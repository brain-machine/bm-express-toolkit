'use strict'

const HttpStatus = require('http-status-codes')
const Error = {}

Error.unespected = (err, messageKey = 'unespected-error') => {
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    messageKeys: [messageKey],
    data: err
  }
}

Error.business = (err, messageKey = 'unespected-error') => {
  return {
    status: HttpStatus.BAD_REQUEST,
    messageKeys: [messageKey],
    data: err
  }
}

Error.authorizationRequired = (data, messageKey = 'authorization-required') => {
  return {
    messageKeys: [messageKey],
    data,
    status: HttpStatus.UNAUTHORIZED
  }
}

Error.forbidden = (data, messageKey = 'forbidden') => {
  return {
    data,
    messageKeys: [messageKey],
    status: HttpStatus.FORBIDDEN
  }
}

module.exports.Error = Error
