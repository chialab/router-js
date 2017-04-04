# Router
> A simple agnostic Router for Web Apps.

[![Travis](https://img.shields.io/travis/Chialab/router-js.svg?maxAge=2592000)](https://travis-ci.org/Chialab/router-js)
[![Code coverage](https://codecov.io/gh/Chialab/router-js/graph/badge.svg)](https://codecov.io/gh/Chialab/router-js)
[![NPM](https://img.shields.io/npm/v/@chialab/router.svg)](https://npmjs.org/packages/@chialab/router)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/chialab-sl-008.svg)](https://saucelabs.com/u/chialab-sl-008)

## Install

```
$ npm i @chialab/rouer --save
```

## Example

```js
var appRouter = new Router();
appRouter.on('/user/:username', function(id) {
    fetchUserById(id);
});
appRouter.on('/posts/:id', function(id) {
    fetchPostById(id);
});
appRouter.on('/posts', function() {
    listPosts();
});
appRouter.on('*', function() {
    page404();
});
appRouter.start();
```

### Polyfills
* [Promise](https://github.com/stefanpenner/es6-promise)

