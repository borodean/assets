const test = require('ava');

const resolveData = require('../lib/data');

test('w/o options', (t) => resolveData('test/fixtures/duplicate-1.jpg')
  .then((resolvedDataUrl) => {
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
    t.is(resolvedDataUrl.slice(-32), 'GWbO3rSpUIsvhA1vsPh/WlSpVprP/9k=');
  }));

test('basePath + loadPaths', (t) => resolveData('picture.png', {
  basePath: 'test/fixtures',
  loadPaths: ['fonts', 'images'],
})
  .then((resolvedDataUrl) => {
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/png;base64,iVBORw0KGg');
    t.is(resolvedDataUrl.slice(-32), '+BPCufaJraBKlQAAAABJRU5ErkJggg==');
  }));

test('discard query + preserve hash', (t) => resolveData('test/fixtures/duplicate-1.jpg?foo=bar#hash')
  .then((resolvedDataUrl) => {
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
    t.is(resolvedDataUrl.slice(-32), 'rSpUIsvhA1vsPh/WlSpVprP/9k=#hash');
  }));

test('svg', (t) => resolveData('test/fixtures/images/vector.svg')
  .then((resolvedDataUrl) => {
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/svg+xml;charset=utf-8');
    t.is(resolvedDataUrl.slice(-32), '0h80z%22%2F%3E%0D%0A%3C%2Fsvg%3E');
  }));

test('non-existing file', (t) => resolveData('non-existing.gif')
  .then(t.fail, (err) => {
    t.true(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
  }));

test.cb('node-style callback w/o options', (t) => {
  resolveData('test/fixtures/duplicate-1.jpg', (err, resolvedDataUrl) => {
    t.is(err, null);
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
    t.end();
  });
});

test.cb('node-style callback w/ options', (t) => {
  resolveData('picture.png', {
    basePath: 'test/fixtures',
    loadPaths: ['fonts', 'images'],
  }, (err, resolvedDataUrl) => {
    t.is(err, null);
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/png;base64,iVBORw0KGg');
    t.end();
  });
});

test.cb('node-style callback + non-existing file', (t) => {
  resolveData('non-existing.gif', (err, resolvedDataUrl) => {
    t.true(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedDataUrl, undefined);
    t.end();
  });
});
