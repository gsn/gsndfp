var $doc, $win, _tk, circplusTemplate, gmodal2, gsnSw, gsndfpfactory, loadScript, qsel, swcss, trakless2;

trakless2 = require('trakless');

gmodal2 = require('gmodal');

loadScript = require('load-script');

qsel = require('dom');

swcss = require('./sw.css');

circplusTemplate = require('./circplus.html');

$win = window;

_tk = $win._tk;

$doc = $win.document;

gsnSw = null;


/** 
 * gsndfpfactory
#
 */

gsndfpfactory = (function() {
  function gsndfpfactory() {}

  gsndfpfactory.prototype.dfpID = '';

  gsndfpfactory.prototype.count = 0;

  gsndfpfactory.prototype.rendered = 0;

  gsndfpfactory.prototype.sel = '.gsnunit';

  gsndfpfactory.prototype.dops = {};

  gsndfpfactory.prototype.isLoaded = false;

  gsndfpfactory.prototype.$ads = void 0;

  gsndfpfactory.prototype.adBlockerOn = false;

  gsndfpfactory.prototype.storeAs = 'gsnunit';

  gsndfpfactory.prototype.lastRefresh = 0;

  gsndfpfactory.prototype.didOpen = false;

  gsndfpfactory.prototype.isVisible = false;

  gsndfpfactory.prototype.ieOld = false;

  gsndfpfactory.prototype.bodyTemplate = circplusTemplate;

  gsndfpfactory.prototype.refresh = function(options) {
    var self;
    self = this;
    self.dfpLoader();
    self.dfpID = gsndfp.getNetworkId(true);
    self.setOptions(options || {});
    _tk.util.ready(function() {
      return self.doIt();
    });
    return this;
  };

  gsndfpfactory.prototype.doIt = function() {
    var cp, currentTime, self, slot1;
    self = this;
    self.sel = self.dops.sel || '.gsnunit';
    if (typeof self.adUnitById !== 'object') {
      self.adUnitById = {};
    }
    if (!($win.opera && $win.opera.version)) {
      self.ieOld = $doc.all && !$win.atop;
    }
    if (self.ieOld) {
      self.dops.inViewOnly = false;
    }
    if (self.sel === '.circplus') {
      self.storeAs = 'circplus';
      cp = qsel(self.sel);
      slot1 = qsel('.cpslot1');
      if (cp.length > 0) {
        if (!slot1[0]) {
          cp.html(self.dops.bodyTemplate || self.bodyTemplate);
        }
      }
      self.$ads = [qsel('.cpslot1')[0], qsel('.cpslot2')[0]];
      if (self.$ads[0]) {
        self.createAds().displayAds();
      }
    } else if (self.sel === '.gsnsw') {
      self.dops.inViewOnly = false;
      $win.gmodal.injectStyle('swcss', swcss);
      gsnSw = self;
      self.dops.enableSingleRequest = true;
      self.dfpID = gsndfp.getNetworkId();
      if (qsel(self.dops.displayWhenExists || '.gsnunit').length <= 0) {
        return;
      }
      self.storeAs = 'gsnsw';
      if (self.didOpen || (self.getCookie('gsnsw2') != null)) {
        setTimeout(function() {
          return self.onCloseCallback({
            cancel: true
          });
        }, 200);
      } else {
        currentTime = (new Date()).getTime();
        if ((currentTime - self.lastRefresh) < 2000) {
          return self;
        }
        self.lastRefresh = currentTime;
        setTimeout(function() {
          return self.getPopup(self.sel);
        }, 200);
      }
      return self;
    } else {
      self.storeAs = 'gsnunit';
      self.$ads = qsel(self.sel);
      self.createAds().displayAds();
    }
    return this;
  };

  gsndfpfactory.prototype.setOptions = function(ops) {
    var dops, k, self, v;
    self = this;
    dops = {
      setTargeting: {},
      setCategoryExclusion: '',
      setLocation: '',
      enableSingleRequest: false,
      collapseEmptyDivs: true,
      refreshExisting: true,
      disablePublisherConsole: false,
      disableInitialLoad: false,
      inViewOnly: true,
      noFetch: false
    };
    for (k in ops) {
      v = ops[k];
      dops[k] = v;
    }
    self.dops = dops;
    return this;
  };

  gsndfpfactory.prototype.onOpenCallback = function(event) {
    var self;
    self = gsnSw;
    gsndfp.on('clickBrand', function(e) {
      $win.gmodal.hide();
    });
    self.didOpen = true;
    self.isVisible = true;
    self.$ads = qsel(self.sel);
    self.createAds().displayAds();
    setTimeout((function() {
      if (self.adBlockerOn) {
        qsel('.remove').remove();
        qsel('.sw-msg')[0].style.display = 'block';
        qsel('.sw-header-copy')[0].style.display = 'none';
        qsel('.sw-row')[0].style.display = 'none';
      }
    }), 150);
  };

  gsndfpfactory.prototype.onCloseCallback = function(event) {
    var self;
    self = gsnSw;
    self.isVisible = false;
    $win.scrollTo(0, 0);
    if (!self.getCookie('gsnsw2')) {
      self.setCookie('gsnsw2', gsndfp.gsnNetworkId + "," + gsndfp.enableCircPlus + "," + gsndfp.disableSw, 1);
    }
    if (typeof self.dops.onClose === 'function') {
      self.dops.onClose(self.didOpen);
    }
  };

  gsndfpfactory.prototype.swSucccess = function(myrsp) {
    var data, evt, handleEvent, rsp, self;
    $win.gsnswCallback = null;
    rsp = myrsp;
    if (typeof myrsp === 'string') {
      rsp = JSON.parse(myrsp);
    }
    self = gsnSw;
    if (rsp) {
      if (!gsndfp.gsnNetworkId) {
        gsndfp.gsnNetworkId = rsp.NetworkId;
      }
      gsndfp.enableCircPlus = rsp.EnableCircPlus;
      gsndfp.disableSw = rsp.DisableSw;
      data = rsp.Template;
    }
    self.dfpID = gsndfp.getNetworkId();
    evt = {
      data: rsp,
      cancel: false
    };
    self.dops.onData(evt);
    if (evt.cancel) {
      data = null;
    }
    if (data) {
      data = data.replace(/%%CACHEBUSTER%%/g, (new Date).getTime()).replace(/%%CHAINID%%/g, gsndfp.gsnid);
      if (!self.rect) {
        self.rect = {
          w: Math.max($doc.documentElement.clientWidth, $win.innerWidth || 0),
          h: Math.max($doc.documentElement.clientHeight, $win.innerHeight || 0)
        };
      }
      handleEvent = function(target) {
        if (target.className.indexOf('sw-close') >= 0) {
          $win.gmodal.off('click', handleEvent);
          $win.gmodal.off('tap', handleEvent);
          return $win.gmodal.hide();
        }
      };
      $win.gmodal.on('click', handleEvent);
      $win.gmodal.on('tap', handleEvent);
      if ($win.gmodal.show({
        content: "<div id='sw'>" + data + "<div>",
        closeCls: 'sw-close'
      }, self.onCloseCallback)) {
        self.onOpenCallback();
      }
    } else {
      self.onCloseCallback({
        cancel: true
      });
    }
    return this;
  };

  gsndfpfactory.prototype.getPopup = function() {
    var dataType, self, url;
    self = this;
    url = gsndfp.apiUrl + "/ShopperWelcome/Get/" + gsndfp.gsnid;
    dataType = 'json';
    $win.gsnswCallback = function(rsp) {
      return self.swSucccess(rsp);
    };
    url += '?callback=gsnswCallback';
    dataType = 'jsonp';
    loadScript(url);

    /**else
      request = new XMLHttpRequest()
      request.open('GET', url, true)
      request.onload = ->
        req = @
        if (req.status >= 200 and req.status < 400)
          self.swSucccess req.response
      request.send()
     */
    return self;
  };

  gsndfpfactory.prototype.getCookie = function(nameOfCookie) {
    var begin, cd, cookieData, end;
    if ($doc.cookie.length > 0) {
      begin = $doc.cookie.indexOf(nameOfCookie + '=');
      end = 0;
      if (begin !== -1) {
        begin += nameOfCookie.length + 1;
        end = $doc.cookie.indexOf(';', begin);
        if (end === -1) {
          end = $doc.cookie.length;
        }
        cookieData = decodeURI($doc.cookie.substring(begin, end));
        if (cookieData.indexOf(',') > 0) {
          cd = cookieData.split(',');
          gsndfp.gsnNetworkId = cd[0];
          gsndfp.enableCircPlus = cd[1];
          gsndfp.disableSw = cd[2];
        }
        return cookieData;
      }
    }
    return null;
  };

  gsndfpfactory.prototype.setCookie = function(nameOfCookie, value, expiredays) {
    var ed;
    ed = new Date;
    ed.setTime(ed.getTime() + expiredays * 24 * 3600 * 1000);
    $doc.cookie = nameOfCookie + '=' + encodeURI(value) + (expiredays === null ? '' : '; expires=' + ed.toGMTString()) + '; path=/';
  };

  gsndfpfactory.prototype.setTargeting = function($adUnitData, allData) {
    var exclusions, exclusionsGroup, i, k, len, targeting, v, valueTrimmed;
    targeting = allData['targeting'];
    if (targeting) {
      if (typeof targeting === 'string') {
        targeting = eval('(' + targeting + ')');
      }
      for (k in targeting) {
        v = targeting[k];
        if (k === 'brand') {
          gsndfp.setBrand(v);
        }
        $adUnitData.setTargeting(k, v);
      }
    }
    exclusions = allData['exclusions'];
    if (exclusions) {
      exclusionsGroup = exclusions.split(',');
      valueTrimmed = void 0;
      for (k = i = 0, len = exclusionsGroup.length; i < len; k = ++i) {
        v = exclusionsGroup[k];
        valueTrimmed = _tk.util.trim(v);
        if (valueTrimmed.length > 0) {
          $adUnitData.setCategoryExclusion(valueTrimmed);
        }
        return;
      }
    }
  };

  gsndfpfactory.prototype.createAds = function() {
    var $adUnit, $existingContent, adUnit, adUnitID, allData, dimensions, i, k, len, ref, self;
    self = this;
    ref = self.$ads;
    for (k = i = 0, len = ref.length; i < len; k = ++i) {
      adUnit = ref[k];
      $adUnit = qsel(adUnit);
      allData = _tk.util.allData(adUnit);
      adUnitID = self.getID($adUnit, self.storeAs, adUnit);
      dimensions = self.getDimensions($adUnit, allData);
      $existingContent = adUnit.innerHTML;
      qsel(adUnit).html('');
      $adUnit.addClass('display-none');
      $win.googletag.cmd.push(function() {
        var $adUnitData, companion;
        $adUnitData = self.adUnitById[adUnitID];
        if ($adUnitData) {
          self.setTargeting($adUnitData, allData);
          return;
        }
        self.dfpID = self.dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
        if (self.dfpID.indexOf('/') !== 0) {
          self.dfpID = '/' + dfpID;
        }
        if (allData['outofpage']) {
          $adUnitData = $win.googletag.defineOutOfPageSlot(self.dfpID, adUnitID).addService($win.googletag.pubads());
        } else {
          $adUnitData = $win.googletag.defineSlot(self.dfpID, dimensions, adUnitID).addService($win.googletag.pubads());
        }
        companion = allData['companion'];
        if (companion != null) {
          $adUnitData.addService($win.googletag.companionAds());
        }
        self.setTargeting($adUnitData, allData);
        self.adUnitById[adUnitID] = $adUnitData;
        $adUnitData.oldRenderEnded = $adUnitData.oldRenderEnded || $adUnitData.renderEnded;
        $adUnitData.renderEnded = function() {
          var display;
          self.rendered++;
          display = adUnit.style.display;
          $adUnit.removeClass('display-none');
          $adUnit.addClass('display-' + display);
          $adUnitData.existing = true;
          if ($adUnitData.oldRenderEnded != null) {
            $adUnitData.oldRenderEnded();
          }
          if (typeof self.dops.afterEachAdLoaded === 'function') {
            self.dops.afterEachAdLoaded.call(self, $adUnit, $adUnitData);
          }
        };
      });
    }
    $win.googletag.cmd.push(function() {
      var brand, exclusionsGroup, j, len1, ref1, v, valueTrimmed;
      if (typeof self.dops.setTargeting['brand'] === 'undefined') {
        brand = gsndfp.getBrand();
        if (brand != null) {
          self.dops.setTargeting['brand'] = brand;
        }
      }
      if (self.dops.enableSingleRequest) {
        $win.googletag.pubads().enableSingleRequest();
      }
      ref1 = self.dops.setTargeting;
      for (k in ref1) {
        v = ref1[k];
        if (k === 'brand') {
          gsndfp.setBrand(v);
        }
        $win.googletag.pubads().setTargeting(k, v);
      }
      if (typeof self.dops.setLocation === 'object') {
        if (typeof self.dops.setLocation.latitude === 'number' && typeof self.dops.setLocation.longitude === 'number' && typeof self.dops.setLocation.precision === 'number') {
          $win.googletag.pubads().setLocation(self.dops.setLocation.latitude, self.dops.setLocation.longitude, self.dops.setLocation.precision);
        } else if (typeof self.dops.setLocation.latitude === 'number' && typeof self.dops.setLocation.longitude === 'number') {
          $win.googletag.pubads().setLocation(self.dops.setLocation.latitude, self.dops.setLocation.longitude);
        }
      }
      if (self.dops.setCategoryExclusion.length > 0) {
        exclusionsGroup = self.dops.setCategoryExclusion.split(',');
        for (k = j = 0, len1 = exclusionsGroup.length; j < len1; k = ++j) {
          v = exclusionsGroup[k];
          valueTrimmed = _tk.util.trim(v);
          if (valueTrimmed.length > 0) {
            $win.googletag.pubads().setCategoryExclusion(valueTrimmed);
          }
        }
      }
      if (self.dops.collapseEmptyDivs || self.dops.collapseEmptyDivs === 'original') {
        $win.googletag.pubads().collapseEmptyDivs();
      }
      if (self.dops.disablePublisherConsole) {
        $win.googletag.pubads().disablePublisherConsole();
      }
      if (self.dops.disableInitialLoad) {
        $win.googletag.pubads().disableInitialLoad();
      }
      if (self.dops.noFetch) {
        $win.googletag.pubads().noFetch();
      }
      if (self.sel === '.circplus') {
        $win.googletag.companionAds().setRefreshUnfilledSlots(true);
      }
      $win.googletag.enableServices();
    });
    return self;
  };

  gsndfpfactory.prototype.isHeightInView = function(el) {
    var isVisible, overhang, percentVisible, rect;
    percentVisible = 0.50;
    rect = el.getBoundingClientRect();
    overhang = rect.height * (1 - percentVisible);
    isVisible = (rect.top >= -overhang) && (rect.bottom <= window.innerHeight + overhang);
    return isVisible;
  };

  gsndfpfactory.prototype.displayAds = function() {
    var $adUnit, $adUnitData, adUnit, i, id, k, len, ref, self, toPush;
    self = this;
    toPush = [];
    ref = self.$ads;
    for (k = i = 0, len = ref.length; i < len; k = ++i) {
      adUnit = ref[k];
      $adUnit = qsel(adUnit);
      id = $adUnit.id();
      $adUnitData = self.adUnitById[id];
      if (($adUnitData != null)) {
        if (!self.dops.inViewOnly || self.isHeightInView(adUnit)) {
          if ($adUnitData.existing) {
            toPush.push($adUnitData);
          } else {
            $win.googletag.cmd.push(function() {
              return $win.googletag.display(id);
            });
          }
        }
      } else {
        $win.googletag.cmd.push(function() {
          return $win.googletag.display(id);
        });
      }
    }
    if (toPush.length > 0) {
      $win.googletag.cmd.push(function() {
        return $win.googletag.pubads().refresh(toPush);
      });
    }
  };

  gsndfpfactory.prototype.getID = function($adUnit, adUnitName, adUnit) {
    var id, self;
    self = this;
    id = $adUnit.id();
    if ((id || '').length <= 0) {
      id = adUnitName + '$auto$gen$id$' + self.count++;
      $adUnit.id(id);
    }
    return id;
  };

  gsndfpfactory.prototype.getDimensions = function($adUnit, allData) {
    var dimensionGroups, dimensionSet, dimensions, dimensionsData, i, k, len, v;
    dimensions = [];
    dimensionsData = allData['dimensions'];
    if (dimensionsData) {
      dimensionGroups = dimensionsData.split(',');
      for (k = i = 0, len = dimensionGroups.length; i < len; k = ++i) {
        v = dimensionGroups[k];
        dimensionSet = v.split('x');
        dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);
      }
    }
    return dimensions;
  };

  gsndfpfactory.prototype.dfpLoader = function() {
    var gads;
    if (self.isLoaded) {
      return;
    }
    $win.googletag = $win.googletag || {};
    $win.googletag.cmd = $win.googletag.cmd || [];
    gads = $doc.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    gads.onerror = function() {
      self.dfpBlocked();
    };
    loadScript('//www.googletagservices.com/tag/js/gpt.js');
    self.isLoaded = true;
    if (gads.style.display === 'none') {
      self.dfpBlocked();
    }
    return this;
  };

  gsndfpfactory.prototype.dfpBlocked = function() {
    var commands, self;
    self = this;
    self.adBlockerOn = true;
    commands = $win.googletag.cmd;
    setTimeout((function() {
      var _defineSlot, i, k, len, v;
      _defineSlot = function(name, dimensions, id, oop) {
        $win.googletag.ads.push(id);
        $win.googletag.ads[id] = {
          renderEnded: function() {},
          addService: function() {
            return this;
          }
        };
        return $win.googletag.ads[id];
      };
      $win.googletag = {
        cmd: {
          push: function(callback) {
            callback.call(self);
            return this;
          }
        },
        ads: [],
        pubads: function() {
          return this;
        },
        noFetch: function() {
          return this;
        },
        disableInitialLoad: function() {
          return this;
        },
        disablePublisherConsole: function() {
          return this;
        },
        enableSingleRequest: function() {
          return this;
        },
        setTargeting: function() {
          return this;
        },
        collapseEmptyDivs: function() {
          return this;
        },
        enableServices: function() {
          return this;
        },
        defineSlot: function(name, dimensions, id) {
          return _defineSlot(name, dimensions, id, false);
        },
        defineOutOfPageSlot: function(name, id) {
          return _defineSlot(name, [], id, true);
        },
        display: function(id) {
          $win.googletag.ads[id].renderEnded.call(self);
          return this;
        }
      };
      for (k = i = 0, len = commands.length; i < len; k = ++i) {
        v = commands[k];
        $win.googletag.cmd.push(v);
        return;
      }
    }), 50);
  };

  return gsndfpfactory;

})();

module.exports = gsndfpfactory;
