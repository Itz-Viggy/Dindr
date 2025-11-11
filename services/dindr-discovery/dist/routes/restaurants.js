"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRestaurantRoutes = registerRestaurantRoutes;
const zod_1 = require("zod");
const search_restaurants_1 = require("../services/search-restaurants");
const requestSchema = zod_1.z.object({
    zipcode: zod_1.z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zipcode provided'),
    radius: zod_1.z
        .number({ invalid_type_error: 'Radius must be a number' })
        .min(1, 'Radius must be between 1 and 25 miles')
        .max(25, 'Radius must be between 1 and 25 miles'),
});
const responseSchema = zod_1.z.array(zod_1.z.object({
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
    distance: zod_1.z.number().optional(),
    likes: zod_1.z.number().optional(),
}));
async function registerRestaurantRoutes(app) {
    app.post('/restaurants/search', {
        schema: {
            body: requestSchema,
            response: {
                200: responseSchema,
            },
        },
    }, async (request, reply) => {
        const { zipcode, radius } = request.body;
        request.log.info({ zipcode, radius }, 'Searching restaurants');
        try {
            const restaurants = await (0, search_restaurants_1.searchRestaurants)(zipcode, radius);
            return reply.send(restaurants);
        }
        catch (error) {
            request.log.error({ err: error }, 'Failed to search restaurants');
            return reply
                .status(500)
                .send({ error: 'Failed to search restaurants', message: error instanceof Error ? error.message : String(error) });
        }
    });
    app.get('/health', async () => ({ status: 'ok' }));
}
