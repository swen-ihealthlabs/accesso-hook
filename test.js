const {
  MongoClient, ObjectId
} = require('mongodb');
const MongoOplog = require('mongo-oplog');
global.Promise = require('bluebird');
require('dotenv').config();
const { doExport } = require('./operation/doOp');
const { insertOp } = require('./operation/insertOp');
const { targetCollection } = require('./db/collection.js');

const uri = 'mongodb://localhost:27017/local';
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'test';
const collName = 'accounts';
const namespace = {
  ns: 'test.accounts'
};
// const oplog = MongoOplog(uri, namespace);
// oplog.tail().then(() => {
//   console.log(`Now listen to changes on ${uri}, collection ${namespace.ns}`);
// });

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
// .then(() => {
//   return new Promise((resolve) => {
//     let docsIds = [];
//     oplog.on('insert', (result) => {
//       const insertedObject = result.o;
//       docsIds.push(ObjectId(insertedObject._id));
//     });
//     resolve(docsIds);
//   });
// })
// .then((unsavedObjectIds) => {
//   console.log(`unsavedObjectIds:${unsavedObjectIds}`);
//   return new Promise((resolve) => {
//     resolve(targetCollection);
//   });
// })
// .then((rTargetCollection) => {
//   console.log(rTargetCollection)
//   return new Promise((resolve) => {
//     insertOp()
//   })
// });
