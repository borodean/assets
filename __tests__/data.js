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
