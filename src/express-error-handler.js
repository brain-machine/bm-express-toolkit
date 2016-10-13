'use strict'

const log = require('../debug')('error')
const HttpStatus = require('http-status-codes')

const error = (err, req, res, next) => {
  log(err)
  err.messages = []

  if (err || err.messageKey || err.messageKeys) {
    err.messages = getMessages(getMessageKeys(err), req.getMessage)
  }

  return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).send(err)
}

function getMessages (messageKeys, handler) {
  let _messages = []

  for (var i = 0; i < messageKeys.length; i++) {
    let _messageKey = messageKeys[i]
    let _message = handler ? handler(_messageKey) : _messageKey
    _messages.push(_message || _messageKey)
  }

  return _messages
}

function getMessageKeys (err) {
  let _keys = []

  if (err.messageKey) {
    _keys.push(err.messageKey)
  }

  if (err.messageKeys) {
    _keys.push(...err.messageKeys)
  }

  return _keys
}

module.exports = error
