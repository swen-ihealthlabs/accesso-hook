const { ObjectId } = require('mongodb');
/**
 * find latest inserted record in collection
 * usage: const collection =
 * const lastest = findLastestOne()
 * @param {Collection} rCollection resolved collection
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
 * @param {Collection} resolvedCollection resolved collection
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
 * @param {Collection} rSourceCollection resolved collection
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

module.exports = {
  findLastestOne,
  findOneById,
  findUnsavedIds
};
