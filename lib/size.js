'use strict';

var calipers = require('calipers')(
  require('calipers-webp'),
  require('calipers-png'),
  require('calipers-jpeg'),
  require('calipers-gif'),
  require('calipers-svg')
);
var Promise = require('bluebird');
var resolvePath = require('./path');

module.exports = function resolveSize(to, options, callback) {
  /* eslint-disable no-param-reassign */

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  /* eslint-enable */

  return resolvePath(to, options)
    .then(function handlePathFulfilled(resolvedPath) {
      return calipers.measure(resolvedPath)
        .then(function handleMeasurementFulfilled(result) {
          return result.pages[0];
        })
        .catch(function handleRejected(err) {
          return Promise.reject(new Error(err.message + ': ' + resolvedPath));
        });
    })
    .nodeify(callback);
};
