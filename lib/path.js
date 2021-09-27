'use strict';

var async = require('async');
var exists = require('./__utils__/exists');
var extend = require('lodash/extend');
var flatten = require('lodash/flatten');
var glob = require('glob');
var path = require('path');
var Promise = require('bluebird');

var pglob = Promise.promisify(glob);

module.exports = function resolvePath(to, options, callback) {
  var loadPaths;

  /* eslint-disable no-param-reassign */

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = extend({
    basePath: '.',
    loadPaths: []
  }, options);

  /* eslint-enable */

  loadPaths = [].concat(options.loadPaths);

  return Promise.map(loadPaths, function iterator(loadPath) {
    return pglob(loadPath, {
      cwd: options.basePath
    })
      .then(function handleFulfilled(matchedPaths) {
        return matchedPaths.map(function matchedPathsIterator(matchedPath) {
          return path.resolve(options.basePath, matchedPath, to);
        });
      });
  })
    .then(function handleFulfilled(filePaths) {
      return flatten(filePaths);
    })
    .then(function handleFulfilled(filePaths) {
      filePaths.unshift(path.resolve(options.basePath, to));

      return new Promise(function executor(resolve, reject) {
        async.detectSeries(filePaths, exists, function iterator(err, resolvedPath) {
          if (resolvedPath) {
            resolve(resolvedPath);
          } else {
            reject(new Error('Asset not found or unreadable: ' + to));
          }
        });
      });
    });
};
