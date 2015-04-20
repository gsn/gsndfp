((document, navigator, screen, location) ->
  'use strict'
  defaults = require('defaults')
  flashdetect = require('flashdetect')

  $startTime = new Date().getTime()
  $endTime = new Date().getTime()
  $timeoutId = null
  $onLoadHandlers = []

  # https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
  # use google analytic for basis of all url parameters so we do not start from scratch
  # it is also useful later for any kind of google analytic data aggregation
  $defaults = 
    sr: "#{screen.width}x#{screen.height}"
    vp: "#{screen.availWidth}x#{screen.availHeight}"
    sd: screen.colorDepth
    je: if navigator.javaEnabled then navigator.javaEnabled() else false
    ul: if navigator.languages then navigator.languages[0] else (navigator.language or navigator.userLanguage or navigator.browserLanguage) 

  ###*
  # webanalyser
  ###
  class webanalyser
    getResult: ->
      if (!defaults.dl?)
        rst = 
          dr: document.referrer
          dl: location.href
          dh: location.hostname
          # don't need pathname, just use href
          # dp: location.pathname
          dt: document.title
          z: new Date().getTime()
          
        if flashdetect.installed
          rst.fl = "#{flashdetect.major} #{flashdetect.minor} #{flashdetect.revisionStr}"

        $defaults = defaults(rst, $defaults)
      return $defaults

  result = new webanalyser()

  module.exports = result

) document, navigator, screen, location