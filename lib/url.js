var extend = require('lodash/object/extend');
var fs = require('fs');
var path = require('path');
var resolvePath = require('./path');
var url = require('url');

function composeAbsolutePathname(baseUrl, basePath, resolvedPath) {
  var from = ensureTrailingSlash(baseUrl);
  var to = path.relative(basePath, resolvedPath);
  return url.resolve(from, to);
}

function composeQueryString(current, addon) {
  if (current) {
    return current + '&' + addon;
  }
  return '?' + addon;
}

function composeRelativePathname(basePath, relativeTo, resolvedPath) {
  var from = path.resolve(basePath, relativeTo);
  return path.relative(from, resolvedPath);
}

function defaultCachebuster(resolvedPath) {
  var mtime = fs.statSync(resolvedPath).mtime;
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

  if (options.cachebuster === true) {
    options.cachebuster = defaultCachebuster;
  }

  var toUrl = url.parse(to);

  return resolvePath(toUrl.pathname, options)
    .then(function (resolvedPath) {
      if (options.relativeTo) {
        toUrl.pathname = composeRelativePathname(options.basePath, options.relativeTo, resolvedPath);
      } else {
        toUrl.pathname = composeAbsolutePathname(options.baseUrl, options.basePath, resolvedPath);
      }
      if (options.cachebuster) {
        var cachebusterOutput = options.cachebuster(resolvedPath, toUrl.pathname);
        if (cachebusterOutput) {
          if (typeof cachebusterOutput === 'string') {
            toUrl.search = composeQueryString(toUrl.search, cachebusterOutput);
          } else {
            if (cachebusterOutput.pathname) {
              toUrl.pathname = cachebusterOutput.pathname;
            }
            if (cachebusterOutput.query) {
              toUrl.search = composeQueryString(toUrl.search, cachebusterOutput.query);
            }
          }
        }
      }
      return url.format(toUrl);
    })
    .nodeify(callback);
};
