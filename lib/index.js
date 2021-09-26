'use strict';

var extend = require('lodash/extend');

function Assets(options) {
  if (!(this instanceof Assets)) {
    return new Assets(options);
  }

  this.options = extend({}, options);
  Object.freeze(this);
}

['data', 'path', 'size', 'url'].forEach(function interator(resolverName) {
  // eslint-disable-next-line global-require
  Assets[resolverName] = require('./' + resolverName);
  Assets.prototype[resolverName] = function resolver(path, callback) {
    return Assets[resolverName](path, this.options, callback);
  };
});

module.exports = Assets;
