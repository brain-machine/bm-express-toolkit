'use strict'

const log = require('../debug')('i18n')
const path = require('path')
const fs = require('fs')
const JSON_EXTENSION = '.json'
const ATT_HEADER_ACCEPT_LANGUAGE = 'accept-language'
const LOCALE_SEPARATOR = ','
const LOCALE_ATTRIBUTE_SEPARATOR = ';'
const LOCALE_QUALITY_PREFIX = 'q='
const messagesMap = {}

class Locale {
  constructor (name, quality) {
    this.name = name
    this.quality = quality ? parseFloat(quality.replace(LOCALE_QUALITY_PREFIX, '')) : parseFloat(1)
  }
}

module.exports = (folderPath, filePrefix = 'messages-') => {
  fs.readdirSync(folderPath).forEach(fileName => {
    if (fileName.startsWith(filePrefix)) {
      let _messages = require(path.join(folderPath, fileName))
      let _localeName = fileName.replace(filePrefix, '').replace(JSON_EXTENSION, '')

      log(`Added Locale Messages: ${_localeName}`)
      messagesMap[_localeName] = _messages
    }
  })

  return i18nMiddleware
}

function i18nMiddleware (req, res, next) {
  let _acceptLanguages = req.headers[ATT_HEADER_ACCEPT_LANGUAGE] || ''
  let _acceptLocales = _acceptLanguages.split(LOCALE_SEPARATOR)
  let _locales = []

  for (let i = 0; i < _acceptLocales.length; i++) {
    _locales.push(new Locale(..._acceptLocales[i].split(LOCALE_ATTRIBUTE_SEPARATOR)))
  }

  _locales.sort((locale1, locale2) => {
    return locale1.quality <= locale2.quality
  })

  req.getMessage = getMessageHandlerOfLocales(_locales)
  next()
}

function getMessageHandlerOfLocales (locales) {
  for (let i = 0; i < locales.length; i++) {
    let _locale = locales[i]
    let _messages = messagesMap[_locale.name]

    if (_messages) {
      log(`Selected locale: ${_locale.name}`)
      return createMessageHandler(_messages)
    }
  }

  let _messagesMap = messagesMap['pt'] || messagesMap['en']
  log('Selected default locale: PT or EN')
  return createMessageHandler(_messagesMap)
}

function createMessageHandler (messages) {
  return messagekey => {
    return messages[messagekey]
  }
}
