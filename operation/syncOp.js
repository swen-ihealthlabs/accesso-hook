global.Promise = require('bluebird');
const {
  doSync, doExport, doListenInsert
} = require('./doOp');

const syncOp = async (rSourceCollection, rTargetCollection) => {
  return new Promise((resolve) => {
    resolve(doSync(rSourceCollection, rTargetCollection));
  }).then((unsavedObjectIds) => {
    return new Promise((resolve) => {
      resolve(doExport(rTargetCollection, unsavedObjectIds));
    });
  });
};
