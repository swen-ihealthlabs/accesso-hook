global.Promise = require('bluebird');
const { ObjectId } = require('mongodb');
const { targetCollection } = require('./db/collection');
const { doExport } = require('./operation/doOp');
const MongoOplog = require('mongo-oplog');

const uri = 'mongodb://localhost:27017/local';
const namespace = {
  ns: 'test.accounts'
};

const oplog = MongoOplog(uri, namespace);

const start = async () => {
  const rTargetCollection = await targetCollection();
  oplog.tail().then(() => {
    console.log('Now listening to insert event on mongodb...');
  });
  oplog.on('insert', (result) => {
    const insertedObject = result.o;
    let docsIds = [];
    docsIds.push(ObjectId(insertedObject._id));
    return new Promise((resolve) => {
      resolve(doExport(docsIds, rTargetCollection));
    });
  });
};
start();
// oplog.tail().then(() => {
//   console.log('Now listening to insert event on mongodb...');
// });
// oplog.on('insert', (result) => {
//   const insertedObject = result.o;
//   docsIds.push(ObjectId(insertedObject._id));
//   return new Promise((resolve) => {
//     resolve(getTargetCollection());
//   }).then((rTargetCollection) => {
//     console.log(rTargetCollection);
//     return new Promise((resolve) => {
//       resolve(doExport(docsIds, rTargetCollection));
//     });
//   });
// });
