global.Promise = require('bluebird');

const argFn = (operation, ...args) => operation(...args);

const queue = (operations, ...args) => {
  let promise = Promise.resolve();
  operations.forEach((operation) => {
    promise = promise.then((result) => {
      return new Promise((resolve) => {
        const asyncPromise = result
          ? argFn(operation, result, ...args)
          : argFn(operation, ...args);
        resolve(asyncPromise);
      });
    });
  });
};

// can't figure out the error
// const queue = (operations, ...args) => {
//   return operations.reduce((promise, operation) => {
//     return promise.then((result) => {
//       console.log(result);
//       return new Promise((resolve) => {
//         const asyncPromise = result
//           ? argFn(operation, result, ...args)
//           : argFn(operation, ...args);
//         resolve(asyncPromise);
//       });
//     });
//   }, Promise.resolve);
// };

module.exports = {
  queue
};
