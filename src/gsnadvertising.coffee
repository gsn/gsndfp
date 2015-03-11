###!
#  Project: gsnevent triggering
 * ===============================
###

### Usage:
#   For Publisher: 
#         Gsn.Advertising.clickBrickOffer(clickTrackingUrl, 69);
#
#   For Consumer:
#         Gsn.Advertising.on('clickBrickOffer', function(evt)) { alert(evt.OfferCode); });
#
# The following events are currently available: clickProduct, clickPromotion, clickBrand, clickBrickOffer, clickRecipe, and clickLink          
###

# the semi-colon before function invocation is a safety net against concatenated
# scripts and/or other plugins which may not be closed properly.
(($, oldGsn, win, doc, gsnContext) ->
  sessionStorageX = win.sessionStorage

  createFrame = ->
    if typeof tickerFrame == 'undefined'
      # create the IFrame and assign a reference to the
      # object to our global variable tickerFrame.
      tempIFrame = doc.createElement('iframe')
      tempIFrame.setAttribute 'id', 'gsnticker'
      tempIFrame.style.position = 'absolute'
      tempIFrame.style.top = '-100px'
      tempIFrame.style.left = '-100px'
      tempIFrame.style.zIndex = '99'
      tempIFrame.style.border = '0px'
      tempIFrame.style.width = '0px'
      tempIFrame.style.height = '0px'
      tickerFrame = doc.body.appendChild(tempIFrame)
      if doc.frames
        # this is for IE5 Mac, because it will only
        # allow access to the doc object
        # of the IFrame if we access it through
        # the doc.frames array
        tickerFrame = doc.frames['gsnticker']
    return

  ##region The actual plugin constructor

  Plugin = ->
    #/ <summary>Plugin constructor</summary>
    @init()
    return

  buildQueryString = (keyWord, keyValue) ->
    if keyValue != null
      keyValue = new String(keyValue)
      if keyWord != 'ProductDescription'
        # some product descriptions have '&amp;' which should not be replaced with '`'. 
        keyValue = keyValue.replace(/&/, '`')
      keyWord + '=' + keyValue.toString()
    else
      ''

  if typeof sessionStorageX == 'undefined'
    sessionStorageX =
      getItem: ->
      setItem: ->
  tickerFrame = undefined
  parent$ = undefined
  myGsn = oldGsn or {}
  oldGsnAdvertising = myGsn.Advertising
  if typeof oldGsnAdvertising != 'undefined'
    if oldGsnAdvertising.pluginLoaded
      return
  Plugin.prototype =
    init: ->
      #/ <summary>Initialization logic goes here</summary>
      return
    pluginLoaded: true
    data: {}
    onAllEvents: null
    oldGsnAdvertising: oldGsnAdvertising
    trigger: (eventName, eventData) ->
      if eventName.indexOf('gsnevent') < 0
        eventName = 'gsnevent:' + eventName
      # a little timeout to make sure click tracking stick
      win.setTimeout (->
        if parent$
          parent$.event.trigger
            type: eventName
            detail: eventData
        else
          $.event.trigger
            type: eventName
            detail: eventData
        if typeof @onAllEvents == 'function'
          @onAllEvents
            type: eventName
            detail: eventData
        return
      ), 100
      return
    on: (eventName, callback) ->
      if eventName.indexOf('gsnevent') < 0
        eventName = 'gsnevent:' + eventName
      $(doc).on eventName, callback
      return
    off: (eventName, callback) ->
      if eventName.indexOf('gsnevent') < 0
        eventName = 'gsnevent:' + eventName
      $(doc).off eventName, callback
      return
    ajaxFireUrl: (url, sync) ->
      #/ <summary>Hit a URL.  Good for click and impression tracking</summary> 
      if typeof url == 'string'
        if url.length < 10
          return
        # this is to cover the cache buster situation
        url = url.replace('%%CACHEBUSTER%%', (new Date).getTime())
        if sync
          $.ajax
            async: false
            url: url
          adUrlIndex = url.indexOf('adurl=')
          if adUrlIndex > 0
            newUrl = url.substr(adUrlIndex + 6)
            @ajaxFireUrl newUrl, sync
        else
          createFrame()
          tickerFrame.src = url
      return
    clickProduct: (click, categoryId, brandName, productDescription, productCode, quantity, displaySize, regularPrice, currentPrice, savingsAmount, savingsStatement, adCode, creativeId) ->
      #/ <summary>Trigger when a product is clicked.  AKA: clickThru</summary>     
      @ajaxFireUrl click
      @trigger 'clickProduct',
        myPlugin: this
        CategoryId: categoryId
        BrandName: brandName
        Description: productDescription
        ProductCode: productCode
        DisplaySize: displaySize
        RegularPrice: regularPrice
        CurrentPrice: currentPrice
        SavingsAmount: savingsAmount
        SavingsStatement: savingsStatement
        AdCode: adCode
        CreativeId: creativeId
        Quantity: quantity or 1
      return
    clickBrickOffer: (click, offerCode, checkCode) ->
      #/ <summary>Trigger when a brick offer is clicked.  AKA: brickRedirect</summary>     
      @ajaxFireUrl click
      @trigger 'clickBrickOffer',
        myPlugin: this
        OfferCode: offerCode or 0
      return
    clickBrand: (click, brandName) ->
      #/ <summary>Trigger when a brand offer or shopper welcome is clicked.</summary>     
      @ajaxFireUrl click
      @setBrand brandName
      @trigger 'clickBrand',
        myPlugin: this
        BrandName: brandName
      return
    clickPromotion: (click, adCode) ->
      #/ <summary>Trigger when a promotion is clicked.  AKA: promotionRedirect</summary>   
      @ajaxFireUrl click
      @trigger 'clickPromotion',
        myPlugin: this
        AdCode: adCode
      return
    clickRecipe: (click, recipeId) ->
      #/ <summary>Trigger when a recipe is clicked.  AKA: recipeRedirect</summary>  
      @ajaxFireUrl click
      @trigger 'clickRecipe', RecipeId: recipeId
      return
    clickLink: (click, url, target) ->
      #/ <summary>Trigger when a generic link is clicked.  AKA: verifyClickThru</summary> 
      if target == undefined or target == ''
        target = '_top'
      @ajaxFireUrl click
      @trigger 'clickLink',
        myPlugin: this
        Url: url
        Target: target
      return
    setBrand: (brandName) ->
      @data.BrandName = brandName
      sessionStorageX.setItem 'Gsn.Advertisement.data.BrandName', brandName
      return
    getBrand: ->
      @data.BrandName or sessionStorageX.getItem('Gsn.Advertisement.data.BrandName')
  # #endregion
  # create the plugin and map function for backward compatibility 
  myPlugin = new Plugin
  myGsn.Advertising = myPlugin
  myGsn.Advertising.brickRedirect = myPlugin.clickBrickOffer
  myGsn.Advertising.clickBrand = myPlugin.clickBrand
  myGsn.Advertising.clickThru = myPlugin.clickProduct

  myGsn.Advertising.logAdImpression = ->

  # empty function, does nothing      

  myGsn.Advertising.logAdRequest = ->

  # empty function, does nothing    
  myGsn.Advertising.promotionRedirect = myPlugin.clickPromotion
  myGsn.Advertising.verifyClickThru = myPlugin.clickLink
  myGsn.Advertising.recipeRedirect = myPlugin.clickRecipe
  # put GSN back online
  win.Gsn = myGsn
  ##region support for classic GSN
  if typeof gsnContext != 'undefined'
    myGsn.Advertising.on 'clickRecipe', (data) ->
      if data.type != 'gsnevent:clickRecipe'
        return
      win.location.replace '/Recipes/RecipeFull.aspx?recipeid=' + data.detail.RecipeId
      return
    myGsn.Advertising.on 'clickProduct', (data) ->
      if data.type != 'gsnevent:clickProduct'
        return
      product = data.detail
      if product
        queryString = new String('')
        queryString += buildQueryString('DepartmentID', product.CategoryId)
        queryString += '~'
        queryString += buildQueryString('BrandName', product.BrandName)
        queryString += '~'
        queryString += buildQueryString('ProductDescription', product.Description)
        queryString += '~'
        queryString += buildQueryString('ProductCode', product.ProductCode)
        queryString += '~'
        queryString += buildQueryString('DisplaySize', product.DisplaySize)
        queryString += '~'
        queryString += buildQueryString('RegularPrice', product.RegularPrice)
        queryString += '~'
        queryString += buildQueryString('CurrentPrice', product.CurrentPrice)
        queryString += '~'
        queryString += buildQueryString('SavingsAmount', product.SavingsAmount)
        queryString += '~'
        queryString += buildQueryString('SavingsStatement', product.SavingsStatement)
        queryString += '~'
        queryString += buildQueryString('Quantity', product.Quantity)
        queryString += '~'
        queryString += buildQueryString('AdCode', product.AdCode)
        queryString += '~'
        queryString += buildQueryString('CreativeID', product.CreativeId)
        # assume there is this global function
        if typeof AddAdToShoppingList == 'function'
          AddAdToShoppingList queryString
      return
    myGsn.Advertising.on 'clickLink', (data) ->
      if data.type != 'gsnevent:clickLink'
        return
      linkData = data.detail
      if linkData
        if linkData.Target == undefined or linkData.Target == ''
          linkData.Target = '_top'
        if linkData.Target == '_blank'
          # this is a link out to open in new window
          win.open linkData.Url
        else
          # assume this is an internal redirect
          win.location.replace linkData.Url
      return
    myGsn.Advertising.on 'clickPromotion', (data) ->
      if data.type != 'gsnevent:clickPromotion'
        return
      linkData = data.detail
      if linkData
        win.location.replace '/Ads/Promotion.aspx?adcode=' + linkData.AdCode
      return
    myGsn.Advertising.on 'clickBrickOffer', (data) ->
      if data.type != 'gsnevent:clickBrickOffer'
        return
      linkData = data.detail
      if linkData
        url = 'https://clientapi.gsn2.com/api/v1/profile/BrickOffer/' + gsnContext.ConsumerID + '/' + linkData.OfferCode
        # open brick offer using the new api URL
        win.open url, ''
      return
  ##endregion
  # allow event to be pass to anybody listening on the parent
  if win.top
    # this should match the initialization entry below
    myParent$ = win.top.jQuery or win.top.Zepto or win.top.tire
    if myParent$ != $
      parent$ = myParent$
  return
) window.jQuery or window.Zepto or window.tire or window.$, window.Gsn or {}, window, document, window.GSNContext