const Router = require("@koa/router");
const router = new Router();

router.get("/qr/:id", generateQR);
router.get("/job", getJob);
router.post("/job", addJob);
router.put("/job", updateJob);

module.exports = router;

/* These are likely to move, but as this app is currently small going to keep
 * the routes + handler functions together */

const { nanoid } = require("nanoid");
const QRCode = require("qrcode");
const { createReadStream } = require("fs");
const { mongoClient } = require("./mongo");

const FRONTEND_HOST = process.env.FRONTEND_HOST; // TODO: config.js

async function generateQR(ctx) {
  const _id = ctx.params.id;
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
  const client = await mongoClient();

  const docs = await client
    .db("waitoutside")
    .collection("waiting")
    .find({ client: "ClientName" })
    .toArray();

  client.close();

  ctx.body = docs;
}

async function addJob(ctx) {
  const client = await mongoClient();

  const body = ctx.request.body;
  const _id = nanoid();

  await createListing(client, { ...body, _id });

  client.close();

  ctx.body = { id: _id };
}

async function updateJob(ctx) {
  const client = await mongoClient();

  const body = ctx.request.body;
  const _id = body._id;

  await client
    .db("waitoutside")
    .collection("waiting")
    .updateOne({ _id }, { $set: { ...ctx.request.body } });

  client.close();

  ctx.body = { success: true };
}

async function createListing(client, object) {
  const result = await client
    .db("waitoutside")
    .collection("waiting")
    .insertOne({ ...object, status: "started", created_at: new Date() });

  return result;
}
