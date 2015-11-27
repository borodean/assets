var extend = require('lodash/object/extend');

function AssetResolver(options) {
  if (!(this instanceof AssetResolver)) {
    return new AssetResolver(options);
  }

  this.options = extend({}, options);

  Object.freeze(this);
}

AssetResolver.data = require('./data');
AssetResolver.path = require('./path');
AssetResolver.size = require('./size');
AssetResolver.url = require('./url');

AssetResolver.prototype.data = function (to, callback) {
  return AssetResolver.data(to, this.options, callback);
};

AssetResolver.prototype.path = function (to, callback) {
  return AssetResolver.path(to, this.options, callback);
};

AssetResolver.prototype.size = function (to, callback) {
  return AssetResolver.size(to, this.options, callback);
};

AssetResolver.prototype.url = function (to, callback) {
  return AssetResolver.url(to, this.options, callback);
};

module.exports = AssetResolver;
