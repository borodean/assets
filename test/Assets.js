import sinon from 'sinon';
import test from 'ava';

import Assets from '..';

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
  // eslint-disable-next-line new-cap
  t.ok(Assets() instanceof Assets, 'instantiable without new');
  t.ok(Object.isFrozen(new Assets()), 'is frozen');
});

test('.options', (t) => {
  const options = { basePath: 'source' };
  t.same(new Assets().options, {}, 'defaults to an empty object');
  t.same(new Assets(options).options.basePath, 'source', 'is initiable');
  t.not(new Assets(options).options, options, 'breaks the reference');
});

test('.data()', (t) => {
  const instance = new Assets();
  instance.data();
  t.ok(Assets.data.called);
});

test('.path()', (t) => {
  const instance = new Assets();
  instance.path();
  t.ok(Assets.path.called);
});

test('.size()', (t) => {
  const instance = new Assets();
  instance.size();
  t.ok(Assets.size.called);
});

test('.url()', (t) => {
  const instance = new Assets();
  instance.url();
  t.ok(Assets.url.called);
});
