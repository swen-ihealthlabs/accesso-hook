const MongoDB = require('./connect');
const ObjectId = require('mongodb').ObjectId;
global.Promise = require('bluebird');
require('dotenv').config();

// const namespace = {
//   ns: 'test.accounts'
// };

const collName = 'accounts';
const findLatestOne = async (collect) => {
  if (collect) {
    try {
      const latest = await collect
        .find({
        })
        .sort({
          _id: -1
        })
        .limit(1)
        .toArray()[0];
      console.log(latest);
      return latest;
    } catch (err) {
      console.error(err);
    }
  } else {
    console.error('collection is not valid');
  }
};

MongoDB.connect(async (err) => {
  if (err) {
    throw err;
  }
  const db = MongoDB.getDB();
  const collection = db.collection(collName);
  const lastest = await findLatestOne(collection);
});

// async function connect(url) {
//   if (!client) {
//     try {
//       client = await MongoClient.connect(url);
//       console.log(`Connect to ${url}`);
//       return client;
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   return client;
// }

// const collection = (async (url, dbName, collectionName) => {
//   if (!client) {
//     try {
//       client = await MongoClient.connect(url);
//       const db = client.db(dbName);
//       const collect = await db.collection(collectionName);
//       console.log('collected');
//       return collect;
//     } catch (err) {
//       console.error(err);
//     }
//   }
// })(mongourl, name, collName);

// findLatestOne();
