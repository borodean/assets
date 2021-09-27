const resolveData = require('../lib/data');

test('w/o options', async () => {
  await expect(
    resolveData('__tests__/fixtures/duplicate-1.jpg'),
  ).resolves.toMatchSnapshot();
});

test('basePath + loadPaths', async () => {
  await expect(
    resolveData('picture.png', {
      basePath: '__tests__/fixtures',
      loadPaths: ['fonts', 'images'],
    }),
  ).resolves.toMatchSnapshot();
});

test('discard query + preserve hash', async () => {
  await expect(
    resolveData('__tests__/fixtures/duplicate-1.jpg?foo=bar#hash'),
  ).resolves.toMatchSnapshot();
});

test('svg', async () => {
  await expect(
    resolveData('__tests__/fixtures/images/vector.svg'),
  ).resolves.toMatchSnapshot();
});

test('non-existing file', async () => {
  await expect(resolveData('non-existing.gif')).rejects.toThrow(
    'Asset not found or unreadable: non-existing.gif',
  );
});

test('node-style callback w/o options', (done) => {
  resolveData('__tests__/fixtures/duplicate-1.jpg', (err, resolvedDataUrl) => {
    expect(err).toBeNull();
    expect(resolvedDataUrl.slice(0, 32)).toBe(
      'data:image/jpeg;base64,/9j/4AAQS',
    );
    done();
  });
});

test('node-style callback w/ options', (done) => {
  resolveData(
    'picture.png',
    {
      basePath: '__tests__/fixtures',
      loadPaths: ['fonts', 'images'],
    },
    (err, resolvedDataUrl) => {
      expect(err).toBeNull();
      expect(resolvedDataUrl.slice(0, 32)).toBe(
        'data:image/png;base64,iVBORw0KGg',
      );
      done();
    },
  );
});

test('node-style callback + non-existing file', (done) => {
  resolveData('non-existing.gif', (err, resolvedDataUrl) => {
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Asset not found or unreadable: non-existing.gif');
    expect(resolvedDataUrl).toBeUndefined();
    done();
  });
});
