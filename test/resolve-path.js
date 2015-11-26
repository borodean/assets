var path = require('path');
var resolvePath = require('../lib/resolve-path');
var test = require('ava');

test('no options', function (t) {
  return resolvePath('fixtures/images/picture.png').then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
  }, t.fail);
});

test('basePath', function (t) {
  return resolvePath('picture.png', {
    basePath: 'fixtures/images'
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
  }, t.fail);
});

test('loadPaths', function (t) {
  return resolvePath('empty-sans.woff', {
    loadPaths: ['fixtures/fonts', 'fixtures/images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/fonts/empty-sans.woff'));
  }, t.fail);
});

test('basePath + loadPaths', function (t) {
  return resolvePath('empty-sans.woff', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/fonts/empty-sans.woff'));
  }, t.fail);
});

test('non-existing file', function (t) {
  return resolvePath('non-existing.gif').then(t.fail, function (err) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
  });
});

test('prioritizes basePath over the loadPaths', function (t) {
  return resolvePath('duplicate-1.jpg', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
  }, t.fail);
});

test('prioritizes firsts loadPaths over the lasts', function (t) {
  return resolvePath('duplicate-2.txt', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/fonts/duplicate-2.txt'));
  }, t.fail);
});

test('node-style callback', function (t) {
  t.plan(5);

  resolvePath('fixtures/images/picture.png', function (err, resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
  });

  resolvePath('non-existing.gif', function (err, resolvedPath) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedPath, undefined);
  });

  resolvePath('picture.png', {
    basePath: 'fixtures/images'
  }, function (err, resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
  });
});
