use waitoutside;
db.createCollection("waiting");
db.waiting.createIndex({ created_at: 1 }, { expireAfterSeconds: 1200 });
