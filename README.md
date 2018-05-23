
# koa-body-clean

[![node][node]][node-url]
[![npm][npm]][npm-url]
[![tests][tests]][tests-url]
[![codecov][codecov]][codecov-url]
[![deps][deps]][deps-url]
[![ddeps][ddeps]][ddeps-url]
[![standard][standard]][standard-url]

> [Koa](https://github.com/koajs/koa) middleware for auto cleanup files created to disk by:

- [koa-body](https://github.com/dlau/koa-body)
- [koa-better-body](https://github.com/tunnckoCore/koa-better-body)
- [koa-multer](https://github.com/koa-modules/multer)
- or any multipart middleware that populate `ctx.request.files`, `ctx.request.body.files` or `ctx.req.files`

The middleware will automatically remove any file in temporary location upon response end, throws or close.

Please report any issues!

## Installation

Requires:

- node >= `7.6.x`
- koa >= `2`

```
$ npm install koa-body-clean
```

## Usage

```js
const bodyClean = require('koa-body-clean')
```

## Example

```js
const body = require('koa-body') // or koa-better-body, koa-multer, ...
const bodyClean = require('koa-body-clean')
const Koa = require('koa')

const app = new Koa()

app.use(body(bodyOptions))
app.use(bodyClean())
```

## Skipping files

To skip a file from removal, set `skip` attribute to `true` in file object.

## License

MIT

[npm]: https://img.shields.io/npm/v/koa-body-clean.svg?style=flat
[npm-url]: https://npmjs.com/package/koa-body-clean

[node]: https://img.shields.io/node/v/koa-body-clean.svg?style=flat
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/rferro/koa-body-clean.svg?style=flat
[deps-url]: https://david-dm.org/rferro/koa-body-clean

[ddeps]: https://img.shields.io/david/dev/rferro/koa-body-clean.svg?style=flat
[ddeps-url]: https://david-dm.org/rferro/koa-body-clean?type=dev

[tests]: https://img.shields.io/travis/rferro/koa-body-clean.svg?style=flat
[tests-url]: https://travis-ci.org/rferro/koa-body-clean

[codecov]: https://coveralls.io/repos/github/rferro/koa-body-clean/badge.svg?branch=master
[codecov-url]: https://coveralls.io/github/rferro/koa-body-clean?branch=master

[standard]: https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat
[standard-url]: https://standardjs.com
