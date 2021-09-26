const sinon = require('sinon');
const test = require('ava');

const Assets = require('..');

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
  t.deepEqual(typeof Assets, 'function', 'is a function');
  // eslint-disable-next-line new-cap
  t.true(Assets() instanceof Assets, 'instantiable without new');
  t.true(Object.isFrozen(new Assets()), 'is frozen');
});

test('.options', (t) => {
  const options = { basePath: 'source' };
  t.deepEqual(new Assets().options, {}, 'defaults to an empty object');
  t.deepEqual(new Assets(options).options.basePath, 'source', 'is initiable');
  t.not(new Assets(options).options, options, 'breaks the reference');
});

test('.data()', (t) => {
  const instance = new Assets();
  instance.data();
  t.true(Assets.data.called);
});

test('.path()', (t) => {
  const instance = new Assets();
  instance.path();
  t.true(Assets.path.called);
});

test('.size()', (t) => {
  const instance = new Assets();
  instance.size();
  t.true(Assets.size.called);
});

test('.url()', (t) => {
  const instance = new Assets();
  instance.url();
  t.true(Assets.url.called);
});
