const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.API_MONGODB_URL;

async function mongoClient() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  return client;
}

module.exports = {
  mongoClient,
};
