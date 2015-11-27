var AssetResolver = require('..');
var sinon = require('sinon');
var test = require('ava');

test.before(function (t) {
  sinon.stub(AssetResolver, 'data');
  sinon.stub(AssetResolver, 'path');
  sinon.stub(AssetResolver, 'size');
  sinon.stub(AssetResolver, 'url');
  t.end();
});

test.after(function (t) {
  AssetResolver.data.restore();
  AssetResolver.path.restore();
  AssetResolver.size.restore();
  AssetResolver.url.restore();
  t.end();
});

test('AssetResolver', function (t) {
  t.same(typeof AssetResolver, 'function', 'is a function');
  t.ok(AssetResolver() instanceof AssetResolver, 'instantiable without new');
  t.ok(Object.isFrozen(AssetResolver()), 'is frozen');
  t.end();
});

test('AssetResolver.options', function (t) {
  var options = { basePath: 'source' };
  t.same(AssetResolver().options, {}, 'defaults to an empty object');
  t.same(AssetResolver(options).options.basePath, 'source', 'is initiable');
  t.not(AssetResolver(options).options, options, 'breaks the reference');
  t.end();
});

test('AssetResolver.data()', function (t) {
  AssetResolver().data();
  t.ok(AssetResolver.data.called);
  t.end();
});

test('AssetResolver.path()', function (t) {
  AssetResolver().path();
  t.ok(AssetResolver.path.called);
  t.end();
});

test('AssetResolver.size()', function (t) {
  AssetResolver().size();
  t.ok(AssetResolver.size.called);
  t.end();
});

test('AssetResolver.url()', function (t) {
  AssetResolver().url();
  t.ok(AssetResolver.url.called);
  t.end();
});
