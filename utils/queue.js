require('../config');

const argFn = (operation, ...args) => operation(...args);

// const queue = (operations, ...args) => {
//   return operations.reduce((promise, operation) => {
//     return promise.then((result) => {
//       return new Promise((resolve) => resolve(argFn(operation, result, ...args))
//     );
//   }, Promise.resolve);
// }

const queue = (operations, ...args) => {
  return operations.reduce((promise, operation) => {
    return promise.then((result) => {
      return new Promise((resolve) => {
        resolve(argFn(operation, result, ...args));
      });
    });
  }, Promise.resolve);
};

module.exports = {
  queue
};
