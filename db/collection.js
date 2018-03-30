const { connectDB } = require('./connect');

const sourceCollection = async () => {
  try {
    const sourceDB = await connectDB(process.env.SOURCE, process.env.SOURCEDB);
    const collection = await sourceDB.collection(process.env.SOURCECOLL);
    console.log('sourceCollection(): async source collection resolve complete');
    return collection;
  } catch (error) {
    throw error;
  }
};

const targetCollection = async () => {
  try {
    const targetDB = await connectDB(process.env.TARGET, process.env.TARGETDB);
    const collection = await targetDB.collection(process.env.TARGETCOLL);
    console.log('targetCollection(): async target collection resolve complete');
    return collection;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sourceCollection,
  targetCollection
};
