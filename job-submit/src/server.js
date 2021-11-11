const Koa = require("koa");
const app = new Koa();

const body = require("koa-body");
app.use(
  body({
    jsonLimit: "1kb",
  })
);

const logger = require("koa-logger");
app.use(logger());

const router = require("./router.js");
app.use(router.routes()).use(router.allowedMethods());

module.exports = app;
