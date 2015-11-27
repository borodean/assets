var extend = require('lodash/object/extend');

function AssetResolver(options) {
  if (!(this instanceof AssetResolver)) {
    return new AssetResolver(options);
  }

  this.options = extend({}, options);

  Object.freeze(this);
}

AssetResolver.measure = require('./measure');
AssetResolver.resolveDataUrl = require('./resolve-url');
AssetResolver.resolvePath = require('./resolve-path');
AssetResolver.resolveUrl = require('./resolve-url');

AssetResolver.prototype.measure = function (to, callback) {
  return AssetResolver.measure(to, this.options, callback);
};

AssetResolver.prototype.resolveDataUrl = function (to, callback) {
  return AssetResolver.resolveDataUrl(to, this.options, callback);
};

AssetResolver.prototype.resolvePath = function (to, callback) {
  return AssetResolver.resolvePath(to, this.options, callback);
};

AssetResolver.prototype.resolveUrl = function (to, callback) {
  return AssetResolver.resolveUrl(to, this.options, callback);
};

module.exports = AssetResolver;
