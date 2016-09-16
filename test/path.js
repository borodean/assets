import path from 'path';
import test from 'ava';

import resolvePath from '../lib/path';

test('w/o options', t =>
  resolvePath('fixtures/duplicate-1.jpg')
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    }, t.fail));

test('basePath', t =>
  resolvePath('duplicate-1.jpg', {
    basePath: 'fixtures',
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    }, t.fail));

test('loadPaths', t =>
  resolvePath('picture.png', {
    loadPaths: ['fixtures/fonts', 'fixtures/images'],
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
    }, t.fail));

test('loadPaths string', t =>
  resolvePath('picture.png', {
    loadPaths: 'fixtures/images',
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
    }, t.fail));

test('loadPaths glob', t =>
  resolvePath('picture.png', {
    loadPaths: 'fixtures/*',
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
    }, t.fail));

test('basePath + loadPaths', t =>
  resolvePath('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images'],
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
    }, t.fail));

test('absolute needle + basePath', (t) => {
  const absoluteTo = path.resolve('fixtures/duplicate-1.jpg');
  return resolvePath(absoluteTo, {
    basePath: 'fixtures',
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    }, t.fail);
});

test('absolute basePath + loadPaths', t =>
  resolvePath('picture.png', {
    basePath: path.resolve('fixtures'),
    loadPaths: [
      path.resolve('fixtures/fonts'),
      path.resolve('fixtures/images'),
    ],
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
    }, t.fail));

test('non-existing file', t =>
  resolvePath('non-existing.gif')
    .then(t.fail, (err) => {
      t.ok(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    }));

test('prioritize basePath over the loadPaths', t =>
  resolvePath('duplicate-1.jpg', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images'],
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    }, t.fail));

test('prioritize firsts loadPaths over the lasts', t =>
  resolvePath('duplicate-2.txt', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images'],
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('fixtures/fonts/duplicate-2.txt'));
    }, t.fail));

test.cb('node-style callback w/ options', (t) => {
  resolvePath('fixtures/duplicate-1.jpg', (err, resolvedPath) => {
    t.is(err, null);
    t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    t.end();
  });
});

test.cb('node-style callback w/o options', (t) => {
  resolvePath('duplicate-1.jpg', {
    basePath: 'fixtures',
  }, (err, resolvedPath) => {
    t.is(err, null);
    t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    t.end();
  });
});

test.cb('node-style callback + non-existing file', (t) => {
  resolvePath('non-existing.gif', (err, resolvedPath) => {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedPath, undefined);
    t.end();
  });
});
