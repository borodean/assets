module.exports = function (buffer, mediaType, options) {
  if (mediaType === 'image/svg+xml' && !options.forceBase64) {
    return 'charset=utf-8,' + encodeURIComponent(buffer.toString('utf8').trim());
  }
  return 'base64,' + buffer.toString('base64');
};
