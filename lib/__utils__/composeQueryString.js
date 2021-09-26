'use strict';

module.exports = function composeQueryString(current, addon) {
  if (current) {
    return current + '&' + addon;
  }
  return '?' + addon;
};
