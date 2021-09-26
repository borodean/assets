const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const test = require('ava');

const resolveUrl = require('../lib/url');

test.before(() => {
  sinon.stub(fs, 'statSync').returns({
    mtime: new Date(Date.UTC(1991, 7, 24)),
  });
});

test.after(() => {
  fs.statSync.restore();
});

test('w/o options', (t) => resolveUrl('test/fixtures/duplicate-1.jpg')
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/duplicate-1.jpg');
  }));

test('basePath', (t) => resolveUrl('duplicate-1.jpg', {
  basePath: 'test/fixtures',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/duplicate-1.jpg');
  }));

test('baseUrl', (t) => resolveUrl('test/fixtures/duplicate-1.jpg', {
  baseUrl: 'http://example.com/wp-content/themes',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, 'http://example.com/wp-content/themes/test/fixtures/duplicate-1.jpg');
  }));

test('loadPaths', (t) => resolveUrl('picture.png', {
  loadPaths: ['test/fixtures/fonts', 'test/fixtures/images'],
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/images/picture.png');
  }));

test('relativeTo', (t) => resolveUrl('test/fixtures/images/picture.png', {
  relativeTo: 'test/fixtures/fonts',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '../images/picture.png');
  }));

test('basePath + baseUrl', (t) => resolveUrl('duplicate-1.jpg', {
  basePath: 'test/fixtures',
  baseUrl: 'http://example.com/wp-content/themes',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, 'http://example.com/wp-content/themes/duplicate-1.jpg');
  }));

test('basePath + loadPaths', (t) => resolveUrl('picture.png', {
  basePath: 'test/fixtures',
  loadPaths: ['fonts', 'images'],
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/images/picture.png');
  }));

test('basePath + relativeTo', (t) => resolveUrl('images/picture.png', {
  basePath: 'test/fixtures',
  relativeTo: 'fonts',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '../images/picture.png');
  }));

test('baseUrl + loadPaths', (t) => resolveUrl('picture.png', {
  baseUrl: 'http://example.com/wp-content/themes',
  loadPaths: ['test/fixtures/fonts', 'test/fixtures/images'],
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, 'http://example.com/wp-content/themes/test/fixtures/images/picture.png');
  }));

test('baseUrl + relativeTo', (t) => resolveUrl('test/fixtures/images/picture.png', {
  baseUrl: 'http://example.com/wp-content/themes',
  relativeTo: 'test/fixtures/fonts',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '../images/picture.png');
  }));

test('loadPaths + relativeTo', (t) => resolveUrl('picture.png', {
  loadPaths: ['test/fixtures/fonts', 'test/fixtures/images'],
  relativeTo: 'test/fixtures/fonts',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '../images/picture.png');
  }));

test('basePath + baseUrl + loadPaths', (t) => resolveUrl('picture.png', {
  basePath: 'test/fixtures',
  baseUrl: 'http://example.com/wp-content/themes',
  loadPaths: ['fonts', 'images'],
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, 'http://example.com/wp-content/themes/images/picture.png');
  }));

test('basePath + baseUrl + relativeTo', (t) => resolveUrl('images/picture.png', {
  basePath: 'test/fixtures',
  baseUrl: 'http://example.com/wp-content/themes',
  relativeTo: 'fonts',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '../images/picture.png');
  }));

test('basePath + loadPaths + relativeTo', (t) => resolveUrl('picture.png', {
  basePath: 'test/fixtures',
  loadPaths: ['fonts', 'images'],
  relativeTo: 'fonts',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '../images/picture.png');
  }));

test('baseUrl + loadPaths + relativeTo', (t) => resolveUrl('picture.png', {
  baseUrl: 'http://example.com/wp-content/themes',
  loadPaths: ['test/fixtures/fonts', 'test/fixtures/images'],
  relativeTo: 'test/fixtures/fonts',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '../images/picture.png');
  }));

test('basePath + baseUrl + loadPaths + relativeTo', (t) => resolveUrl('picture.png', {
  basePath: 'test/fixtures',
  baseUrl: 'http://example.com/wp-content/themes',
  loadPaths: ['fonts', 'images'],
  relativeTo: 'fonts',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '../images/picture.png');
  }));

test('absolute basePath + relativeTo', (t) => resolveUrl('images/picture.png', {
  basePath: path.resolve('test/fixtures'),
  relativeTo: path.resolve('test/fixtures/fonts'),
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '../images/picture.png');
  }));

test('non-existing file', (t) => resolveUrl('non-existing.gif')
  .then(t.fail, (err) => {
    t.true(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
  }));

test('baseUrl w/ trailing slash', (t) => resolveUrl('test/fixtures/images/picture.png', {
  baseUrl: 'http://example.com/wp-content/themes/',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, ('http://example.com/wp-content/themes/test/fixtures/images/picture.png'));
  }));

test('default cachebuster', (t) => resolveUrl('test/fixtures/duplicate-1.jpg', {
  cachebuster: true,
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/duplicate-1.jpg?9f057edc00');
  }));

