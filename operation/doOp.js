const {
  findLastestOne, findOneById, findUnsavedIds
} = require('../db/find');
const { doSave } = require('../db/save');
const { doUpdate } = require('../db/update');
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

const doListenInsert = async () => {};

module.exports = {
  doSync,
  doExport,
  doListenInsert
};
