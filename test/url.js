var fs = require('fs');
var path = require('path');
var resolveUrl = require('../lib/url');
var test = require('ava');

function mtime(filePath, mtime) {
  var atime = fs.statSync(filePath).atime;
  fs.utimesSync(filePath, atime, mtime);
}

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

test('default cachebuster', function (t) {
  mtime('fixtures/images/picture.png', Date.UTC(1991, 7, 24));
  return resolveUrl('fixtures/images/picture.png', {
    cachebuster: true
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?26d2d778b6000');
    }, t.fail);
});

test('custom cachebuster w/ falsy result', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    cachebuster: function () { return; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png');
    }, t.fail);
});

test('custom cachebuster w/ string result', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    cachebuster: function () { return 'bust'; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?bust');
    }, t.fail);
});

test('custom cachebuster w/ pathname', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    cachebuster: function () { return { pathname: '/foo.png' }; } // TODO leading slash
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/foo.png');
    }, t.fail);
});

test('custom cachebuster w/ query', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    cachebuster: function () { return { query: 'bust' }; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?bust');
    }, t.fail);
});

test('custom cachebuster w/ pathname + query', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    cachebuster: function () { return { pathname: '/foo.png', query: 'bust' }; } // TODO leading slash
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/foo.png?bust');
    }, t.fail);
});

test('custom cachebuster arguments', function (t) {
  resolveUrl('images/picture.png', {
    basePath: 'fixtures',
    cachebuster: function (resolvedPath, resolvedUrlPathname) {
      t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
      t.is(resolvedUrlPathname, path.resolve('/images/picture.png'));
      t.end();
    }
  }).catch(function () {
    t.fail();
    t.end();
  });
});

test('query + hash', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash')
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz#hash');
    }, t.fail);
});

test('query + hash w/ default cachebuster', function (t) {
  mtime('fixtures/images/picture.png', Date.UTC(1991, 7, 24));
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: true
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz&26d2d778b6000#hash');
    }, t.fail);
});

test('query + hash w/ custom cachebuster w/ falsy result', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: function () { return; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz#hash');
    }, t.fail);
});

test('query + hash w/ custom cachebuster w/ string result', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: function () { return 'bust'; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz&bust#hash');
    }, t.fail);
});

test('query + hash w/ custom cachebuster w/ pathname', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: function () { return { pathname: '/foo.png' }; } // TODO leading slash
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/foo.png?foo=bar&baz#hash');
    }, t.fail);
});

test('query + hash w/ custom cachebuster w/ query', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: function () { return { query: 'bust' }; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz&bust#hash');
    }, t.fail);
});

test('query + hash w/ custom cachebuster w/ pathname + query', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: function () { return { pathname: '/foo.png', query: 'bust' }; } // TODO leading slash
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/foo.png?foo=bar&baz&bust#hash');
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
