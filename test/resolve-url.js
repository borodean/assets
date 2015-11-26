var resolveUrl = require('../lib/resolve-url');
var test = require('ava');

test('resolves from the current working directory', function (t) {
  return resolveUrl('fixtures/images/picture.png').then(function (resolvedUrl) {
    t.is(resolvedUrl, '/fixtures/images/picture.png');
  }, t.fail);
});

test('rejects when resolving non-exisiting file', function (t) {
  return resolveUrl('not-found.gif').then(t.fail, function (err) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: not-found.gif');
  });
});

test('resolves from the base path', function (t) {
  return resolveUrl('picture.png', {
    basePath: 'fixtures/images'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, ('/picture.png'));
  }, t.fail);
});

test('resolves from the load path', function (t) {
  return resolveUrl('empty-sans.woff', {
    loadPaths: ['fixtures/fonts', 'fixtures/images']
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, '/fixtures/fonts/empty-sans.woff');
  }, t.fail);
});

test('resolves from the base path and load path combo', function (t) {
  return resolveUrl('empty-sans.woff', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, '/fonts/empty-sans.woff');
  }, t.fail);
});

test('resolves from the base URL with a trailing slash', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    baseUrl: 'http://example.com/wp-content/themes/'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, ('http://example.com/wp-content/themes/fixtures/images/picture.png'));
  }, t.fail);
});

test('resolves from the base URL without a trailing slash', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    baseUrl: 'http://example.com/wp-content/themes'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, ('http://example.com/wp-content/themes/fixtures/images/picture.png'));
  }, t.fail);
});

test('resolves from the base URL and base path combo', function (t) {
  return resolveUrl('images/picture.png', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes/'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, ('http://example.com/wp-content/themes/images/picture.png'));
  }, t.fail);
});

test('resolves from the base URL, base path and load path combo', function (t) {
  return resolveUrl('empty-sans.woff', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes/',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, ('http://example.com/wp-content/themes/fonts/empty-sans.woff'));
  }, t.fail);
});

test('resolves to a relative URL', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    relativeTo: 'fixtures/fonts'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, '../images/picture.png');
  }, t.fail);
});

test('resolves to a relative URL from the base path', function (t) {
  return resolveUrl('images/picture.png', {
    basePath: 'fixtures',
    relativeTo: 'fonts'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, '../images/picture.png');
  }, t.fail);
});

test('resolves keeping query parameters and hash', function (t) {
  return resolveUrl('images/picture.png?foo=bar&baz#hash', {
    basePath: 'fixtures'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, '/images/picture.png?foo=bar&baz#hash');
  }, t.fail);
});

test('resolves to a relative URL keeping query parameters and hash', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    relativeTo: 'fixtures/fonts'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, '../images/picture.png?foo=bar&baz#hash');
  }, t.fail);
});

test('accepts node-style callback', function (t) {
  t.plan(5);

  resolveUrl('fixtures/images/picture.png', function (err, resolvedUrl) {
    t.is(resolvedUrl, '/fixtures/images/picture.png');
  });

  resolveUrl('not-found.gif', function (err, resolvedUrl) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: not-found.gif');
    t.is(resolvedUrl, undefined);
  });

  resolveUrl('picture.png', {
    basePath: 'fixtures/images'
  }, function (err, resolvedUrl) {
    t.is(resolvedUrl, '/picture.png');
  });
});
