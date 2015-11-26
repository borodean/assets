var extend = require('lodash/object/extend');
var path = require('path');
var resolvePath = require('./resolve-path');
var url = require('url');

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
    relativeTo: false
  }, options);

  return resolvePath(to, options)
    .then(function (resolvedPath) {
      if (options.relativeTo) {
        var relativeFrom = path.resolve(options.basePath, options.relativeTo);
        return path.relative(relativeFrom, resolvedPath);
      }
      var normalizedBaseUrl = ensureTrailingSlash(options.baseUrl);
      var relativePath = path.relative(options.basePath, resolvedPath);
      return url.resolve(normalizedBaseUrl, relativePath);
    })
    .nodeify(callback);
};
