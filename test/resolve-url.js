var mock = require('mock-fs');
var resolveUrl = require('../lib/resolve-url');
var test = require('ava');

test.before(function (t) {
  mock({
    'assets': {
      'duplicate-1.jpg': new Buffer(0),
      'fonts': {
        'duplicate-2.txt': new Buffer(0),
        'pt-sans.woff': new Buffer(0)
      },
      'images': {
        'duplicate-1.jpg': new Buffer(0),
        'duplicate-2.txt': new Buffer(0),
        'picture.png': new Buffer(0)
      }
    }
  });
  t.end();
});

test.after(function (t) {
  mock.restore();
  t.end();
});

test('resolves from the current working directory', function (t) {
  return resolveUrl('assets/images/picture.png').then(function (resolvedUrl) {
    t.is(resolvedUrl, '/assets/images/picture.png');
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
    basePath: 'assets/images'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, ('/picture.png'));
  }, t.fail);
});

test('resolves from the load path', function (t) {
  return resolveUrl('pt-sans.woff', {
    loadPaths: ['assets/fonts', 'assets/images']
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, '/assets/fonts/pt-sans.woff');
  }, t.fail);
});

test('resolves from the base path and load path combo', function (t) {
  return resolveUrl('pt-sans.woff', {
    basePath: 'assets',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, '/fonts/pt-sans.woff');
  }, t.fail);
});

test('resolves from the base URL with a trailing slash', function (t) {
  return resolveUrl('assets/images/picture.png', {
    baseUrl: 'http://example.com/wp-content/themes/'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, ('http://example.com/wp-content/themes/assets/images/picture.png'));
  }, t.fail);
});

test('resolves from the base URL without a trailing slash', function (t) {
  return resolveUrl('assets/images/picture.png', {
    baseUrl: 'http://example.com/wp-content/themes'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, ('http://example.com/wp-content/themes/assets/images/picture.png'));
  }, t.fail);
});

test('resolves from the base URL and base path combo', function (t) {
  return resolveUrl('images/picture.png', {
    basePath: 'assets',
    baseUrl: 'http://example.com/wp-content/themes/'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, ('http://example.com/wp-content/themes/images/picture.png'));
  }, t.fail);
});

test('resolves from the base URL, base path and load path combo', function (t) {
  return resolveUrl('pt-sans.woff', {
    basePath: 'assets',
    baseUrl: 'http://example.com/wp-content/themes/',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, ('http://example.com/wp-content/themes/fonts/pt-sans.woff'));
  }, t.fail);
});

test('resolves to a relative URL', function (t) {
  return resolveUrl('assets/images/picture.png', {
    relativeTo: 'assets/fonts'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, '../images/picture.png');
  }, t.fail);
});

test('resolves to a relative URL from the base path', function (t) {
  return resolveUrl('images/picture.png', {
    basePath: 'assets',
    relativeTo: 'fonts'
  }).then(function (resolvedUrl) {
    t.is(resolvedUrl, '../images/picture.png');
  }, t.fail);
});

test('accepts node-style callback', function (t) {
  t.plan(5);

  resolveUrl('assets/images/picture.png', function (err, resolvedUrl) {
    t.is(resolvedUrl, '/assets/images/picture.png');
  });

  resolveUrl('not-found.gif', function (err, resolvedUrl) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: not-found.gif');
    t.is(resolvedUrl, undefined);
  });

  resolveUrl('picture.png', {
    basePath: 'assets/images'
  }, function (err, resolvedUrl) {
    t.is(resolvedUrl, '/picture.png');
  });
});
