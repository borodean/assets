const fs = require('fs');
const path = require('path');

const resolveUrl = require('../lib/url');

beforeEach(() => {
  jest.spyOn(fs, 'statSync').mockReturnValue({
    mtime: new Date(Date.UTC(1991, 7, 24)),
  });
});

afterEach(() => {
  fs.statSync.mockRestore();
});

test('w/o options', async () => {
  await expect(resolveUrl('__tests__/fixtures/duplicate-1.jpg')).resolves.toBe(
    '/__tests__/fixtures/duplicate-1.jpg',
  );
});

test('basePath', async () => {
  await expect(
    resolveUrl('duplicate-1.jpg', {
      basePath: '__tests__/fixtures',
    }),
  ).resolves.toBe('/duplicate-1.jpg');
});

test('baseUrl', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/duplicate-1.jpg', {
      baseUrl: 'http://example.com/wp-content/themes',
    }),
  ).resolves.toBe(
    'http://example.com/wp-content/themes/__tests__/fixtures/duplicate-1.jpg',
  );
});

test('loadPaths', async () => {
  await expect(
    resolveUrl('picture.png', {
      loadPaths: ['__tests__/fixtures/fonts', '__tests__/fixtures/images'],
    }),
  ).resolves.toBe('/__tests__/fixtures/images/picture.png');
});

test('relativeTo', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png', {
      relativeTo: '__tests__/fixtures/fonts',
    }),
  ).resolves.toBe('../images/picture.png');
});

test('basePath + baseUrl', async () => {
  await expect(
    resolveUrl('duplicate-1.jpg', {
      basePath: '__tests__/fixtures',
      baseUrl: 'http://example.com/wp-content/themes',
    }),
  ).resolves.toBe('http://example.com/wp-content/themes/duplicate-1.jpg');
});

test('basePath + loadPaths', async () => {
  await expect(
    resolveUrl('picture.png', {
      basePath: '__tests__/fixtures',
      loadPaths: ['fonts', 'images'],
    }),
  ).resolves.toBe('/images/picture.png');
});

test('basePath + relativeTo', async () => {
  await expect(
    resolveUrl('images/picture.png', {
      basePath: '__tests__/fixtures',
      relativeTo: 'fonts',
    }),
  ).resolves.toBe('../images/picture.png');
});

test('baseUrl + loadPaths', async () => {
  await expect(
    resolveUrl('picture.png', {
      baseUrl: 'http://example.com/wp-content/themes',
      loadPaths: ['__tests__/fixtures/fonts', '__tests__/fixtures/images'],
    }),
  ).resolves.toBe(
    'http://example.com/wp-content/themes/__tests__/fixtures/images/picture.png',
  );
});

test('baseUrl + relativeTo', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png', {
      baseUrl: 'http://example.com/wp-content/themes',
      relativeTo: '__tests__/fixtures/fonts',
    }),
  ).resolves.toBe('../images/picture.png');
});

test('loadPaths + relativeTo', async () => {
  await expect(
    resolveUrl('picture.png', {
      loadPaths: ['__tests__/fixtures/fonts', '__tests__/fixtures/images'],
      relativeTo: '__tests__/fixtures/fonts',
    }),
  ).resolves.toBe('../images/picture.png');
});

test('basePath + baseUrl + loadPaths', async () => {
  await expect(
    resolveUrl('picture.png', {
      basePath: '__tests__/fixtures',
      baseUrl: 'http://example.com/wp-content/themes',
      loadPaths: ['fonts', 'images'],
    }),
  ).resolves.toBe('http://example.com/wp-content/themes/images/picture.png');
});

test('basePath + baseUrl + relativeTo', async () => {
  await expect(
    resolveUrl('images/picture.png', {
      basePath: '__tests__/fixtures',
      baseUrl: 'http://example.com/wp-content/themes',
      relativeTo: 'fonts',
    }),
  ).resolves.toBe('../images/picture.png');
});

test('basePath + loadPaths + relativeTo', async () => {
  await expect(
    resolveUrl('picture.png', {
      basePath: '__tests__/fixtures',
      loadPaths: ['fonts', 'images'],
      relativeTo: 'fonts',
    }),
  ).resolves.toBe('../images/picture.png');
});

test('baseUrl + loadPaths + relativeTo', async () => {
  await expect(
    resolveUrl('picture.png', {
      baseUrl: 'http://example.com/wp-content/themes',
      loadPaths: ['__tests__/fixtures/fonts', '__tests__/fixtures/images'],
      relativeTo: '__tests__/fixtures/fonts',
    }),
  ).resolves.toBe('../images/picture.png');
});

test('basePath + baseUrl + loadPaths + relativeTo', async () => {
  await expect(
    resolveUrl('picture.png', {
      basePath: '__tests__/fixtures',
      baseUrl: 'http://example.com/wp-content/themes',
      loadPaths: ['fonts', 'images'],
      relativeTo: 'fonts',
    }),
  ).resolves.toBe('../images/picture.png');
});

test('absolute basePath + relativeTo', async () => {
  await expect(
    resolveUrl('images/picture.png', {
      basePath: path.resolve('__tests__/fixtures'),
      relativeTo: path.resolve('__tests__/fixtures/fonts'),
    }),
  ).resolves.toBe('../images/picture.png');
});

test('non-existing file', async () => {
  await expect(resolveUrl('non-existing.gif')).rejects.toThrow(
    'Asset not found or unreadable: non-existing.gif',
  );
});

