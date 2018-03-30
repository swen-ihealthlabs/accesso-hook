const MongoClient = require('mongodb').MongoClient;
const Assert = require('assert');
require('dotenv').config();

let _db;
const connect = async (callback) => {
  try {
    MongoClient.connect(process.env.SOURCE, (err, client) => {
      _db = client.db(process.env.SOURCEDB);
      Assert.equal(null, err);
      console.log(`Connect to ${process.env.SOURCE}/${process.env.SOURCEDB}`);
      return callback(err);
    });
  } catch (error) {
    throw error;
  }
};

const getDB = () => _db;
const disconnect = () => _db.close();

module.exports = {
  connect,
  getDB,
  disconnect
};
