var path = require('path');

module.exports = function (basePath, relativeTo, resolvedPath) {
  var from = path.resolve(basePath, relativeTo);
  return path.relative(from, resolvedPath);
};