test('baseUrl w/ trailing slash', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png', {
      baseUrl: 'http://example.com/wp-content/themes/',
    }),
  ).resolves.toBe(
    'http://example.com/wp-content/themes/__tests__/fixtures/images/picture.png',
  );
});

test('default cachebuster', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/duplicate-1.jpg', {
      cachebuster: true,
    }),
  ).resolves.toBe('/__tests__/fixtures/duplicate-1.jpg?9f057edc00');
});

test('custom cachebuster w/ falsy result', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/duplicate-1.jpg', {
      cachebuster: () => {},
    }),
  ).resolves.toBe('/__tests__/fixtures/duplicate-1.jpg');
});

test('custom cachebuster w/ string result', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/duplicate-1.jpg', {
      cachebuster: () => 'bust',
    }),
  ).resolves.toBe('/__tests__/fixtures/duplicate-1.jpg?bust');
});

test('custom cachebuster w/ number result', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/duplicate-1.jpg', {
      cachebuster: () => 42,
    }),
  ).resolves.toBe('/__tests__/fixtures/duplicate-1.jpg?42');
});

test('custom cachebuster w/ pathname', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/duplicate-1.jpg', {
      cachebuster: () => ({ pathname: '/foo.png' }), // TODO leading slash
    }),
  ).resolves.toBe('/foo.png');
});

test('custom cachebuster w/ query', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/duplicate-1.jpg', {
      cachebuster: () => ({ query: 'bust' }),
    }),
  ).resolves.toBe('/__tests__/fixtures/duplicate-1.jpg?bust');
});

test('custom cachebuster w/ pathname + query', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/duplicate-1.jpg', {
      cachebuster: () => ({ pathname: '/foo.png', query: 'bust' }), // TODO leading slash
    }),
  ).resolves.toBe('/foo.png?bust');
});

test('custom cachebuster arguments', async () => {
  const cachebuster = jest.fn();

  await resolveUrl('duplicate-1.jpg', {
    basePath: '__tests__/fixtures',
    cachebuster,
  });

  expect(cachebuster).toBeCalledWith(
    path.resolve('__tests__/fixtures/duplicate-1.jpg'),
    '/duplicate-1.jpg',
  );
});

test('query + hash', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png?foo=bar&baz#hash'),
  ).resolves.toBe('/__tests__/fixtures/images/picture.png?foo=bar&baz#hash');
});

test('query + hash w/ default cachebuster', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png?foo=bar&baz#hash', {
      cachebuster: true,
    }),
  ).resolves.toBe(
    '/__tests__/fixtures/images/picture.png?foo=bar&baz&9f057edc00#hash',
  );
});

test('query + hash w/ custom cachebuster w/ falsy result', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png?foo=bar&baz#hash', {
      cachebuster: () => {},
    }),
  ).resolves.toBe('/__tests__/fixtures/images/picture.png?foo=bar&baz#hash');
});

test('query + hash w/ custom cachebuster w/ string result', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png?foo=bar&baz#hash', {
      cachebuster: () => 'bust',
    }),
  ).resolves.toBe(
    '/__tests__/fixtures/images/picture.png?foo=bar&baz&bust#hash',
  );
});

test('query + hash w/ custom cachebuster w/ pathname', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png?foo=bar&baz#hash', {
      cachebuster: () => ({ pathname: '/foo.png' }), // TODO leading slash
    }),
  ).resolves.toBe('/foo.png?foo=bar&baz#hash');
});

test('query + hash w/ custom cachebuster w/ query', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png?foo=bar&baz#hash', {
      cachebuster: () => ({ query: 'bust' }),
    }),
  ).resolves.toBe(
    '/__tests__/fixtures/images/picture.png?foo=bar&baz&bust#hash',
  );
});

test('query + hash w/ custom cachebuster w/ pathname + query', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png?foo=bar&baz#hash', {
      cachebuster: () => ({ pathname: '/foo.png', query: 'bust' }), // TODO leading slash
    }),
  ).resolves.toBe('/foo.png?foo=bar&baz&bust#hash');
});

test('query + hash w/ relativeTo', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/images/picture.png?foo=bar&baz#hash', {
      relativeTo: '__tests__/fixtures/fonts',
    }),
  ).resolves.toBe('../images/picture.png?foo=bar&baz#hash');
});

test('URI-encoded needle', async () => {
  await expect(
    resolveUrl('__tests__/fixtures/white%20space.txt'),
  ).resolves.toBe('/__tests__/fixtures/white%20space.txt');
});

test('node-style callback w/o options', (done) => {
  resolveUrl('__tests__/fixtures/duplicate-1.jpg', (err, resolvedUrl) => {
    expect(err).toBeNull();
    expect(resolvedUrl).toBe('/__tests__/fixtures/duplicate-1.jpg');
    done();
  });
});

test('node-style callback w/ options', (done) => {
  resolveUrl(
    'duplicate-1.jpg',
    {
      basePath: '__tests__/fixtures',
    },
    (err, resolvedUrl) => {
      expect(err).toBeNull();
      expect(resolvedUrl).toBe('/duplicate-1.jpg');
      done();
    },
  );
});

test('node-style callback + non-existing file', (done) => {
  resolveUrl('non-existing.gif', (err, resolvedUrl) => {
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Asset not found or unreadable: non-existing.gif');
    expect(resolvedUrl).toBeUndefined();
    done();
  });
});
