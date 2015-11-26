var path = require('path');
var resolvePath = require('../lib/resolve-path');
var test = require('ava');

test('resolves from the current working directory', function (t) {
  return resolvePath('fixtures/images/picture.png').then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
  }, t.fail);
});

test('rejects when resolving non-exisiting file', function (t) {
  return resolvePath('not-found.gif').then(t.fail, function (err) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: not-found.gif');
  });
});

test('resolves from the base path', function (t) {
  return resolvePath('picture.png', {
    basePath: 'fixtures/images'
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
  }, t.fail);
});

test('resolves from the load path', function (t) {
  return resolvePath('empty-sans.woff', {
    loadPaths: ['fixtures/fonts', 'fixtures/images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/fonts/empty-sans.woff'));
  }, t.fail);
});

test('resolves from the base path and load path combo', function (t) {
  return resolvePath('empty-sans.woff', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/fonts/empty-sans.woff'));
  }, t.fail);
});

test('prioritizes the base path over the load path', function (t) {
  return resolvePath('duplicate-1.jpg', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
  }, t.fail);
});

test('prioritizes the load paths by their order', function (t) {
  return resolvePath('duplicate-2.txt', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/fonts/duplicate-2.txt'));
  }, t.fail);
});

test('accepts node-style callback', function (t) {
  t.plan(5);

  resolvePath('fixtures/images/picture.png', function (err, resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
  });

  resolvePath('not-found.gif', function (err, resolvedPath) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: not-found.gif');
    t.is(resolvedPath, undefined);
  });

  resolvePath('picture.png', {
    basePath: 'fixtures/images'
  }, function (err, resolvedPath) {
    t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
  });
});
