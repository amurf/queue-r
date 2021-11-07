const Koa = require("koa");
const Router = require("@koa/router");
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

const router = new Router();

router.get("/qr/:id", generateQR);
router.get("/job", getJob);
router.post("/job", addJob);
router.put("/job", updateJob);

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);

async function generateQR(ctx) {
  const _id = ctx.request.body.id;
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

async function getJob(ctx) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const docs = await client
    .db("waitoutside")
    .collection("waiting")
    .find({ client: "ClientName" })
    .toArray();

  ctx.body = docs;
}

async function addJob(ctx) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const body = ctx.request.body;
  const _id = nanoid();

  createListing(client, { ...body, _id });

  ctx.body = { id: _id };
}

async function updateJob(ctx) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const body = ctx.request.body;
  const _id = body._id;

  await client
    .db("waitoutside")
    .collection("waiting")
    .updateOne({ _id }, { $set: { ...ctx.request.body } });

  ctx.body = { success: true };
}

async function createListing(client, object) {
  const result = await client
    .db("waitoutside")
    .collection("waiting")
    .insertOne({ ...object, status: "started", created_at: new Date() });
}
