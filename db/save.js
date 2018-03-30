/**
 * insert unsaved ids on target db
 * this setup preceeds the export to file
 * @param {Collection} resolvedCollection target Collection
 * @param {ObjectId} objectId id to save on target
 * @return {insertOneWriteOpResult} insert result
 */
const doSave = async (resolvedCollection, objectId) => {
  const savingObjectId = Object.assign(
    {
    },
    {
      mid: objectId._id,
      status: 'saving'
    }
  );

  const options = {
    w: 1,
    forceServerObjectId: true
  };

  try {
    const insertOneWriteOpResult = await resolvedCollection.insertOne(
      savingObjectId,
      options
    );
    // console.log(`doSave(): ${insertOneWriteOpResult.insertedCount}`);
    return insertOneWriteOpResult;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  doSave
};
