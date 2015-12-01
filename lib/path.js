var async = require('async');
var exists = require('./__utils__/exists');
var extend = require('lodash/object/extend');
var path = require('path');
var Promise = require('bluebird');

module.exports = function (to, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = extend({
    basePath: '.',
    loadPaths: []
  }, options);

  var filePaths = options.loadPaths.map(function (loadPath) {
    return path.resolve(options.basePath, loadPath, to);
  });

  filePaths.unshift(path.resolve(options.basePath, to));

  if (options.currentPath) {
    filePaths.unshift(path.resolve(options.basePath, options.currentPath, to));
  }

  return new Promise(function (resolve, reject) {
    async.detectSeries(filePaths, exists, function (resolvedPath) {
      if (resolvedPath) return resolve(resolvedPath);
      reject(new Error('Asset not found or unreadable: ' + to));
    });
  }).nodeify(callback);
};
