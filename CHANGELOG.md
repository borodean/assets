# Change log

## 2.1.1

Updates package dependencies.

## 2.1.0

Allows globs to be passed to `loadPaths`:
```js
var options = { loadPaths: ['assets/*'] };
```

Also, `loadPaths` now also accepts a single string instead of an array:
```js
var options = { loadPaths: 'images' };
```

## 2.0.0

Removes `currentPath` support.

## 1.0.1

Allows numbers to be returned from a cachebuster.

## 1.0.0

Initial release.
