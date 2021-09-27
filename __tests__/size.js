const path = require('path');

const resolveSize = require('../lib/size');

test('w/o options', async () => {
  await expect(
    resolveSize('__tests__/fixtures/duplicate-1.jpg'),
  ).resolves.toEqual({ width: 200, height: 114 });
});

test('basePath + loadPaths', async () => {
  await expect(
    resolveSize('picture.png', {
      basePath: '__tests__/fixtures',
      loadPaths: ['fonts', 'images'],
    }),
  ).resolves.toEqual({ width: 200, height: 57 });
});

test('non-existing file', async () => {
  await expect(resolveSize('non-existing.gif')).rejects.toThrow(
    'Asset not found or unreadable: non-existing.gif',
  );
});

test('non-supported file type', async () => {
  const absolutePath = path.resolve('__tests__/fixtures/fonts/empty-sans.woff');
  await expect(
    resolveSize('__tests__/fixtures/fonts/empty-sans.woff'),
  ).rejects.toThrow(`File type not supported: ${absolutePath}`);
});

test('invalid file', async () => {
  const absolutePath = path.resolve('__tests__/fixtures/invalid.jpg');
  await expect(resolveSize('__tests__/fixtures/invalid.jpg')).rejects.toThrow(
    `Invalid JPEG file: ${absolutePath}`,
  );
});
