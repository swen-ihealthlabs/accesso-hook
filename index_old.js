// import MongoOplog from 'mongo-oplog';
// import { MongoClient, ObjectId } from 'mongodb';
// import Promise from 'bluebird';

const MongoOplog = require('mongo-oplog');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
global.Promise = require('bluebird');
require('dotenv').config();

const uri = 'mongodb://localhost:27017/local';
const dbUrl = 'mongodb://localhost:27017';
const targetUrl = 'mongodb://localhost:27017/test';
const namespace = {
  ns: 'test.accounts'
};
const dbName = 'test';
const collName = 'accounts';

new Promise((resolve, reject) => {
  MongoClient.connect(dbUrl, (err, client) => {
    if (err) {
      reject(err);
    }
    console.log(`Connect to ${dbUrl}`);
    resolve(client);
  });
})
  .then((client) => {
    return new Promise((resolve) => {
      const db = client.db(dbName);
      if (db) {
        console.log(`Use ${db.toString()}`);
      }
      const collecti = db.collection(collName);
      console.log(`collection ${collecti}`);
      resolve(collecti);
    });
  })
  .then((collecti) => {
    return new Promise((resolve) => {
      const documents = collecti.insertMany([
        {
          name: 'David',
          age: 12
        },
        {
          name: 'Elsa',
          age: 13
        },
        {
          name: 'Farine',
          age: 14
        }
      ]);
      resolve(documents);
    });
  })
  .then((documents) => {
    console.log(documents);
  });

// const oplog = MongoOplog(uri, namespace);
// console.log(oplog);

// oplog.tail().then(() => {
//   console.log(`Now listen to changes on ${uri}, collection ${namespace.ns}`);
// });

// oplog.on('insert', (doc) => {
//   console.log(doc.o);
// });
