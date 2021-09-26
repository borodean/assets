'use strict';

var sep = require('path').sep;

module.exports = function convertPathToUrl(path) {
  return path.split(sep).join('/');
};
