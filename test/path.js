var path = require('path');
var resolvePath = require('../lib/path');
var test = require('ava');

test('w/o options', function (t) {
  return resolvePath('fixtures/duplicate-1.jpg')
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    }, t.fail);
});

test('basePath', function (t) {
  return resolvePath('duplicate-1.jpg', {
    basePath: 'fixtures'
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    }, t.fail);
});

test('currentPath', function (t) {
  return resolvePath('knitwork.gif', {
    currentPath: 'fixtures/patterns'
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/patterns/knitwork.gif'));
    }, t.fail);
});

test('loadPaths', function (t) {
  return resolvePath('picture.png', {
    loadPaths: ['fixtures/fonts', 'fixtures/images']
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
    }, t.fail);
});

test('basePath + currentPath', function (t) {
  return resolvePath('knitwork.gif', {
    basePath: 'fixtures',
    currentPath: 'patterns'
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/patterns/knitwork.gif'));
    }, t.fail);
});

test('basePath + loadPaths', function (t) {
  return resolvePath('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
    }, t.fail);
});

test('currentPath + loadPaths', function (t) {
  return resolvePath('knitwork.gif', {
    currentPath: 'fixtures/patterns',
    loadPaths: ['fixtures/fonts', 'fixtures/images']
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/patterns/knitwork.gif'));
    }, t.fail);
});

test('basePath + currentPath + loadPaths', function (t) {
  return resolvePath('knitwork.gif', {
    basePath: 'fixtures',
    currentPath: 'patterns',
    loadPaths: ['fonts', 'images']
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/patterns/knitwork.gif'));
    }, t.fail);
});

test('absolute needle + basePath', function (t) {
  var absoluteTo = path.resolve('fixtures/duplicate-1.jpg');
  return resolvePath(absoluteTo, {
    basePath: 'fixtures'
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    }, t.fail);
});

test('absolute basePath + currentPath', function (t) {
  return resolvePath('knitwork.gif', {
    basePath: path.resolve('fixtures'),
    currentPath: path.resolve('fixtures/patterns')
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/patterns/knitwork.gif'));
    }, t.fail);
});

test('absolute basePath + loadPaths', function (t) {
  return resolvePath('picture.png', {
    basePath: path.resolve('fixtures'),
    loadPaths: [
      path.resolve('fixtures/fonts'),
      path.resolve('fixtures/images')
    ]
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/images/picture.png'));
    }, t.fail);
});

test('non-existing file', function (t) {
  return resolvePath('non-existing.gif')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    });
});

test('prioritize currentPath over the basePath', function (t) {
  return resolvePath('duplicate-1.jpg', {
    basePath: 'fixtures',
    currentPath: 'images'
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/images/duplicate-1.jpg'));
    }, t.fail);
});

test('prioritize basePath over the loadPaths', function (t) {
  return resolvePath('duplicate-1.jpg', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    }, t.fail);
});

test('prioritize firsts loadPaths over the lasts', function (t) {
  return resolvePath('duplicate-2.txt', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  })
    .then(function (resolvedPath) {
      t.is(resolvedPath, path.resolve('fixtures/fonts/duplicate-2.txt'));
    }, t.fail);
});

test.cb('node-style callback w/ options', function (t) {
  resolvePath('fixtures/duplicate-1.jpg', function (err, resolvedPath) {
    t.is(err, null);
    t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    t.end();
  });
});

test.cb('node-style callback w/o options', function (t) {
  resolvePath('duplicate-1.jpg', {
    basePath: 'fixtures'
  }, function (err, resolvedPath) {
    t.is(err, null);
    t.is(resolvedPath, path.resolve('fixtures/duplicate-1.jpg'));
    t.end();
  });
});

test.cb('node-style callback + non-existing file', function (t) {
  resolvePath('non-existing.gif', function (err, resolvedPath) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedPath, undefined);
    t.end();
  });
});
