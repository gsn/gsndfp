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
    sel: '.gsnunit'
    dops: {}
    isLoaded: false
    $ads: undefined
    adBlockerOn: false
    storeAs: 'gsnunit'
    lastRefresh: 0
    adUnitById: {}

    # for shopper welcome
    didOpen: false
    isVisible: false

    # for circplus
    bodyTemplate: circplusTemplate
    refresh: (options) ->
      self = @
      self.dfpLoader()
      options = options or {}
      self.dfpID = gsndfp.getNetworkId(true)
      self.setOptions(options)
      self.sel = options.sel or '.gsnunit'
      options = self.dops
      selector = self.sel

      # handle circplus
      if (selector == '.circplus')
        self.storeAs = 'circplus'
        cp = qsel(selector)
        if cp.length > 0
          trakless.util.html(cp[0], options.bodyTemplate or self.bodyTemplate)

        # real selector is use above to append bodyTemplate
        self.$ads = [qsel('.cpslot1')[0], qsel('.cpslot2')[0]]

        # only proceed if there are ads
        if (self.$ads[0])
          self.createAds()
          self.displayAds()
      # handle sw
      else if (selector == '.gsnsw')
        $win.gmodal.injectStyle('swcss', swcss)
        gsnSw = self
        self.dops.enableSingleRequest = true
        self.dfpID = gsndfp.getNetworkId()
        if qsel(options.displayWhenExists or '.gsnunit').length <= 0
          return
      
        self.storeAs = 'gsnsw'
        if self.didOpen or self.getCookie('gsnsw2')?
          self.onCloseCallback cancel: true
        else
          currentTime = (new Date()).getTime()
          if (currentTime - self.lastRefresh) < 1000
            return self

          self.lastRefresh = currentTime
          self.getPopup selector

        return self
      # handle adpods
      else
        self.$ads = qsel(selector)
        self.createAds()
        self.displayAds()

      @

    setOptions: (options) ->
      self = @
      # Set default options
      dops =
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
        dops[k] = v

      self.dops = dops
      
      @

    onOpenCallback: (event) ->
      self = gsnSw

      # hide on brand click
      gsndfp.on 'clickBrand', (e) ->
        $win.gmodal.hide()
        return

      self.didOpen = true  
      self.isVisible = true
      self.$ads = qsel(self.sel)
      self.createAds()
      self.displayAds()

      setTimeout (->  
        # adblocking detection  
        if self.adBlockerOn

          # remove any class that is tagged to be remove
          qsel('.remove').remove()
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
        self.setCookie 'gsnsw2', "#{gsndfp.gsnNetworkId},#{gsndfp.enableCircPlus},#{gsndfp.disableSw}", 1
      if typeof self.dops.onClose == 'function'
        self.dops.onClose self.didOpen
      return

    swSucccess: (myrsp) ->
      rsp = myrsp
      if (typeof myrsp is 'string')
        rsp = JSON.parse(myrsp)
        
      self = gsnSw
      if rsp
        # allow for local value to override remote value
        if (!gsndfp.gsnNetworkId)
          gsndfp.gsnNetworkId = rsp.NetworkId

        gsndfp.enableCircPlus = rsp.EnableCircPlus
        gsndfp.disableSw = rsp.DisableSw
        data = rsp.Template
                                             
      self.dfpID = gsndfp.getNetworkId() 
      evt = { data: rsp, cancel: false }                      
      self.dops.onData evt

      if evt.cancel
        data = null 
      if data
        #add the random cachebuster
        data = data.replace(/%%CACHEBUSTER%%/g, (new Date).getTime()).replace(/%%CHAINID%%/g, gsndfp.gsnid)
        $win.gmodal.on('show', self.onOpenCallback)
        $win.gmodal.on('hide', self.onCloseCallback)
        $win.gmodal.on('click', (evt) ->
          target = evt.target or evt.srcElement
          if (target.className.indexOf('sw-close') >= 0)
            $win.gmodal.hide()
        )

        # open the modal to show shopper welcome
        $win.gmodal.show({content: "<div id='sw'>#{data}<div>", closeCls: 'sw-close'})
      else
        self.onCloseCallback cancel: true
      
      @

    getPopup: (selector) ->
      self = @
      url = "#{gsndfp.apiUrl}/ShopperWelcome/Get/#{gsndfp.gsnid}"
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
            gsndfp.gsnNetworkId = cookieDatas[0]
            gsndfp.enableCircPlus = cookieData[1]
            gsndfp.disableSw = cookieData[2]
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
      self.dfpID = gsndfp.getNetworkId() 
      # Loops through on page Ad units and gets ads for them.
      for adUnit, k in self.$ads
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
          $adUnitData = self.adUnitById[adUnitID]
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
                gsndfp.setBrand(v)
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
            if typeof dops.afterEachAdLoaded == 'function'
              dops.afterEachAdLoaded.call this, $adUnit
            # Excute afterAllAdsLoaded callback if provided
            if typeof dops.afterAllAdsLoaded == 'function' and rendered == self.count
              dops.afterAllAdsLoaded.call this, $ads
            return

          # Store googleAdUnit reference
          self.adUnitById[adUnitID] = googleAdUnit
          return
      # Push DFP config options
      $win.googletag.cmd.push ->
        if typeof self.dops.setTargeting['brand'] == 'undefined'
          brand = gsndfp.getBrand()
          if brand?
            self.dops.setTargeting['brand'] = brand

        if self.dops.enableSingleRequest
          $win.googletag.pubads().enableSingleRequest()

        for k, v of self.dops.setTargeting
          if k == 'brand'
            gsndfp.setBrand(v)
          $win.googletag.pubads().setTargeting k, v

        if typeof self.dops.setLocation == 'object'
          if typeof self.dops.setLocation.latitude == 'number' and typeof self.dops.setLocation.longitude == 'number' and typeof self.dops.setLocation.precision == 'number'
            $win.googletag.pubads().setLocation self.dops.setLocation.latitude, self.dops.setLocation.longitude, self.dops.setLocation.precision
          else if typeof self.dops.setLocation.latitude == 'number' and typeof self.dops.setLocation.longitude == 'number'
            $win.googletag.pubads().setLocation self.dops.setLocation.latitude, self.dops.setLocation.longitude

        if self.dops.setCategoryExclusion.length > 0
          exclusionsGroup = self.dops.setCategoryExclusion.split(',')
          for v, k in exclusionsGroup
            valueTrimmed = trakless.util.trim(v)
            if valueTrimmed.length > 0
              $win.googletag.pubads().setCategoryExclusion valueTrimmed

        if self.dops.collapseEmptyDivs or self.dops.collapseEmptyDivs == 'original'
          $win.googletag.pubads().collapseEmptyDivs()

        if self.dops.disablePublisherConsole
          $win.googletag.pubads().disablePublisherConsole()

        if self.dops.disableInitialLoad
          $win.googletag.pubads().disableInitialLoad()

        if self.dops.noFetch
          $win.googletag.pubads().noFetch()

        if self.sel == '.circplus'
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
      toPush = []
      # Display each ad
      for adUnit, k in self.$ads
        $adUnit = qsel(adUnit)
        id = $adUnit.get('@id')
        $adUnitData = self.adUnitById[id]
        if self.dops.refreshExisting and $adUnitData
          # determine if element is in view
          if !self.dops.inViewOnly or self.isHeightInView(adUnit)
            toPush.push $adUnitData
        else
          $win.googletag.cmd.push ->
            $win.googletag.display id

      if toPush.length > 0
        $win.googletag.cmd.push ->
          $win.googletag.pubads().refresh toPush

      return

    getID: ($adUnit, adUnitName, count, adUnit) ->
      self = @
      if !self.dops.refreshExisting
        if ($adUnit.get('@id') or '').length <= 0
          $adUnit.set '@id', adUnitName + '$auto$gen$id$' + count
      $adUnit.get('@id') or $adUnit.set('@id', adUnitName + '$auto$gen$id$' + count).get('@id')

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
      if self.isLoaded
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
      self.isLoaded = true

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
            @

        # Execute any stored commands
        for v, k in commands
          $win.googletag.cmd.push v
          return
        return
      ), 50
      return
  
  module.exports = gsndfpfactory
) window