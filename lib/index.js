var extend = require('lodash/object/extend');

function Assets(options) {
  if (!(this instanceof Assets)) {
    return new Assets(options);
  }

  this.options = extend({}, options);

  Object.freeze(this);
}

Assets.data = require('./data');
Assets.path = require('./path');
Assets.size = require('./size');
Assets.url = require('./url');

Assets.prototype.data = function (to, callback) {
  return Assets.data(to, this.options, callback);
};

Assets.prototype.path = function (to, callback) {
  return Assets.path(to, this.options, callback);
};

Assets.prototype.size = function (to, callback) {
  return Assets.size(to, this.options, callback);
};

Assets.prototype.url = function (to, callback) {
  return Assets.url(to, this.options, callback);
};

module.exports = Assets;
