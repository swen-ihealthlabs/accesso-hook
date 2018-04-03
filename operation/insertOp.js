global.Promise = require('bluebird');
const { ObjectId } = require('mongodb');
const MongoOplog = require('mongo-oplog');
const { doExport } = require('./doOp');

const insertOp = async (rTargetCollection) => {
  let docsIds = [];
  return new Promise((resolve) => {
    const oplog = MongoOplog('mongodb://localhost:27017/local', {
      ns: 'test.accounts'
    });
    oplog.tail();
    oplog.on('insert', (result) => {
      const insertedObject = result.o;
      docsIds.push(ObjectId(insertedObject._id));
    });
    resolve(docsIds);
  }).then((unsavedObjectIds) => {
    console.log(`insertOp(): ${unsavedObjectIds}`);
    return new Promise((resolve) => {
      resolve(doExport(unsavedObjectIds, rTargetCollection));
    });
  });
};

const listen = async (oplog, rTargetCollection) => {
  let docsIds = [];
  return new Promise((resolve) => {
    oplog.tail().then(() => {
      console.log('listen(): now listening to inert event on mongodb');
    });
    oplog.on('insert', (result) => {
      resolve(result);
    });
  }).then((result) => {
    console.log(`listen(): ${JSON.stringify(result, null, 2)}`);
    const insertedObject = result.o;
    docsIds.push(ObjectId(insertedObject._id));
    console.log(`listen(): docsIds: ${docsIds}`);
    return new Promise((resolve) => {
      resolve(doExport(docsIds, rTargetCollection));
    });
  });
};

module.exports = {
  insertOp,
  listen
};
