"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const restaurants_1 = require("./routes/restaurants");
const server = (0, fastify_1.default)({
    logger: true,
});
server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
server.register(restaurants_1.registerRestaurantRoutes);
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
