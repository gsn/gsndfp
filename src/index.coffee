debug = require('debug')
log = debug('gsndfp')
trakless2 = require('trakless')
loadiframe = require('load-iframe')
dom = require('dom')
gsndfpfactory = require('./gsndfpfactory.coffee')

if console?
  if (console.log.bind?)
    log.log = console.log.bind(console); 

win = window
doc = win.document
gsnContext = win.gsnContext
_tk = win._tk
myGsn = win.Gsn or {}
oldGsnAdvertising = myGsn.Advertising
gsnSw2 = new gsndfpfactory()
gsnpods = new gsndfpfactory()
circPlus = new gsndfpfactory()
lastRefreshTime = 0
if oldGsnAdvertising?
  # prevent multiple load
  if oldGsnAdvertising.pluginLoaded
    return

class Plugin
  pluginLoaded: true
  defP:
    # default action parameters *optional* means it will not break but we would want it if possible
     # required - example: registration, coupon, circular
    page: undefined
     # required - specific action/event/behavior name (prev circular, next circular)
    evtname: undefined
     # optional* - string identifying the department
    dept: undefined
    # -- Device Data --
     # optional* - kios, terminal, or device Id
     # if deviceid is not unique, then the combination of storeid and deviceid should be unique
    deviceid: undefined
     # optional* - the storeId
    storeid: undefined
     # these are consumer data
     # optional* - the id you use to uniquely identify your consumer
    consumerid: undefined
     # optional* - determine if consumer is anonymous or registered with your site
    isanon: true
     # optional * - string identify consumer loyalty card id
    loyaltyid: undefined
    # -- Consumer Interest --
    aisle: undefined           # optional - ailse
    category: undefined        # optional - category
    shelf: undefined           # optional - shelf
    brand: undefined           # optional - default brand
    pcode: undefined           # string contain product code or upc
    pdesc: undefined           # string containing product description
    latlng: undefined       # latitude, longitude if possible
     # optional - describe how you want to categorize this event/action.
     # ie. this action is part of (checkout process, circular, coupon, etc...)
    evtcategory: undefined
     # option - event property
     # example: item id
    evtproperty: undefined
     # option - event action
     # example: click
    evtaction: undefined
     # example: page (order summary), evtcategory (checkout), evtname (transaction total), evtvalue (100) for $100
    evtvalue: undefined
    # additional parameters TBD
  translator:
    page: 'dt'
    evtname: 'en'
    dept: 'dpt'
    deviceid: 'dvceid'
    storeid: 'stid'
    consumerid: 'uid'
    isanon: 'anon'
    loyaltyid: 'loyid'
    aisle: 'aisle'
    category: 'cat'
    shelf: 'shf'
    brand: 'bn'
    pcode: 'ic'
    pdesc: 'in'
    latlng: 'lln'
    evtcategory: 'ec'
    evtproperty: 'ep'
    evtlabel: 'el'
    evtaction: 'ea'
    evtvalue: 'ev'
  isDebug: false
  gsnid: 0
  selector: 'body'
  apiUrl: 'https://clientapi.gsn2.com/api/v1'
  gsnNetworkId: undefined
  gsnNetworkStore: undefined
  onAllEvents: undefined
  oldGsnAdvertising: oldGsnAdvertising
  minSecondBetweenRefresh: 5
  enableCircPlus: false
  disableSw: ''
  source: ''
  targetting: {}
  depts: ''
  circPlusBody: undefined
  refreshExisting:
    circPlus: false
    pods: false
  circPlusDept: undefined
  timer: undefined

  ###*
  # get network id
  #
  # @return {Object}
  ###
  getNetworkId: (includeStore)->
    self = @
    result = self.gsnNetworkId + if (self.source or "").length > 0 then ".#{self.source}" else "" 
    if (includeStore)
      result = result.replace(/\/$/gi, '') + (self.gsnNetworkStore or '')
    return result

  ###*
  # emit a gsnevent
  #
  # @param {String} en - event name
  # @param {Object} ed - event data
  # @return {Object}
  ###
  emit: (en, ed) ->
    if en.indexOf('gsnevent') < 0
      en = 'gsnevent:' + en

    # a little timeout to make sure click tracking stick
    win.setTimeout (->
      _tk.emitTop en,
          type: en
          detail: ed

      if typeof @onAllEvents == 'function'
        @onAllEvents
          type: en
          detail: ed
      return
    ), 100
    @

  ###*
  # listen to a gsnevent
  #
  # @param {String} en - event name
  # @param {Function} cb - callback
  # @return {Object}
  ###
  on: (en, cb) ->
    if en.indexOf('gsnevent') < 0
      en = 'gsnevent:' + en

    trakless.on en, cb
    @

  ###*
  # detach from event
  #
  # @param {String} en - event name
  # @param {Function} cb - cb
  # @return {Object}
  ###
  off: (en, cb) ->
    if en.indexOf('gsnevent') < 0
      en = 'gsnevent:' + en

    trakless.off en, cb
    @

  ###*
  # loggingn data
  #
  # @param {String} message - log message
  # @return {Object}
  ###
  log: (message) ->
    self = myGsn.Advertising

    if (self.isDebug or debug.enabled('gsndfp'))
      self.isDebug = true
      if (typeof message is 'object')
        try
          message = JSON.stringify(message)
        catch
      log(message)
    @

  ###*
  # trigger action tracking
  #
  # @param {String} actionParam
  # @return {Object}
  ###
  trackAction: (actionParam) ->
    self = myGsn.Advertising
    tsP = {}
    if typeof actionParam is 'object'
      for k, v of actionParam when v?
        k2 = self.translator[k]
        if (k2)
          tsP[k2] = v

    _tk.track('gsn', tsP)
      
    self.log actionParam

    @

  ###*
  # utility method to normalize category
  #
  # @param {String} keyword
  # @return {String}
  ###
  cleanKeyword: (keyword) ->
    result = keyword.replace(/[^a-zA-Z0-9]+/gi, '_').replace(/^[_]+/gi, '')
    if result.toLowerCase?
      result = result.toLowerCase()

    return result

  ###*
  # add a dept
  #
  # @param {String} dept
  # @return {Object}
  ###
  addDept: (dept) ->
    self =  myGsn.Advertising
    if dept?
      goodDept = self.cleanKeyword dept
      goodDept = ",#{goodDept}"
      if (self.depts.indexOf(goodDept) < 0)
        self.depts = "#{goodDept}#{self.depts}"
    @

  ###*
  # fire a tracking url
  #
  # @param {String} url
  # @return {Object}
  ###
  ajaxFireUrl: (url) ->
    #/ <summary>Hit a URL.  Good for click and impression tracking</summary>
    if typeof url == 'string'
      if url.length < 10
        return

      # this is to cover the cache buster situation
      url = url.replace('%%CACHEBUSTER%%', (new Date).getTime())
      img = new Image(1,1)
      img.src = url
    @

  ###*
  # Trigger when a product is clicked.  AKA: clickThru
  #
  ###
  clickProduct: (click, categoryId, brandName, productDescription, productCode, quantity, displaySize, regularPrice, currentPrice, savingsAmount, savingsStatement, adCode, creativeId) ->
    @ajaxFireUrl click
    @emit 'clickProduct',
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
    @

  ###*
  # Trigger when a brick offer is clicked.  AKA: brickRedirect
  #
  ###
  clickBrickOffer: (click, offerCode, checkCode) ->
    @ajaxFireUrl click
    @emit 'clickBrickOffer',
      myPlugin: this
      OfferCode: offerCode or 0
    @

  ###*
  # Trigger when a brand offer or shopper welcome is clicked.
  #
  ###
  clickBrand: (click, brandName) ->
    @ajaxFireUrl click
    @setBrand brandName
    @emit 'clickBrand',
      myPlugin: this
      BrandName: brandName
    @

  ###*
  # Trigger when a promotion is clicked.  AKA: promotionRedirect
  #
  ###
  clickPromotion: (click, adCode) ->
    @ajaxFireUrl click
    @emit 'clickPromotion',
      myPlugin: this
      AdCode: adCode
    @

  ###*
  # Trigger when a recipe is clicked.  AKA: recipeRedirect
  #
  ###
  clickRecipe: (click, recipeId) ->
    @ajaxFireUrl click
    @emit 'clickRecipe', RecipeId: recipeId
    @

  ###*
  # Trigger when a generic link is clicked.  AKA: verifyClickThru
  #
  ###
  clickLink: (click, url, target) ->
    if target == undefined or target == ''
      target = '_top'
    @ajaxFireUrl click
    @emit 'clickLink',
      myPlugin: this
      Url: url
      Target: target
    @

  ###*
  # set the brand for the session
  #
  ###
  setBrand: (brandName) ->
    trakless.util.session('gsndfp:brand', brandName)
    @

  ###*
  # get the brand currently in session
  #
  ###
  getBrand: ->
    trakless.util.session('gsndfp:brand')

  ###*
  # handle a dom event
  #
  ###
  actionHandler: (evt) ->
    self = myGsn.Advertising
    elem = if evt.target then evt.target else evt.srcElement
    payLoad = {}
    if elem?
      allData = trakless.util.allData(elem)
      for k, v in allData when /^gsn/gi.test(k)
        realk = /^gsn/i.replace(k, '').toLowerCase()
        payLoad[realk] = v
    
    self.refresh payLoad
    return self

  ###*
  # internal method for refreshing adpods
  #
  ###
  refreshAdPodsInternal: (actionParam, forceRefresh) ->
    self = myGsn.Advertising
    payLoad = actionParam or {}
    for k, v of self.defP when v?
      if (!payLoad[k])
        payLoad[k] = v

    if (gsnSw2.isVisible)
      return self

    # track payLoad
    payLoad.siteid = self.gsnid
    self.trackAction payLoad
    canRefresh = ((new Date).getTime() / 1000 - lastRefreshTime) >= self.minSecondBetweenRefresh

    if (forceRefresh || canRefresh)
      lastRefreshTime = (new Date()).getTime() / 1000;

      if (payLoad.dept?)
        self.addDept payLoad.dept

      if (forceRefresh)
        self.refreshExisting.pods = false
        self.refreshExisting.circPlus = false

      targetting =
        dept: self.depts.split(',').slice(1,5)
        brand: self.getBrand()

      if payLoad.page
        targetting.kw = payLoad.page.replace(/[^a-z]/gi, '');

      if (targetting.dept.length > 0)
        self.depts = "," + targetting.dept.join(',')
      else
        targetting.dept = ['produce']
        
      gsnpods.refresh(
        setTargeting: targetting
        sel: '.gsnunit'
        refreshExisting: self.refreshExisting.pods
      )
      self.refreshExisting.pods = true

      if self.enableCircPlus
        targetting.dept = [targetting.dept[0]]
        circPlus.refresh(
          setTargeting: targetting
          bodyTemplate: self.bodyTemplate
          sel: '.circplus'
          refreshExisting: self.refreshExisting.circPlus
        )
        self.refreshExisting.circPlus = true


    @

  ###*
  # adpods refresh
  #
  ###
  refresh: (actionParam, forceRefresh) ->
    self = myGsn.Advertising
    if (!self.hasGsnUnit()) then return self

    if (self.gsnid)

      if (gsnSw2.isVisible)
        return self
        
      gsnSw2.refresh(
        displayWhenExists: '.gsnadunit,.gsnunit'
        sel: '.gsnsw'
        onData: (evt) ->
          if (self.source or '').length > 0
            evt.cancel = self.disableSw.indexOf(self.source) > 0

        onClose: ->
          # make sure selector is always wired-up
          if self.selector?
            dom(self.selector)[0].onclick = (e) ->
              e = e or win.event
              e.target = e.target or e.srcElement or e.parentNode
              if (win.gmodal.hasCls(e.target, 'gsnaction'))
                self.actionHandler e
              
            self.selector  = null
          self.refreshAdPodsInternal(actionParam, forceRefresh)
      )

    @

  ###*
  # determine if there are adpods on the page
  #
  ###
  hasGsnUnit: () ->
    return dom('.gsnadunit,.gsnunit,.circplus').length > 0

  ###*
  # set global defaults
  #
  ###
  setDefault: (defParam) ->
    self = myGsn.Advertising
    if (typeof defParam == 'object')
      for k, v of defParam when v?
        self.defP[k] = v
    @

  ###*
  # method for support refreshing with timer
  #
  ###
  refreshWithTimer: (actionParam) ->
    self = myGsn.Advertising
    if (!actionParam?)
      actionParam = { evtname: 'refresh-timer' }

    self.refresh(actionParam, true)
    timer = (self.timer || 0) * 1000

    if (timer > 0)
      setTimeout self.refreshWithTimer, timer

    @

  ###*
  # the onload method, document ready friendly
  #
  ###
  load: (gsnid, isDebug) ->
    self = myGsn.Advertising
    if (gsnid)
      self.gsnid = gsnid
      if (isDebug)
        debug.enable('gsndfp')

    return self.refreshWithTimer({ evtname: 'loading' })

