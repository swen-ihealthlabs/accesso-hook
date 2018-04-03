require('./config');
const {
  sourceCollection, targetCollection
} = require('./db/collection');
const { syncOp } = require('./operation/syncOp');
const { listen } = require('./operation/insertOp');
const MongoOplog = require('mongo-oplog');

const uri = 'mongodb://localhost:27017/local';
const namespace = {
  ns: 'test.accounts'
};

const run = async (oplog) => {
  const rSourceCollection = await sourceCollection();
  const rTargetCollection = await targetCollection();

  listen(oplog, rTargetCollection);
  // syncOp(rSourceCollection, rTargetCollection);
  // queue([doSync, doExport], rSourceCollection, rTargetCollection);
};

const oplog = MongoOplog(uri, namespace);
run(oplog);
