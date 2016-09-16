import path from 'path';
import test from 'ava';

import resolveSize from '../lib/size';

test('w/o options', t =>
  resolveSize('fixtures/duplicate-1.jpg')
    .then((size) => {
      t.deepEqual(size, { width: 200, height: 114 });
    }, t.fail));

test('basePath + loadPaths', t =>
  resolveSize('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images'],
  })
    .then((size) => {
      t.deepEqual(size, { width: 200, height: 57 });
    }, t.fail));

test('non-existing file', t =>
  resolveSize('non-existing.gif')
    .then(t.fail, (err) => {
      t.true(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    }));

test('nonsupported file type', t =>
  resolveSize('fixtures/fonts/empty-sans.woff')
    .then(t.fail, (err) => {
      const absolutePath = path.resolve('fixtures/fonts/empty-sans.woff');
      t.true(err instanceof Error);
      t.is(err.message, `File type not supported: ${absolutePath}`);
    }));

test('invalid file', t =>
  resolveSize('fixtures/invalid.jpg')
    .then(t.fail, (err) => {
      const absolutePath = path.resolve('fixtures/invalid.jpg');
      t.true(err instanceof Error);
      t.is(err.message, `Invalid JPEG file: ${absolutePath}`);
    }));

test.cb('node-style callback w/o options', (t) => {
  resolveSize('fixtures/duplicate-1.jpg', (err, size) => {
    t.deepEqual(size, { width: 200, height: 114 });
    t.end();
  });
});

test.cb('node-style callback w/ options', (t) => {
  resolveSize('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images'],
  }, (err, size) => {
    t.deepEqual(size, { width: 200, height: 57 });
    t.end();
  });
});

test.cb('node-style callback + non-existing file', (t) => {
  resolveSize('non-existing.gif', (err, size) => {
    t.true(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(size, undefined);
    t.end();
  });
});
