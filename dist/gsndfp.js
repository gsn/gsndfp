/*!
 * gsndfp
 * version 1.1.0
 * Requires jQuery 1.7.1 or higher
 * git@github.com:gsn/gsndfp.git
 * License: Grocery Shopping Network
 *          MIT from derived work of Copyright (c) 2013 Matt Cooper: https://github.com/coop182/jquery.dfp.js  v1.0.18
 */
(function($, window) {
  'use strict';
  var $adCollection, count, createAds, dfpBlocked, dfpID, dfpIsLoaded, dfpLoader, dfpOptions, dfpScript, dfpSelector, displayAds, getDimensions, getID, init, isInView, lastRefreshTime, refreshHandler, rendered, sessionStorageX, setOptions, storeAs;
  sessionStorageX = sessionStorage;
  if (typeof sessionStorageX === 'undefined') {
    sessionStorageX = {
      getItem: function() {},
      setItem: function() {}
    };
  }
  dfpScript = this;
  dfpID = '';
  count = 0;
  rendered = 0;
  dfpSelector = '.gsnunit';
  dfpOptions = {};
  dfpIsLoaded = false;
  $adCollection = void 0;
  storeAs = 'gsnUnit';
  lastRefreshTime = new Date;
  init = function(id, selector, options) {
    dfpID = id;
    $adCollection = $(selector);
    dfpLoader();
    setOptions(options);
    $(function() {
      createAds();
      displayAds();
      $('body').on('click', dfpOptions.refreshTarget, refreshHandler);
    });
  };
  setOptions = function(options) {
    dfpOptions = {
      setTargeting: {},
      setCategoryExclusion: '',
      setLocation: '',
      enableSingleRequest: true,
      collapseEmptyDivs: true,
      refreshExisting: true,
      disablePublisherConsole: false,
      disableInitialLoad: false,
      inViewOnly: false,
      noFetch: false,
      refreshTarget: '.gsnunit-refresh-target',
      minSecondBetweenRefresh: 5
    };
    $.extend(true, dfpOptions, options);
    if (dfpOptions.googletag) {
      window.googletag.cmd.push(function() {
        $.extend(true, window.googletag, dfpOptions.googletag);
      });
    }
  };
  createAds = function() {
    $adCollection.each(function() {
      var $adUnit, $existingContent, adUnitID, dimensions;
      $adUnit = $(this);
      count++;
      adUnitID = getID($adUnit, 'gsn', count);
      dimensions = getDimensions($adUnit);
      $existingContent = $adUnit.html();
      $adUnit.html('').addClass('display-none');
      window.googletag.cmd.push(function() {
        var $adUnitData, exclusions, exclusionsGroup, googleAdUnit, targeting, valueTrimmed;
        googleAdUnit = void 0;
        $adUnitData = $adUnit.data(storeAs);
        if ($adUnitData) {
          return;
        }
        dfpID = dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
        if (dfpID.indexOf('/') !== 0) {
          dfpID = '/' + dfpID;
        }
        if ($adUnit.data('outofpage')) {
          googleAdUnit = window.googletag.defineOutOfPageSlot(dfpID, adUnitID).addService(window.googletag.pubads());
        } else {
          googleAdUnit = window.googletag.defineSlot(dfpID, dimensions, adUnitID).addService(window.googletag.pubads());
        }
        targeting = $adUnit.data('targeting');
        if (targeting) {
          if (typeof targeting === 'string') {
            targeting = eval('(' + targeting + ')');
          }
          $.each(targeting, function(k, v) {
            if (k === 'brand') {
              sessionStorageX.setItem('brand', v);
            }
            googleAdUnit.setTargeting(k, v);
          });
        }
        exclusions = $adUnit.data('exclusions');
        if (exclusions) {
          exclusionsGroup = exclusions.split(',');
          valueTrimmed = void 0;
          $.each(exclusionsGroup, function(k, v) {
            valueTrimmed = $.trim(v);
            if (valueTrimmed.length > 0) {
              googleAdUnit.setCategoryExclusion(valueTrimmed);
            }
          });
        }
        googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded || googleAdUnit.renderEnded;
        googleAdUnit.renderEnded = function() {
          var display;
          rendered++;
          display = $adUnit.css('display');
          $adUnit.removeClass('display-none').addClass('display-' + display);
          googleAdUnit.oldRenderEnded();
          if (typeof dfpOptions.afterEachAdLoaded === 'function') {
            dfpOptions.afterEachAdLoaded.call(this, $adUnit);
          }
          if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === count) {
            dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
          }
        };
        $adUnit.data(storeAs, googleAdUnit);
      });
    });
    window.googletag.cmd.push(function() {
      var exclusionsGroup, valueTrimmed;
      if (typeof dfpOptions.setTargeting['brand'] === 'undefined') {
        if (sessionStorageX.getItem('brand')) {
          dfpOptions.setTargeting['brand'] = sessionStorageX.getItem('brand');
        }
      }
      if (dfpOptions.enableSingleRequest === true) {
        window.googletag.pubads().enableSingleRequest();
      }
      $.each(dfpOptions.setTargeting, function(k, v) {
        if (k === 'brand') {
          sessionStorageX.setItem('brand', v);
        }
        window.googletag.pubads().setTargeting(k, v);
      });
      if (typeof dfpOptions.setLocation === 'object') {
        if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number' && typeof dfpOptions.setLocation.precision === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
        } else if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude);
        }
      }
      if (dfpOptions.setCategoryExclusion.length > 0) {
        exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
        valueTrimmed = void 0;
        $.each(exclusionsGroup, function(k, v) {
          valueTrimmed = $.trim(v);
          if (valueTrimmed.length > 0) {
            window.googletag.pubads().setCategoryExclusion(valueTrimmed);
          }
        });
      }
      if (dfpOptions.collapseEmptyDivs) {
        window.googletag.pubads().collapseEmptyDivs();
      }
      if (dfpOptions.disablePublisherConsole === true) {
        window.googletag.pubads().disablePublisherConsole();
      }
      if (dfpOptions.disableInitialLoad === true) {
        window.googletag.pubads().disableInitialLoad();
      }
      if (dfpOptions.noFetch === true) {
        window.googletag.pubads().noFetch();
      }
      window.googletag.enableServices();
    });
  };
  isInView = function(elem) {
    var docViewBottom, docViewTop, elemBottom, elemTop;
    docViewTop = $(window).scrollTop();
    docViewBottom = docViewTop + $(window).height();
    elemTop = elem.offset().top;
    elemBottom = elemTop + elem.height();
    return elemTop + (elemBottom - elemTop) / 2 >= docViewTop && elemTop + (elemBottom - elemTop) / 2 <= docViewBottom;
  };
  refreshHandler = function() {
    if ((new Date).getSeconds() - lastRefreshTime.getSeconds() >= dfpOptions.minSecondBetweenRefresh) {
      Gsn.Advertising.refreshAdPods();
      lastRefreshTime = new Date;
    }
  };
  displayAds = function() {
    var toPush;
    toPush = [];
    $adCollection.each(function() {
      var $adUnit, $adUnitData;
      $adUnit = $(this);
      $adUnitData = $adUnit.data(storeAs);
      if (dfpOptions.refreshExisting && $adUnitData && $adUnit.data('gsnDfpExisting')) {
        if (!dfpOptions.inViewOnly || isInView($adUnit) && $adUnit.is(':visible')) {
          toPush.push($adUnitData);
        }
      } else {
        $adUnit.data('gsnDfpExisting', true);
        window.googletag.cmd.push(function() {
          window.googletag.display($adUnit.attr('id'));
        });
      }
    });
    if (toPush.length > 0) {
      window.googletag.cmd.push(function() {
        window.googletag.pubads().refresh(toPush);
      });
    }
  };
  getID = function($adUnit, adUnitName, count) {
    if (!dfpOptions.refreshExisting) {
      $adUnit.data(storeAs, null);
      $adUnit.data('gsnDfpExisting', null);
      if ($adUnit.attr('id')) {
        $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count);
      }
    }
    return $adUnit.attr('id') || $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count).attr('id');
  };
  getDimensions = function($adUnit) {
    var dimensionGroups, dimensions, dimensionsData;
    dimensions = [];
    dimensionsData = $adUnit.data('dimensions');
    if (dimensionsData) {
      dimensionGroups = dimensionsData.split(',');
      $.each(dimensionGroups, function(k, v) {
        var dimensionSet;
        dimensionSet = v.split('x');
        dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);
      });
    } else {
      dimensions.push([$adUnit.width(), $adUnit.height()]);
    }
    return dimensions;
  };
  dfpLoader = function() {
    var gads, node, useSsl;
    dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
    if (dfpIsLoaded) {
      return;
    }
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    gads.onerror = function() {
      dfpBlocked();
    };
    useSsl = 'https:' === document.location.protocol;
    gads.src = (useSsl ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
    if (gads.style.display === 'none') {
      dfpBlocked();
    }
  };
  dfpBlocked = function() {
    var commands;
    commands = window.googletag.cmd;
    setTimeout((function() {
      var _defineSlot;
      _defineSlot = function(name, dimensions, id, oop) {
        window.googletag.ads.push(id);
        window.googletag.ads[id] = {
          renderEnded: function() {},
          addService: function() {
            return this;
          }
        };
        return window.googletag.ads[id];
      };
      window.googletag = {
        cmd: {
          push: function(callback) {
            callback.call(dfpScript);
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
          window.googletag.ads[id].renderEnded.call(dfpScript);
          return this;
        }
      };
      $.each(commands, function(k, v) {
        window.googletag.cmd.push(v);
      });
    }), 50);
  };

  /**
   * Add function to the jQuery / Zepto / tire namespace
   * @param  String id      (Optional) The DFP account ID
   * @param  Object options (Optional) Custom options to apply
   */
  $.gsnDfp = $.fn.gsnDfp = function(id, options) {
    var selector;
    options = options || {};
    if (id === void 0) {
      id = dfpID;
    }
    if (typeof id === 'object') {
      options = id;
      id = options.dfpID || dfpID;
    }
    selector = this;
    if (typeof this === 'function') {
      selector = dfpSelector;
    }
    init(id, selector, options);
    return this;
  };
})(window.jQuery || window.Zepto || window.tire || window.$, window);

