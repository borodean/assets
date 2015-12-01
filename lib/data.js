var extend = require('lodash/object/extend');
var fs = require('fs');
var mime = require('mime');
var Promise = require('bluebird');
var resolvePath = require('./path');
var url = require('url');

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

  var toUrl = url.parse(to);

  return resolvePath(toUrl.pathname, options)
    .then(function (resolvedPath) {
      var mediaType = mime.lookup(resolvedPath);
      return preadFile(resolvedPath)
        .then(function (data) {
          if (mediaType === 'image/svg+xml') {
            return 'data:' + mediaType + ';charset=utf-8,' + encodeURIComponent(data.toString('utf8').trim()) + (toUrl.hash || '');
          }
          return 'data:' + mediaType + ';base64,' + data.toString('base64') + (toUrl.hash || '');
        });
    })
    .nodeify(callback);
};
