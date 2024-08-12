const fastify = require("fastify");
const config = require("./config");
const registerRoutes = require("../routes");
const helmet = require("@fastify/helmet");
const fastifyCors = require("@fastify/cors");
const fastifyMultipart = require("@fastify/multipart");
const { dbInitialize } = require("../../infrastructure/postgres");
const { cacheInitialize } = require("../../infrastructure/redis");
const errorDecorator = require("../middlewares/errorDecorator");
const responseDecorator = require("../middlewares/responseDecorator");
const { swaggerObject, swaggerUIObject } = require("../utils/swaggerOptions");
const {
  syncRolesAndPermissionsToCache,
} = require("../helpers/cacheSyncHelper");

module.exports = async function FastServer(options) {
  const process = options.process;

  if (process === undefined) throw new Error("Fatal [process] not found");

  let _server = null;

  const defaultOptions = {
    bodyLimit: 100 * 1024 * 1024, // 100MB
    logger: {
      level: config.get("fastify").log_level,
      // prettyPrint: true,
      serializers: {
        res(res) {
          return {
            code: res.code,
            body: res.body,
          };
        },
        req(req) {
          return {
            method: req.method,
            url: req.url,
            path: req.path,
            parameters: req.parameters,
            headers: req.headers,
          };
        },
      },
    },
  };

  const serverOptions = { ...defaultOptions };

  if (_server === null) _server = fastify(serverOptions);

  const defaultInitialization = async () => {
    await defaultMiddleware();
  };

  const defaultMiddleware = async () => {
    _server.register(helmet);
    _server.register(fastifyCors);
    _server.register(errorDecorator);
    _server.register(fastifyMultipart);
    _server.register(responseDecorator);
    _server.register(require("@fastify/swagger"), swaggerObject);
    _server.register(require("@fastify/swagger-ui"), swaggerUIObject);
  };

  const infrastructureSetup = async () => {
    await dbInitialize();
    cacheInitialize();
  };

  const syncCache = async () => {
    await syncRolesAndPermissionsToCache();
  };

  const start = async function start() {
    try {
      await infrastructureSetup();
      await syncCache();
      await defaultInitialization();
      registerRoutes(_server);
      _server.listen({
        port: config.get("server").port,
        host: config.get("server").host,
      });
    } catch (_error) {
      console.error("Shutting Down Due To Fatal Exception >");
      console.error("Server Initialization Error >", _error);
      process.exit(1);
    }
  };

  return {
    start,
    fastifyServer: _server,
  };
};
