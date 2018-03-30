const { ObjectId } = require('mongodb');
// const { URL } = require('url');
// const fs = require('fs');
/**
 * find latest inserted record in collection
 * usage: const collection =
 * const lastest = findLastestOne()
 * @param {Promise} rCollection resolved collection
 * @return {Object} mongodb object
 */
const findLastestOne = async (rCollection) => {
  if (rCollection) {
    try {
      const latest = await rCollection
        .find({
        })
        .sort({
          _id: -1
        })
        .limit(1)
        .toArray();
      return latest[0];
    } catch (error) {
      console.log(error);
    }
  }
};

/**
 * find result by specific _id
 * @param {Promise} resolvedCollection resolved collection
 * @param {number} objectId id
 * @return {Object} matched object
 */
const findOneById = async (resolvedCollection, objectId) => {
  if (resolvedCollection) {
    try {
      const ret = await resolvedCollection
        .find({
          _id: objectId
        })
        .limit(1)
        .toArray();
      return ret;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error('database is not connected');
  }
};

/**
 *
 * get the gap of ids between source db and target db,
 * we assume that target db may has less records
 * execute sync if returned id' length > 0
 * status SYNC if no ids returned
 * @param {Promise} rSourceCollection resolved collection
 * @param {number} sourceLast last record in source db
 * @param {number} targetLast last record in target db
 * @return {array} unsaved Ids if not null
 */

const findUnsavedIds = async (rSourceCollection, sourceLast, targetLast) => {
  if (rSourceCollection) {
    try {
      let ranges;
      if (!sourceLast) {
        console.log('findUnsavedIds(): no data in source db');
        return;
      }
      if (!targetLast) {
        ranges = rSourceCollection
          .find({
            _id: {
              $lte: ObjectId(sourceLast._id)
            }
          })
          .toArray();
        return ranges;
      }
      // const collection = await sourceCollectionPromise();
      ranges = await rSourceCollection
        .find({
          _id: {
            $gt: ObjectId(targetLast._id),
            $lte: ObjectId(sourceLast._id)
          }
        })
        .toArray();
      return ranges;
    } catch (err) {
      console.error(err);
    }
  }
};

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

/**
 * update each id's status to "saved" on target db
 * this setup takes place after id records' export to file
 * @param {Collection} resolvedCollection target collection
 * @param {number} doc objectId to update on target
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

// const exportToFile = async () => {
//   const wPath = new URL('/usr/src/app/uploads', '172.17.0.2');
//   fs.writeFile(wPath, 'hello node.js', (err) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log('exportToFile(): data has been serialized in path');
//   });
// };

/**
 * export inserted data to file
 * 1. check if data id exsited on target db
 * 2. save data to target db, with status: saving
 * 3. export data to file
 * 4. update saving data's status to "saved"
 * @param {Collection} targetCollection resolved collection
 * @param {number} objectIds ids to insert
 * @param {boolean} preSync if sync operation required before listening insert event
 * @returns {void}
 */
// 这是一个队列，改写成Promise队列
const doExport = async (targetCollection, objectIds, preSync = true) => {
  try {
    for (let objectId of objectIds) {
      if (preSync) {
        const existed = await findOneById(targetCollection, objectId);
        console.log(`1 ${objectId._id}`);
        if (existed.length) {
          console.log(
            `doExport(): ${objectId._id} already saved on target db, abondoned`
          );
          continue;
        }
      }
      const insertOneWriteOpResult = await doSave(targetCollection, objectId);

      console.log(
        `2 ${insertOneWriteOpResult.insertedCount} -  ${
          insertOneWriteOpResult.insertedId
        }`
      );
      if (insertOneWriteOpResult.insertedCount) {
        const savedDoc = insertOneWriteOpResult.ops[0];
        // TODO: exportToFile()
        const result = await doUpdate(targetCollection, savedDoc.mid);
        console.log(`3 ${JSON.stringify(savedDoc, null, 2)}`);
        if (insertOneWriteOpResult.result.ok) {
          console.log(`doExport(): ${savedDoc.mid} status has been updated`);
        } else {
          console.log(`doExport(): ${savedDoc.mid} status update FAILED`);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * sync ids existed on source db but not on target db
 * 1. get lastest one on both source and target db
 * 2. get id ranges betweens source and target db (source >= target)
 * 3. insert unsaved id ranges to target db
 * @param {Collection} rSourceCollection source collection
 * @param {Collection} rTargetCollection target collection
 * @return {void}
 */
const doSync = async (rSourceCollection, rTargetCollection) => {
  try {
    const sourceLatest = await findLastestOne(rSourceCollection);
    console.log(
      `doSync(): source db latest id ${
        sourceLatest ? sourceLatest._id : undefined
      }`
    );
    const targetLatest = await findLastestOne(rTargetCollection);
    console.log(
      `doSync(): target db latest id ${
        targetLatest ? sourceLatest._id : undefined
      }`
    );

    const unsavedIds = await findUnsavedIds(
      rSourceCollection,
      sourceLatest,
      targetLatest
    );
    // for (let objectid of unsavedIds) {
    //   console.log(`doSync(): type of objectid is ${typeof objectid}`);
    // }
    console.log(`doSync(): unsaved Ids are ${unsavedIds}`);
    const insertedIds = await doExport(rTargetCollection, unsavedIds, false);
    // console.log(`doSync(): Ids saved in target collection are ${insertedIds}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  findLastestOne,
  findOneById,
  findUnsavedIds,
  doSave,
  doUpdate,
  doSync
};