test('custom cachebuster w/ falsy result', (t) => resolveUrl('test/fixtures/duplicate-1.jpg', {
  cachebuster() {},
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/duplicate-1.jpg');
  }));

test('custom cachebuster w/ string result', (t) => resolveUrl('test/fixtures/duplicate-1.jpg', {
  cachebuster() { return 'bust'; },
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/duplicate-1.jpg?bust');
  }));

test('custom cachebuster w/ number result', (t) => resolveUrl('test/fixtures/duplicate-1.jpg', {
  cachebuster() { return 42; },
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/duplicate-1.jpg?42');
  }));

test('custom cachebuster w/ pathname', (t) => resolveUrl('test/fixtures/duplicate-1.jpg', {
  cachebuster() { return { pathname: '/foo.png' }; }, // TODO leading slash
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/foo.png');
  }));

test('custom cachebuster w/ query', (t) => resolveUrl('test/fixtures/duplicate-1.jpg', {
  cachebuster() { return { query: 'bust' }; },
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/duplicate-1.jpg?bust');
  }));

test('custom cachebuster w/ pathname + query', (t) => resolveUrl('test/fixtures/duplicate-1.jpg', {
  cachebuster() { return { pathname: '/foo.png', query: 'bust' }; }, // TODO leading slash
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/foo.png?bust');
  }));

test('custom cachebuster arguments', (t) => {
  const cachebuster = sinon.spy();
  return resolveUrl('duplicate-1.jpg', {
    basePath: 'test/fixtures',
    cachebuster,
  })
    .then(() => {
      t.true(cachebuster.calledOnce);
      t.is(cachebuster.lastCall.args.length, 2);
      t.is(cachebuster.lastCall.args[0], path.resolve('test/fixtures/duplicate-1.jpg'));
      t.is(cachebuster.lastCall.args[1], '/duplicate-1.jpg');
    }, t.fail);
});

test('query + hash', (t) => resolveUrl('test/fixtures/images/picture.png?foo=bar&baz#hash')
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/images/picture.png?foo=bar&baz#hash');
  }));

test('query + hash w/ default cachebuster', (t) => resolveUrl('test/fixtures/images/picture.png?foo=bar&baz#hash', {
  cachebuster: true,
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/images/picture.png?foo=bar&baz&9f057edc00#hash');
  }));

test('query + hash w/ custom cachebuster w/ falsy result', (t) => resolveUrl('test/fixtures/images/picture.png?foo=bar&baz#hash', {
  cachebuster() {},
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/images/picture.png?foo=bar&baz#hash');
  }));

test('query + hash w/ custom cachebuster w/ string result', (t) => resolveUrl('test/fixtures/images/picture.png?foo=bar&baz#hash', {
  cachebuster() { return 'bust'; },
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/images/picture.png?foo=bar&baz&bust#hash');
  }));

test('query + hash w/ custom cachebuster w/ pathname', (t) => resolveUrl('test/fixtures/images/picture.png?foo=bar&baz#hash', {
  cachebuster() { return { pathname: '/foo.png' }; }, // TODO leading slash
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/foo.png?foo=bar&baz#hash');
  }));

test('query + hash w/ custom cachebuster w/ query', (t) => resolveUrl('test/fixtures/images/picture.png?foo=bar&baz#hash', {
  cachebuster() { return { query: 'bust' }; },
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/images/picture.png?foo=bar&baz&bust#hash');
  }));

test('query + hash w/ custom cachebuster w/ pathname + query', (t) => resolveUrl('test/fixtures/images/picture.png?foo=bar&baz#hash', {
  cachebuster() { return { pathname: '/foo.png', query: 'bust' }; }, // TODO leading slash
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/foo.png?foo=bar&baz&bust#hash');
  }));

test('query + hash w/ relativeTo', (t) => resolveUrl('test/fixtures/images/picture.png?foo=bar&baz#hash', {
  relativeTo: 'test/fixtures/fonts',
})
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '../images/picture.png?foo=bar&baz#hash');
  }));

test('URI-encoded needle', (t) => resolveUrl('test/fixtures/white%20space.txt')
  .then((resolvedUrl) => {
    t.is(resolvedUrl, '/test/fixtures/white%20space.txt');
  }));

test.cb('node-style callback w/o options', (t) => {
  resolveUrl('test/fixtures/duplicate-1.jpg', (err, resolvedUrl) => {
    t.is(err, null);
    t.is(resolvedUrl, '/test/fixtures/duplicate-1.jpg');
    t.end();
  });
});

test.cb('node-style callback w/ options', (t) => {
  resolveUrl('duplicate-1.jpg', {
    basePath: 'test/fixtures',
  }, (err, resolvedUrl) => {
    t.is(err, null);
    t.is(resolvedUrl, '/duplicate-1.jpg');
    t.end();
  });
});

test.cb('node-style callback + non-existing file', (t) => {
  resolveUrl('non-existing.gif', (err, resolvedUrl) => {
    t.true(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedUrl, undefined);
    t.end();
  });
});
