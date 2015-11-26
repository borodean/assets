var extend = require('lodash/object/extend');
var resolvePath = require('./resolve-path');

function AssetResolver(options) {
  if (!(this instanceof AssetResolver)) {
    return new AssetResolver(options);
  }

  this.options = extend({}, options);

  Object.freeze(this);
}

AssetResolver.prototype.resolvePath = function (to) {
  return resolvePath(to, this.options);
};

module.exports = AssetResolver;
