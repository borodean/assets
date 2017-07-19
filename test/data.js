import test from 'ava';

import resolveData from '../lib/data';

const imageminJpegtran = (function (r) {
  try {
    return r('imagemin-jpegtran');
  } catch (e) {
    return null;
  }
}(require));

test('w/o options', t =>
  resolveData('fixtures/duplicate-1.jpg')
    .then((resolvedDataUrl) => {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
      t.is(resolvedDataUrl.slice(-32), 'GWbO3rSpUIsvhA1vsPh/WlSpVprP/9k=');
    }, t.fail));

test('basePath + loadPaths', t =>
  resolveData('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images'],
  })
    .then((resolvedDataUrl) => {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/png;base64,iVBORw0KGg');
      t.is(resolvedDataUrl.slice(-32), '+BPCufaJraBKlQAAAABJRU5ErkJggg==');
    }, t.fail));

test('discard query + preserve hash', t =>
  resolveData('fixtures/duplicate-1.jpg?foo=bar#hash')
    .then((resolvedDataUrl) => {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
      t.is(resolvedDataUrl.slice(-32), 'rSpUIsvhA1vsPh/WlSpVprP/9k=#hash');
    }, t.fail));

test('svg', t =>
  resolveData('fixtures/images/vector.svg')
    .then((resolvedDataUrl) => {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/svg+xml;charset=utf-8');
      t.is(resolvedDataUrl.slice(-32), '0h80z%22%2F%3E%0D%0A%3C%2Fsvg%3E');
    }, t.fail));

test('non-existing file', t =>
  resolveData('non-existing.gif')
    .then(t.fail, (err) => {
      t.true(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    }));

test.cb('node-style callback w/o options', (t) => {
  resolveData('fixtures/duplicate-1.jpg', (err, resolvedDataUrl) => {
    t.is(err, null);
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
    t.end();
  });
});

test.cb('node-style callback w/ options', (t) => {
  resolveData('picture.png', {
    basePath: 'fixtures',
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

if (imageminJpegtran != null) {
  test('minified inline', t =>
    resolveData('fixtures/duplicate-1.jpg', {
      imagemin: {
        plugins: [
          imageminJpegtran({
            progressive: true,
            arithmetic: true,
          }),
        ],
      },
    }).then((minifiedDataUrl) => resolveData('fixtures/duplicate-1.jpg')
      .then((originDataUrl) => {
        t.true(minifiedDataUrl.length < originDataUrl.length);
      }), t.fail));
}
