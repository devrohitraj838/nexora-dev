require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function test() {
  try {
    await client.connect();
    console.log("✅ Connected using MongoDB Driver");
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

test();