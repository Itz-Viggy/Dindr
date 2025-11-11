"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSessionRoutes = registerSessionRoutes;
const zod_1 = require("zod");
const session_service_1 = require("../services/session-service");
const restaurantSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    address: zod_1.z.string(),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    cuisine: zod_1.z.string(),
    price_range: zod_1.z.string(),
    rating: zod_1.z.number(),
    image_url: zod_1.z.string().nullable(),
});
const requestSchema = zod_1.z.object({
    sessionId: zod_1.z.string().min(1, 'Session ID is required'),
    action: zod_1.z.enum(['create', 'validate', 'join', 'update_restaurant', 'clear_matches']),
    restaurant: restaurantSchema.optional(),
});
// Define a generic response schema for session actions
const sessionResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    data: zod_1.z.any().optional(),
    error: zod_1.z.string().optional(),
});
async function registerSessionRoutes(app) {
    app.post('/sessions', {
        schema: {
            body: requestSchema,
            response: {
                200: sessionResponseSchema,
                500: zod_1.z.object({
                    error: zod_1.z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        try {
            const result = await (0, session_service_1.handleSessionAction)(request.body);
            // Ensure the response matches the schema
            return reply.send({
                success: true,
                data: result,
            });
        }
        catch (error) {
            const status = typeof error?.status === 'number' ? error.status : 500;
            request.log.error({ err: error }, 'Session action failed');
            return reply.status(status).send({
                error: error instanceof Error ? error.message : 'Internal server error',
            });
        }
    });
    app.get('/health', async () => ({ status: 'ok' }));
}
