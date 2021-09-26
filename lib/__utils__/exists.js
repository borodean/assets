'use strict';

var fs = require('fs');

module.exports = function exists(filePath, callback) {
  fs.stat(filePath, function cb(err) {
    callback(null, err === null);
  });
};
