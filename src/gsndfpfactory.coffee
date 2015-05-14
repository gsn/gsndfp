trakless2 = require('trakless')
gmodal2 = require('gmodal')
loadScript = require('load-script')
qsel = require('dom')
swcss = require('./sw.css')
circplusTemplate = require('./circplus.html')
$win = window
_tk = $win._tk
$doc = $win.document
gsnSw = null

###* 
# gsndfpfactory for creating different gsndfp products
# gsnsw - shopper welcome
# circPlus - circular plus
# adpods - regular adpods
###
class gsndfpfactory
  ###*
   * dfp network id
   * @type {String}
  ###
  dfpID: ''
  ###*
   * count allow for unique ad id
   * @type {Number}
  ###
  count: 0
  ###*
   * count the number of rendered
   * @type {Number}
  ###
  rendered: 0
  ###*
   * selector to detect ads div
   * @type {String}
  ###
  sel: '.gsnunit'
  ###*
   * options
   * @type {Object}
  ###
  dopts: {}
  ###*
   * determine if googletag is loaded
   * @type {Boolean}
  ###
  isLoaded: false
  ###*
   * all the dom elements result from selector
   * @type {[HTMLElement]}
  ###
  $ads: undefined
  ###*
   * determine if adblocker is enabled
   * @type {Boolean}
  ###
  adBlockerOn: false
  ###*
   * dfp object storage key
   * @type {String}
  ###
  storeAs: 'gsnunit'
  ###*
   * determine the last refresh timestamp
   * @type {Number}
  ###
  lastRefresh: 0
  ###*
   * determine if shopperwelcome has open
   * @type {Boolean}
  ###
  didOpen: false
  ###*
   * determine if shopperwelcome is visible
   * @type {Boolean}
  ###
  isVisible: false
  ###*
   * shopperwelcome determine if ie is old
   * @type {Boolean}
  ###
  ieOld: false
  ###*
   * circPlus html template
   * @type {Object}
  ###
  bodyTemplate: circplusTemplate
  ###*
   * refresh method
   * @param  {Object} options
   * @return {Object}         
  ###
  refresh: (options) ->
    self = @
    self.dfpLoader()
    self.dfpID = gsndfp.getNetworkId(true)
    self.setOptions(options or {})
    _tk.util.ready ->
      self.doIt()
    @
  ###*
   * internal refresh method
   * @return {Object} 
  ###
  doIt: () ->
    self = @
    self.sel = self.dopts.sel or '.gsnunit'
    if (typeof self.adUnitById != 'object')
      self.adUnitById = {}

    if (!($win.opera and $win.opera.version))
      # ok now am I IE (opera is the only other browser that will do this
      self.ieOld = ($doc.all and !$win.atop)

    if (self.ieOld)
      self.dopts.inViewOnly = false

    # handle circplus
    if (self.sel is '.circplus')
      self.storeAs = 'circplus'
      cp = qsel(self.sel)
      slot1 = qsel('.cpslot1')
      if cp.length > 0
        if !slot1[0]
          cp.html(self.dopts.bodyTemplate or self.bodyTemplate)

      # real selector is use above to append bodyTemplate
      self.$ads = [qsel('.cpslot1')[0], qsel('.cpslot2')[0]]

      # only proceed if there are ads
      if self.$ads[0]?
        self.createAds().displayAds()

    # handle sw
    else if (self.sel is '.gsnsw')
      self.dopts.inViewOnly = false
      $win.gmodal.injectStyle('swcss', swcss)

      gsnSw = self
      self.dopts.enableSingleRequest = true
      self.dfpID = gsndfp.getNetworkId()
      if qsel(self.dopts.displayWhenExists or '.gsnunit').length <= 0
        return
    
      self.storeAs = 'gsnsw'
      if self.didOpen or self.getCookie('gsnsw2')?
        setTimeout ->
          self.onCloseCallback cancel: true
        , 200
      else
        currentTime = (new Date()).getTime()
        if (currentTime - self.lastRefresh) < 2000
          return self

        self.lastRefresh = currentTime
        setTimeout ->
          self.getPopup self.sel
        , 200
      return self
    # handle adpods
    else
      self.storeAs = 'gsnunit'
      self.$ads = qsel(self.sel)
      self.createAds().displayAds()

    @
  ###*
   * set options and merge with default options
   * @param {Object} ops options
  ###
  setOptions: (ops) ->
    self = @
    # Set default options
    dopts =
      setTargeting: {}
      setCategoryExclusion: ''
      setLocation: ''
      enableSingleRequest: false
      collapseEmptyDivs: true
      refreshExisting: true
      disablePublisherConsole: false
      disableInitialLoad: false
      inViewOnly: true
      noFetch: false
      sizeMapping: 
        leaderboard: [
          {browser: [ 980, 600], ad_sizes: [[728, 90], [640, 480]]}
          {browser: [   0,   0], ad_sizes: [[320, 50]]}
        ],
        box: [
          {browser: [ 980, 600], ad_sizes: [[300, 250], [250, 250]]}
          {browser: [   0,   0], ad_sizes: [[180, 150]]}
        ],
        skyscraper: [
          {browser: [ 980, 600], ad_sizes: [[160, 600], [120, 600]]}
          {browser: [   0,   0], ad_sizes: [[120, 240]]}
        ]

    # Merge options objects
    for k, v of ops
      dopts[k] = v

    self.dopts = dopts
    @
  ###*
   * shopperwelcome open internal handler
   * @param  {Object} evt event object
   * @return {Object}       
  ###
  onOpenCallback: (evt) ->
    self = gsnSw

    # hide on brand click
    gsndfp.on 'clickBrand', (e) ->
      $win.gmodal.hide()
      return

    self.didOpen = true  
    self.isVisible = true
    self.$ads = qsel(self.sel)
    self.createAds().displayAds()
    setTimeout (->  
      # adblocking detection  
      if self.adBlockerOn
        # remove any class that is tagged to be remove
        qsel('.remove').remove()
        qsel('.sw-msg')[0].style.display = 'block';
        qsel('.sw-header-copy')[0].style.display = 'none';
        qsel('.sw-row')[0].style.display = 'none';

      return self
    ), 150

    return self
  ###*
   * shopperwelcome close internal handler
   * @param  {Object} evt
   * @return {Object}       
  ###
  onCloseCallback: (evt) ->
    self = gsnSw
    self.isVisible = false  
    if !self.getCookie('gsnsw2')
      self.setCookie 'gsnsw2', "#{gsndfp.gsnNetworkId},#{gsndfp.enableCircPlus},#{gsndfp.disableSw}", gsndfp.expireHours
    if typeof self.dopts.onClose == 'function'
      self.dopts.onClose self.didOpen

    return self

  ###*
   * shopperwelcome callback success method
   * @param  {Object} svrRsp server response
   * @return {Object}       
  ###
  swSucccess: (svrRsp) ->
    # remove handler for security reason
    $win.gsnswCallback = null
    rsp = svrRsp
    if (typeof svrRsp is 'string')
      rsp = JSON.parse(svrRsp)
      
    self = gsnSw
    if rsp
      # allow for local value to override remote value
      if (!gsndfp.gsnNetworkId)
        gsndfp.gsnNetworkId = rsp.NetworkId

      gsndfp.enableCircPlus = rsp.EnableCircPlus
      gsndfp.disableSw = rsp.DisableSw
      gsndfp.expireHours = rsp.ExpireHours
      data = rsp.Template
                                           
    self.dfpID = gsndfp.getNetworkId() 
    evt = { data: rsp, cancel: false }                      
    self.dopts.onData evt

    if evt.cancel
      data = null 
    if data
      #add the random cachebuster
      data = data.replace(/%%CACHEBUSTER%%/g, (new Date).getTime()).replace(/%%CHAINID%%/g, gsndfp.gsnid)

      if !self.rect and $doc.documentElement?
          self.rect = 
            w: Math.max($doc.documentElement.clientWidth, $win.innerWidth || 0)
            h: Math.max($doc.documentElement.clientHeight, $win.innerHeight || 0)

      # open the modal to show shopper welcome
      if ($win.gmodal.show({ content: "<div id='sw'>#{data}<div>", closeCls: 'sw-close' }, self.onCloseCallback))
        self.onOpenCallback()
    else
      self.onCloseCallback cancel: true
    
    @

  ###* 
   * shopperwelcome request method
   * @return {Object}
  ###
  getPopup: () ->
    self = @
    url = "#{gsndfp.apiUrl}/ShopperWelcome/Get/#{gsndfp.gsnid}"
    dataType = 'json'
    
    # fallback to jsonp for IE lt 10
    # this allow for better caching on non-IE browser
    # if I am opera I need to not enter this function
    $win.gsnswCallback = (rsp) ->
      self.swSucccess(rsp)
    url += '?callback=gsnswCallback' 
    loadScript(url)
    return self

  ###*
   * get cookie name
   * @param  {string} nameOfCookie cookie name
   * @return {[type]}              [description]
  ###
  getCookie: (nameOfCookie) ->
    if $doc.cookie.length > 0
      begin = $doc.cookie.indexOf(nameOfCookie + '=')
      end = 0
      if begin != -1
        begin += nameOfCookie.length + 1
        end = $doc.cookie.indexOf(';', begin)
        if end == -1
          end = $doc.cookie.length
        cookieData = decodeURI($doc.cookie.substring(begin, end))
        if (cookieData.indexOf(',') > 0)
          cd = cookieData.split(',')
          gsndfp.gsnNetworkId = cd[0]
          gsndfp.enableCircPlus = cd[1]
          gsndfp.disableSw = cd[2]
        return cookieData
    return

  ###*
   * set cookie value
   * @param {string} nameOfCookie 
   * @param {Object} value        
   * @param {Number} expireHours  
  ###
  setCookie: (nameOfCookie, value, expireHours) ->
    self = @
    ed = new Date()
    ed.setTime ed.getTime() + (expireHours or 24) * 3600 * 1000
    v = encodeURI(value);
    edv = ed.toGMTString();
    if (gsndfp.isDebug)
      $doc.cookie = "#{nameOfCookie}=#{v}; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/"
    else
      $doc.cookie = "#{nameOfCookie}=#{v}; expires=#{edv}; path=/"
    return self

  ###*
   * set targeting
   * @param {Object} gtslot      google tag object
   * @param {Object} allData     object data attributes
  ###
  setTargeting: (gtslot, allData) ->
    # Sets custom targeting for just THIS ad unit if it has been specified
    targeting = allData['targeting']
    if targeting
      if typeof targeting == 'string'
        targeting = eval('(' + targeting + ')')
      for k, v of targeting
        if k == 'brand'
          gsndfp.setBrand(v)
        gtslot.setTargeting k, v

    # Sets custom exclusions for just THIS ad unit if it has been specified
    exclusions = allData['exclusions']
    if exclusions
      exclusionsGroup = exclusions.split(',')
      valueTrimmed = undefined
      for v, k in exclusionsGroup
        valueTrimmed = _tk.util.trim(v)
        if valueTrimmed.length > 0
          gtslot.setCategoryExclusion valueTrimmed
    @

  ###*
   * create all the ads object
   * @return {Object} 
  ###
  createAds: ->
    self = @
    opts = self.dopts

    # Loops through on page Ad units and gets ads for them.
    for adUnit, k in self.$ads
      $adUnit = qsel(adUnit)
      allData = _tk.util.allData(adUnit)
      # adUnit id - this will use an existing id or an auto generated one.
      adUnitID = self.getID($adUnit, self.storeAs, adUnit)
      # get dimensions of the adUnit
      dimensions = self.getDimensions(allData)
      # get existing content
      $existingContent = adUnit.innerHTML
      # wipe html clean ready for ad and set the default display class.
      qsel(adUnit).html('')
      $adUnit.addClass 'display-none'
      # Push commands to DFP to create ads
      $win.googletag.cmd.push ->
        gtslot = self.adUnitById[adUnitID]
        if gtslot
          self.setTargeting gtslot, allData
          return

        # remove double slash and any space, trim ending slash
        self.dfpID = self.dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/')
        # append single front slash
        if self.dfpID.indexOf('/') != 0
          self.dfpID = '/' + dfpID

        # Create the ad - out of page or normal
        if allData['outofpage']
          gtslot = $win.googletag.defineOutOfPageSlot(self.dfpID, adUnitID).addService($win.googletag.pubads())
        else
          gtslot = $win.googletag.defineSlot(self.dfpID, dimensions, adUnitID).addService($win.googletag.pubads())

        # mark as companion ad
        companion = allData['companion']
        if companion?
          gtslot.addService $win.googletag.companionAds()

        self.setTargeting gtslot, allData

        mapping = allData['sizes']
        if mapping and opts.sizeMapping[mapping]
          # Convert verbose to DFP format
          map = $win.googletag.sizeMapping()
          for v, k in opts.sizeMapping[mapping]
            map.addSize v.browser, v.ad_sizes

          gtslot.defineSizeMapping map.build()

        # Store googleAdUnit reference
        self.adUnitById[adUnitID] = gtslot

        # The following hijacks an internal google method to check if the div has been
        # collapsed after the ad has been attempted to be loaded.
        gtslot.oldRenderEnded = gtslot.oldRenderEnded or gtslot.renderEnded

        gtslot.renderEnded = ->
          self.rendered++
          display = adUnit.style.display
          $adUnit.removeClass 'display-none'
          $adUnit.addClass 'display-' + display
          gtslot.existing = true

          if gtslot.oldRenderEnded?
            gtslot.oldRenderEnded()

          # Excute afterEachAdLoaded callback if provided
          if typeof opts.afterEachAdLoaded == 'function'
            opts.afterEachAdLoaded.call self, $adUnit, gtslot

          # Excute afterAllAdsLoaded callback if provided
          if typeof opts.afterAllAdsLoaded is 'function' and self.count > 0 and self.rendered is self.count
            opts.afterAllAdsLoaded.call self, self.$ads
          return

        return self

    # Push DFP config options
    $win.googletag.cmd.push ->
      pubAds = $win.googletag.pubads()
      if typeof opts.setTargeting['brand'] is 'undefined'
        brand = gsndfp.getBrand()
        if brand?
          opts.setTargeting['brand'] = brand

      if opts.enableSingleRequest
        pubAds.enableSingleRequest()

      for k, v of opts.setTargeting
        if k == 'brand'
          gsndfp.setBrand(v)
        pubAds.setTargeting k, v

      setLoc = opts.setLocation
      if typeof setLoc is 'object'
        if typeof setLoc.latitude is 'number' and typeof setLoc.longitude is 'number' and typeof setLoc.precision is 'number'
          pubAds.setLocation setLoc.latitude, setLoc.longitude, setLoc.precision
        else if typeof setLoc.latitude is 'number' and typeof setLoc.longitude is 'number'
          pubAds.setLocation setLoc.latitude, setLoc.longitude

      if opts.setCategoryExclusion.length > 0
        exclusionsGroup = opts.setCategoryExclusion.split(',')
        for v, k in exclusionsGroup
          valueTrimmed = _tk.util.trim(v)
          if valueTrimmed.length > 0
            pubAds.setCategoryExclusion valueTrimmed

      if opts.collapseEmptyDivs or opts.collapseEmptyDivs is 'original'
        pubAds.collapseEmptyDivs()

      if opts.disablePublisherConsole
        pubAds.disablePublisherConsole()

      if opts.disableInitialLoad
        pubAds.disableInitialLoad()

      if opts.noFetch
        pubAds.noFetch()

      if self.sel is '.circplus'
        $win.googletag.companionAds().setRefreshUnfilledSlots true

      $win.googletag.enableServices()
      return self

    return self

  ###*
   * determine if ads height is in view
   * @param  {HTMLElement}  el 
   * @return {Boolean}    
  ###
  isHeightInView: (el) ->
    # check for 50% visible
    isVisible = true
    try 
      percentVisible = 0.50
      rect = el.getBoundingClientRect()
      overhang = rect.height * (1 - percentVisible)

      isVisible = (rect.top >= -overhang) && (rect.bottom <= window.innerHeight + overhang)
    catch e
      # do nothing

    return isVisible

  ###*
   * display all ads, either refresh or not
   * @return {Object} 
  ###
  displayAds: ->
    self = @
    toPush = []
    # Display each ad
    for adUnit, k in self.$ads
      $adUnit = qsel(adUnit)
      id = $adUnit.id()
      gtslot = self.adUnitById[id]
      
      if gtslot?
        # determine if element is in view
        if !self.dopts.inViewOnly or self.isHeightInView(adUnit)
          if (gtslot.existing)
            toPush.push gtslot
          else
            $win.googletag.cmd.push ->
              $win.googletag.display id
      else
        $win.googletag.cmd.push ->
          $win.googletag.display id
     

    if toPush.length > 0
      $win.googletag.cmd.push ->
        $win.googletag.pubads().refresh toPush

    return

  ###*
   * get id
   * @param  {Object} $adUnit    
   * @param  {string} adUnitName 
   * @param  {Object} adUnit     
   * @return {string}            the id
  ###
  getID: ($adUnit, adUnitName, adUnit) ->
    self = @
    id = $adUnit.id()
    if (id or '').length <= 0
      id = adUnitName + '$auto$gen$id$' + self.count++
      $adUnit.id id
    return id

  ###*
   * get the dimension
   * @param  {Object} allData element attribute
   * @return {Array}         array of dimensions
  ###
  getDimensions: (allData) ->
    self = @
    dimensions = []
    dimensionsData = allData['dimensions']

    # Check if data-dimensions are specified. If they aren't, use the dimensions of the ad unit div.
    if dimensionsData
      dimensionGroups = dimensionsData.split(',')
      for v, k in dimensionGroups
        dimensionSet = v.split('x')
        dimensions.push [
          parseInt(dimensionSet[0], 10)
          parseInt(dimensionSet[1], 10)
        ]
    else
      mapping = allData['sizes']
      if mapping and self.dopts.sizeMapping[mapping]
        for v, k in self.dopts.sizeMapping[mapping]
          dimensions = dimensions.concat(v.ad_sizes)

    return dimensions

  ###*
   * load the dfp/googletag
   * @return {Object}
  ###
  dfpLoader: ->
    self = @
    if self.isLoaded
      return

    $win.googletag = $win.googletag or {}
    $win.googletag.cmd = $win.googletag.cmd or []

    gads = loadScript '//www.googletagservices.com/tag/js/gpt.js', ->
      # Adblock plus seems to hide blocked scripts... so we check for that
      if gads.style.display is 'none'
        self.dfpBlocked()

      return self

    gads.onerror = ->
      self.dfpBlocked()
      return self

    self.isLoaded = true
    return self
  ###*
   * mark that dfp is blocked
   * @return {Object}
  ###
  dfpBlocked: ->
    self = @
    self.adBlockerOn = true
    # Get the stored dfp commands
    commands = $win.googletag.cmd
    # SetTimeout is a bit dirty but the script does not execute in the correct order without it
    setTimeout (->
      _defineSlot = (name, dimensions, id, oop) ->
        $win.googletag.ads.push id
        $win.googletag.ads[id] =
          renderEnded: ->
          addService: ->
            this
        $win.googletag.ads[id]

      # overwrite the dfp object - replacing the command array with a function and defining missing functions
      $win.googletag =
        cmd: push: (callback) ->
          callback.call self
          @
        ads: []
        pubads: ->
          @
        noFetch: ->
          @
        disableInitialLoad: ->
          @
        disablePublisherConsole: ->
          @
        enableSingleRequest: ->
          @
        setTargeting: ->
          @
        collapseEmptyDivs: ->
          @
        enableServices: ->
          @
        defineSlot: (name, dimensions, id) ->
          _defineSlot name, dimensions, id, false
        defineOutOfPageSlot: (name, id) ->
          _defineSlot name, [], id, true
        display: (id) ->
          $win.googletag.ads[id].renderEnded.call self
          @

      # Execute any stored commands
      for v, k in commands
        $win.googletag.cmd.push v

      return self
    ), 50

    return self

module.exports = gsndfpfactory
