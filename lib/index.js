var extend = require('lodash/object/extend');
var resolveDataUrl = require('./resolve-url');
var resolvePath = require('./resolve-path');
var resolveUrl = require('./resolve-url');

function AssetResolver(options) {
  if (!(this instanceof AssetResolver)) {
    return new AssetResolver(options);
  }

  this.options = extend({}, options);

  Object.freeze(this);
}

AssetResolver.prototype.resolveDataUrl = function (to, callback) {
  return resolveDataUrl(to, this.options, callback);
};

AssetResolver.prototype.resolvePath = function (to, callback) {
  return resolvePath(to, this.options, callback);
};

AssetResolver.prototype.resolveUrl = function (to, callback) {
  return resolveUrl(to, this.options, callback);
};

module.exports = AssetResolver;
