/**
 * update each id's status to "saved" on target db
 * this setup takes place after id records' export to file
 * @param {Collection} resolvedCollection target collection
 * @param {number} mesureId objectId to update on target
 * @return {object} saved object, status: saved
 */
const doUpdate = async (resolvedCollection, mesureId) => {
  // const collection = await targetCollectionPromise();
  console.log(`1 doUpdate(): ${JSON.stringify(mesureId, null, 2)}`);
  const filter = {
    mid: {
      $eq: mesureId
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
