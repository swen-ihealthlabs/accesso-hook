/**
 * update each id's status to "saved" on target db
 * this setup takes place after id records' export to file
 * @param {Collection} resolvedCollection target collection
 * @param {Document} doc objectId to update on target
 * @return {object} saved object, status: saved
 */
const doUpdate = async (resolvedCollection, doc) => {
  // const collection = await targetCollectionPromise();
  console.log(`${JSON.stringify(doc, null, 2)}`);
  const filter = {
    _id: {
      $eq: doc
    }
  };
  const update = {
    $set: {
      status: 'saved'
    }
  };
  const options = {
    wtimeout: 100,
    w: 1,
    j: 1
  };
  try {
    const updateWriteOpResultObject = await resolvedCollection.updateOne(
      filter,
      update,
      options
    );
    console.log(
      `doUpdate(): record ${updateWriteOpResultObject} has been updated`
    );
    return updateWriteOpResultObject;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  doUpdate
};
