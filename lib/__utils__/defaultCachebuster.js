'use strict';

var fs = require('fs');

module.exports = function defaultCachebuster(resolvedPath) {
  var mtime = fs.statSync(resolvedPath).mtime;
  return mtime.getTime().toString(16);
};
