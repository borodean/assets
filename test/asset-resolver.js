var AssetResolver = require('../lib/asset-resolver');
var test = require('ava');

test('AssetResolver', function (t) {
  t.same(typeof AssetResolver, 'function');
  t.ok(AssetResolver() instanceof AssetResolver);
  t.end();
});
