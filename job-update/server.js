const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.API_MONGODB_URL;

const { Server } = require("socket.io");
const io = new Server(3000, {});

io.on("connection", async function (socket) {
  const id = socket.handshake.query.id;

  // This is for handling the auto close
  if (socket.handshake.query.waitingForClose) {
    socket.join(`close:${id}`);
    return;
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const doc = await client
    .db("waitoutside")
    .collection("waiting")
    .findOne({ _id: id });

  if (doc) {
    socket.emit("update", "order received");
    socket.join(`update:${id}`);
    io.to(`close:${id}`).emit("closeWindow", true);
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
      let doc;
      if (change.operationType == "update") {
        doc = change.updateDescription.updatedFields;
        doc._id = change.documentKey._id;
      } else {
        doc = change.fullDocument;
      }
      io.to(`update:${doc._id}`).emit("update", doc.status);
    });
}
