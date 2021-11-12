const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.MONGO_URI;

// https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connection-pooling
// Connect once recommended!

module.exports = async function () {
  let client = new MongoClient(MONGO_URI);

  await client.connect();
  await client.db("admin").command({ ping: 1 });

  console.log("MongoDB connected");

  return client;
};
