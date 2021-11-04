const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.API_MONGODB_URL;

const { Server } = require("socket.io");
const io = new Server(3000, {});

io.on("connection", async function (socket) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const id = socket.handshake.query.id;
  const doc = await client
    .db("waitoutside")
    .collection("waiting")
    .findOne({ _id: id });

  if (doc) {
    socket.emit("update", "order received");
    socket.join(`update:${id}`);
  } else {
    socket.emit("error", "invalid id");
  }
});

startWatcher(io);

async function startWatcher(io) {
  const mongo = new MongoClient(MONGO_URI);
  await mongo.connect();

  mongo
    .db("waitoutside")
    .collection("waiting")
    .watch([], {})
    .on("change", function (change) {
      const doc = change.fullDocument;
      io.to(`update:${doc._id}`).emit("update", doc.status);
    });
}
