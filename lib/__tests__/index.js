
const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const koaBody = require('koa-body')
const koaBodyClean = require('..')
const koaMulter = require('koa-multer')
const request = require('supertest')
const rimraf = require('rimraf')

const tmpDir = path.join(__dirname, 'tmp')
const tmpContent = Buffer.from('empty')
const tmpName = 'file.xyz'
const tmpCount = () => fs.readdirSync(tmpDir).length

let app

beforeEach(() => {
  app = new Koa()
  app.use(koaBodyClean())

  fs.mkdirSync(tmpDir)
})

afterEach(() => {
  rimraf.sync(tmpDir)
})

describe('standalone', () => {
  let md, ctx, next

  beforeEach(() => {
    md = koaBodyClean()
    ctx = {}
    next = jest.fn()
  })

  it('invalid ctx', async () => {
    let err = 'invalid ctx'

    await expect(md(undefined, next)).rejects.toThrow(err)
    await expect(md(0, next)).rejects.toThrow(err)
    await expect(md(null, next)).rejects.toThrow(err)
  })

  it('invalid next', async () => {
    let err = 'invalid next'

    await expect(md(ctx)).rejects.toThrow(err)
    await expect(md(ctx, {})).rejects.toThrow(err)
    await expect(md(ctx, null)).rejects.toThrow(err)
  })

  it('call next only 1 time', async () => {
    await md(ctx, next)

    expect(next).toHaveBeenCalledTimes(1)
  })

  it('no erros if no files', async () => {
    await request(app.callback()).post('/')
  })
})

describe('with koa-body (formidable)', () => {
  beforeEach(() => {
    app.use(koaBody({
      multipart: true,
      formidable: {
        uploadDir: tmpDir
      }
    }))
  })

  it('any', async () => {
    await request(app.callback())
      .post('/')
      .attach('file', tmpContent, tmpName)
      .attach('file', tmpContent, tmpName)
      .attach('file1', tmpContent, tmpName)
      .attach('file2', tmpContent, tmpName)
      .then(() => {
        expect(tmpCount()).toBe(0)
      })
  })

  it('single', async () => {
    await request(app.callback())
      .post('/')
      .attach('file', tmpContent, tmpName)
      .then(() => {
        expect(tmpCount()).toBe(0)
      })
  })

  it('array', async () => {
    await request(app.callback())
      .post('/')
      .attach('file', tmpContent, tmpName)
      .attach('file', tmpContent, tmpName)
      .then(() => {
        expect(tmpCount()).toBe(0)
      })
  })

  it('not remove skipped', async () => {
    await request(app.callback())
      .post('/')
      .attach('file', tmpContent, tmpName)
      .attach('file', tmpContent, tmpName)
      .then(() => {
        expect(tmpCount()).toBe(0)
      })
  })
})

describe('with koa-multer (multer)', () => {
  let options = {
    dest: tmpDir
  }

  it('any', async () => {
    app.use(koaMulter(options).any())

    await request(app.callback())
      .post('/')
      .attach('file', tmpContent, tmpName)
      .attach('file', tmpContent, tmpName)
      .attach('file1', tmpContent, tmpName)
      .attach('file2', tmpContent, tmpName)
      .then(() => {
        expect(tmpCount()).toBe(0)
      })
  })

  it('single', async () => {
    app.use(koaMulter(options).single('file'))

    await request(app.callback())
      .post('/')
      .attach('file', tmpContent, tmpName)
      .then(() => {
        expect(tmpCount()).toBe(0)
      })
  })

  it('array', async () => {
    app.use(koaMulter(options).array('file'))

    await request(app.callback())
      .post('/')
      .attach('file', tmpContent, tmpName)
      .attach('file', tmpContent, tmpName)
      .then(() => {
        expect(tmpCount()).toBe(0)
      })
  })
})
