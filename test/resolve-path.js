var mock = require('mock-fs');
var path = require('path');
var resolvePath = require('../lib/resolve-path');
var test = require('ava');

test.before(function (t) {
  mock({
    'assets': {
      'duplicate-1.jpg': new Buffer(0),
      'fonts': {
        'duplicate-2.txt': new Buffer(0),
        'pt-sans.woff': new Buffer(0)
      },
      'images': {
        'duplicate-1.jpg': new Buffer(0),
        'duplicate-2.txt': new Buffer(0),
        'picture.png': new Buffer(0)
      }
    }
  });
  t.end();
});

test.after(function (t) {
  mock.restore();
  t.end();
});

test('resolves from the current working directory', function (t) {
  return resolvePath('assets/images/picture.png').then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('assets/images/picture.png'));
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
    basePath: 'assets/images'
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('assets/images/picture.png'));
  }, t.fail);
});

test('resolves from the load path 1', function (t) {
  return resolvePath('pt-sans.woff', {
    loadPaths: ['assets/fonts', 'assets/images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('assets/fonts/pt-sans.woff'));
  }, t.fail);
});

test('resolves from the load path 2', function (t) {
  return resolvePath('picture.png', {
    loadPaths: ['assets/fonts', 'assets/images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('assets/images/picture.png'));
  }, t.fail);
});

test('resolves from both base path and load path', function (t) {
  return resolvePath('pt-sans.woff', {
    basePath: 'assets',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('assets/fonts/pt-sans.woff'));
  }, t.fail);
});

test('prioritizes the base path over the load path', function (t) {
  return resolvePath('duplicate-1.jpg', {
    basePath: 'assets',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('assets/duplicate-1.jpg'));
  }, t.fail);
});

test('prioritizes the load paths by their order', function (t) {
  return resolvePath('duplicate-2.txt', {
    basePath: 'assets',
    loadPaths: ['fonts', 'images']
  }).then(function (resolvedPath) {
    t.is(resolvedPath, path.resolve('assets/fonts/duplicate-2.txt'));
  }, t.fail);
});

test('accepts node-style callback', function (t) {
  t.plan(5);

  resolvePath('assets/images/picture.png', function (err, resolvedPath) {
    t.is(resolvedPath, path.resolve('assets/images/picture.png'));
  });

  resolvePath('not-found.gif', function (err, resolvedPath) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: not-found.gif');
    t.is(resolvedPath, undefined);
  });

  resolvePath('picture.png', {
    basePath: 'assets/images'
  }, function (err, resolvedPath) {
    t.is(resolvedPath, path.resolve('assets/images/picture.png'));
  });
});
