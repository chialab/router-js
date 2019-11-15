<p align="center">
   <strong>Router</strong>
</p>

<p align="center">
    A simple agnostic Router for Web Apps.
</p>

<p align="center">
    <a href="https://travis-ci.org/chialab/router-js">
        <img alt="Travis status" src="https://img.shields.io/travis/chialab/router-js.svg?style=flat-square">
    </a>
    <a href="https://codecov.io/gh/chialab/router-js">
        <img alt="Code coverage" src="https://img.shields.io/codecov/c/github/chialab/router-js.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@chialab/router">
        <img alt="NPM" src="https://img.shields.io/npm/v/@chialab/router.svg?style=flat-square">
    </a>
    <a href="https://github.com/chialab/router-js/blob/master/LICENSE">
        <img alt="License" src="https://img.shields.io/npm/l/@dnajs/core.svg?style=flat-square">
    </a>
    <a href="https://saucelabs.com/u/chialab-sl-008">
        <img alt="Saucelabs" src="https://badges.herokuapp.com/sauce/chialab-sl-008?labels=none&style=flat-square">
    </a>
</p>

---

## Install

```
$ npm i @chialab/router --save
```

## Example

```js
import Router from '@chialab/router';

const appRouter = new Router();
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
