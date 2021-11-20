const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.MONGO_URI;
const ioMongoClient = new MongoClient(MONGO_URI);

const { Server } = require("socket.io");
const io = new Server(3000, {});

io.on("connection", async function (socket) {
  const id = socket.handshake.query.id;

  // This is for handling the auto close
  if (socket.handshake.query.waitingForClose) {
    socket.join(`close:${id}`);
    return;
  }

  await ioMongoClient.connect();
  const doc = await ioMongoClient
    .db("queue-r")
    .collection("waiting")
    .findOne({ _id: id });

  if (doc) {
    socket.emit("update", { status: doc.status, name: doc.name });
    socket.join(`update:${id}`);
    io.to(`close:${id}`).emit("closeWindow", true);
  } else {
    socket.emit("error", "invalid id");
  }

  ioMongoClient.close();
});

startWatcher(io);

async function startWatcher(io) {
  const watcherMongoClientClient = new MongoClient(MONGO_URI);
  await watcherMongoClientClient.connect();

  watcherMongoClientClient
    .db("queue-r")
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
