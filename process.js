require('./config');
const {
  sourceCollection, targetCollection
} = require('./db/collection');
const { syncOp } = require('./operation/syncOp');

const run = async () => {
  const rSourceCollection = await sourceCollection();
  const rTargetCollection = await targetCollection();
  syncOp(rSourceCollection, rTargetCollection);
};

run();
