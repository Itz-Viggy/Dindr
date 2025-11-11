import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { handleSessionAction } from '../services/session-service';

const restaurantSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  cuisine: z.string(),
  price_range: z.string(),
  rating: z.number(),
  image_url: z.string().nullable(),
});

const requestSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  action: z.enum(['create', 'validate', 'join', 'update_restaurant', 'clear_matches']),
  restaurant: restaurantSchema.optional(),
});

// Define a generic response schema for session actions
const sessionResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export async function registerSessionRoutes(app: FastifyInstance) {
  app.post<{ Body: z.infer<typeof requestSchema>; Reply: z.infer<typeof sessionResponseSchema> }>(
    '/sessions',
    {
      schema: {
        body: requestSchema,
        response: {
          200: sessionResponseSchema,
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await handleSessionAction(request.body);
        // Ensure the response matches the schema
        return reply.send({
          success: true,
          data: result,
        });
      } catch (error) {
        const status = typeof (error as any)?.status === 'number' ? (error as any).status : 500;
        request.log.error({ err: error }, 'Session action failed');
        return reply.status(status).send({
          error:
            error instanceof Error ? error.message : 'Internal server error',
        });
      }
    }
  );

  app.get('/health', async () => ({ status: 'ok' }));
}
