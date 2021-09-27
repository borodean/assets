const path = require('path');

const resolvePath = require('../lib/path');

test('w/o options', async () => {
  await expect(resolvePath('__tests__/fixtures/duplicate-1.jpg')).resolves.toBe(
    path.resolve('__tests__/fixtures/duplicate-1.jpg'),
  );
});

test('basePath', async () => {
  await expect(
    resolvePath('duplicate-1.jpg', {
      basePath: '__tests__/fixtures',
    }),
  ).resolves.toBe(path.resolve('__tests__/fixtures/duplicate-1.jpg'));
});

test('loadPaths', async () => {
  await expect(
    resolvePath('picture.png', {
      loadPaths: ['__tests__/fixtures/fonts', '__tests__/fixtures/images'],
    }),
  ).resolves.toBe(path.resolve('__tests__/fixtures/images/picture.png'));
});

test('loadPaths string', async () => {
  await expect(
    resolvePath('picture.png', {
      loadPaths: '__tests__/fixtures/images',
    }),
  ).resolves.toBe(path.resolve('__tests__/fixtures/images/picture.png'));
});

test('loadPaths glob', async () => {
  await expect(
    resolvePath('picture.png', {
      loadPaths: '__tests__/fixtures/*',
    }),
  ).resolves.toBe(path.resolve('__tests__/fixtures/images/picture.png'));
});

test('basePath + loadPaths', async () => {
  await expect(
    resolvePath('picture.png', {
      basePath: '__tests__/fixtures',
      loadPaths: ['fonts', 'images'],
    }),
  ).resolves.toBe(path.resolve('__tests__/fixtures/images/picture.png'));
});

test('absolute needle + basePath', async () => {
  const absoluteTo = path.resolve('__tests__/fixtures/duplicate-1.jpg');
  await expect(
    resolvePath(absoluteTo, {
      basePath: '__tests__/fixtures',
    }),
  ).resolves.toBe(path.resolve('__tests__/fixtures/duplicate-1.jpg'));
});

test('absolute basePath + loadPaths', async () => {
  await expect(
    resolvePath('picture.png', {
      basePath: path.resolve('__tests__/fixtures'),
      loadPaths: [
        path.resolve('__tests__/fixtures/fonts'),
        path.resolve('__tests__/fixtures/images'),
      ],
    }),
  ).resolves.toBe(path.resolve('__tests__/fixtures/images/picture.png'));
});

test('non-existing file', async () => {
  await expect(resolvePath('non-existing.gif')).rejects.toThrow(
    'Asset not found or unreadable: non-existing.gif',
  );
});

test('prioritize basePath over the loadPaths', async () => {
  await expect(
    resolvePath('duplicate-1.jpg', {
      basePath: '__tests__/fixtures',
      loadPaths: ['fonts', 'images'],
    }),
  ).resolves.toBe(path.resolve('__tests__/fixtures/duplicate-1.jpg'));
});

test('prioritize firsts loadPaths over the lasts', async () => {
  await expect(
    resolvePath('duplicate-2.txt', {
      basePath: '__tests__/fixtures',
      loadPaths: ['fonts', 'images'],
    }),
  ).resolves.toBe(path.resolve('__tests__/fixtures/fonts/duplicate-2.txt'));
});
