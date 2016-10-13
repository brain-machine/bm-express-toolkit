'use strict'

const debug = require('debug')
const env = require('./env')

module.exports = (moduleName) => {
  const logger = debug(`${env.appName}:${moduleName}`)
  return function sendLog (message) {
    return logger(message)
  }
}
