'use strict';

var convertPathToUrl = require('./convertPathToUrl');
var ensureTrailingSlash = require('./ensureTrailingSlash');
var path = require('path');
var url = require('url');

module.exports = function composeAbsolutePathname(baseUrl, basePath, resolvedPath) {
  var from = ensureTrailingSlash(baseUrl);
  var to = path.relative(basePath, resolvedPath);
  return url.resolve(from, convertPathToUrl(to));
};
