const { MongoClient } = require('mongodb');

let _db;
const connectDB = async (mongoUrl, dbName) => {
  try {
    if (!_db) {
      const client = await MongoClient.connect(mongoUrl);
      const db = client.db(dbName);
      console.log(`connectDB(): connect to ${mongoUrl}/${dbName}`);
      _db = db;
    }
    return _db;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  connectDB
};
