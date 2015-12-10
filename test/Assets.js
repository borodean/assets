var Assets = require('..');
var sinon = require('sinon');
var test = require('ava');

test.before(function () {
  sinon.stub(Assets, 'data');
  sinon.stub(Assets, 'path');
  sinon.stub(Assets, 'size');
  sinon.stub(Assets, 'url');
});

test.after(function () {
  Assets.data.restore();
  Assets.path.restore();
  Assets.size.restore();
  Assets.url.restore();
});

test('Assets', function (t) {
  t.same(typeof Assets, 'function', 'is a function');
  t.ok(Assets() instanceof Assets, 'instantiable without new');
  t.ok(Object.isFrozen(Assets()), 'is frozen');
});

test('Assets.options', function (t) {
  var options = { basePath: 'source' };
  t.same(Assets().options, {}, 'defaults to an empty object');
  t.same(Assets(options).options.basePath, 'source', 'is initiable');
  t.not(Assets(options).options, options, 'breaks the reference');
});

test('Assets.data()', function (t) {
  Assets().data();
  t.ok(Assets.data.called);
});

test('Assets.path()', function (t) {
  Assets().path();
  t.ok(Assets.path.called);
});

test('Assets.size()', function (t) {
  Assets().size();
  t.ok(Assets.size.called);
});

test('Assets.url()', function (t) {
  Assets().url();
  t.ok(Assets.url.called);
});
