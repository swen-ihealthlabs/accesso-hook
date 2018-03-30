require('../config');

const queue = (operations) => {
  return operations.reduce((promise, operation) => {
    return promise.then(() => {
      return new Promise((resolve) => resolve(operation));
    });
  }, Promise.resolve);
};

module.exports = {
  queue
};
