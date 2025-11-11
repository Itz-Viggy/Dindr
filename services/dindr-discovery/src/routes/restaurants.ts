import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { Restaurant } from '@dindr/contracts';
import { searchRestaurants } from '../services/search-restaurants';

const requestSchema = z.object({
  zipcode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zipcode provided'),
  radius: z
    .number({ invalid_type_error: 'Radius must be a number' })
    .min(1, 'Radius must be between 1 and 25 miles')
    .max(25, 'Radius must be between 1 and 25 miles'),
});

const responseSchema = z.array(
  z.object({
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
    distance: z.number().optional(),
    likes: z.number().optional(),
  })
);

export async function registerRestaurantRoutes(app: FastifyInstance) {
  app.post<{ Body: z.infer<typeof requestSchema>; Reply: Restaurant[] }>(
    '/restaurants/search',
    {
      schema: {
        body: requestSchema,
        response: {
          200: responseSchema,
        },
      },
    },
    async (request, reply) => {
      const { zipcode, radius } = request.body;

      request.log.info({ zipcode, radius }, 'Searching restaurants');

      try {
        const restaurants = await searchRestaurants(zipcode, radius);
        return reply.send(restaurants);
      } catch (error) {
        request.log.error({ err: error }, 'Failed to search restaurants');
        return reply
          .status(500)
          .send({ error: 'Failed to search restaurants', message: error instanceof Error ? error.message : String(error) });
      }
    }
  );

  app.get('/health', async () => ({ status: 'ok' }));
}
