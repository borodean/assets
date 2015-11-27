var resolveData = require('../lib/data');
var test = require('ava');

test('no options', function (t) {
  return resolveData('fixtures/duplicate-1.jpg')
    .then(function (resolvedDataUrl) {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
    }, t.fail);
});

test('with options', function (t) {
  return resolveData('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  })
    .then(function (resolvedDataUrl) {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/png;base64,iVBORw0KGg');
    }, t.fail);
});

test('remove query + preserve hash', function (t) {
  return resolveData('fixtures/duplicate-1.jpg?foo=bar#hash')
    .then(function (resolvedDataUrl) {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
      t.is(resolvedDataUrl.slice(-32), 'rSpUIsvhA1vsPh/WlSpVprP/9k=#hash');
    }, t.fail);
});

test('non-existing file', function (t) {
  return resolveData('non-existing.gif')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    });
});

test('node-style callback', function (t) {
  t.plan(5);

  resolveData('fixtures/duplicate-1.jpg', function (err, resolvedDataUrl) {
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
  });

  resolveData('non-existing.gif', function (err, resolvedDataUrl) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedDataUrl, undefined);
  });

  resolveData('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }, function (err, resolvedDataUrl) {
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/png;base64,iVBORw0KGg');
  });
});