# create the plugin and map function for backward compatibility with Virtual Store
myPlugin = new Plugin
myGsn.Advertising = myPlugin
myGsn.Advertising.brickRedirect = myPlugin.clickBrickOffer
myGsn.Advertising.clickBrand = myPlugin.clickBrand
myGsn.Advertising.clickThru = myPlugin.clickProduct
myGsn.Advertising.refreshAdPods = myPlugin.refresh

myGsn.Advertising.logAdImpression = ->
# empty function, does nothing

myGsn.Advertising.logAdRequest = ->
# empty function, does nothing

myGsn.Advertising.promotionRedirect = myPlugin.clickPromotion
myGsn.Advertising.verifyClickThru = myPlugin.clickLink
myGsn.Advertising.recipeRedirect = myPlugin.clickRecipe

# put GSN back online
win.Gsn = myGsn
win.gsndfp = myGsn.Advertising

if (gsnContext?)
  buildqs = (k, v) ->
    if v?
      v = new String(v)
      if k != 'ProductDescription'
        # some product descriptions have '&amp;' which should not be replaced with '`'.
        v = v.replace(/&/, '`')
      k + '=' + v.toString()
    else

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
      qs = new String('')
      qs += buildqs('DepartmentID', product.CategoryId)
      qs += '~' + buildqs('BrandName', product.BrandName)
      qs += '~' + buildqs('ProductDescription', product.Description)
      qs += '~' + buildqs('ProductCode', product.ProductCode)
      qs += '~' + buildqs('DisplaySize', product.DisplaySize)
      qs += '~' + buildqs('RegularPrice', product.RegularPrice)
      qs += '~' + buildqs('CurrentPrice', product.CurrentPrice)
      qs += '~' + buildqs('SavingsAmount', product.SavingsAmount)
      qs += '~' + buildqs('SavingsStatement', product.SavingsStatement)
      qs += '~' + buildqs('Quantity', product.Quantity)
      qs += '~' + buildqs('AdCode', product.AdCode)
      qs += '~' +buildqs('CreativeID', product.CreativeId)
      # assume there is this global function
      if typeof AddAdToShoppingList == 'function'
        AddAdToShoppingList qs
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
      url = myGsn.Advertising.apiUrl + '/profile/BrickOffer/' + gsnContext.ConsumerID + '/' + linkData.OfferCode
      # open brick offer using the new api URL
      win.open url, ''
    return
    
