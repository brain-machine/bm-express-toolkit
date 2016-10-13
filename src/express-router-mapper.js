'use strict'

const log = require('../debug')('express-router-mapper')
const express = require('express')
const path = require('path')
const fs = require('fs')
const middlewareMap = require('./express-middleware-mapper')
const router = express.Router()

module.exports.map = (folderPath, fileSuffix = 'route.js') => {
  fs.readdirSync(folderPath).forEach(fileName => {
    if (fileName.endsWith(fileSuffix)) {
      let _routes = require(path.join(folderPath, fileName))

      _routes.forEach(route => {
        let _middleware = resolveMiddleware(route.filters)
        router[route.method](route.path, ..._middleware, route.action)

        log(`${route.method} ${route.path} [${route.filters}]`)
      })
    }
  })

  return router
}

function resolveMiddleware (middlewares = []) {
  let _resolvedMiddlewares = []

  if (!middlewares) {
    middlewares = []
  }

  middlewares.forEach(middleware => {
    if (typeof middleware === 'string') {
      let _action = middlewareMap.get(middleware)
      if (_action) {
        _resolvedMiddlewares.push(_action)
      } else {
        throw `Not found middleware ${middleware}`
      }
    } else if (typeof middleware === 'function') {
      _resolvedMiddlewares.push(middleware)
    }
  })

  return _resolvedMiddlewares
}
