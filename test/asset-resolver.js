var AssetResolver = require('../lib/asset-resolver');
var test = require('ava');

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
