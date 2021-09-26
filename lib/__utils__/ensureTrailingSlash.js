'use strict';

var convertPathToUrl = require('./convertPathToUrl');
var path = require('path');
var url = require('url');

module.exports = function encodeBuffer(urlStr) {
  var urlObj = url.parse(urlStr);
  urlObj.pathname = convertPathToUrl(path.join(urlObj.pathname, path.sep));
  return url.format(urlObj);
};
