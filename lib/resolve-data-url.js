var extend = require('lodash/object/extend');
var fs = require('fs');
var mime = require('mime');
var Promise = require('bluebird');
var resolvePath = require('./resolve-path');

var preadFile = Promise.promisify(fs.readFile);

module.exports = function (to, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = extend({
    basePath: '.',
    loadPaths: []
  }, options);

  return resolvePath(to, options)
    .then(function (resolvedPath) {
      var mediaType = mime.lookup(resolvedPath);
      return preadFile(resolvedPath)
        .then(function (data) {
          return 'data:' + mediaType + ';base64,' + data.toString('base64');
        });
    })
    .nodeify(callback);
};