#auto init with attributes
# at this point, we expect Gsn.Advertising to be available from above

aPlugin = myGsn.Advertising
if !aPlugin then return

attrs =
  debug: (value) ->
    return unless typeof value is "string"
    aPlugin.isDebug = value isnt "false"
    if (value) 
      debug.enable('gsndfp')
  api: (value) ->
    return unless typeof value is "string"
    aPlugin.apiUrl = value
  source: (value) ->
    return unless typeof value is "string"
    aPlugin.source = value
  gsnid: (value) ->
    return unless value
    aPlugin.gsnid = value
    trakless.setSiteId(value)
  timer: (value) ->
    return unless value
    aPlugin.timer = value
  selector: (value) ->
    return unless typeof value is "string"
    aPlugin.selector = value

for script in doc.getElementsByTagName("script")
  if /gsndfp/i.test(script.src)
    for prefix in ['','data-']
      for k,fn of attrs
        fn script.getAttribute prefix+k


trakless.setPixel('//pi.gsngrocers.com/pi.gif')
trakless.store.init({url: '//cdn.gsngrocers.com/script/xstore.html', dntIgnore: true})

if aPlugin.hasGsnUnit() 
 aPlugin.load() 
else 
  trakless.util.ready( -> 
    aPlugin.load()
  )

module.exports = myGsn