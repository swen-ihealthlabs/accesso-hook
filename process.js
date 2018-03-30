require('./config');
const {
  sourceCollection, targetCollection
} = require('./db/collection');
const { doSync } = require('./db/crud');

const run = async () => {
  const rSourceCollection = await sourceCollection();
  const rTargetCollection = await targetCollection();
  doSync(rSourceCollection, rTargetCollection);
};

run();
