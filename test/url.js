import fs from 'fs';
import path from 'path';
import resolveUrl from '../lib/url';
import sinon from 'sinon';
import test from 'ava';

test.before(() => {
  sinon.stub(fs, 'statSync').returns({
    mtime: new Date(Date.UTC(1991, 7, 24)),
  });
});

test.after(() => {
  fs.statSync.restore();
});

test('w/o options', (t) =>
  resolveUrl('fixtures/duplicate-1.jpg')
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg');
    }, t.fail));

test('basePath', (t) =>
  resolveUrl('duplicate-1.jpg', {
    basePath: 'fixtures',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/duplicate-1.jpg');
    }, t.fail));

test('baseUrl', (t) =>
  resolveUrl('fixtures/duplicate-1.jpg', {
    baseUrl: 'http://example.com/wp-content/themes',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/fixtures/duplicate-1.jpg');
    }, t.fail));

test('loadPaths', (t) =>
  resolveUrl('picture.png', {
    loadPaths: ['fixtures/fonts', 'fixtures/images'],
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/images/picture.png');
    }, t.fail));

test('relativeTo', (t) =>
  resolveUrl('fixtures/images/picture.png', {
    relativeTo: 'fixtures/fonts',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail));

test('basePath + baseUrl', (t) =>
  resolveUrl('duplicate-1.jpg', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/duplicate-1.jpg');
    }, t.fail));

test('basePath + loadPaths', (t) =>
  resolveUrl('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images'],
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/images/picture.png');
    }, t.fail));

test('basePath + relativeTo', (t) =>
  resolveUrl('images/picture.png', {
    basePath: 'fixtures',
    relativeTo: 'fonts',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail));

test('baseUrl + loadPaths', (t) =>
  resolveUrl('picture.png', {
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fixtures/fonts', 'fixtures/images'],
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/fixtures/images/picture.png');
    }, t.fail));

test('baseUrl + relativeTo', (t) =>
  resolveUrl('fixtures/images/picture.png', {
    baseUrl: 'http://example.com/wp-content/themes',
    relativeTo: 'fixtures/fonts',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail));

test('loadPaths + relativeTo', (t) =>
  resolveUrl('picture.png', {
    loadPaths: ['fixtures/fonts', 'fixtures/images'],
    relativeTo: 'fixtures/fonts',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail));

test('basePath + baseUrl + loadPaths', (t) =>
  resolveUrl('picture.png', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fonts', 'images'],
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/images/picture.png');
    }, t.fail));

test('basePath + baseUrl + relativeTo', (t) =>
  resolveUrl('images/picture.png', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes',
    relativeTo: 'fonts',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail));

test('basePath + loadPaths + relativeTo', (t) =>
  resolveUrl('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images'],
    relativeTo: 'fonts',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail));

test('baseUrl + loadPaths + relativeTo', (t) =>
  resolveUrl('picture.png', {
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fixtures/fonts', 'fixtures/images'],
    relativeTo: 'fixtures/fonts',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail));

test('basePath + baseUrl + loadPaths + relativeTo', (t) =>
  resolveUrl('picture.png', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fonts', 'images'],
    relativeTo: 'fonts',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail));

test('absolute basePath + relativeTo', (t) =>
  resolveUrl('images/picture.png', {
    basePath: path.resolve('fixtures'),
    relativeTo: path.resolve('fixtures/fonts'),
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail));

test('non-existing file', (t) =>
  resolveUrl('non-existing.gif')
    .then(t.fail, (err) => {
      t.ok(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    }));

test('baseUrl w/ trailing slash', (t) =>
  resolveUrl('fixtures/images/picture.png', {
    baseUrl: 'http://example.com/wp-content/themes/',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, ('http://example.com/wp-content/themes/fixtures/images/picture.png'));
    }, t.fail));

test('default cachebuster', (t) =>
  resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster: true,
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg?9f057edc00');
    }, t.fail));

test('custom cachebuster w/ falsy result', (t) =>
  resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster() { return; },
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg');
    }, t.fail));

test('custom cachebuster w/ string result', (t) =>
  resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster() { return 'bust'; },
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg?bust');
    }, t.fail));

test('custom cachebuster w/ number result', (t) =>
  resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster() { return 42; },
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg?42');
    }, t.fail));

test('custom cachebuster w/ pathname', (t) =>
  resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster() { return { pathname: '/foo.png' }; }, // TODO leading slash
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/foo.png');
    }, t.fail));

test('custom cachebuster w/ query', (t) =>
  resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster() { return { query: 'bust' }; },
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg?bust');
    }, t.fail));

test('custom cachebuster w/ pathname + query', (t) =>
  resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster() { return { pathname: '/foo.png', query: 'bust' }; }, // TODO leading slash
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/foo.png?bust');
    }, t.fail));

test('custom cachebuster arguments', (t) => {
  const cachebuster = sinon.spy();
  return resolveUrl('duplicate-1.jpg', {
    basePath: 'fixtures',
    cachebuster,
  })
    .then(() => {
      t.ok(cachebuster.calledOnce);
      t.is(cachebuster.lastCall.args.length, 2);
      t.is(cachebuster.lastCall.args[0], path.resolve('fixtures/duplicate-1.jpg'));
      t.is(cachebuster.lastCall.args[1], '/duplicate-1.jpg');
    }, t.fail);
});

test('query + hash', (t) =>
  resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash')
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz#hash');
    }, t.fail));

test('query + hash w/ default cachebuster', (t) =>
  resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: true,
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz&9f057edc00#hash');
    }, t.fail));

test('query + hash w/ custom cachebuster w/ falsy result', (t) =>
  resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster() { return; },
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz#hash');
    }, t.fail));

test('query + hash w/ custom cachebuster w/ string result', (t) =>
  resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster() { return 'bust'; },
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz&bust#hash');
    }, t.fail));

test('query + hash w/ custom cachebuster w/ pathname', (t) =>
  resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster() { return { pathname: '/foo.png' }; }, // TODO leading slash
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/foo.png?foo=bar&baz#hash');
    }, t.fail));

test('query + hash w/ custom cachebuster w/ query', (t) =>
  resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster() { return { query: 'bust' }; },
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz&bust#hash');
    }, t.fail));

test('query + hash w/ custom cachebuster w/ pathname + query', (t) =>
  resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster() { return { pathname: '/foo.png', query: 'bust' }; }, // TODO leading slash
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/foo.png?foo=bar&baz&bust#hash');
    }, t.fail));

test('query + hash w/ relativeTo', (t) =>
  resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    relativeTo: 'fixtures/fonts',
  })
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '../images/picture.png?foo=bar&baz#hash');
    }, t.fail));

test('URI-encoded needle', (t) =>
  resolveUrl('fixtures/white%20space.txt')
    .then((resolvedUrl) => {
      t.is(resolvedUrl, '/fixtures/white%20space.txt');
    }, t.fail));

test.cb('node-style callback w/o options', (t) => {
  resolveUrl('fixtures/duplicate-1.jpg', (err, resolvedUrl) => {
    t.is(err, null);
    t.is(resolvedUrl, '/fixtures/duplicate-1.jpg');
    t.end();
  });
});

test.cb('node-style callback w/ options', (t) => {
  resolveUrl('duplicate-1.jpg', {
    basePath: 'fixtures',
  }, (err, resolvedUrl) => {
    t.is(err, null);
    t.is(resolvedUrl, '/duplicate-1.jpg');
    t.end();
  });
});

test.cb('node-style callback + non-existing file', (t) => {
  resolveUrl('non-existing.gif', (err, resolvedUrl) => {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedUrl, undefined);
    t.end();
  });
});
