const Koa = require("koa");
const koaBody = require("koa-body");

const app = new Koa();

app.use(
  koaBody({
    jsonLimit: "1kb",
  })
);

const router = require("./router.js");
app.use(router.routes()).use(router.allowedMethods());

module.exports = app;
