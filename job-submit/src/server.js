const Koa = require("koa");
const app = new Koa();

async function setup() {
  const body = require("koa-body");
  app.use(
    body({
      jsonLimit: "1kb",
    })
  );

  const initMongo = require("./mongo.js");
  let mongo = await initMongo();
  app.context.mongo = mongo;

  const logger = require("koa-logger");
  app.use(logger());

  const router = require("./router.js");
  app.use(router.routes()).use(router.allowedMethods());

  return app;
}

module.exports = setup;
