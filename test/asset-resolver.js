var AssetResolver = require('..');
var sinon = require('sinon');
var test = require('ava');

test.before(function (t) {
  sinon.stub(AssetResolver, 'measure');
  sinon.stub(AssetResolver, 'resolveDataUrl');
  sinon.stub(AssetResolver, 'resolvePath');
  sinon.stub(AssetResolver, 'resolveUrl');
  t.end();
});

test.after(function (t) {
  AssetResolver.measure.restore();
  AssetResolver.resolveDataUrl.restore();
  AssetResolver.resolvePath.restore();
  AssetResolver.resolveUrl.restore();
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

test('AssetResolver.measure()', function (t) {
  AssetResolver().measure();
  t.ok(AssetResolver.measure.called);
  t.end();
});

test('AssetResolver.resolveDataUrl()', function (t) {
  AssetResolver().resolveDataUrl();
  t.ok(AssetResolver.resolveDataUrl.called);
  t.end();
});

test('AssetResolver.resolvePath()', function (t) {
  AssetResolver().resolvePath();
  t.ok(AssetResolver.resolvePath.called);
  t.end();
});

test('AssetResolver.resolveUrl()', function (t) {
  AssetResolver().resolveUrl();
  t.ok(AssetResolver.resolveUrl.called);
  t.end();
});
