# Router
> A simple agnostic Router for Web Apps.

## Install

[![NPM](https://img.shields.io/npm/v/chialab-router.svg)](https://www.npmjs.com/package/chialab-router)
```
$ npm i chialab-router --save
```
[![Bower](https://img.shields.io/bower/v/chialab-router.svg)](https://github.com/chialab/router-js)
```
$ bower i chialab-router --save
```

## Example

```js
var appRouter = new Router();
appRouter.on('/user/*', function(id) {
    fetchUserById(id);
});
appRouter.on('/posts/*', function(id) {
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

## Dev

[![Chialab es6-workflow](https://img.shields.io/badge/project-es6--workflow-lightgrey.svg)](https://github.com/Chialab/es6-workflow)
[![Travis](https://img.shields.io/travis/Chialab/router-js.svg?maxAge=2592000)](https://travis-ci.org/Chialab/router-js)
[![Code coverage](https://codecov.io/gh/Chialab/router-js/branch/master/graph/badge.svg)](https://codecov.io/gh/Chialab/router-js)
