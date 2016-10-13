'use strict'

const log = require('../debug')('middleware-mapper')
const map = {}

module.exports.add = (id, middleware) => {
  map[id] = middleware
  log(`map middleware ${id}`)
}

module.exports.get = id => {
  return map[id]
}

module.exports.remove = id => {
  delete map[id]
  log(`map middleware ${id}`)
}
