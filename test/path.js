import path from 'path';
import test from 'ava';

import resolvePath from '../lib/path';

test('w/o options', t =>
  resolvePath('test/fixtures/duplicate-1.jpg')
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('test/fixtures/duplicate-1.jpg'));
    }));

test('basePath', t =>
  resolvePath('duplicate-1.jpg', {
    basePath: 'test/fixtures',
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('test/fixtures/duplicate-1.jpg'));
    }));

test('loadPaths', t =>
  resolvePath('picture.png', {
    loadPaths: ['test/fixtures/fonts', 'test/fixtures/images'],
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('test/fixtures/images/picture.png'));
    }));

test('loadPaths string', t =>
  resolvePath('picture.png', {
    loadPaths: 'test/fixtures/images',
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('test/fixtures/images/picture.png'));
    }));

test('loadPaths glob', t =>
  resolvePath('picture.png', {
    loadPaths: 'test/fixtures/*',
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('test/fixtures/images/picture.png'));
    }));

test('basePath + loadPaths', t =>
  resolvePath('picture.png', {
    basePath: 'test/fixtures',
    loadPaths: ['fonts', 'images'],
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('test/fixtures/images/picture.png'));
    }));

test('absolute needle + basePath', (t) => {
  const absoluteTo = path.resolve('test/fixtures/duplicate-1.jpg');
  return resolvePath(absoluteTo, {
    basePath: 'test/fixtures',
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('test/fixtures/duplicate-1.jpg'));
    }, t.fail);
});

test('absolute basePath + loadPaths', t =>
  resolvePath('picture.png', {
    basePath: path.resolve('test/fixtures'),
    loadPaths: [
      path.resolve('test/fixtures/fonts'),
      path.resolve('test/fixtures/images'),
    ],
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('test/fixtures/images/picture.png'));
    }));

test('non-existing file', t =>
  resolvePath('non-existing.gif')
    .then(t.fail, (err) => {
      t.true(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    }));

test('prioritize basePath over the loadPaths', t =>
  resolvePath('duplicate-1.jpg', {
    basePath: 'test/fixtures',
    loadPaths: ['fonts', 'images'],
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('test/fixtures/duplicate-1.jpg'));
    }));

test('prioritize firsts loadPaths over the lasts', t =>
  resolvePath('duplicate-2.txt', {
    basePath: 'test/fixtures',
    loadPaths: ['fonts', 'images'],
  })
    .then((resolvedPath) => {
      t.is(resolvedPath, path.resolve('test/fixtures/fonts/duplicate-2.txt'));
    }));

test.cb('node-style callback w/ options', (t) => {
  resolvePath('test/fixtures/duplicate-1.jpg', (err, resolvedPath) => {
    t.is(err, null);
    t.is(resolvedPath, path.resolve('test/fixtures/duplicate-1.jpg'));
    t.end();
  });
});

test.cb('node-style callback w/o options', (t) => {
  resolvePath('duplicate-1.jpg', {
    basePath: 'test/fixtures',
  }, (err, resolvedPath) => {
    t.is(err, null);
    t.is(resolvedPath, path.resolve('test/fixtures/duplicate-1.jpg'));
    t.end();
  });
});

test.cb('node-style callback + non-existing file', (t) => {
  resolvePath('non-existing.gif', (err, resolvedPath) => {
    t.true(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedPath, undefined);
    t.end();
  });
});
