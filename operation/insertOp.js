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

module.exports = {
  insertOp
};
