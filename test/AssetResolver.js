var AssetResolver = require('..');
var sinon = require('sinon');
var test = require('ava');

test.before(function () {
  sinon.stub(AssetResolver, 'data');
  sinon.stub(AssetResolver, 'path');
  sinon.stub(AssetResolver, 'size');
  sinon.stub(AssetResolver, 'url');
});

test.after(function () {
  AssetResolver.data.restore();
  AssetResolver.path.restore();
  AssetResolver.size.restore();
  AssetResolver.url.restore();
});

test('AssetResolver', function (t) {
  t.same(typeof AssetResolver, 'function', 'is a function');
  t.ok(AssetResolver() instanceof AssetResolver, 'instantiable without new');
  t.ok(Object.isFrozen(AssetResolver()), 'is frozen');
});

test('AssetResolver.options', function (t) {
  var options = { basePath: 'source' };
  t.same(AssetResolver().options, {}, 'defaults to an empty object');
  t.same(AssetResolver(options).options.basePath, 'source', 'is initiable');
  t.not(AssetResolver(options).options, options, 'breaks the reference');
});

test('AssetResolver.data()', function (t) {
  AssetResolver().data();
  t.ok(AssetResolver.data.called);
});

test('AssetResolver.path()', function (t) {
  AssetResolver().path();
  t.ok(AssetResolver.path.called);
});

test('AssetResolver.size()', function (t) {
  AssetResolver().size();
  t.ok(AssetResolver.size.called);
});

test('AssetResolver.url()', function (t) {
  AssetResolver().url();
  t.ok(AssetResolver.url.called);
});
