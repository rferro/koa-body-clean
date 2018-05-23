
const assert = require('assert')
const { unlink } = require('fs')

const debug = require('debug')('koa:body-cleaner')

module.exports = function koaBodyClean () {
  return async function (ctx, next) {
    assert(ctx && typeof ctx === 'object', 'invalid ctx')
    assert(typeof next === 'function' || next instanceof Promise, 'invalid next')

    try {
      await next()
    } finally {
      let list = []
      let targets = [ctx.req, ctx.request]

      if (ctx.request) {
        targets.push(ctx.request.body)
      }

      for (let target of targets) {
        if (typeof target !== 'object') {
          continue
        }

        let { file, files } = target

        if (file && file.path) {
          list.push(file)
        }

        if (files) {
          if (Array.isArray(files)) {
            list.push(...files)
          } else if (typeof files === 'object') {
            for (let key in files) {
              if (!files[key]) {
                continue
              } else if (Array.isArray(files[key])) {
                list.push(...files[key])
              } else if (typeof files[key] === 'object') {
                list.push(files[key])
              }
            }
          }
        }
      }

      for (let file of list) {
        if (!file || !file.path) {
          continue
        }

        let name = file.name || file.originalname || file.path.split('/').pop()

        if (file.skip || file.removed) {
          debug(`${name} SKIPPED`)
        } else {
          process.nextTick(() => {
            unlink(file.path, (err) => {
              if (err) {
                debug(`${name} ERROR: ${err.code || err.message || err}`)
              } else {
                debug(`${name} REMOVED`)
              }
            })
          })
        }
      }
    }
  }
}
