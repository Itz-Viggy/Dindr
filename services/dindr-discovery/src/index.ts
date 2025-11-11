import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { registerRestaurantRoutes } from './routes/restaurants';

const server = Fastify({
  logger: true,
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(registerRestaurantRoutes);

const port = Number(process.env.PORT ?? 4001);
const host = process.env.HOST ?? '0.0.0.0';

server
  .listen({ port, host })
  .then((address) => {
    server.log.info(`Discovery service listening at ${address}`);
  })
  .catch((err) => {
    server.log.error(err, 'Failed to start discovery service');
    process.exit(1);
  });
