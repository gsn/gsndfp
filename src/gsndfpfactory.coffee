###!
#  Project: gsndfp
 * ===============================
###

((win) ->
  'use strict'
  trakless2 = require('trakless')
  trakless = win.trakless
  gmodal = require('gmodal')
  swcss = require('./sw.css')
  circplusTemplate = require('./circplus.html')
  loadScript = require('load-script')
  $win = win
  qsel = $win.trakless.util.$
  $doc = $win.document
  gsnSw = null

  ###* 
  # gsndfpfactory
  #
  ###
  class gsndfpfactory
    dfpID: ''
    count: 0
    rendered: 0
    dfpSelector: '.gsnunit'
    dfpOptions: {}
    dfpIsLoaded: false
    $adCollection: undefined
    adBlockerOn: false
    storeAs: 'gsnunit'
    lastRefresh: 0
    didOpen: false
    isVisible: false

    # for circplus
    bodyTemplate: circplusTemplate
    refresh: (options) ->
      self = @
      self.dfpLoader()
      options = options or {}
      self.dfpID = Gsn.Advertising.getNetworkId(true)
      self.setOptions(options)
      self.dfpSelector = options.dfpSelector or '.gsnunit'
      options = self.dfpOptions
      selector = self.dfpSelector

      # handle circplus
      if (selector == '.circplus')
        cp = qsel(selector)
        if cp.length > 0
          trakless.util.html(cp[0], options.bodyTemplate or self.bodyTemplate)
     
        # real selector is use above to append bodyTemplate
        self.$adCollection = [qsel('.cpslot1')[0], qsel('.cpslot2')[0]]
        self.storeAs = 'circplus'
        self.createAds()
        self.displayAds()
      # handle sw
      else if (selector == '.gsnsw')
        self.dfpID = Gsn.Advertising.getNetworkId()
        if qsel(options.displayWhenExists or '.gsnunit').length <= 0
          return

        self.storeAs = 'gsnsw'
        if self.didOpen or self.getCookie('gsnsw2')?
          self.onCloseCallback cancel: true
        else
          self.getPopup selector
          Gsn.Advertising.on 'clickBrand', (e) ->
            $win.gmodal.hide()
            return self

        gsnSw = self
        return self
      # handle adpods
      else
        self.$adCollection = qsel(selector)
        self.createAds()
        self.displayAds()

      @

    setOptions: (options) ->
      self = @
      # Set default options
      dfpOptions =
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

      # Merge options objects
      for k, v of options
        dfpOptions[k] = v

      self.dfpOptions = dfpOptions
      
      @

    onOpenCallback: (event) ->
      self = gsnSw
      self.didOpen = true   
      self.isVisible = true

      # remove any class that is tagged to be remove
      qsel('.remove').remove()
      self.$adCollection = qsel(self.dfpSelector)
      self.createAds()
      self.displayAds()    
      setTimeout (->
        # adblocking detection  
        if self.adBlockerOn
          qsel('.sw-msg')[0].style.display = 'block';
          qsel('.sw-header-copy')[0].style.display = 'none';
          qsel('.sw-row')[0].style.display = 'none';
        return
      ), 150
      return

    onCloseCallback: (event) ->
      self = gsnSw
      self.isVisible = false
      $win.scrollTo 0, 0            
      if !self.getCookie('gsnsw2')
        self.setCookie 'gsnsw2', "#{Gsn.Advertising.gsnNetworkId},#{Gsn.Advertising.enableCircPlus},#{Gsn.Advertising.disableSw}", 1
      if typeof self.dfpOptions.onClose == 'function'
        self.dfpOptions.onClose self.didOpen
      return

    swSucccess: (myrsp) ->
      rsp = myrsp
      if (typeof myrsp is 'string')
        rsp = JSON.parse(myrsp)
        
      self = gsnSw
      if rsp
        # allow for local value to override remote value
        if (!Gsn.Advertising.gsnNetworkId)
          Gsn.Advertising.gsnNetworkId = rsp.NetworkId

        Gsn.Advertising.enableCircPlus = rsp.EnableCircPlus
        Gsn.Advertising.disableSw = rsp.DisableSw
        data = rsp.Template
                                             
      self.dfpID = Gsn.Advertising.getNetworkId() 
      evt = { data: rsp, cancel: false }                      
      self.dfpOptions.onData evt

      if evt.cancel
        data = null 
      if data
        #add the random cachebuster
        data = data.replace(/%%CACHEBUSTER%%/g, (new Date).getTime()).replace(/%%CHAINID%%/g, Gsn.Advertising.gsnid)
        $win.gmodal.injectStyle('swcss', swcss)
        $win.gmodal.on('show', self.onOpenCallback)
        $win.gmodal.on('hide', self.onCloseCallback)
        $win.gmodal.on('click', (evt) ->
          if (evt.target.className.indexOf('sw-close') >= 0)
            $win.gmodal.hide()
        )

        # open the modal to show shopper welcome
        $win.gmodal.show({content: "<div id='sw'>#{data}<div>", closeCls: 'sw-close'})
      else
        self.onCloseCallback cancel: true
      
      @

    getPopup: (selector) ->
      self = @
      url = "#{Gsn.Advertising.apiUrl}/ShopperWelcome/Get/#{Gsn.Advertising.gsnid}"
      dataType = 'json'
      
      # fallback to jsonp for IE lt 10
      # this allow for better caching on non-IE browser
      # if I am opera I need to not enter this function
      if (!($win.opera && $win.opera.version))
        # ok now am I IE (opera is the only other browser that will do this
        if ($doc.all && !$win.atop)
          $win.gsnswCallback = (rsp) ->
            self.swSucccess(rsp)
          url += '?callback=gsnswCallback' 
          dataType = 'jsonp'  
  
      if (dataType is 'jsonp')
        loadScript(url)
      else
        qsel.request('GET', url).then(self.swSucccess)
      @

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
            cookieDatas = cookieData.split(',')
            Gsn.Advertising.gsnNetworkId = cookieDatas[0]
            Gsn.Advertising.enableCircPlus = cookieData[1]
            Gsn.Advertising.disableSw = cookieData[2]
          return cookieData
      null

    setCookie: (nameOfCookie, value, expiredays) ->
      ExpireDate = new Date
      ExpireDate.setTime ExpireDate.getTime() + expiredays * 24 * 3600 * 1000
      $doc.cookie = nameOfCookie + '=' + encodeURI(value) + (if expiredays == null then '' else '; expires=' + ExpireDate.toGMTString()) + '; path=/'
      return

    clearCookie: (nameOfCookie) ->
      self = @
      if nameOfCookie == self.getCookie(nameOfCookie)
        $doc.cookie = nameOfCookie + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      return

    createAds: ->
      self = @
      self.dfpID = Gsn.Advertising.getNetworkId() 
      # Loops through on page Ad units and gets ads for them.
      for adUnit, k in self.$adCollection
        $adUnit = qsel(adUnit)
        allData = trakless.util.allData(adUnit)
        self.count++
        # adUnit id - this will use an existing id or an auto generated one.
        adUnitID = self.getID($adUnit, self.storeAs, self.count, adUnit)
        # get dimensions of the adUnit
        dimensions = self.getDimensions($adUnit, allData)
        # get existing content
        $existingContent = adUnit.innerHTML
        # wipe html clean ready for ad and set the default display class.
        trakless.util.html(adUnit, '')
        $adUnit.set('$', '+display-none')
        # Push commands to DFP to create ads
        $win.googletag.cmd.push ->
          googleAdUnit = undefined
          $adUnitData = adUnit[self.storeAs]
          if $adUnitData
            return
          # remove double slash and any space, trim ending slash
          self.dfpID = self.dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/')
          # append single front slash
          if self.dfpID.indexOf('/') != 0
            self.dfpID = '/' + dfpID
          # Create the ad - out of page or normal
          if allData['outofpage']
            googleAdUnit = $win.googletag.defineOutOfPageSlot(self.dfpID, adUnitID).addService($win.googletag.pubads())
          else
            googleAdUnit = $win.googletag.defineSlot(self.dfpID, dimensions, adUnitID).addService($win.googletag.pubads())

          # mark as companion ad
          companion = allData['companion']
          if companion?
            googleAdUnit.addService $win.googletag.companionAds()

          # Sets custom targeting for just THIS ad unit if it has been specified
          targeting = allData['targeting']
          if targeting
            if typeof targeting == 'string'
              targeting = eval('(' + targeting + ')')
            for k, v of targeting
              if k == 'brand'
                Gsn.Advertising.setBrand(v)
              googleAdUnit.setTargeting k, v
              return
          # Sets custom exclusions for just THIS ad unit if it has been specified
          exclusions = allData['exclusions']
          if exclusions
            exclusionsGroup = exclusions.split(',')
            valueTrimmed = undefined
            for v, k in exclusionsGroup
              valueTrimmed = trakless.util.trim(v)
              if valueTrimmed.length > 0
                googleAdUnit.setCategoryExclusion valueTrimmed
              return
          # The following hijacks an internal google method to check if the div has been
          # collapsed after the ad has been attempted to be loaded.
          googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded or googleAdUnit.renderEnded

          googleAdUnit.renderEnded = ->
            rendered++
            display = adUnit.style.display
            $adUnit.set('$', '-display-none').set('$', '+display-' + display)

            if googleAdUnit.oldRenderEnded?
              googleAdUnit.oldRenderEnded()

            # Excute afterEachAdLoaded callback if provided
            if typeof dfpOptions.afterEachAdLoaded == 'function'
              dfpOptions.afterEachAdLoaded.call this, $adUnit
            # Excute afterAllAdsLoaded callback if provided
            if typeof dfpOptions.afterAllAdsLoaded == 'function' and rendered == self.count
              dfpOptions.afterAllAdsLoaded.call this, $adCollection
            return

          # Store googleAdUnit reference
          adUnit[self.storeAs] = googleAdUnit
          return
      # Push DFP config options
      $win.googletag.cmd.push ->
        if typeof self.dfpOptions.setTargeting['brand'] == 'undefined'
          brand = Gsn.Advertising.getBrand()
          if brand?
            self.dfpOptions.setTargeting['brand'] = brand

        if self.dfpOptions.enableSingleRequest
          $win.googletag.pubads().enableSingleRequest()

        for k, v of self.dfpOptions.setTargeting
          if k == 'brand'
            Gsn.Advertising.setBrand(v)
          $win.googletag.pubads().setTargeting k, v

        if typeof self.dfpOptions.setLocation == 'object'
          if typeof self.dfpOptions.setLocation.latitude == 'number' and typeof self.dfpOptions.setLocation.longitude == 'number' and typeof self.dfpOptions.setLocation.precision == 'number'
            $win.googletag.pubads().setLocation self.dfpOptions.setLocation.latitude, self.dfpOptions.setLocation.longitude, self.dfpOptions.setLocation.precision
          else if typeof self.dfpOptions.setLocation.latitude == 'number' and typeof self.dfpOptions.setLocation.longitude == 'number'
            $win.googletag.pubads().setLocation self.dfpOptions.setLocation.latitude, self.dfpOptions.setLocation.longitude

        if self.dfpOptions.setCategoryExclusion.length > 0
          exclusionsGroup = self.dfpOptions.setCategoryExclusion.split(',')
          for v, k in exclusionsGroup
            valueTrimmed = trakless.util.trim(v)
            if valueTrimmed.length > 0
              $win.googletag.pubads().setCategoryExclusion valueTrimmed

        if self.dfpOptions.collapseEmptyDivs or self.dfpOptions.collapseEmptyDivs == 'original'
          $win.googletag.pubads().collapseEmptyDivs()

        if self.dfpOptions.disablePublisherConsole
          $win.googletag.pubads().disablePublisherConsole()

        if self.dfpOptions.disableInitialLoad
          $win.googletag.pubads().disableInitialLoad()

        if self.dfpOptions.noFetch
          $win.googletag.pubads().noFetch()

        if self.dfpSelector == '.circplus'
          $win.googletag.companionAds().setRefreshUnfilledSlots true

        $win.googletag.enableServices()
        return
      return

    isHeightInView: (el) ->
      # check for 50% visible
      percentVisible = 0.50;
      rect = el.getBoundingClientRect()
      overhang = rect.height * (1 - percentVisible)

      isVisible = (rect.top >= -overhang) && (rect.bottom <= window.innerHeight + overhang)
      return isVisible;

    displayAds: ->
      self = @
      currentTime = (new Date()).getTime()
      if (currentTime - self.lastRefresh) < 1000
        return self

      self.lastRefresh = currentTime
      toPush = []
      # Display each ad
      for adUnit, k in self.$adCollection
        $adUnit = qsel(adUnit)
        $adUnitData = adUnit[self.storeAs]
        if self.dfpOptions.refreshExisting and $adUnitData and adUnit['gsnDfpExisting']
          # determine if element is in view
          if !self.dfpOptions.inViewOnly or self.isHeightInView($adUnit)
            toPush.push $adUnitData
        else
          adUnit['gsnDfpExisting'] = true
          $win.googletag.cmd.push ->
            $win.googletag.display $adUnit.get('@id')

      if toPush.length > 0
        $win.googletag.cmd.push ->
          $win.googletag.pubads().refresh toPush

      return

    getID: ($adUnit, adUnitName, count, adUnit) ->
      self = @
      if !self.dfpOptions.refreshExisting
        adUnit[self.storeAs] = null
        adUnit['gsnDfpExisting'] = null
        if $adUnit.get('@id')
          $adUnit.set '@id', adUnitName + '-auto-gen-id-' + count
      $adUnit.get('@id') or $adUnit.set('@id', adUnitName + '-auto-gen-id-' + count).get('@id')

    getDimensions: ($adUnit, allData) ->
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

      dimensions

    dfpLoader: ->
      if self.dfpIsLoaded
        return

      $win.googletag = $win.googletag or {}
      $win.googletag.cmd = $win.googletag.cmd or []

      gads = $doc.createElement('script')
      gads.async = true
      gads.type = 'text/javascript'
      # Adblock blocks the load of Ad scripts... so we check for that

      gads.onerror = ->
        self.dfpBlocked()
        return

      loadScript('//www.googletagservices.com/tag/js/gpt.js')
      self.dfpIsLoaded = true

      # Adblock plus seems to hide blocked scripts... so we check for that
      if gads.style.display == 'none'
        self.dfpBlocked()
      @

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
            this

        # Execute any stored commands
        for v, k in commands
          $win.googletag.cmd.push v
          return
        return
      ), 50
      return
  
  module.exports = gsndfpfactory
) window