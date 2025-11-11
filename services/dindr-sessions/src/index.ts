import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { registerSessionRoutes } from './routes/sessions';

const server = Fastify({
  logger: true,
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(registerSessionRoutes);

const port = Number(process.env.PORT ?? 4002);
const host = process.env.HOST ?? '0.0.0.0';

server
  .listen({ port, host })
  .then((address) => {
    server.log.info(`Sessions service listening at ${address}`);
  })
  .catch((err) => {
    server.log.error(err, 'Failed to start sessions service');
    process.exit(1);
  });
