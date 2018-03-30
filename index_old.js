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
let collect;
let client;

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
// .then((collecti) => {
//   return new Promise((resolve) => {
//     const document = collecti.findOne({
//       _id: ObjectId('5ab9f37369da8d56edc29a8e')
//     });
//     resolve(document);
//   });
// })
// .then((document) => {
//   console.log(document);
// });

const oplog = MongoOplog(uri, namespace);
console.log(oplog);

oplog.tail().then(() => {
  console.log(`Now listen to changes on ${uri}, collection ${namespace.ns}`);
});

oplog.on('insert', (doc) => {
  console.log(doc.o);
});

// async function connect(url) {
//   if (!sourceConn) {
//     try {
//       sourceConn = await MongoClient.connect(url);
//       console.log(`Connect to ${url}`);
//       return sourceConn;
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   return sourceConn;
// }

/**
 * get collection provided with mongo url and collection
 * usage:
 * @param {string} url mongo address
 * @param {string} collectionName mongo collection
 * @return {Collection} object
 */
const collection = async (url, dbName, collectionName) => {
  if (!collect) {
    try {
      client = await MongoClient.connect(url);
      db = client.db(dbName);
      collect = await db.collection(collectionName);
      return collect;
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 * close database
 * @return {void}
 */
const closeDb = () => {
  if (client) {
    client.close();
  }
};

// async function findOneById(_id) {
//   return async function getCollection(collectionName) {
//     return async function getConnect(url) {
//       try {
//         const db = await MongoClient.connect(url);
//         const collection = await db.collection(collectionName);
//         return await collection.findOne({
//           _id: ObjectId(_id)
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     };
//   };
// }

// const findOneById = async (url) => async (collectionName) => async (_id) => {
//   try {
//     const db = await MongoClient.connect(url);
//     const collection = await db.collection(collectionName);
//     const ret = await collection.findOne({
//       _id: ObjectId(_id)
//     });
//     return ret;
//   } catch (err) {
//     console.error(err);
//   }
// };

/**
 * find result by specific _id
 * @param {number} id id
 * @return {Object} matched object
 */
const findOneById = async (id) => {
  if (collection) {
    try {
      const ret = await collection.findOne({
        _id: ObjectId(id)
      });
      return ret;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error('database is not connected');
  }
};

/**
 * find latest inserted record in db
 * usage: const collection =
 * const lastest = findLastestOne()
 * @return {Object} mongodb object
 */
const findLatestOne = async () => {
  if (collection) {
    try {
      const latest = await collection
        .find()
        .sort({
          _id: -1
        })
        .limit(1);
      return latest;
    } catch (err) {
      console.error(err);
    }
  } else {
    console.error('database is not connected');
  }
};

/**
 *
 * get the record gap between source db and target db,
 * we assume that target db may has less records
 * sync if returned gaps array's length = 0
 * @param {number} sourceLast last record in source db
 * @param {number} targetLast last record in target db
 * @return {array} record gaps
 */
const findGaps = async (sourceLast) => async (targetLast) => {
  if (collection) {
    try {
      const ranges = await collection.find({
        _id: {
          $gt: ObjectId(targetLast._id),
          $lte: ObjectId(sourceLast._id)
        }
      });
      return ranges;
    } catch (err) {
      console.error(err);
    }
  }
};

const insertGaps = ()

function exportToXml(doc) {
  // save to address, file system docker
  // save to target db
}
