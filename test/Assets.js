import Assets from '..';
import sinon from 'sinon';
import test from 'ava';

test.before(() => {
  sinon.stub(Assets, 'data');
  sinon.stub(Assets, 'path');
  sinon.stub(Assets, 'size');
  sinon.stub(Assets, 'url');
});

test.after(() => {
  Assets.data.restore();
  Assets.path.restore();
  Assets.size.restore();
  Assets.url.restore();
});

test('constructor', (t) => {
  t.same(typeof Assets, 'function', 'is a function');
  t.ok(Assets() instanceof Assets, 'instantiable without new');
  t.ok(Object.isFrozen(Assets()), 'is frozen');
});

test('.options', (t) => {
  const options = { basePath: 'source' };
  t.same(Assets().options, {}, 'defaults to an empty object');
  t.same(Assets(options).options.basePath, 'source', 'is initiable');
  t.not(Assets(options).options, options, 'breaks the reference');
});

test('.data()', (t) => {
  Assets().data();
  t.ok(Assets.data.called);
});

test('.path()', (t) => {
  Assets().path();
  t.ok(Assets.path.called);
});

test('.size()', (t) => {
  Assets().size();
  t.ok(Assets.size.called);
});

test('.url()', (t) => {
  Assets().url();
  t.ok(Assets.url.called);
});
