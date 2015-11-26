var extend = require('lodash/object/extend');
var fs = require('fs');
var path = require('path');
var resolvePath = require('./resolve-path');
var url = require('url');

function cachebuster(path) {
  var mtime = fs.statSync(path).mtime;
  return mtime.getTime().toString(16);
}

function ensureTrailingSlash(urlStr) {
  var urlObj = url.parse(urlStr);
  urlObj.pathname = path.join(urlObj.pathname, '/');
  return url.format(urlObj);
}

module.exports = function (to, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = extend({
    basePath: '.',
    baseUrl: '/',
    cachebuster: false,
    relativeTo: false
  }, options);

  var toUrl = url.parse(to);

  return resolvePath(toUrl.pathname, options)
    .then(function (resolvedPath) {
      if (options.relativeTo) {
        var relativeFrom = path.resolve(options.basePath, options.relativeTo);
        toUrl.pathname = path.relative(relativeFrom, resolvedPath);
      } else {
        var normalizedBaseUrl = ensureTrailingSlash(options.baseUrl);
        var relativePath = path.relative(options.basePath, resolvedPath);
        toUrl.pathname = url.resolve(normalizedBaseUrl, relativePath);
      }
      if (options.cachebuster) {
        var cachebusterOutput = cachebuster(resolvedPath);
        if (toUrl.search) {
          toUrl.search = toUrl.search + '&' + cachebusterOutput;
        } else {
          toUrl.search = '?' + cachebusterOutput;
        }
      }
      return url.format(toUrl);
    })
    .nodeify(callback);
};
