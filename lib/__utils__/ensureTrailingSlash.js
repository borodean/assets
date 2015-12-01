var path = require('path');
var url = require('url');

module.exports = function (urlStr) {
  var urlObj = url.parse(urlStr);
  urlObj.pathname = path.join(urlObj.pathname, '/');
  return url.format(urlObj);
};
