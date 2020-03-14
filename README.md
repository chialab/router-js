<p align="center">
    <strong>Router</strong> • A simple agnostic Router for Web Apps.
</p>

<p align="center">
    <a href="https://www.chialab.io/p/router-js"><img alt="Documentation link" src="https://img.shields.io/badge/Docs-chialab.io-lightgrey.svg?style=flat-square"></a>
    <a href="https://github.com/chialab/router-js"><img alt="Source link" src="https://img.shields.io/badge/Source-GitHub-lightgrey.svg?style=flat-square"></a>
    <a href="https://www.chialab.it"><img alt="Authors link" src="https://img.shields.io/badge/Authors-Chialab-lightgrey.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/@chialab/router"><img alt="NPM" src="https://img.shields.io/npm/v/@chialab/router.svg?style=flat-square"></a>
    <a href="https://github.com/chialab/router-js/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@chialab/router.svg?style=flat-square"></a>
</p>

---

## Install

```sh
$ npm install @chialab/router
# or
$ yarn add @chialab/router
```

Use via cdn:
```html
<script type="text/javascript" src="https://unpkg.com/@chialab/router-js"></script>
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

---

## Development

[![Build status](https://github.com/chialab/router-js/workflows/Main/badge.svg)](https://github.com/chialab/router-js/actions?query=workflow%3ABuild)
[![codecov](https://codecov.io/gh/chialab/router-js/branch/master/graph/badge.svg)](https://codecov.io/gh/chialab/router-js)


### Requirements

In order to build and test Router, the following requirements are needed:
* [NodeJS](https://nodejs.org/) (>= 10.0.0)
* [Yarn](https://yarnpkg.com)
* [RNA](https://github.com/chialab/rna-cli) (>= 3.0.0)

### Build the project

Install the dependencies and run the `build` script:
```
$ yarn install
$ yarn build
```

This will generate the UMD and ESM bundles in the `dist` folder, as well as the declaration file.

### Test the project

Run the `test` script:

```
$ yarn test
```

---

## License

Router is released under the [MIT](https://github.com/chialab/router-js/blob/master/LICENSE) license.