(function($, window) {
  'use strict';
  var $adCollection, advertUrl, apiUrl, chainId, clean, clearCookie, count, createAds, cssUrl, dfpBlocked, dfpID, dfpIsLoaded, dfpLoader, dfpOptions, dfpScript, dfpSelector, didOpen, displayAds, getCookie, getDimensions, getID, getPopup, init, onCloseCallback, onOpenCallback, rendered, sessionStorageX, setAdvertisingTester, setCookie, setOptions, setResponsiveCss, storeAs;
  sessionStorageX = sessionStorage;
  if (typeof sessionStorageX === 'undefined') {
    sessionStorageX = {
      getItem: function() {},
      setItem: function() {}
    };
  }
  dfpScript = this;
  dfpID = '';
  count = 0;
  rendered = 0;
  dfpSelector = '.gsnsw';
  dfpOptions = {};
  dfpIsLoaded = false;
  $adCollection = void 0;
  storeAs = 'gsnsw';
  apiUrl = 'https://clientapi.gsn2.com/api/v1/ShopperWelcome/GetShopperWelcome/';
  cssUrl = 'http://cdn.gsngrocers.com/script/sw2/1.1.0/sw2-override.css';
  advertUrl = 'http://cdn.gsngrocers.com/script/sw2/1.1.0/advertisement.js';
  chainId = 0;
  didOpen = false;
  init = function(id, selector, options) {
    var advert, css;
    setOptions(options);
    css = dfpOptions.cssUrl || cssUrl;
    advert = dfpOptions.advertUrl || advertUrl;
    if (dfpOptions.cancel) {
      onCloseCallback({
        cancel: true
      });
    }
    setResponsiveCss(css);
    setAdvertisingTester(advert);
    if (getCookie('shopperwelcome2') === null) {
      dfpID = id;
      dfpLoader();
      getPopup(selector);
      Gsn.Advertising.on('clickBrand', function(e) {
        $('.sw-close').click();
      });
    } else {
      onCloseCallback({
        cancel: true
      });
    }
  };
  setResponsiveCss = function(css) {
    var cssTag, head;
    if (0 === $('.respo').length) {
      head = document.getElementsByTagName('head').item(0);
      cssTag = document.createElement('link');
      cssTag.setAttribute('href', css);
      cssTag.setAttribute('rel', 'stylesheet');
      cssTag.setAttribute('class', 'respo');
      head.appendChild(cssTag);
    }
  };
  setAdvertisingTester = function(advert) {
    var body, scriptTag;
    if (0 === $('.advert').length) {
      body = document.getElementsByTagName('body').item(0);
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('src', advert);
      scriptTag.setAttribute('class', 'advert');
      body.appendChild(scriptTag);
    }
  };
  onOpenCallback = function(event) {
    didOpen = true;
    setTimeout((function() {
      if (typeof gsnGlobalTester === 'undefined') {
        jQuery('.sw-msg').show();
        jQuery('.sw-header-copy').hide();
        jQuery('.sw-row').hide();
      }
    }), 150);
  };
  onCloseCallback = function(event) {
    $('.sw-pop').remove();
    $('.lean-overlay').remove();
    window.scrollTo(0, 0);
    if (getCookie('shopperwelcome2') === null) {
      setCookie('shopperwelcome2', 'shopperwelcome2', 1);
    }
    if (typeof dfpOptions.onClose === 'function') {
      dfpOptions.onClose(didOpen);
    }
  };
  getPopup = function(selector) {
    var chain, url;
    url = dfpOptions.apiUrl || apiUrl;
    chain = dfpOptions.chainId || chainId;
    $.ajax({
      url: url + chain,
      dataType: 'json',
      success: function(data) {
        var body, div;
        if (data) {
          data = data.replace(/%%CACHEBUSTER%%/g, (new Date).getTime()).replace(/%%CHAINID%%/g, chain);
          if (0 === $('#sw').length) {
            body = document.getElementsByTagName('body').item(0);
            div = document.createElement('div');
            div.setAttribute('id', 'sw');
            body.appendChild(div);
          }
          $('#sw').html(clean(data));
          $adCollection = $(selector);
          if ($adCollection) {
            createAds();
            displayAds();
            $('.sw-pop').easyModal({
              autoOpen: true,
              closeOnEscape: false,
              onClose: onCloseCallback,
              onOpen: onOpenCallback,
              top: 25
            });
          }
        } else {
          onCloseCallback({
            cancel: true
          });
        }
      }
    });
  };
  clean = function(data) {
    var template;
    template = $(data.trim());
    $('.remove', template).remove();
    return template.prop('outerHTML');
  };
  getCookie = function(NameOfCookie) {
    var begin, end;
    if (document.cookie.length > 0) {
      begin = document.cookie.indexOf(NameOfCookie + '=');
      end = 0;
      if (begin !== -1) {
        begin += NameOfCookie.length + 1;
        end = document.cookie.indexOf(';', begin);
        if (end === -1) {
          end = document.cookie.length;
        }
        return decodeURI(document.cookie.substring(begin, end));
      }
    }
    return null;
  };
  setCookie = function(NameOfCookie, value, expiredays) {
    var ExpireDate;
    ExpireDate = new Date;
    ExpireDate.setTime(ExpireDate.getTime() + expiredays * 24 * 3600 * 1000);
    document.cookie = NameOfCookie + '=' + encodeURI(value) + (expiredays === null ? '' : '; expires=' + ExpireDate.toGMTString()) + '; path=/';
  };
  clearCookie = function(nameOfCookie) {
    if (nameOfCookie === getCookie(nameOfCookie)) {
      document.cookie = nameOfCookie + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };
  setOptions = function(options) {
    dfpOptions = {
      setTargeting: {},
      setCategoryExclusion: '',
      setLocation: '',
      enableSingleRequest: true,
      collapseEmptyDivs: true,
      refreshExisting: true,
      disablePublisherConsole: false,
      disableInitialLoad: false,
      noFetch: false
    };
    $.extend(true, dfpOptions, options);
    if (dfpOptions.googletag) {
      window.googletag.cmd.push(function() {
        $.extend(true, window.googletag, dfpOptions.googletag);
      });
    }
  };
  createAds = function() {
    $adCollection.each(function() {
      var $adUnit, $existingContent, adUnitID, dimensions;
      $adUnit = $(this);
      count++;
      adUnitID = getID($adUnit, 'gsnsw', count);
      dimensions = getDimensions($adUnit);
      $existingContent = $adUnit.html();
      $adUnit.html('').addClass('display-none');
      window.googletag.cmd.push(function() {
        var $adUnitData, exclusions, exclusionsGroup, googleAdUnit, targeting, valueTrimmed;
        googleAdUnit = void 0;
        $adUnitData = $adUnit.data(storeAs);
        if ($adUnitData) {
          return;
        }
        dfpID = dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
        if (dfpID.indexOf('/') !== 0) {
          dfpID = '/' + dfpID;
        }
        if ($adUnit.data('outofpage')) {
          googleAdUnit = window.googletag.defineOutOfPageSlot(dfpID, adUnitID).addService(window.googletag.pubads());
        } else {
          googleAdUnit = window.googletag.defineSlot(dfpID, dimensions, adUnitID).addService(window.googletag.pubads());
        }
        targeting = $adUnit.data('targeting');
        if (targeting) {
          if (typeof targeting === 'string') {
            targeting = eval('(' + targeting + ')');
          }
          $.each(targeting, function(k, v) {
            if (k === 'brand') {
              sessionStorageX.setItem('brand', v);
            }
            googleAdUnit.setTargeting(k, v);
          });
        }
        exclusions = $adUnit.data('exclusions');
        if (exclusions) {
          exclusionsGroup = exclusions.split(',');
          valueTrimmed = void 0;
          $.each(exclusionsGroup, function(k, v) {
            valueTrimmed = $.trim(v);
            if (valueTrimmed.length > 0) {
              googleAdUnit.setCategoryExclusion(valueTrimmed);
            }
          });
        }
        googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded || googleAdUnit.renderEnded;
        googleAdUnit.renderEnded = function() {
          var display;
          rendered++;
          display = $adUnit.css('display');
          $adUnit.removeClass('display-none').addClass('display-' + display);
          if (typeof dfpOptions.afterEachAdLoaded === 'function') {
            dfpOptions.afterEachAdLoaded.call(this, $adUnit);
          }
          if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === count) {
            dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
          }
        };
        $adUnit.data(storeAs, googleAdUnit);
      });
    });
    window.googletag.cmd.push(function() {
      var exclusionsGroup, valueTrimmed;
      if (typeof dfpOptions.setTargeting['brand'] === 'undefined') {
        if (sessionStorageX.getItem('brand')) {
          dfpOptions.setTargeting['brand'] = sessionStorageX.getItem('brand');
        }
      }
      if (dfpOptions.enableSingleRequest === true) {
        window.googletag.pubads().enableSingleRequest();
      }
      $.each(dfpOptions.setTargeting, function(k, v) {
        if (k === 'brand') {
          sessionStorageX.setItem('brand', v);
        }
        window.googletag.pubads().setTargeting(k, v);
      });
      if (typeof dfpOptions.setLocation === 'object') {
        if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number' && typeof dfpOptions.setLocation.precision === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
        } else if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude);
        }
      }
      if (dfpOptions.setCategoryExclusion.length > 0) {
        exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
        valueTrimmed = void 0;
        $.each(exclusionsGroup, function(k, v) {
          valueTrimmed = $.trim(v);
          if (valueTrimmed.length > 0) {
            window.googletag.pubads().setCategoryExclusion(valueTrimmed);
          }
        });
      }
      if (dfpOptions.collapseEmptyDivs) {
        window.googletag.pubads().collapseEmptyDivs();
      }
      if (dfpOptions.disablePublisherConsole === true) {
        window.googletag.pubads().disablePublisherConsole();
      }
      if (dfpOptions.disableInitialLoad === true) {
        window.googletag.pubads().disableInitialLoad();
      }
      if (dfpOptions.noFetch === true) {
        window.googletag.pubads().noFetch();
      }
      window.googletag.enableServices();
    });
  };
  displayAds = function() {
    var toPush;
    toPush = [];
    $adCollection.each(function() {
      var $adUnit, $adUnitData;
      $adUnit = $(this);
      $adUnitData = $adUnit.data(storeAs);
      if (dfpOptions.refreshExisting && $adUnitData && $adUnit.data('gsnDfpExisting')) {
        toPush.push($adUnitData);
      } else {
        $adUnit.data('gsnDfpExisting', true);
        window.googletag.cmd.push(function() {
          window.googletag.display($adUnit.attr('id'));
        });
      }
    });
    if (toPush.length > 0) {
      window.googletag.cmd.push(function() {
        window.googletag.pubads().refresh(toPush);
      });
    }
  };
  getID = function($adUnit, adUnitName, count) {
    if (!dfpOptions.refreshExisting) {
      $adUnit.data(storeAs, null);
      $adUnit.data('gsnDfpExisting', null);
      if ($adUnit.attr('id')) {
        $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count);
      }
    }
    return $adUnit.attr('id') || $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count).attr('id');
  };
  getDimensions = function($adUnit) {
    var dimensionGroups, dimensions, dimensionsData;
    dimensions = [];
    dimensionsData = $adUnit.data('dimensions');
    if (dimensionsData) {
      dimensionGroups = dimensionsData.split(',');
      $.each(dimensionGroups, function(k, v) {
        var dimensionSet;
        dimensionSet = v.split('x');
        dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);
      });
    } else {
      dimensions.push([$adUnit.width(), $adUnit.height()]);
    }
    return dimensions;
  };
  dfpLoader = function() {
    var gads, node, useSSL;
    dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
    if (dfpIsLoaded) {
      return;
    }
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    gads.onerror = function() {
      dfpBlocked();
    };
    useSSL = 'https:' === document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
    if (gads.style.display === 'none') {
      dfpBlocked();
    }
  };
  dfpBlocked = function() {
    var commands;
    commands = window.googletag.cmd;
    setTimeout((function() {
      var _defineSlot;
      _defineSlot = function(name, dimensions, id, oop) {
        window.googletag.ads.push(id);
        window.googletag.ads[id] = {
          renderEnded: function() {},
          addService: function() {
            return this;
          }
        };
        return window.googletag.ads[id];
      };
      window.googletag = {
        cmd: {
          push: function(callback) {
            callback.call(dfpScript);
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
          window.googletag.ads[id].renderEnded.call(dfpScript);
          return this;
        }
      };
      $.each(commands, function(k, v) {
        window.googletag.cmd.push(v);
      });
    }), 50);
  };

  /**
   * Add function to the jQuery / Zepto / tire namespace
   * @param  String id      (Optional) The DFP account ID
   * @param  Object options (Optional) Custom options to apply
   - network id
   - chain id
   - store id (optional)
   */
  $.gsnSw2 = $.fn.gsnSw2 = function(id, options) {
    var selector;
    options = options || {};
    if (id === void 0) {
      id = dfpID;
    }
    if (typeof id === 'object') {
      options = id;
      id = options.dfpID || dfpID;
    }
    selector = this;
    if (typeof this === 'function') {
      selector = dfpSelector;
    }
    if ($(options.displayWhenExists || '.gsnunit').length) {
      init(id, selector, options);
    }
    return this;
  };
})(window.jQuery || window.Zepto || window.tire || window.$, window);
