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

const FRONTEND_HOST = process.env.FRONTEND_HOST; // TODO: config.js

async function generateQR(ctx) {
  const _id = ctx.params.id;
  const filename = `${_id}.svg`;

  const file = await QRCode.toFile(
    filename,
    `${FRONTEND_HOST}/w/${_id}`,
    function (err, string) {
      if (err) throw err;
    }
  );

  ctx.body = createReadStream(filename);
}

async function getJob(ctx) {
  const docs = await ctx.mongo
    .db("waitoutside")
    .collection("waiting")
    .find({ client: "ClientName" })
    .toArray();

  ctx.body = docs;
}

async function addJob(ctx) {
  const body = ctx.request.body;
  const _id = nanoid();

  await createListing(ctx.mongo, { ...body, _id });

  ctx.body = { id: _id };
}

async function updateJob(ctx) {
  const body = ctx.request.body;
  const _id = body._id;

  await ctx.mongo
    .db("waitoutside")
    .collection("waiting")
    .updateOne({ _id }, { $set: { ...ctx.request.body } });

  ctx.body = { success: true };
}

async function createListing(mongo, object) {
  const result = await mongo
    .db("waitoutside")
    .collection("waiting")
    .insertOne({ ...object, status: "started", created_at: new Date() });

  return result;
}
