var resolveUrl = require('../lib/resolve-url');
var test = require('ava');

test('no options', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg')
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg');
    }, t.fail);
});

test('basePath', function (t) {
  return resolveUrl('duplicate-1.jpg', {
    basePath: 'fixtures'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/duplicate-1.jpg');
    }, t.fail);
});

test('baseUrl', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg', {
    baseUrl: 'http://example.com/wp-content/themes'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/fixtures/duplicate-1.jpg');
    }, t.fail);
});

test('loadPaths', function (t) {
  return resolveUrl('picture.png', {
    loadPaths: ['fixtures/fonts', 'fixtures/images']
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png');
    }, t.fail);
});

test('relativeTo', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    relativeTo: 'fixtures/fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('basePath + baseUrl', function (t) {
  return resolveUrl('duplicate-1.jpg', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/duplicate-1.jpg');
    }, t.fail);
});

test('basePath + loadPaths', function (t) {
  return resolveUrl('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/images/picture.png');
    }, t.fail);
});

test('basePath + relativeTo', function (t) {
  return resolveUrl('images/picture.png', {
    basePath: 'fixtures',
    relativeTo: 'fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('baseUrl + loadPaths', function (t) {
  return resolveUrl('picture.png', {
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fixtures/fonts', 'fixtures/images']
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/fixtures/images/picture.png');
    }, t.fail);
});

test('baseUrl + relativeTo', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    baseUrl: 'http://example.com/wp-content/themes',
    relativeTo: 'fixtures/fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('loadPaths + relativeTo', function (t) {
  return resolveUrl('picture.png', {
    loadPaths: ['fixtures/fonts', 'fixtures/images'],
    relativeTo: 'fixtures/fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('basePath + baseUrl + loadPaths', function (t) {
  return resolveUrl('picture.png', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fonts', 'images']
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/images/picture.png');
    }, t.fail);
});

test('basePath + baseUrl + relativeTo', function (t) {
  return resolveUrl('images/picture.png', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes',
    relativeTo: 'fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('basePath + loadPaths + relativeTo', function (t) {
  return resolveUrl('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images'],
    relativeTo: 'fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('basePath + baseUrl + loadPaths + relativeTo', function (t) {
  return resolveUrl('picture.png', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fonts', 'images'],
    relativeTo: 'fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('non-existing file', function (t) {
  return resolveUrl('non-existing.gif')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    });
});

test('baseUrl w/ trailing slash', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    baseUrl: 'http://example.com/wp-content/themes/'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, ('http://example.com/wp-content/themes/fixtures/images/picture.png'));
    }, t.fail);
});

test('query + hash', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash')
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz#hash');
    }, t.fail);
});

test('query + hash w/ relativeTo', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    relativeTo: 'fixtures/fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png?foo=bar&baz#hash');
    }, t.fail);
});

test('node-style callback', function (t) {
  t.plan(5);

  resolveUrl('fixtures/images/picture.png', function (err, resolvedUrl) {
    t.is(resolvedUrl, '/fixtures/images/picture.png');
  });

  resolveUrl('non-existing.gif', function (err, resolvedUrl) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedUrl, undefined);
  });

  resolveUrl('picture.png', {
    basePath: 'fixtures/images'
  }, function (err, resolvedUrl) {
    t.is(resolvedUrl, '/picture.png');
  });
});
