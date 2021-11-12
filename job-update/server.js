const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.MONGO_URI;

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

  client.close();
});

startWatcher(io);

async function startWatcher(io) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  client
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
