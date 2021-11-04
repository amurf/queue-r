const Koa = require("koa");
const koaBody = require("koa-body");

const { nanoid } = require("nanoid");
const app = new Koa();

const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.API_MONGODB_URL;

const QRCode = require("qrcode");
const { createReadStream } = require("fs");

const FRONTEND_HOST = process.env.FRONTEND_HOST;

app.use(
  koaBody({
    jsonLimit: "1kb",
  })
);

app.use(async (ctx) => {
  if (ctx.path == "/job") {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const body = ctx.request.body;
    const _id = nanoid();

    createListing(client, { ...body, _id });

    const filename = `${_id}.svg`;
    const file = await QRCode.toFile(
      filename,
      `${FRONTEND_HOST}/w/${_id}`,
      function (err, string) {
        if (err) throw err;
        console.log("done");
      }
    );

    ctx.body = createReadStream(filename);
  }
});

app.listen(3000);

async function createListing(client, object) {
  const result = await client
    .db("waitoutside")
    .collection("waiting")
    .insertOne({ ...object, status: "started", created_at: new Date() });
}
