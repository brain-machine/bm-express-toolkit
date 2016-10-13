'use strict'

const HttpStatus = require('http-status-codes')
const actionController = {}

actionController.withStaticParams = (action, params = []) => {
  return (req, res, next) => {
    action(...params)
      .then(data => {
        if (data || data.messageKey || data.messageKeys) {
          data.messages = getMessages(getMessageKeys(data), req.getMessage)
        }
        return res.status(data.status || HttpStatus.OK).json(data)
      })
      .catch(err => {
        return next(err)
      })
  }
}

actionController.withDynamicParams = (action, params = []) => {
  return (req, res, next) => {
    let _resolvedParams = params.map(prop => {
      let _props = prop.split('.')
      let _propValue = req[_props.shift()]

      for (var i = 0; i < _props.length; i++) {
        _propValue = _propValue[_props[i]]
      }

      return _propValue
    })

    action(..._resolvedParams)
      .then(data => {
        if (data || data.messageKey || data.messageKeys) {
          data.messages = getMessages(getMessageKeys(data), req.getMessage)
        }
        return res.status(data.status || HttpStatus.OK).json(data)
      })
      .catch(err => {
        return next(err)
      })
  }
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

function getMessageKeys (data) {
  let _keys = []

  if (data.messageKey) {
    _keys.push(data.messageKey)
  }

  if (data.messageKeys) {
    _keys.push(...data.messageKeys)
  }

  return _keys
}

module.exports = actionController
