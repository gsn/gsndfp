(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {

/*!
 *  Project: gsnevent triggering
 * ===============================
 */


/* Usage:
 *   For Publisher:
 *         Gsn.Advertising.clickBrickOffer(clickTrackingUrl, 69);
#
 *   For Consumer:
 *         Gsn.Advertising.on('clickBrickOffer', function(evt)) { alert(evt.OfferCode); });
#
 * The following events are currently available: clickProduct, clickPromotion, clickBrand, clickBrickOffer, clickRecipe, and clickLink
 */

(function() {
  (function(win) {
    var Plugin, aPlugin, attrs, buildQueryString, circPlus, createFrame, defaults, doc, fn, gsnContext, gsnDfp, gsnSw2, gsndfpfactory, i, j, k, len, len1, myGsn, myPlugin, oldGsnAdvertising, prefix, ref, ref1, script, tickerFrame, trakless, trakless2;
    defaults = require('defaults');
    trakless2 = require('trakless');
    gsndfpfactory = require('./gsndfpfactory.coffee');
    doc = win.document;
    gsnContext = win.gsnContext;
    trakless = win.trakless;
    tickerFrame = void 0;
    myGsn = win.Gsn || {};
    oldGsnAdvertising = myGsn.Advertising;
    gsnSw2 = new gsndfpfactory();
    gsnDfp = new gsndfpfactory();
    circPlus = new gsndfpfactory();
    if (typeof oldGsnAdvertising !== 'undefined') {
      if (oldGsnAdvertising.pluginLoaded) {
        return;
      }
    }
    createFrame = function() {
      var tempIFrame;
      if (typeof tickerFrame === 'undefined') {
        tempIFrame = doc.createElement('iframe');
        tempIFrame.setAttribute('id', 'gsnticker');
        tempIFrame.style.position = 'absolute';
        tempIFrame.style.top = '-9999em';
        tempIFrame.style.left = '-9999em';
        tempIFrame.style.zIndex = '99';
        tempIFrame.style.border = '0px';
        tempIFrame.style.width = '0px';
        tempIFrame.style.height = '0px';
        tickerFrame = doc.body.appendChild(tempIFrame);
        if (doc.frames) {
          tickerFrame = doc.frames['gsnticker'];
        }
      }
    };
    Plugin = (function() {
      function Plugin() {}

      Plugin.prototype.pluginLoaded = true;

      Plugin.prototype.defaultActionParam = {
        page: void 0,
        evtname: '',
        dept: void 0,
        deviceid: '',
        storeid: '',
        consumerid: '',
        isanon: false,
        loyaltyid: '',
        aisle: '',
        category: '',
        shelf: '',
        brand: '',
        pcode: '',
        pdesc: '',
        latlng: [0, 0],
        evtcategory: '',
        evtvalue: 0
      };

      Plugin.prototype.translator = {
        siteid: 'sid',
        page: 'pg',
        evtname: 'en',
        dept: 'dpt',
        deviceid: 'dvc',
        storeid: 'str',
        consumerid: 'cust',
        isanon: 'isa',
        loyaltyid: 'loy',
        aisle: 'asl',
        category: 'cat',
        shelf: 'shf',
        brand: 'brd',
        pcode: 'pcd',
        pdesc: 'pds',
        latlng: 'latlng',
        evtcategory: 'ec',
        evtvalue: 'ev'
      };

      Plugin.prototype.isDebug = false;

      Plugin.prototype.gsnid = 0;

      Plugin.prototype.selector = 'body';

      Plugin.prototype.apiUrl = 'https://clientapi.gsn2.com/api/v1';

      Plugin.prototype.gsnNetworkId = void 0;

      Plugin.prototype.gsnNetworkStore = void 0;

      Plugin.prototype.onAllEvents = void 0;

      Plugin.prototype.oldGsnAdvertising = oldGsnAdvertising;

      Plugin.prototype.minSecondBetweenRefresh = 5;

      Plugin.prototype.enableCircPlus = false;

      Plugin.prototype.disableSw = '';

      Plugin.prototype.source = '';

      Plugin.prototype.targetting = {};

      Plugin.prototype.depts = [];

      Plugin.prototype.circPlusBody = void 0;

      Plugin.prototype.refreshExisting = {
        circPlus: false,
        pods: false
      };

      Plugin.prototype.circPlusDept = void 0;

      Plugin.prototype.timer = void 0;


      /**
       * get network id
      #
       * @return {Object}
       */

      Plugin.prototype.getNetworkId = function() {
        var self;
        self = this;
        return self.gsnNetworkId + ((self.source || "").length > 0 ? "." + self.source : "");
      };


      /**
       * trigger a gsnevent
      #
       * @param {String} en - event name
       * @param {Object} ed - event data
       * @return {Object}
       */

      Plugin.prototype.trigger = function(en, ed) {
        if (en.indexOf('gsnevent') < 0) {
          en = 'gsnevent:' + en;
        }
        win.setTimeout((function() {
          trakless.util.trigger(en, {
            type: en,
            detail: ed
          });
          if (typeof this.onAllEvents === 'function') {
            this.onAllEvents({
              type: en,
              detail: ed
            });
          }
        }), 100);
        return this;
      };


      /**
       * listen to a gsnevent
      #
       * @param {String} en - event name
       * @param {Function} cb - callback
       * @return {Object}
       */

      Plugin.prototype.on = function(en, cb) {
        if (en.indexOf('gsnevent') < 0) {
          en = 'gsnevent:' + en;
        }
        trakless.util.on(en, cb);
        return this;
      };


      /**
       * detach from event
      #
       * @param {String} en - event name
       * @param {Function} cb - cb
       * @return {Object}
       */

      Plugin.prototype.off = function(en, cb) {
        if (en.indexOf('gsnevent') < 0) {
          en = 'gsnevent:' + en;
        }
        trakless.util.off(en, cb);
        return this;
      };

      Plugin.prototype.log = function(message) {
        var self;
        self = myGsn.Advertising;
        if (self.isDebug && console) {
          console.log(message);
        }
        return this;
      };


      /**
       * trigger action tracking
      #
       * @param {String} actionParam
       * @return {Object}
       */

      Plugin.prototype.trackAction = function(actionParam) {
        var i, k, len, self, traker, translatedParam, v;
        self = myGsn.Advertising;
        translatedParam = {};
        if (actionParam != null) {
          for (k = i = 0, len = actionParam.length; i < len; k = ++i) {
            v = actionParam[k];
            translatedParam[self.translator[k]] = v;
          }
          traker = trakless.getDefaultTracker();
          traker.track('gsn', translatedParam);
        }
        self.log(trakless.util.stringToJSON(actionParam));
        return this;
      };


      /**
       * utility method to normalize category
      #
       * @param {String} keyword
       * @return {String}
       */

      Plugin.prototype.cleanKeyword = function(keyword) {
        var result;
        result = keyword.replace(/[^a-zA-Z0-9]+/gi, '_').replace(/^[_]+/gi, '');
        if (result.toLowerCase != null) {
          result = result.toLowerCase();
        }
        return result;
      };


      /**
       * add a dept
      #
       * @param {String} dept
       * @return {Object}
       */

      Plugin.prototype.addDept = function(dept) {
        var depts, goodDepts, i, len, oldDepts, self;
        self = myGsn.Advertising;
        if (dept != null) {
          oldDepts = self.depts;
          depts = [];
          goodDepts = {};
          depts.push(self.cleanKeyword(dept));
          goodDepts[depts[0]] = 1;
          self.circPlusDept = depts[0];
          for (i = 0, len = oldDepts.length; i < len; i++) {
            dept = oldDepts[i];
            if (goodDepts[dept] == null) {
              depts.push(dept);
            }
            goodDepts[dept] = 1;
          }
          while (depts.length > 5) {
            depts.pop();
          }
          self.depts = depts;
        }
        return this;
      };


      /**
       * fire a tracking url
      #
       * @param {String} url
       * @return {Object}
       */

      Plugin.prototype.ajaxFireUrl = function(url) {
        if (typeof url === 'string') {
          if (url.length < 10) {
            return;
          }
          url = url.replace('%%CACHEBUSTER%%', (new Date).getTime());
          createFrame();
          tickerFrame.src = url;
        }
        return this;
      };


      /**
       * Trigger when a product is clicked.  AKA: clickThru
      #
       */

      Plugin.prototype.clickProduct = function(click, categoryId, brandName, productDescription, productCode, quantity, displaySize, regularPrice, currentPrice, savingsAmount, savingsStatement, adCode, creativeId) {
        this.ajaxFireUrl(click);
        this.trigger('clickProduct', {
          myPlugin: this,
          CategoryId: categoryId,
          BrandName: brandName,
          Description: productDescription,
          ProductCode: productCode,
          DisplaySize: displaySize,
          RegularPrice: regularPrice,
          CurrentPrice: currentPrice,
          SavingsAmount: savingsAmount,
          SavingsStatement: savingsStatement,
          AdCode: adCode,
          CreativeId: creativeId,
          Quantity: quantity || 1
        });
        return this;
      };


      /**
       * Trigger when a brick offer is clicked.  AKA: brickRedirect
      #
       */

      Plugin.prototype.clickBrickOffer = function(click, offerCode, checkCode) {
        this.ajaxFireUrl(click);
        this.trigger('clickBrickOffer', {
          myPlugin: this,
          OfferCode: offerCode || 0
        });
        return this;
      };


      /**
       * Trigger when a brand offer or shopper welcome is clicked.
      #
       */

      Plugin.prototype.clickBrand = function(click, brandName) {
        this.ajaxFireUrl(click);
        this.setBrand(brandName);
        this.trigger('clickBrand', {
          myPlugin: this,
          BrandName: brandName
        });
        return this;
      };


      /**
       * Trigger when a promotion is clicked.  AKA: promotionRedirect
      #
       */

      Plugin.prototype.clickPromotion = function(click, adCode) {
        this.ajaxFireUrl(click);
        this.trigger('clickPromotion', {
          myPlugin: this,
          AdCode: adCode
        });
        return this;
      };


      /**
       * Trigger when a recipe is clicked.  AKA: recipeRedirect
      #
       */

      Plugin.prototype.clickRecipe = function(click, recipeId) {
        this.ajaxFireUrl(click);
        this.trigger('clickRecipe', {
          RecipeId: recipeId
        });
        return this;
      };


      /**
       * Trigger when a generic link is clicked.  AKA: verifyClickThru
      #
       */

      Plugin.prototype.clickLink = function(click, url, target) {
        if (target === void 0 || target === '') {
          target = '_top';
        }
        this.ajaxFireUrl(click);
        this.trigger('clickLink', {
          myPlugin: this,
          Url: url,
          Target: target
        });
        return this;
      };


      /**
       * set the brand for the session
      #
       */

      Plugin.prototype.setBrand = function(brandName) {
        trakless.util.session('gsndfp:brand', brandName);
        return this;
      };


      /**
       * get the brand currently in session
      #
       */

      Plugin.prototype.getBrand = function() {
        return trakless.util.session('gsndfp:brand');
      };


      /**
       * handle a dom event
      #
       */

      Plugin.prototype.actionHandler = function(evt) {
        var allData, elem, i, k, len, payLoad, realk, self, v;
        self = myGsn.Advertising;
        elem = evt.target ? evt.target : evt.srcElement;
        payLoad = {};
        if (elem != null) {
          allData = trakless.util.allData(elem);
          for (v = i = 0, len = allData.length; i < len; v = ++i) {
            k = allData[v];
            if (!(/^gsn/gi.test(k))) {
              continue;
            }
            realk = /^gsn/i.replace(k, '').toLowerCase();
            payLoad[realk] = v;
          }
        }
        self.refresh(payLoad);
        return self;
      };


      /**
       * internal method for refreshing adpods
      #
       */

      Plugin.prototype.refreshAdPodsInternal = function(actionParam, forceRefresh) {
        var canRefresh, lastRefreshTime, payLoad, self, targetting;
        self = myGsn.Advertising;
        payLoad = defaults(actionParam, self.defaultActionParam);
        payLoad.siteid = self.gsnid;
        self.trackAction(payLoad);
        canRefresh = lastRefreshTime <= 0 || ((new Date).getTime() / 1000 - lastRefreshTime) >= self.minSecondBetweenRefresh;
        if (forceRefresh || canRefresh) {
          lastRefreshTime = (new Date()).getTime() / 1000;
          self.addDept(payLoad.dept);
          if (forceRefresh) {
            self.refreshExisting.pods = false;
            self.refreshExisting.circPlus = false;
          }
          targetting = {
            dept: self.depts || [],
            brand: self.getBrand()
          };
          if (payLoad.page) {
            targetting.kw = payLoad.page.replace(/[^a-z]/gi, '');
          }
          gsnDfp.init(self.getNetworkId().replace(/\/$/gi, '') + (self.gsnNetworkStore || ''), {
            setTargeting: targetting,
            refreshExisting: self.refreshExisting.pods
          });
          self.refreshExisting.pods = true;
          if (self.enableCircPlus) {
            targetting.dept = [self.circPlusDept || 'produce'];
            circPlus.init(self.getNetworkId().replace(/\/$/gi, '') + (self.gsnNetworkStore || ''), {
              setTargeting: targetting,
              circPlusBody: self.circPlusBody,
              dfpSelector: '.circplus',
              refreshExisting: self.refreshExisting.circPlus
            });
            self.refreshExisting.circPlus = true;
          }
        }
        return this;
      };


      /**
       * adpods refresh
      #
       */

      Plugin.prototype.refresh = function(actionParam, forceRefresh) {
        var self;
        self = myGsn.Advertising;
        if (!self.hasGsnUnit()) {
          return self;
        }
        if (self.gsnid) {
          gsnSw2.init(self.gsnid, {
            displayWhenExists: '.gsnadunit,.gsnunit',
            dfpSelector: '.gsnsw',
            onData: function(evt) {
              if ((self.source || '').length > 0) {
                return evt.cancel = self.disableSw.indexOf(self.source) > 0;
              }
            },
            onClose: function() {
              if (self.selector != null) {
                trakless.util.onClick(self.selector, self.actionHandler, '.gsnaction');
                self.selector = null;
              }
              return self.refreshAdPodsInternal(actionParam, forceRefresh);
            }
          });
        }
        return this;
      };


      /**
       * determine if there are adpods on the page
      #
       */

      Plugin.prototype.hasGsnUnit = function() {
        return trakless.util.$('.gsnadunit,.gsnunit,.circplus').length > 0;
      };


      /**
       * set global defaults
      #
       */

      Plugin.prototype.setDefault = function(defaultParam) {
        var self;
        self = myGsn.Advertising;
        self.defaultActionParam = defaults(defaultParam, self.defaultActionParam);
        return this;
      };


      /**
       * method for support refreshing with timer
      #
       */

      Plugin.prototype.refreshWithTimer = function(actionParam) {
        var self, timer;
        self = myGsn.Advertising;
        if (actionParam == null) {
          actionParam = {
            evtname: 'refresh-timer'
          };
        }
        self.refresh(actionParam, true);
        timer = (self.timer || 0) * 1000;
        if (timer > 0) {
          setTimeout(self.refreshWithTimer, timer);
        }
        return this;
      };


      /**
       * the onload method, document ready friendly
      #
       */

      Plugin.prototype.load = function(gsnid, isDebug) {
        var self;
        self = myGsn.Advertising;
        if (gsnid) {
          self.gsnid = gsnid;
          if (!self.isDebug) {
            self.isDebug = isDebug;
          }
        }
        return self.refreshWithTimer({
          evtname: 'loading'
        });
      };

      return Plugin;

    })();
    myPlugin = new Plugin;
    myGsn.Advertising = myPlugin;
    myGsn.Advertising.brickRedirect = myPlugin.clickBrickOffer;
    myGsn.Advertising.clickBrand = myPlugin.clickBrand;
    myGsn.Advertising.clickThru = myPlugin.clickProduct;
    myGsn.Advertising.refreshAdPods = myPlugin.refresh;
    myGsn.Advertising.logAdImpression = function() {};
    myGsn.Advertising.logAdRequest = function() {};
    myGsn.Advertising.promotionRedirect = myPlugin.clickPromotion;
    myGsn.Advertising.verifyClickThru = myPlugin.clickLink;
    myGsn.Advertising.recipeRedirect = myPlugin.clickRecipe;
    win.Gsn = myGsn;
    buildQueryString = function(keyWord, keyValue) {
      if (keyValue !== null) {
        keyValue = new String(keyValue);
        if (keyWord !== 'ProductDescription') {
          keyValue = keyValue.replace(/&/, '`');
        }
        return keyWord + '=' + keyValue.toString();
      } else {
        return '';
      }
    };
    if ((gsnContext != null)) {
      myGsn.Advertising.on('clickRecipe', function(data) {
        if (data.type !== 'gsnevent:clickRecipe') {
          return;
        }
        win.location.replace('/Recipes/RecipeFull.aspx?recipeid=' + data.detail.RecipeId);
      });
      myGsn.Advertising.on('clickProduct', function(data) {
        var product, queryString;
        if (data.type !== 'gsnevent:clickProduct') {
          return;
        }
        product = data.detail;
        if (product) {
          queryString = new String('');
          queryString += buildQueryString('DepartmentID', product.CategoryId);
          queryString += '~';
          queryString += buildQueryString('BrandName', product.BrandName);
          queryString += '~';
          queryString += buildQueryString('ProductDescription', product.Description);
          queryString += '~';
          queryString += buildQueryString('ProductCode', product.ProductCode);
          queryString += '~';
          queryString += buildQueryString('DisplaySize', product.DisplaySize);
          queryString += '~';
          queryString += buildQueryString('RegularPrice', product.RegularPrice);
          queryString += '~';
          queryString += buildQueryString('CurrentPrice', product.CurrentPrice);
          queryString += '~';
          queryString += buildQueryString('SavingsAmount', product.SavingsAmount);
          queryString += '~';
          queryString += buildQueryString('SavingsStatement', product.SavingsStatement);
          queryString += '~';
          queryString += buildQueryString('Quantity', product.Quantity);
          queryString += '~';
          queryString += buildQueryString('AdCode', product.AdCode);
          queryString += '~';
          queryString += buildQueryString('CreativeID', product.CreativeId);
          if (typeof AddAdToShoppingList === 'function') {
            AddAdToShoppingList(queryString);
          }
        }
      });
      myGsn.Advertising.on('clickLink', function(data) {
        var linkData;
        if (data.type !== 'gsnevent:clickLink') {
          return;
        }
        linkData = data.detail;
        if (linkData) {
          if (linkData.Target === void 0 || linkData.Target === '') {
            linkData.Target = '_top';
          }
          if (linkData.Target === '_blank') {
            win.open(linkData.Url);
          } else {
            win.location.replace(linkData.Url);
          }
        }
      });
      myGsn.Advertising.on('clickPromotion', function(data) {
        var linkData;
        if (data.type !== 'gsnevent:clickPromotion') {
          return;
        }
        linkData = data.detail;
        if (linkData) {
          win.location.replace('/Ads/Promotion.aspx?adcode=' + linkData.AdCode);
        }
      });
      myGsn.Advertising.on('clickBrickOffer', function(data) {
        var linkData, url;
        if (data.type !== 'gsnevent:clickBrickOffer') {
          return;
        }
        linkData = data.detail;
        if (linkData) {
          url = myGsn.Advertising.apiUrl + '/profile/BrickOffer/' + gsnContext.ConsumerID + '/' + linkData.OfferCode;
          win.open(url, '');
        }
      });
    }
    aPlugin = myGsn.Advertising;
    if (!aPlugin) {
      return;
    }
    attrs = {
      debug: function(value) {
        if (typeof value !== "string") {
          return;
        }
        return aPlugin.isDebug = value !== "false";
      },
      api: function(value) {
        if (typeof value !== "string") {
          return;
        }
        return aPlugin.apiUrl = value;
      },
      source: function(value) {
        if (typeof value !== "string") {
          return;
        }
        return aPlugin.source = value;
      },
      gsnid: function(value) {
        if (!value) {
          return;
        }
        aPlugin.gsnid = value;
        return trakless.setSiteId(value);
      },
      timer: function(value) {
        if (!value) {
          return;
        }
        return aPlugin.timer = value;
      },
      selector: function(value) {
        if (typeof value !== "string") {
          return;
        }
        return aPlugin.selector = value;
      }
    };
    ref = doc.getElementsByTagName("script");
    for (i = 0, len = ref.length; i < len; i++) {
      script = ref[i];
      if (/gsndfp/i.test(script.src)) {
        ref1 = ['', 'data-'];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          prefix = ref1[j];
          for (k in attrs) {
            fn = attrs[k];
            fn(script.getAttribute(prefix + k));
          }
        }
      }
    }
    trakless.setPixel('//pi.gsngrocers.com/pi.gif');
    if (aPlugin.hasGsnUnit()) {
      aPlugin.load();
    } else {
      trakless.util.ready(function() {
        return aPlugin.load();
      });
    }
    return;
    return module.exports = myGsn;
  })(window);

}).call(this);

}, {"defaults":2,"trakless":3,"./gsndfpfactory.coffee":4}],
2: [function(require, module, exports) {
'use strict';

/**
 * Merge default values.
 *
 * @param {Object} dest
 * @param {Object} defaults
 * @return {Object}
 * @api public
 */
var defaults = function (dest, src, recursive) {
  for (var prop in src) {
    if (recursive && dest[prop] instanceof Object && src[prop] instanceof Object) {
      dest[prop] = defaults(dest[prop], src[prop], true);
    } else if (! (prop in dest)) {
      dest[prop] = src[prop];
    }
  }

  return dest;
};

/**
 * Expose `defaults`.
 */
module.exports = defaults;

}, {}],
3: [function(require, module, exports) {
(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
(function() {
  var $defaultTracker, $pixel, $siteid, $trakless2, attrs, fn, i, j, k, len, len1, myutil, prefix, ref, ref1, script, tracker, trakless, traklessParent, win, xstore;

  win = window;

  tracker = require('./tracker.coffee');

  myutil = require('./myutil.coffee');

  xstore = require('xstore');

  $defaultTracker = null;

  $siteid = 0;

  $pixel = '/pixel.gif';


  /**
   * tracker factory
  #
   */

  trakless = (function() {
    function trakless() {}


    /**
     * set default siteid
    #
     * @param {Number} siteid - the site id
     * @return {Object}
     */

    trakless.setSiteId = function(siteid) {
      $siteid = siteid > 0 ? siteid : $siteid;
    };


    /**
     * set default pixel
    #
     * @param {String} pixel - the default pixel url
     * @return {Object}
     */

    trakless.setPixel = function(pixelUrl) {
      $pixel = pixelUrl || $pixel;
    };


    /**
     * the storage
    #
     * @return {Object}
     */

    trakless.store = xstore;


    /**
     * you can provide different siteid and pixelUrl for in multi-tracker and site scenario
    #
     * @param {Number} siteid - the siteid
     * @param {String} pixelUrl - the pixel url
     * @return {Object}
     */

    trakless.getTracker = function(siteid, pixelUrl) {
      var rst;
      rst = new tracker(siteid, pixelUrl);
      rst.siteid = siteid || $siteid;
      rst.pixel = pixelUrl || $pixel;
      rst.store = xstore;
      return rst;
    };


    /**
     * get the default racker
    #
     */

    trakless.getDefaultTracker = function() {
      if ($defaultTracker == null) {
        $defaultTracker = trakless.getTracker();
      }
      return $defaultTracker;
    };


    /**
     * utility
    #
     */

    trakless.util = myutil;

    return trakless;

  })();

  $trakless2 = trakless;

  if (win.top !== win) {
    try {
      traklessParent = win.top.trakless;
      $trakless2 = traklessParent;
    } catch (_error) {
      $trakless2 = win.parent.trakless;
    }
  }

  trakless.util.trakless2 = $trakless2;

  attrs = {
    site: function(value) {
      return trakless.setSiteId(value);
    },
    pixel: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return trakless.setPixel(value);
    }
  };

  ref = win.document.getElementsByTagName("script");
  for (i = 0, len = ref.length; i < len; i++) {
    script = ref[i];
    if (/trakless/i.test(script.src)) {
      ref1 = ['', 'data-'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        prefix = ref1[j];
        for (k in attrs) {
          fn = attrs[k];
          fn(script.getAttribute(prefix + k));
        }
      }
    }
  }

  win.trakless = trakless;

  module.exports = trakless;

}).call(this);

}, {"./tracker.coffee":2,"./myutil.coffee":3,"xstore":4}],
2: [function(require, module, exports) {
(function() {
  var $defaults, $sessionid, Emitter, cookie, defaults, getImage, initStorage, myutil, query, trackIt, tracker, uuid, webanalyser;

  defaults = require('defaults');

  cookie = require('cookie');

  Emitter = require('emitter');

  query = require('querystring');

  uuid = require('uuid');

  webanalyser = require('webanalyser');

  myutil = require('./myutil.coffee');

  $defaults = null;

  $sessionid = cookie('trakless:usid');

  if ($sessionid == null) {
    $sessionid = new Date().getTime();
    cookie('tls:usid', $sessionid, {
      path: '/'
    });
  }


  /**
   * Send image request to server using GET.
   * The infamous web bug (or beacon) is a transparent, single pixel (1x1) image
  #
   */

  getImage = function(cfgUrl, request, callback) {
    var image;
    image = new Image(1, 1);
    image.onload = function() {
      var iterator;
      iterator = 0;
      if (typeof callback === 'function') {
        callback();
      }
    };
    image.src = cfgUrl + (cfgUrl.indexOf('?') < 0 ? '?' : '&') + request;
    return image;
  };

  initStorage = (function(_this) {
    return function(pixel) {};
  })(this);

  trackIt = (function(_this) {
    return function(myData) {};
  })(this);


  /**
   * tracker class
  #
   */

  tracker = (function() {
    function tracker() {}

    tracker.prototype.defaults = webanalyser.getResult();

    tracker.prototype.pixel = '/pixel.gif';

    tracker.prototype.siteid = 0;

    tracker.prototype.store = null;

    tracker.prototype.uuid = null;

    tracker.prototype._trackit = function(myData, pixel) {
      var self;
      self = this;
      myData.uuid = self.uuid;
      myData.siteid = self.siteid;
      myData.usid = $sessionid;
      getImage(pixel, query.stringify(myData));
      self.emit('track', myData.ht, myData);
      return self;
    };

    tracker.prototype._track = function(ht, extra) {
      var data, i, k, len, myData, myDef, pixel, self, v;
      self = this;
      if (extra == null) {
        extra = {};
      }
      if (self.siteid > 0) {
        pixel = myutil.trim(this.pixel);
        myDef = self.defaults;
        if ((pixel.indexOf('//') === 0) && (myDef.dl.indexOf('http') !== 0)) {
          pixel = 'http:' + pixel;
        }
        initStorage(pixel);
        data = ht === 'pageview' ? defaults(extra, myDef) : extra;
        myData = {};
        for (v = i = 0, len = data.length; i < len; v = ++i) {
          k = data[v];
          if (v != null) {
            if (!(typeof v === "string") || (myutil.trim(v).length > 0)) {
              myData[k] = v;
            }
          }
        }
        myData.z = new Date().getTime();
        myData.ht = ht;
        if (!self.uuid) {
          self.uuid = uuid();
        }
        if (self.store != null) {
          self.store.get('trakless-uuid').then(function(id) {
            if (!id) {
              self.store.set('trakless-uuid', self.uuid);
            }
            self.uuid = id || self.uuid;
            return self._trackit(myData, pixel);
          });
        } else {
          self._trackit(myData, pixel);
        }
      }
      return this;
    };


    /**
     * track generic method
    #
     * @param {String} ht - hit types with possible values of 'pageview', 'event', 'transaction', 'item', 'social', 'exception', 'timing', 'app', 'custom'
     * @param {Object} extra - extended data
     * @return {Object}
     */

    tracker.prototype.track = function(ht, extra) {
      var self;
      self = this;
      myutil.ready(function() {
        return self._track(ht || 'custom', extra);
      });
      return this;
    };


    /**
     * track pageview
    #
     * @param {Object} extra - extended data
     * @return {Object}
     */

    tracker.prototype.trackPageView = function(extra) {
      return this.track('pageview', extra);
    };


    /**
     * track event
    #
     * @param {String} category
     * @param {String} action
     * @param {String} label
     * @param {String} value - Values must be non-negative.
     * @return {Object}
     */

    tracker.prototype.trackEvent = function(category, action, label, value) {
      if (value && value < 0) {
        value = null;
      }
      return this.track('event', {
        ec: category || 'event',
        ea: action,
        el: label,
        ev: value
      });
    };


    /**
     * track item
    #
     * @param {String} id - *required* [OD564]
     * @param {Number} name - *required* [Shoe] Specifies the item name.
     * @param {Number} price [3.50] Specifies the price for a single item / unit.
     * @param {Number} quantity [4] Specifies the number of items purchased.
     * @param {String} code [SKU47] Specifies the SKU or item code.
     * @param {String} category [Blue] Specifies the category that the item belongs to.
     * @param {String} currencycode [EUR] When present indicates the local currency for all transaction currency values. Value should be a valid ISO 4217 currency code.
     * @return {Object}
     */

    tracker.prototype.trackItemOrTransaction = function(id, name, price, quantity, code, category, currencycode) {
      return this.track('item', {
        ti: id,
        "in": name,
        ip: price,
        iq: quantity,
        ic: code,
        iv: category,
        cu: currencycode
      });
    };


    /**
     * track transaction
    #
     * @param {String} id - *required* [OD564]
     * @param {String} affiliation [Member] Specifies the affiliation or store name.
     * @param {Number} revenue [15.47] Specifies the total revenue associated with the transaction. This value should include any shipping or tax costs.
     * @param {Number} shipping [3.50] Specifies the total shipping cost of the transaction.
     * @param {Number} tax [1.20] Specifies the total tax of the transaction.
     * @param {Number} price [3.50] Specifies the price for a single item / unit.
     * @param {Number} quantity [4] Specifies the number of items purchased.
     * @param {String} code [SKU47] Specifies the SKU or item code.
     * @param {String} category [Blue] Specifies the category that the item belongs to.
     * @param {String} currencycode [EUR] When present indicates the local currency for all transaction currency values. Value should be a valid ISO 4217 currency code.
     * @return {Object}
     */

    tracker.prototype.trackTransaction = function(id, affiliation, revenue, shipping, tax, name, price, quantity, code, category, currencycode) {
      return this.track('transaction', {
        ti: id,
        ta: affiliation,
        tr: revenue,
        ts: shipping,
        tt: tax,
        "in": name,
        ip: price,
        iq: quantity,
        ic: code,
        iv: category,
        cu: currencycode
      });
    };


    /**
     * track social
    #
     * @param {String} network - *required* [facebook] Specifies the social network, for example Facebook or Google Plus.
     * @param {String} action - *required* [like] Specifies the social interaction action. For example on Google Plus when a user clicks the +1 button, the social action is 'plus'.
     * @param {String} target - *required* [http://foo.com] Specifies the target of a social interaction. This value is typically a URL but can be any text.
     * @return {Object}
     */

    tracker.prototype.trackSocial = function(network, action, target) {
      return this.track('social', {
        sn: network,
        sa: action,
        st: target
      });
    };


    /**
     * track exception
    #
     * @param {String} description - Specifies the description of an exception.
     * @param {String} isFatal - true/false Specifies whether the exception was fatal.
     * @return {Object}
     */

    tracker.prototype.trackException = function(description, isFatal) {
      return this.track('exception', {
        exf: isFatal ? 1 : 0,
        exd: description
      });
    };


    /**
     * track app
    #
     * @param {String} name - *required* [MyApp] Specifies the application name.
     * @param {String} id - *required* [com.company.app] Application identifier.
     * @param {String} version - *required* [1.2] Specifies the application version.
     * @param {String} installerid - *required* com.platform.vending
     * @return {Object}
     */

    tracker.prototype.trackApp = function(name, id, version, installerid) {
      return this.track('app', {
        an: name,
        aid: id,
        av: version,
        aiid: installer
      });
    };


    /**
     * track custom
    #
     * @param {Object} customDataObject - object with any property you want
     * @return {Object}
     */

    tracker.prototype.trackCustom = function(customDataObject) {
      return this.track('custom', customDataObject);
    };

    return tracker;

  })();

  Emitter(tracker.prototype);

  module.exports = tracker;

}).call(this);

}, {"defaults":5,"cookie":6,"emitter":7,"querystring":8,"uuid":9,"webanalyser":10,"./myutil.coffee":3}],
5: [function(require, module, exports) {
'use strict';

/**
 * Merge default values.
 *
 * @param {Object} dest
 * @param {Object} defaults
 * @return {Object}
 * @api public
 */
var defaults = function (dest, src, recursive) {
  for (var prop in src) {
    if (recursive && dest[prop] instanceof Object && src[prop] instanceof Object) {
      dest[prop] = defaults(dest[prop], src[prop], true);
    } else if (! (prop in dest)) {
      dest[prop] = src[prop];
    }
  }

  return dest;
};

/**
 * Expose `defaults`.
 */
module.exports = defaults;

}, {}],
6: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var debug = require('debug')('cookie');

/**
 * Set or get cookie `name` with `value` and `options` object.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @return {Mixed}
 * @api public
 */

module.exports = function(name, value, options){
  switch (arguments.length) {
    case 3:
    case 2:
      return set(name, value, options);
    case 1:
      return get(name);
    default:
      return all();
  }
};

/**
 * Set cookie `name` to `value`.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @api private
 */

function set(name, value, options) {
  options = options || {};
  var str = encode(name) + '=' + encode(value);

  if (null == value) options.maxage = -1;

  if (options.maxage) {
    options.expires = new Date(+new Date + options.maxage);
  }

  if (options.path) str += '; path=' + options.path;
  if (options.domain) str += '; domain=' + options.domain;
  if (options.expires) str += '; expires=' + options.expires.toUTCString();
  if (options.secure) str += '; secure';

  document.cookie = str;
}

/**
 * Return all cookies.
 *
 * @return {Object}
 * @api private
 */

function all() {
  return parse(document.cookie);
}

/**
 * Get cookie `name`.
 *
 * @param {String} name
 * @return {String}
 * @api private
 */

function get(name) {
  return all()[name];
}

/**
 * Parse cookie `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parse(str) {
  var obj = {};
  var pairs = str.split(/ *; */);
  var pair;
  if ('' == pairs[0]) return obj;
  for (var i = 0; i < pairs.length; ++i) {
    pair = pairs[i].split('=');
    obj[decode(pair[0])] = decode(pair[1]);
  }
  return obj;
}

/**
 * Encode.
 */

function encode(value){
  try {
    return encodeURIComponent(value);
  } catch (e) {
    debug('error `encode(%o)` - %o', value, e)
  }
}

/**
 * Decode.
 */

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    debug('error `decode(%o)` - %o', value, e)
  }
}

}, {"debug":11}],
11: [function(require, module, exports) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Use chrome.storage.local if we are in an app
 */

var storage;

if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined')
  storage = chrome.storage.local;
else
  storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      storage.removeItem('debug');
    } else {
      storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

}, {"./debug":12}],
12: [function(require, module, exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

}, {"ms":13}],
13: [function(require, module, exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

}, {}],
7: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

}, {"indexof":14}],
14: [function(require, module, exports) {
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
}, {}],
8: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var encode = encodeURIComponent;
var decode = decodeURIComponent;
var trim = require('trim');
var type = require('type');

/**
 * Parse the given query `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if ('string' != typeof str) return {};

  str = trim(str);
  if ('' == str) return {};
  if ('?' == str.charAt(0)) str = str.slice(1);

  var obj = {};
  var pairs = str.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var parts = pairs[i].split('=');
    var key = decode(parts[0]);
    var m;

    if (m = /(\w+)\[(\d+)\]/.exec(key)) {
      obj[m[1]] = obj[m[1]] || [];
      obj[m[1]][m[2]] = decode(parts[1]);
      continue;
    }

    obj[parts[0]] = null == parts[1]
      ? ''
      : decode(parts[1]);
  }

  return obj;
};

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

exports.stringify = function(obj){
  if (!obj) return '';
  var pairs = [];

  for (var key in obj) {
    var value = obj[key];

    if ('array' == type(value)) {
      for (var i = 0; i < value.length; ++i) {
        pairs.push(encode(key + '[' + i + ']') + '=' + encode(value[i]));
      }
      continue;
    }

    pairs.push(encode(key) + '=' + encode(obj[key]));
  }

  return pairs.join('&');
};

}, {"trim":15,"type":16}],
15: [function(require, module, exports) {

exports = module.exports = trim;

function trim(str){
  if (str.trim) return str.trim();
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  if (str.trimLeft) return str.trimLeft();
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  if (str.trimRight) return str.trimRight();
  return str.replace(/\s*$/, '');
};

}, {}],
16: [function(require, module, exports) {
/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object Error]': return 'error';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val !== val) return 'nan';
  if (val && val.nodeType === 1) return 'element';

  val = val.valueOf
    ? val.valueOf()
    : Object.prototype.valueOf.apply(val)

  return typeof val;
};

}, {}],
9: [function(require, module, exports) {

/**
 * Taken straight from jed's gist: https://gist.github.com/982883
 *
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f, and
 * y is replaced with a random hexadecimal digit from 8 to b.
 */

module.exports = function uuid(a){
  return a           // if the placeholder was passed, return
    ? (              // a random number from 0 to 15
      a ^            // unless b is 8,
      Math.random()  // in which case
      * 16           // a random number from
      >> a/4         // 8 to 11
      ).toString(16) // in hexadecimal
    : (              // or otherwise a concatenated string:
      [1e7] +        // 10000000 +
      -1e3 +         // -1000 +
      -4e3 +         // -4000 +
      -8e3 +         // -80000000 +
      -1e11          // -100000000000,
      ).replace(     // replacing
        /[018]/g,    // zeroes, ones, and eights with
        uuid         // random hex digits
      )
};
}, {}],
10: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
(function(document, navigator, screen, location) {
  'use strict';
  var $defaults, $endTime, $onLoadHandlers, $startTime, $timeoutId, defaults, flashdetect, result, webanalyser;
  defaults = require('defaults');
  flashdetect = require('flashdetect');
  $startTime = new Date().getTime();
  $endTime = new Date().getTime();
  $timeoutId = null;
  $onLoadHandlers = [];
  $defaults = {
    sr: screen.width + "x" + screen.height,
    vp: screen.availWidth + "x" + screen.availHeight,
    sd: screen.colorDepth,
    je: navigator.javaEnabled ? navigator.javaEnabled() : false,
    ul: navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage || navigator.browserLanguage
  };

  /**
   * webanalyser
   */
  webanalyser = (function() {
    function webanalyser() {}

    webanalyser.prototype.getResult = function() {
      var rst;
      if (defaults.dl == null) {
        rst = {
          dr: document.referrer,
          dl: location.href,
          dh: location.hostname,
          dt: document.title,
          z: new Date().getTime()
        };
        if (flashdetect.installed) {
          rst.fl = flashdetect.major + " " + flashdetect.minor + " " + flashdetect.revisionStr;
        }
        $defaults = defaults(rst, $defaults);
      }
      return $defaults;
    };

    return webanalyser;

  })();
  result = new webanalyser();
  return module.exports = result;
})(document, navigator, screen, location);

}, {"defaults":5,"flashdetect":17}],
17: [function(require, module, exports) {
/*
Copyright (c) Copyright (c) 2007, Carl S. Yestrau All rights reserved.
Code licensed under the BSD License: http://www.featureblend.com/license.txt
Version: 1.0.4
*/
var flashdetect = new function(){
    var self = this;
    self.installed = false;
    self.raw = "";
    self.major = -1;
    self.minor = -1;
    self.revision = -1;
    self.revisionStr = "";
    var activeXDetectRules = [
        {
            "name":"ShockwaveFlash.ShockwaveFlash.7",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash.6",
            "version":function(obj){
                var version = "6,0,21";
                try{
                    obj.AllowScriptAccess = "always";
                    version = getActiveXVersion(obj);
                }catch(err){}
                return version;
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        }
    ];
    /**
     * Extract the ActiveX version of the plugin.
     * 
     * @param {Object} The flash ActiveX object.
     * @type String
     */
    var getActiveXVersion = function(activeXObj){
        var version = -1;
        try{
            version = activeXObj.GetVariable("$version");
        }catch(err){}
        return version;
    };
    /**
     * Try and retrieve an ActiveX object having a specified name.
     * 
     * @param {String} name The ActiveX object name lookup.
     * @return One of ActiveX object or a simple object having an attribute of activeXError with a value of true.
     * @type Object
     */
    var getActiveXObject = function(name){
        var obj = -1;
        try{
            obj = new ActiveXObject(name);
        }catch(err){
            obj = {activeXError:true};
        }
        return obj;
    };
    /**
     * Parse an ActiveX $version string into an object.
     * 
     * @param {String} str The ActiveX Object GetVariable($version) return value. 
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     * @type Object
     */
    var parseActiveXVersion = function(str){
        var versionArray = str.split(",");//replace with regex
        return {
            "raw":str,
            "major":parseInt(versionArray[0].split(" ")[1], 10),
            "minor":parseInt(versionArray[1], 10),
            "revision":parseInt(versionArray[2], 10),
            "revisionStr":versionArray[2]
        };
    };
    /**
     * Parse a standard enabledPlugin.description into an object.
     * 
     * @param {String} str The enabledPlugin.description value.
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     * @type Object
     */
    var parseStandardVersion = function(str){
        var descParts = str.split(/ +/);
        var majorMinor = descParts[2].split(/\./);
        var revisionStr = descParts[3];
        return {
            "raw":str,
            "major":parseInt(majorMinor[0], 10),
            "minor":parseInt(majorMinor[1], 10), 
            "revisionStr":revisionStr,
            "revision":parseRevisionStrToInt(revisionStr)
        };
    };
    /**
     * Parse the plugin revision string into an integer.
     * 
     * @param {String} The revision in string format.
     * @type Number
     */
    var parseRevisionStrToInt = function(str){
        return parseInt(str.replace(/[a-zA-Z]/g, ""), 10) || self.revision;
    };
    /**
     * Is the major version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required major version.
     * @type Boolean
     */
    self.majorAtLeast = function(version){
        return self.major >= version;
    };
    /**
     * Is the minor version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required minor version.
     * @type Boolean
     */
    self.minorAtLeast = function(version){
        return self.minor >= version;
    };
    /**
     * Is the revision version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required revision version.
     * @type Boolean
     */
    self.revisionAtLeast = function(version){
        return self.revision >= version;
    };
    /**
     * Is the version greater than or equal to a specified major, minor and revision.
     * 
     * @param {Number} major The minimum required major version.
     * @param {Number} (Optional) minor The minimum required minor version.
     * @param {Number} (Optional) revision The minimum required revision version.
     * @type Boolean
     */
    self.versionAtLeast = function(major){
        var properties = [self.major, self.minor, self.revision];
        var len = Math.min(properties.length, arguments.length);
        for(i=0; i<len; i++){
            if(properties[i]>=arguments[i]){
                if(i+1<len && properties[i]==arguments[i]){
                    continue;
                }else{
                    return true;
                }
            }else{
                return false;
            }
        }
    };
    /**
     * Constructor, sets raw, major, minor, revisionStr, revision and installed public properties.
     */
    self.flashdetect = function(){
        if(navigator.plugins && navigator.plugins.length>0){
            var type = 'application/x-shockwave-flash';
            var mimeTypes = navigator.mimeTypes;
            if(mimeTypes && mimeTypes[type] && mimeTypes[type].enabledPlugin && mimeTypes[type].enabledPlugin.description){
                var version = mimeTypes[type].enabledPlugin.description;
                var versionObj = parseStandardVersion(version);
                self.raw = versionObj.raw;
                self.major = versionObj.major;
                self.minor = versionObj.minor; 
                self.revisionStr = versionObj.revisionStr;
                self.revision = versionObj.revision;
                self.installed = true;
            }
        }else if(navigator.appVersion.indexOf("Mac")==-1 && window.execScript){
            var version = -1;
            for(var i=0; i<activeXDetectRules.length && version==-1; i++){
                var obj = getActiveXObject(activeXDetectRules[i].name);
                if(!obj.activeXError){
                    self.installed = true;
                    version = activeXDetectRules[i].version(obj);
                    if(version!=-1){
                        var versionObj = parseActiveXVersion(version);
                        self.raw = versionObj.raw;
                        self.major = versionObj.major;
                        self.minor = versionObj.minor; 
                        self.revision = versionObj.revision;
                        self.revisionStr = versionObj.revisionStr;
                    }
                }
            }
        }
    }();
};
flashdetect.JS_RELEASE = "1.0.4";

module.exports = flashdetect;

}, {}],
3: [function(require, module, exports) {
(function() {
  (function(win) {
    var cookie, doc, domevent, myutil;
    domevent = require('domevent');
    cookie = require('cookie');
    doc = win.document;

    /**
     *  util
     */
    myutil = (function() {
      function myutil() {}

      myutil.trakless2 = null;


      /**
       * allow for getting all attributes
      #
       * @param {HTMLElement} el - element
       * @return {Object}
       */

      myutil.allData = function(el) {
        var attr, camelCaseName, data, i, k, len, name, ref;
        data = {};
        ref = el.attributes;
        for (k = i = 0, len = ref.length; i < len; k = ++i) {
          attr = ref[k];
          name = attr.name.replace(/^data-/g, '');
          camelCaseName = name.replace(/-(.)/g, function($0, $1) {
            return $1.toUpperCase();
          });
          data[camelCaseName] = attr.value;
        }
        return data;
      };


      /**
       * mini jquery
      #
       */

      myutil.$ = domevent;


      /**
       * attach to event
      #
       * @param {String} ename - event name
       * @param {Function} cb - callback
       * @return {Object}
       */

      myutil.on = function(ename, cb) {
        domevent(doc).on(ename, cb);
        return this;
      };


      /**
       * detach event
      #
       * @param {String} ename - event name
       * @param {Function} cb - callback
       * @return {Object}
       */

      myutil.off = function(ename, cb) {
        domevent(doc).off(ename, cb);
        return this;
      };


      /**
       * trigger event
      #
       * @param {String} ename - event name
       * @param {Object} edata - event data
       * @return {Object}
       */

      myutil.trigger = function(ename, edata) {
        if (this.trakless2 && this.trakless2.util) {
          this.trakless2.util.$.trigger({
            type: ename,
            detail: edata
          });
        }
        return this;
      };


      /**
       * parse a string to JSON, return string if fail
      #
       * @param {String} v - string value
       * @return {Object}
       */

      myutil.stringToJSON = function(v) {
        var v2;
        if (typeof v === "string") {
          v2 = domevent.parseJSON(v);
          if (!(v2 == null)) {
            return v2;
          }
        }
        return v;
      };


      /**
       * get or set session data - store in cookie
       * if no value is provided, then it is a get
      #
       * @param {String} k - key
       * @param {Object} v - value
       * @return {Object}
       */

      myutil.session = function(k, v) {
        if ((v != null)) {
          if (!(typeof v === "string")) {
            v = domevent.toJSON(v);
          }
          cookie('tls:' + k, v, {
            path: '/'
          });
          return v;
        }
        v = cookie('tls:' + k);
        if (typeof v === 'undefined') {
          return v;
        }
        return myutil.stringToJSON(v);
      };


      /**
       * click listener - useful util for click tracking
      #
       * @param {String} el - element or parent
       * @param {Function} handler - function handler
       * @param {String} monitor - selector/query of child to monitor
       * @return {Object}
       */

      myutil.onClick = function(el, handler, monitor) {
        domevent(el).on('click', handler, monitor);
        return this;
      };


      /**
       * document ready
      #
       */

      myutil.ready = domevent.ready;


      /**
       * trim
      #
       */

      myutil.trim = function(v) {
        return v.replace(/^\s+|\s+$/gm, '');
      };


      /**
       * set a class
      #
       */

      myutil.setClass = function(el, cls) {
        return domevent(el).set('$', cls);
      };

      return myutil;

    })();
    return module.exports = myutil;
  })(window);

}).call(this);

}, {"domevent":18,"cookie":6}],
18: [function(require, module, exports) {
myObj = null
mydefine = function(h, F){
	myObj = F().$;
};
// minified.js config start -- use this comment to re-create a configuration in the Builder
// - Only sections add, always, each, error, get, ht, 
// - ie6compatibility, ie7compatibility, ie8compatibility, ie9compatibility, off, on, onclick, 
// - parsejson, promise, ready, remove, request, set, template, tojson, trigger, 
// - values, wait.


mydefine("minified",function(){function U(a){return a.substr(0,3)}function F(a){return a!=g?""+a:""}function A(a){return"string"==typeof a}function D(a){return a&&a.nodeType}function G(a){return a}function m(a,b,c){return F(a).replace(b,c!=g?c:"")}function H(a){return m(a,/^\s+|\s+$/g)}function B(a,b,c){for(var d in a)a.hasOwnProperty(d)&&b.call(c||a,d,a[d]);return a}function q(a,b,c){if(a)for(var d=0;d<a.length;d++)b.call(c||a,a[d],d);return a}function V(a,b){var c=[],d=n(b)?b:function(a){return b!=
a};q(a,function(b,f){d.call(a,b,f)&&c.push(b)});return c}function y(a,b,c){var d=[];a(b,function(a,f){r(a=c.call(b,a,f))?q(a,function(a){d.push(a)}):a!=g&&d.push(a)});return d}function C(a,b){var c=[];q(a,function(d,e){c.push(b.call(a,d,e))});return c}function J(a,b){var c=b||{},d;for(d in a)c[d]=a[d];return c}function W(a,b,c){return b==g?c:0>b?Math.max(a.length+b,0):Math.min(a.length,b)}function K(a,b,c){if(n(a))return a.apply(c&&b,C(c||b,G))}function X(a){C(a,function(a){return K(a,void 0,void 0)})}
function P(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}function Y(a){return m(a,/[\x00-\x1f'"\u2028\u2029]/g,P)}function I(a,b){for(var c=0,d,e=[];d=b.exec(a);)e.push(a.substring(c,d.index)),c=d.index+d[0].length;e.push(a.substr(c));return e}function Z(a,b){function c(a,c){var d=[];e.call(c||a,a,function(a,c){r(a)?q(a,function(a,b){c.call(a,a,b)}):B(a,function(a,b){c.call(b,a,b)})},b||G,function(){K(d.push,d,arguments)},ba);return d.join("")}if(L[a])return L[a];var d="with(_.isObject(obj)?obj:{}){"+
C(I(a,/{{|}}}?/g),function(a,c){var b,d=H(a),e=m(d,/^{/),d=d==e?"esc(":"";if(c%2)return(b=/^each\b(\s+([\w_]+(\s*,\s*[\w_]+)?)\s*:)?(.*)/.exec(e))?"each("+(H(b[4])?b[4]:"this")+", function("+b[2]+"){":(b=/^if\b(.*)/.exec(e))?"if("+b[1]+"){":(b=/^else\b\s*(if\b(.*))?/.exec(e))?"}else "+(b[1]?"if("+b[2]+")":"")+"{":(b=/^\/(if)?/.exec(e))?b[1]?"}\n":"});\n":(b=/^(var\s.*)/.exec(e))?b[1]+";":(b=/^#(.*)/.exec(e))?b[1]:(b=/(.*)::\s*(.*)/.exec(e))?"print("+d+'_.formatValue("'+Y(b[2])+'",'+(H(b[1])?b[1]:
"this")+(d&&")")+"));\n":"print("+d+(H(e)?e:"this")+(d&&")")+");\n";if(a)return'print("'+Y(a)+'");\n'}).join("")+"}",e=new Function("obj","each","esc","print","_",d);99<ca.push(c)&&delete L[ca.shift()];return L[a]=c}function ka(a){return m(a,/[<>'"&]/g,function(a){return"&#"+a.charCodeAt(0)+";"})}function da(a,b){return Z(a,ka)(b)}function n(a){return"function"==typeof a&&!a.item}function r(a){return a&&a.length!=g&&!A(a)&&!D(a)&&!n(a)&&a!==p}function ea(a,b){for(var c=0;a&&c<a.length;c++)a[c]===
b&&a.splice(c--,1)}function M(a){return a.Nia=a.Nia||++la}function fa(a,b){var c=[],d={},e;l(a,function(a){l(b(a),function(a){d[e=M(a)]||(c.push(a),d[e]=!0)})});return c}function ma(a,b,c,d,e,f){return function(h,k){var g,u=h||p.event,aa=!f,z=k||u.target||u.srcElement;if(f)for(;z&&z!=b&&!(aa=f(z));)z=z.parentNode;aa&&(g=(!a.apply(t(f?z:b),c||[u,d])||""==e)&&"|"!=e)&&!k&&(u.preventDefault&&(u.preventDefault(),u.stopPropagation()),u.cancelBubble=!0);return!g}}function Q(a,b){l(b,function(a){a.element.detachEvent("on"+
a.a,a.b)})}function ga(a){E?E.push(a):setTimeout(a,0)}function ha(a){return y(l,a,function(a){if(r(a))return ha(a);D(a)&&(a=a.cloneNode(!0),a.removeAttribute&&a.removeAttribute("id"));return a})}function t(a,b,c){return n(a)?ga(a):new N(v(a,b,c))}function v(a,b,c){function d(a){a=y(l,a,function z(a){return r(a)?y(l,a,z):a});return f?V(a,function(a){for(;a=a.parentNode;)if(a==f||c)return a==f}):a}function e(a,b){var c=RegExp("(^|\\s+)"+a+"(?=$|\\s)","i");return function(d){return a?c.test(d[b]):!0}}
var f,h,k,g;if(b&&1!=(b=v(b)).length)return fa(b,function(b){return v(a,b,c)});f=b&&b[0];if(!A(a))return d(a);if(f&&1!=D(f))return[];if(1<(b=a.split(/\s*,\s*/)).length)return fa(b,function(a){return v(a,f,c)});if(b=/(\S+)\s+(.+)$/.exec(a))return v(b[2],v(b[1],f),c);if(a!=(b=m(a,/^#/)))return d(document.getElementById(b));h=(b=/([\w-]*)\.?([\w-]*)/.exec(a))[1];g=b[2];b=(k=document.getElementsByClassName&&g)?(f||document).getElementsByClassName(g):(f||document).getElementsByTagName(h||"*");if(h=k?h:
g)b=V(b,e(h,k?"tagName":"className"));return c?d(b):b}function na(a,b){function c(a,b){var c=RegExp("(^|\\s+)"+a+"(?=$|\\s)","i");return function(d){return a?c.test(d[b]):!0}}var d={},e=d;if(n(a))return a;if("number"==typeof a)return function(b,c){return c==a};if(!a||"*"==a||A(a)&&(e=/^([\w-]*)\.?([\w-]*)$/.exec(a))){var f=c(e[1],"tagName"),h=c(e[2],"className");return function(a){return 1==D(a)&&f(a)&&h(a)}}if(b)return function(c){return t(a,b).find(c)!=g};t(a).each(function(a){d[M(a)]=!0});return function(a){return d[M(a)]}}
function l(a,b){r(a)?q(a,b):a!=g&&b(a,0);return a}function O(){function a(a,d){b==g&&a!=g&&(b=a,h=r(d)?d:[d],setTimeout(function(){q(c,function(a){a()})},0));return b}var b,c=[],d=arguments,e=d.length,f=0,h=[];q(d,function u(b,c){try{b.then?b.then(function(b){var d;(b&&"object"==typeof b||n(b))&&n(d=b.then)?u(d,c):(h[c]=C(arguments,G),++f==e&&a(!0,2>e?h[c]:h))},function(b){h[c]=C(arguments,G);a(!1,2>e?h[c]:[h[c][0],h,c])}):b(function(){a(!0,arguments)},function(){a(!1,arguments)})}catch(d){a(!1,[d,
h,c])}});a.stop=function(){q(d,function(a){a.stop&&a.stop()});return K(a.stop0)};var k=a.then=function(d,e){function f(){try{var a=b?d:e;n(a)?function oa(a){try{var b,c=0;if((a&&"object"==typeof a||n(a))&&n(b=a.then)){if(a===k)throw new TypeError;b.call(a,function(a){c++||oa(a)},function(a){c++||k(!1,[a])});k.stop0=a.stop}else k(!0,[a])}catch(d){c++||k(!1,[d])}}(K(a,ia,h)):k(b,h)}catch(c){k(!1,[c])}}var k=O();k.stop0=a.stop;b!=g?setTimeout(f,0):c.push(f);return k};a.always=function(a){return k(a,
a)};a.error=function(a){return k(0,a)};return a}function N(a,b){var c=0;if(a)for(var d=0,e=a.length;d<e;d++){var f=a[d];if(b&&r(f))for(var h=0,k=f.length;h<k;h++)this[c++]=f[h];else this[c++]=f}else this[c++]=b;this.length=c;this._=!0}function ba(){return new N(arguments,!0)}var p=this,R={},S={},la=1,w={},E=/^[ic]/.test(document.readyState)?g:[],x=!!document.all&&!document.addEventListener,g=null,ia,T=I("January,February,March,April,May,June,July,August,September,October,November,December",/,/g);
C(T,U);T=I("Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",/,/g);C(T,U);I("am,pm",/,/g);I("am,am,am,am,am,am,am,am,am,am,am,am,pm,pm,pm,pm,pm,pm,pm,pm,pm,pm,pm,pm",/,/g);var L={},ca=[];J({each:function(a){return function(b,c,d){return a(this,b,c,d)}}(q),e:0,remove:function(){l(this,function(a){x&&1==D(a)&&(l(v("*",a),function(a){Q(0,w[a.Nia]);delete w[a.Nia]}),Q(0,w[a.Nia]),delete w[a.Nia]);a.parentNode.removeChild(a)})},get:function(a,b){var c=this,d=c[0];if(d){if(A(a)){var e=/^(\W*)(.*)/.exec(m(a,
/^%/,"@data-")),f=e[1],d=S[f]?S[f](this,e[2]):"$"==a?c.get("className"):"$$"==a?x?d.style.cssText:c.get("@style"):"$$slide"==a?c.get("$height"):"$$fade"==a||"$$show"==a?"hidden"==c.get("$visibility")||"none"==c.get("$display")?0:"$$fade"==a?x?isNaN(c.get("$filter",!0))?1:c.get("$filter",!0)/100:isNaN(c.get("$opacity",!0))?1:c.get("$opacity",!0):1:"$$scrollX"==a?p.pageXOffset!=g?p.pageXOffset:(document.documentElement||document.body.parentNode||document.body).scrollLeft:"$$scrollY"==a?p.pageXOffset!=
g?p.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:"$"==f?p.getComputedStyle?p.getComputedStyle(d,g).getPropertyValue(m(e[2],/[A-Z]/g,function(a){return"-"+a.toLowerCase()})):(d.currentStyle||d.style)[m(e[2],/^float$/,"cssFloat")]:"@"==f?d.getAttribute(e[2]):d[e[2]];return b?parseFloat(m(d,/^[^\d-]+/)):d}var h={};(r(a)?l:B)(a,function(a){h[a]=c.get(a,b)});return h}},set:function(a,b){var c=this;if(b!==ia){var d=/^(\W*)(.*)/.exec(m(m(a,/^\$float$/,"cssFloat"),
/^%/,"@data-")),e=d[1];if(R[e])R[e](this,d[2],b);else"$$fade"==a?c.set({$visibility:b?"visible":"hidden"}).set(x?1>b?{$filter:"alpha(opacity = "+100*b+")",$zoom:1}:{$filter:""}:{$opacity:b}):"$$slide"==a?c.set({$visibility:b?"visible":"hidden",$overflow:"hidden",$height:/px/.test(b)?b:function(a,c,d){a=t(d);d={$position:"absolute",$visibility:"hidden",$display:"block",$height:g};c=a.get(d);d=a.set(d).get("clientHeight");a.set(c);return d*b+"px"}}):"$$show"==a?b?c.set({$visibility:b?"visible":"hidden",
$display:""}).set({$display:function(a){return"none"==a?"block":a}}):c.set({$display:"none"}):"$$"==a?x?c.set("$cssText",b):c.set("@style",b):l(this,function(c,h){var k=n(b)?b(t(c).get(a),h,c):b;"$"==e?d[2]?c.style[d[2]]=k:l(k&&k.split(/\s+/),function(a){var b=m(a,/^[+-]/),d=c.className||"",e=m(d,RegExp("(^|\\s+)"+b+"(?=$|\\s)"));if(/^\+/.test(a)||b==a&&d==e)e+=" "+b;c.className=H(e)}):"$$scrollX"==a?c.scroll(k,t(c).get("$$scrollY")):"$$scrollY"==a?c.scroll(t(c).get("$$scrollX"),k):"@"==e?k==g?c.removeAttribute(d[2]):
c.setAttribute(d[2],k):c[d[2]]=k})}else A(a)||n(a)?c.set("$",a):B(a,function(a,b){c.set(a,b)});return c},add:function(a,b){return this.each(function(c,d){function e(a){r(a)?l(a,e):n(a)?e(a(c,d)):a!=g&&(a=D(a)?a:document.createTextNode(a),f?f.parentNode.insertBefore(a,f.nextSibling):b?b(a,c,c.parentNode):c.appendChild(a),f=a)}var f;e(d&&!n(a)?ha(a):a)})},values:function(a){var b=a||{};this.each(function(a){var d=a.name||a.id,e=F(a.value);if(/form/i.test(a.tagName))for(d=0;d<a.elements.length;d++)t(a.elements[d]).values(b);
else!d||/ox|io/i.test(a.type)&&!a.checked||(b[d]=b[d]==g?e:y(l,[b[d],e],G))});return b},on:function(a,b,c,d,e){return n(b)?this.on(g,a,b,c,e):A(d)?this.on(a,b,c,g,d):this.each(function(f,h){l(a?v(a,f):f,function(a){l(F(b).split(/\s/),function(b){var f=m(b,/[?|]/),g=!!e&&("blur"==f||"focus"==f),l=ma(c,a,d,h,m(b,/[^?|]/g),e&&na(e,a));b={element:a,b:l,a:f,c:g};(c.M=c.M||[]).push(b);x?(a.attachEvent("on"+b.a+(g?"in":""),l),f=M(a),(w[f]=w[f]||[]).push(b)):(a.addEventListener(f,l,g),(a.M=a.M||[]).push(b))})})})},
onClick:function(a,b,c,d){return n(b)?this.on(a,"click",b,c,d):this.onClick(g,a,b,c)},trigger:function(a,b){return this.each(function(c){for(var d,e=c;e&&!d;)l(x?w[e.Nia]:e.M,function(e){e.a==a&&(d=d||!e.b(b,c))}),e=e.parentNode})},ht:function(a,b){var c;if(2<arguments.length){c=arguments;var d=[];if(c)for(var e=W(c,void 0,c.length),f=W(c,1,0);f<e;f++)d.push(c[f]);c=d;d=void 0;for(e=0;e<c.length;e++)d=J(c[e],d);c=d}else c=b;return this.set("innerHTML",n(a)?a(c):/{{/.test(a)?da(a,c):/^#\S+$/.test(a)?
da(v(a,void 0,void 0)[0].text,c):a)}},N.prototype);J({request:function(a,b,c,d){d=d||{};var e,f=0,h=O(),k=c&&c.constructor==d.constructor;try{h.xhr=e=p.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Msxml2.XMLHTTP.3.0"),h.stop0=function(){e.abort()},k&&(c=y(B,c,function(a,b){return y(l,b,function(b){return encodeURIComponent(a)+(b!=g?"="+encodeURIComponent(b):"")})}).join("&")),c==g||/post/i.test(a)||(b+="?"+c,c=g),e.open(a,b,!0,d.user,d.pass),k&&/post/i.test(a)&&e.setRequestHeader("Content-Type",
"application/x-www-form-urlencoded"),B(d.headers,function(a,b){e.setRequestHeader(a,b)}),B(d.xhr,function(a,b){e[a]=b}),e.onreadystatechange=function(){4!=e.readyState||f++||(200==e.status?h(!0,[e.responseText,e]):h(!1,[e.status,e.responseText,e]))},e.send(c)}catch(m){f||h(!1,[0,g,F(m)])}return h},toJSON:function b(c){return c==g?""+c:A(c=c.valueOf())?'"'+m(c,/[\\\"\x00-\x1f\u2028\u2029]/g,P)+'"':r(c)?"["+y(l,c,b).join()+"]":c&&"object"==typeof c?"{"+y(B,c,function(c,e){return b(c)+":"+b(e)}).join()+
"}":F(c)},parseJSON:p.JSON?p.JSON.parse:function(b){b=m(b,/[\x00\xad\u0600-\uffff]/g,P);if(/^[[\],:{}\s]*$/.test(m(m(b,/\\["\\\/bfnrtu]/g),/"[^"\\\n\r]*"|true|false|null|[\d.eE+-]+/g)))return eval("("+b+")")},ready:ga,off:function(b){l(b.M,function(b){x?(b.element.detachEvent("on"+b.a+(b.c?"in":""),b.b),ea(w[b.element.Nia],b)):(b.element.removeEventListener(b.a,b.b,b.c),ea(b.element.M,b))});b.M=g},wait:function(b,c){var d=O(),e=setTimeout(function(){d(!0,c)},b);d.stop0=function(){d(!1);clearTimeout(e)};
return d}},t);J({each:q,toObject:function(b,c){var d={};q(b,function(b){d[b]=c});return d},template:Z,d:0,promise:O},ba);if(x){var ja=function(){X(E);E=g};document.attachEvent("onreadystatechange",function(){/^[ic]/.test(document.readyState)&&ja()});p.attachEvent("onload",ja)}else document.addEventListener("DOMContentLoaded",function(){X(E);E=g},!1);p.f=function(){l(w,Q)};return{$:t,M:N,getter:S,setter:R}});
module.exports = myObj;
}, {}],
4: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
(function(win) {
  var Queue, cacheBust, deferredObject, delay, dnt, doPostMessage, doc, handleMessageEvent, hash, iframe, load, lstore, mydeferred, myproxy, onMessage, proxyPage, proxyWin, q, randomHash, store, usePostMessage, xstore;
  doc = win.document;
  load = require('load-iframe');
  Queue = require('queue');
  store = require('store.js');
  proxyPage = 'http://niiknow.github.io/xstore/xstore.html';
  deferredObject = {};
  iframe = void 0;
  proxyWin = void 0;
  usePostMessage = win.postMessage != null;
  cacheBust = 0;
  hash = void 0;
  delay = 333;
  lstore = {};
  q = new Queue({
    concurrency: 1,
    timeout: delay + 5
  });
  dnt = win.navigator.doNotTrack || navigator.msDoNotTrack || win.doNotTrack;
  onMessage = function(fn) {
    if (win.addEventListener) {
      return win.addEventListener("message", fn, false);
    } else {
      return win.attachEvent("onmessage", fn);
    }
  };

  /**
   * defer/promise class
  #
   */
  mydeferred = (function() {
    var i, k, len, ref, v;

    function mydeferred() {}

    mydeferred.prototype.q = function(event, item) {
      var d, deferredHash, self;
      self = this;
      self.mycallbacks = [];
      self.myerrorbacks = [];
      deferredHash = randomHash();
      d = [0, deferredHash, event, item.k, item.v];
      deferredObject[deferredHash] = self;
      if (usePostMessage) {
        doPostMessage(JSON.stringify(d));
      } else {
        if (iframe !== null) {
          cacheBust += 1;
          d[0] = +(new Date) + cacheBust;
          hash = '#' + JSON.stringify(d);
          if (iframe.src) {
            iframe.src = "" + proxyPage + hash;
          } else if ((iframe.contentWindow != null) && (iframe.contentWindow.location != null)) {
            iframe.contentWindow.location = "" + proxyPage + hash;
          } else {
            iframe.setAttribute('src', "" + proxyPage + hash);
          }
        }
      }
      self.then = function(fn, fnErr) {
        if (fnErr) {
          self.myerrorbacks.push(fnErr);
        }
        self.mycallbacks.push(fn);
        return self;
      };
      return self;
    };

    mydeferred.prototype.myresolve = function(data) {
      var i, k, len, ref, self, v;
      self = this;
      ref = self.mycallbacks || [];
      for (k = i = 0, len = ref.length; i < len; k = ++i) {
        v = ref[k];
        v(data);
      }
      return self;
    };

    mydeferred.prototype.myreject = function(e) {
      var self;
      return self = this;
    };

    ref = self.myerrorbacks || [];
    for (k = i = 0, len = ref.length; i < len; k = ++i) {
      v = ref[k];
      v(data);
    }

    self;

    return mydeferred;

  })();
  myproxy = (function() {
    function myproxy() {}

    myproxy.prototype.delay = 333;

    myproxy.prototype.hash = win.location.hash;

    myproxy.prototype.init = function() {
      var self;
      self = this;
      if (usePostMessage) {
        return onMessage(self.handleProxyMessage);
      } else {
        return setInterval((function() {
          var newhash;
          newhash = win.location.hash;
          if (newhash !== hash) {
            hash = newhash;
            self.handleProxyMessage({
              data: JSON.parse(newhash.substr(1))
            });
          }
        }), self.delay);
      }
    };

    myproxy.prototype.handleProxyMessage = function(e) {
      var d, id, key, method, myCacheBust, self;
      d = e.data;
      if (typeof d === "string") {
        if (/^xstore-/.test(d)) {
          d = d.split(",");
        } else {
          try {
            d = JSON.parse(d);
          } catch (_error) {
            return;
          }
        }
      }
      if (!(d instanceof Array)) {
        return;
      }
      id = d[1];
      if (!/^xstore-/.test(id)) {
        return;
      }
      self = this;
      key = d[3] || 'xstore';
      method = d[2];
      cacheBust = 0;
      if (method === 'get') {
        d[4] = store.get(key);
      } else if (method === 'set') {
        store.set(key, d[4]);
      } else if (method === 'remove') {
        store.remove(key);
      } else if (method === 'clear') {
        store.clear();
      } else {
        d[2] = 'error-' + method;
      }
      d[1] = id.replace('xstore-', 'xstoreproxy-');
      if (usePostMessage) {
        e.source.postMessage(JSON.stringify(d), '*');
      } else {
        cacheBust += 1;
        myCacheBust = +(new Date) + cacheBust;
        d[0] = myCacheBust;
        hash = '#' + JSON.stringify(d);
        win.location = win.location.href.replace(globals.location.hash, '') + hash;
      }
    };

    return myproxy;

  })();
  randomHash = function() {
    var rh;
    rh = Math.random().toString(36).substr(2);
    return "xstore-" + rh;
  };
  doPostMessage = function(msg) {
    if ((proxyWin != null)) {
      proxyWin.postMessage(msg, '*');
      return;
    }
    return q.push(function() {
      return doPostMessage(msg);
    });
  };
  handleMessageEvent = function(e) {
    var d, di, id;
    d = e.data;
    if (typeof d === "string") {
      if (/^xstoreproxy-/.test(d)) {
        d = d.split(",");
      } else {
        try {
          d = JSON.parse(d);
        } catch (_error) {
          return;
        }
      }
    }
    if (!(d instanceof Array)) {
      return;
    }
    id = d[1];
    if (!/^xstoreproxy-/.test(id)) {
      return;
    }
    id = id.replace('xstoreproxy-', 'xstore-');
    di = deferredObject[id];
    if (di) {
      if (/^error-/.test(d[2])) {
        di.myreject(d[2]);
      } else {
        di.myresolve(d[4]);
      }
      return delete deferredObject[id];
    }
  };

  /**
   * xstore class
  #
   */
  xstore = (function() {
    function xstore() {}

    xstore.prototype.hasInit = false;

    xstore.prototype.get = function(k) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            return fn(lstore[k]);
          }
        };
      }
      return (new mydeferred()).q('get', {
        'k': k
      });
    };

    xstore.prototype.set = function(k, v) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            lstore[k] = v;
            return fn(lstore[k]);
          }
        };
      }
      return (new mydeferred()).q('set', {
        'k': k,
        'v': v
      });
    };

    xstore.prototype.remove = function(k) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            delete lstore[k];
            return fn;
          }
        };
      }
      return (new mydeferred()).q('remove', {
        'k': k
      });
    };

    xstore.prototype.clear = function() {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            lstore = {};
            return fn;
          }
        };
      }
      return (new mydeferred()).q('clear');
    };

    xstore.prototype.init = function(options) {
      var self;
      self = this;
      if (self.hasInit) {
        return self;
      }
      self.hasInit = true;
      options = options || {};
      if (options.isProxy) {
        (new myproxy()).init();
        return;
      }
      proxyPage = options.url || proxyPage;
      if (options.dntIgnore) {
        dnt = false;
      }
      if (!store.enabled) {
        dnt = true;
      }
      if (win.location.protocol === 'https') {
        proxyPage = proxyPage.replace('http:', 'https:');
      }
      return iframe = load(proxyPage, function() {
        iframe.setAttribute("id", "xstore");
        proxyWin = iframe.contentWindow;
        if (!usePostMessage) {
          hash = proxyWin.location.hash;
          return setInterval((function() {
            if (proxyWin.location.hash !== hash) {
              hash = proxyWin.location.hash;
              handleMessageEvent({
                origin: proxyDomain,
                data: hash.substr(1)
              });
            }
          }), delay);
        } else {
          return onMessage(handleMessageEvent);
        }
      });
    };

    return xstore;

  })();
  win.xstore = new xstore();
  return module.exports = win.xstore;
})(window);

}, {"load-iframe":19,"queue":20,"store.js":21}],
19: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var onload = require('script-onload');
var tick = require('next-tick');
var type = require('type');

/**
 * Expose `loadScript`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */

module.exports = function loadIframe(options, fn){
  if (!options) throw new Error('Cant load nothing...');

  // Allow for the simplest case, just passing a `src` string.
  if ('string' == type(options)) options = { src : options };

  var https = document.location.protocol === 'https:' ||
              document.location.protocol === 'chrome-extension:';

  // If you use protocol relative URLs, third-party scripts like Google
  // Analytics break when testing with `file:` so this fixes that.
  if (options.src && options.src.indexOf('//') === 0) {
    options.src = https ? 'https:' + options.src : 'http:' + options.src;
  }

  // Allow them to pass in different URLs depending on the protocol.
  if (https && options.https) options.src = options.https;
  else if (!https && options.http) options.src = options.http;

  // Make the `<iframe>` element and insert it before the first iframe on the
  // page, which is guaranteed to exist since this Javaiframe is running.
  var iframe = document.createElement('iframe');
  iframe.src = options.src;
  iframe.width = options.width || 1;
  iframe.height = options.height || 1;
  iframe.style.display = 'none';

  // If we have a fn, attach event handlers, even in IE. Based off of
  // the Third-Party Javascript script loading example:
  // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
  if ('function' == type(fn)) {
    onload(iframe, fn);
  }

  tick(function(){
    // Append after event listeners are attached for IE.
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(iframe, firstScript);
  });

  // Return the iframe element in case they want to do anything special, like
  // give it an ID or attributes.
  return iframe;
};
}, {"script-onload":22,"next-tick":23,"type":16}],
22: [function(require, module, exports) {

// https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html

/**
 * Invoke `fn(err)` when the given `el` script loads.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api public
 */

module.exports = function(el, fn){
  return el.addEventListener
    ? add(el, fn)
    : attach(el, fn);
};

/**
 * Add event listener to `el`, `fn()`.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api private
 */

function add(el, fn){
  el.addEventListener('load', function(_, e){ fn(null, e); }, false);
  el.addEventListener('error', function(e){
    var err = new Error('script error "' + el.src + '"');
    err.event = e;
    fn(err);
  }, false);
}

/**
 * Attach evnet.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api private
 */

function attach(el, fn){
  el.attachEvent('onreadystatechange', function(e){
    if (!/complete|loaded/.test(el.readyState)) return;
    fn(null, e);
  });
  el.attachEvent('onerror', function(e){
    var err = new Error('failed to load the script "' + el.src + '"');
    err.event = e || window.event;
    fn(err);
  });
}

}, {}],
23: [function(require, module, exports) {
"use strict"

if (typeof setImmediate == 'function') {
  module.exports = function(f){ setImmediate(f) }
}
// legacy node.js
else if (typeof process != 'undefined' && typeof process.nextTick == 'function') {
  module.exports = process.nextTick
}
// fallback for other environments / postMessage behaves badly on IE8
else if (typeof window == 'undefined' || window.ActiveXObject || !window.postMessage) {
  module.exports = function(f){ setTimeout(f) };
} else {
  var q = [];

  window.addEventListener('message', function(){
    var i = 0;
    while (i < q.length) {
      try { q[i++](); }
      catch (e) {
        q = q.slice(i);
        window.postMessage('tic!', '*');
        throw e;
      }
    }
    q.length = 0;
  }, true);

  module.exports = function(fn){
    if (!q.length) window.postMessage('tic!', '*');
    q.push(fn);
  }
}

}, {}],
20: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var Emitter;
var bind;

try {
  Emitter = require('component-emitter');
  bind = require('component-bind');
} catch (err) {
  Emitter = require('emitter');
  bind = require('bind');
}

/**
 * Expose `Queue`.
 */

module.exports = Queue;

/**
 * Initialize a `Queue` with the given options:
 *
 *  - `concurrency` [1]
 *  - `timeout` [0]
 *
 * @param {Object} options
 * @api public
 */

function Queue(options) {
  options = options || {};
  this.timeout = options.timeout || 0;
  this.concurrency = options.concurrency || 1;
  this.pending = 0;
  this.jobs = [];
}

/**
 * Mixin emitter.
 */

Emitter(Queue.prototype);

/**
 * Return queue length.
 *
 * @return {Number}
 * @api public
 */

Queue.prototype.length = function(){
  return this.pending + this.jobs.length;
};

/**
 * Queue `fn` for execution.
 *
 * @param {Function} fn
 * @param {Function} [cb]
 * @api public
 */

Queue.prototype.push = function(fn, cb){
  this.jobs.push([fn, cb]);
  setTimeout(bind(this, this.run), 0);
};

/**
 * Run jobs at the specified concurrency.
 *
 * @api private
 */

Queue.prototype.run = function(){
  while (this.pending < this.concurrency) {
    var job = this.jobs.shift();
    if (!job) break;
    this.exec(job);
  }
};

/**
 * Execute `job`.
 *
 * @param {Array} job
 * @api private
 */

Queue.prototype.exec = function(job){
  var self = this;
  var ms = this.timeout;

  var fn = job[0];
  var cb = job[1];
  if (ms) fn = timeout(fn, ms);

  this.pending++;
  fn(function(err, res){
    cb && cb(err, res);
    self.pending--;
    self.run();
  });
};

/**
 * Decorate `fn` with a timeout of `ms`.
 *
 * @param {Function} fn
 * @param {Function} ms
 * @return {Function}
 * @api private
 */

function timeout(fn, ms) {
  return function(cb){
    var done;

    var id = setTimeout(function(){
      done = true;
      var err = new Error('Timeout of ' + ms + 'ms exceeded');
      err.timeout = timeout;
      cb(err);
    }, ms);

    fn(function(err, res){
      if (done) return;
      clearTimeout(id);
      cb(err, res);
    });
  }
}

}, {"component-emitter":24,"component-bind":25,"emitter":24,"bind":25}],
24: [function(require, module, exports) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

}, {}],
25: [function(require, module, exports) {
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

}, {}],
21: [function(require, module, exports) {
;(function(win){
	var store = {},
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage

	store.disabled = false
	store.version = '1.3.17'
	store.set = function(key, value) {}
	store.get = function(key, defaultVal) {}
	store.has = function(key) { return store.get(key) !== undefined }
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal)
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}
	store.forEach = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key))
			return (val === undefined ? defaultVal : val)
		}
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		function ieKeyFix(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key)
			var val = store.deserialize(storage.getAttribute(key))
			return (val === undefined ? defaultVal : val)
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr=attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
		store.getAll = function(storage) {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled

	if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { win.store = store }

})(Function('return this')());

}, {}]}, {}, {"1":""})

}, {"xstore":5,"defaults":2,"cookie":6,"emitter":7,"querystring":8,"uuid":9,"webanalyser":10,"domevent":11,"component-emitter":7}],
5: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
(function(win) {
  var Queue, cacheBust, deferredObject, delay, dnt, doPostMessage, doc, handleMessageEvent, hash, iframe, load, lstore, mydeferred, myproxy, onMessage, proxyPage, proxyWin, q, randomHash, store, usePostMessage, xstore;
  doc = win.document;
  load = require('load-iframe');
  Queue = require('queue');
  store = require('store.js');
  proxyPage = 'http://niiknow.github.io/xstore/xstore.html';
  deferredObject = {};
  iframe = void 0;
  proxyWin = void 0;
  usePostMessage = win.postMessage != null;
  cacheBust = 0;
  hash = void 0;
  delay = 333;
  lstore = {};
  q = new Queue({
    concurrency: 1,
    timeout: delay + 5
  });
  dnt = win.navigator.doNotTrack || navigator.msDoNotTrack || win.doNotTrack;
  onMessage = function(fn) {
    if (win.addEventListener) {
      return win.addEventListener("message", fn, false);
    } else {
      return win.attachEvent("onmessage", fn);
    }
  };

  /**
   * defer/promise class
  #
   */
  mydeferred = (function() {
    var i, k, len, ref, v;

    function mydeferred() {}

    mydeferred.prototype.q = function(event, item) {
      var d, deferredHash, self;
      self = this;
      self.mycallbacks = [];
      self.myerrorbacks = [];
      deferredHash = randomHash();
      d = [0, deferredHash, event, item.k, item.v];
      deferredObject[deferredHash] = self;
      if (usePostMessage) {
        doPostMessage(JSON.stringify(d));
      } else {
        if (iframe !== null) {
          cacheBust += 1;
          d[0] = +(new Date) + cacheBust;
          hash = '#' + JSON.stringify(d);
          if (iframe.src) {
            iframe.src = "" + proxyPage + hash;
          } else if ((iframe.contentWindow != null) && (iframe.contentWindow.location != null)) {
            iframe.contentWindow.location = "" + proxyPage + hash;
          } else {
            iframe.setAttribute('src', "" + proxyPage + hash);
          }
        }
      }
      self.then = function(fn, fnErr) {
        if (fnErr) {
          self.myerrorbacks.push(fnErr);
        }
        self.mycallbacks.push(fn);
        return self;
      };
      return self;
    };

    mydeferred.prototype.myresolve = function(data) {
      var i, k, len, ref, self, v;
      self = this;
      ref = self.mycallbacks || [];
      for (k = i = 0, len = ref.length; i < len; k = ++i) {
        v = ref[k];
        v(data);
      }
      return self;
    };

    mydeferred.prototype.myreject = function(e) {
      var self;
      return self = this;
    };

    ref = self.myerrorbacks || [];
    for (k = i = 0, len = ref.length; i < len; k = ++i) {
      v = ref[k];
      v(data);
    }

    self;

    return mydeferred;

  })();
  myproxy = (function() {
    function myproxy() {}

    myproxy.prototype.delay = 333;

    myproxy.prototype.hash = win.location.hash;

    myproxy.prototype.init = function() {
      var self;
      self = this;
      if (usePostMessage) {
        return onMessage(self.handleProxyMessage);
      } else {
        return setInterval((function() {
          var newhash;
          newhash = win.location.hash;
          if (newhash !== hash) {
            hash = newhash;
            self.handleProxyMessage({
              data: JSON.parse(newhash.substr(1))
            });
          }
        }), self.delay);
      }
    };

    myproxy.prototype.handleProxyMessage = function(e) {
      var d, id, key, method, myCacheBust, self;
      d = e.data;
      if (typeof d === "string") {
        if (/^xstore-/.test(d)) {
          d = d.split(",");
        } else {
          try {
            d = JSON.parse(d);
          } catch (_error) {
            return;
          }
        }
      }
      if (!(d instanceof Array)) {
        return;
      }
      id = d[1];
      if (!/^xstore-/.test(id)) {
        return;
      }
      self = this;
      key = d[3] || 'xstore';
      method = d[2];
      cacheBust = 0;
      if (method === 'get') {
        d[4] = store.get(key);
      } else if (method === 'set') {
        store.set(key, d[4]);
      } else if (method === 'remove') {
        store.remove(key);
      } else if (method === 'clear') {
        store.clear();
      } else {
        d[2] = 'error-' + method;
      }
      d[1] = id.replace('xstore-', 'xstoreproxy-');
      if (usePostMessage) {
        e.source.postMessage(JSON.stringify(d), '*');
      } else {
        cacheBust += 1;
        myCacheBust = +(new Date) + cacheBust;
        d[0] = myCacheBust;
        hash = '#' + JSON.stringify(d);
        win.location = win.location.href.replace(globals.location.hash, '') + hash;
      }
    };

    return myproxy;

  })();
  randomHash = function() {
    var rh;
    rh = Math.random().toString(36).substr(2);
    return "xstore-" + rh;
  };
  doPostMessage = function(msg) {
    if ((proxyWin != null)) {
      proxyWin.postMessage(msg, '*');
      return;
    }
    return q.push(function() {
      return doPostMessage(msg);
    });
  };
  handleMessageEvent = function(e) {
    var d, di, id;
    d = e.data;
    if (typeof d === "string") {
      if (/^xstoreproxy-/.test(d)) {
        d = d.split(",");
      } else {
        try {
          d = JSON.parse(d);
        } catch (_error) {
          return;
        }
      }
    }
    if (!(d instanceof Array)) {
      return;
    }
    id = d[1];
    if (!/^xstoreproxy-/.test(id)) {
      return;
    }
    id = id.replace('xstoreproxy-', 'xstore-');
    di = deferredObject[id];
    if (di) {
      if (/^error-/.test(d[2])) {
        di.myreject(d[2]);
      } else {
        di.myresolve(d[4]);
      }
      return delete deferredObject[id];
    }
  };

  /**
   * xstore class
  #
   */
  xstore = (function() {
    function xstore() {}

    xstore.prototype.hasInit = false;

    xstore.prototype.get = function(k) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            return fn(lstore[k]);
          }
        };
      }
      return (new mydeferred()).q('get', {
        'k': k
      });
    };

    xstore.prototype.set = function(k, v) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            lstore[k] = v;
            return fn(lstore[k]);
          }
        };
      }
      return (new mydeferred()).q('set', {
        'k': k,
        'v': v
      });
    };

    xstore.prototype.remove = function(k) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            delete lstore[k];
            return fn;
          }
        };
      }
      return (new mydeferred()).q('remove', {
        'k': k
      });
    };

    xstore.prototype.clear = function() {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            lstore = {};
            return fn;
          }
        };
      }
      return (new mydeferred()).q('clear');
    };

    xstore.prototype.init = function(options) {
      var self;
      self = this;
      if (self.hasInit) {
        return self;
      }
      self.hasInit = true;
      options = options || {};
      if (options.isProxy) {
        (new myproxy()).init();
        return;
      }
      proxyPage = options.url || proxyPage;
      if (options.dntIgnore) {
        dnt = false;
      }
      if (!store.enabled) {
        dnt = true;
      }
      if (win.location.protocol === 'https') {
        proxyPage = proxyPage.replace('http:', 'https:');
      }
      return iframe = load(proxyPage, function() {
        iframe.setAttribute("id", "xstore");
        proxyWin = iframe.contentWindow;
        if (!usePostMessage) {
          hash = proxyWin.location.hash;
          return setInterval((function() {
            if (proxyWin.location.hash !== hash) {
              hash = proxyWin.location.hash;
              handleMessageEvent({
                origin: proxyDomain,
                data: hash.substr(1)
              });
            }
          }), delay);
        } else {
          return onMessage(handleMessageEvent);
        }
      });
    };

    return xstore;

  })();
  win.xstore = new xstore();
  return module.exports = win.xstore;
})(window);

}, {"load-iframe":12,"queue":13,"store.js":14}],
12: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var onload = require('script-onload');
var tick = require('next-tick');
var type = require('type');

/**
 * Expose `loadScript`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */

module.exports = function loadIframe(options, fn){
  if (!options) throw new Error('Cant load nothing...');

  // Allow for the simplest case, just passing a `src` string.
  if ('string' == type(options)) options = { src : options };

  var https = document.location.protocol === 'https:' ||
              document.location.protocol === 'chrome-extension:';

  // If you use protocol relative URLs, third-party scripts like Google
  // Analytics break when testing with `file:` so this fixes that.
  if (options.src && options.src.indexOf('//') === 0) {
    options.src = https ? 'https:' + options.src : 'http:' + options.src;
  }

  // Allow them to pass in different URLs depending on the protocol.
  if (https && options.https) options.src = options.https;
  else if (!https && options.http) options.src = options.http;

  // Make the `<iframe>` element and insert it before the first iframe on the
  // page, which is guaranteed to exist since this Javaiframe is running.
  var iframe = document.createElement('iframe');
  iframe.src = options.src;
  iframe.width = options.width || 1;
  iframe.height = options.height || 1;
  iframe.style.display = 'none';

  // If we have a fn, attach event handlers, even in IE. Based off of
  // the Third-Party Javascript script loading example:
  // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
  if ('function' == type(fn)) {
    onload(iframe, fn);
  }

  tick(function(){
    // Append after event listeners are attached for IE.
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(iframe, firstScript);
  });

  // Return the iframe element in case they want to do anything special, like
  // give it an ID or attributes.
  return iframe;
};
}, {"script-onload":15,"next-tick":16,"type":17}],
15: [function(require, module, exports) {

// https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html

/**
 * Invoke `fn(err)` when the given `el` script loads.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api public
 */

module.exports = function(el, fn){
  return el.addEventListener
    ? add(el, fn)
    : attach(el, fn);
};

/**
 * Add event listener to `el`, `fn()`.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api private
 */

function add(el, fn){
  el.addEventListener('load', function(_, e){ fn(null, e); }, false);
  el.addEventListener('error', function(e){
    var err = new Error('script error "' + el.src + '"');
    err.event = e;
    fn(err);
  }, false);
}

/**
 * Attach evnet.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api private
 */

function attach(el, fn){
  el.attachEvent('onreadystatechange', function(e){
    if (!/complete|loaded/.test(el.readyState)) return;
    fn(null, e);
  });
  el.attachEvent('onerror', function(e){
    var err = new Error('failed to load the script "' + el.src + '"');
    err.event = e || window.event;
    fn(err);
  });
}

}, {}],
16: [function(require, module, exports) {
"use strict"

if (typeof setImmediate == 'function') {
  module.exports = function(f){ setImmediate(f) }
}
// legacy node.js
else if (typeof process != 'undefined' && typeof process.nextTick == 'function') {
  module.exports = process.nextTick
}
// fallback for other environments / postMessage behaves badly on IE8
else if (typeof window == 'undefined' || window.ActiveXObject || !window.postMessage) {
  module.exports = function(f){ setTimeout(f) };
} else {
  var q = [];

  window.addEventListener('message', function(){
    var i = 0;
    while (i < q.length) {
      try { q[i++](); }
      catch (e) {
        q = q.slice(i);
        window.postMessage('tic!', '*');
        throw e;
      }
    }
    q.length = 0;
  }, true);

  module.exports = function(fn){
    if (!q.length) window.postMessage('tic!', '*');
    q.push(fn);
  }
}

}, {}],
17: [function(require, module, exports) {
/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object Error]': return 'error';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val !== val) return 'nan';
  if (val && val.nodeType === 1) return 'element';

  val = val.valueOf
    ? val.valueOf()
    : Object.prototype.valueOf.apply(val)

  return typeof val;
};

}, {}],
13: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var Emitter;
var bind;

try {
  Emitter = require('component-emitter');
  bind = require('component-bind');
} catch (err) {
  Emitter = require('emitter');
  bind = require('bind');
}

/**
 * Expose `Queue`.
 */

module.exports = Queue;

/**
 * Initialize a `Queue` with the given options:
 *
 *  - `concurrency` [1]
 *  - `timeout` [0]
 *
 * @param {Object} options
 * @api public
 */

function Queue(options) {
  options = options || {};
  this.timeout = options.timeout || 0;
  this.concurrency = options.concurrency || 1;
  this.pending = 0;
  this.jobs = [];
}

/**
 * Mixin emitter.
 */

Emitter(Queue.prototype);

/**
 * Return queue length.
 *
 * @return {Number}
 * @api public
 */

Queue.prototype.length = function(){
  return this.pending + this.jobs.length;
};

/**
 * Queue `fn` for execution.
 *
 * @param {Function} fn
 * @param {Function} [cb]
 * @api public
 */

Queue.prototype.push = function(fn, cb){
  this.jobs.push([fn, cb]);
  setTimeout(bind(this, this.run), 0);
};

/**
 * Run jobs at the specified concurrency.
 *
 * @api private
 */

Queue.prototype.run = function(){
  while (this.pending < this.concurrency) {
    var job = this.jobs.shift();
    if (!job) break;
    this.exec(job);
  }
};

/**
 * Execute `job`.
 *
 * @param {Array} job
 * @api private
 */

Queue.prototype.exec = function(job){
  var self = this;
  var ms = this.timeout;

  var fn = job[0];
  var cb = job[1];
  if (ms) fn = timeout(fn, ms);

  this.pending++;
  fn(function(err, res){
    cb && cb(err, res);
    self.pending--;
    self.run();
  });
};

/**
 * Decorate `fn` with a timeout of `ms`.
 *
 * @param {Function} fn
 * @param {Function} ms
 * @return {Function}
 * @api private
 */

function timeout(fn, ms) {
  return function(cb){
    var done;

    var id = setTimeout(function(){
      done = true;
      var err = new Error('Timeout of ' + ms + 'ms exceeded');
      err.timeout = timeout;
      cb(err);
    }, ms);

    fn(function(err, res){
      if (done) return;
      clearTimeout(id);
      cb(err, res);
    });
  }
}

}, {"component-emitter":18,"component-bind":19,"emitter":18,"bind":19}],
18: [function(require, module, exports) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

}, {}],
19: [function(require, module, exports) {
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

}, {}],
14: [function(require, module, exports) {
;(function(win){
	var store = {},
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage

	store.disabled = false
	store.version = '1.3.17'
	store.set = function(key, value) {}
	store.get = function(key, defaultVal) {}
	store.has = function(key) { return store.get(key) !== undefined }
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal)
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}
	store.forEach = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key))
			return (val === undefined ? defaultVal : val)
		}
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		function ieKeyFix(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key)
			var val = store.deserialize(storage.getAttribute(key))
			return (val === undefined ? defaultVal : val)
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr=attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
		store.getAll = function(storage) {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled

	if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { win.store = store }

})(Function('return this')());

}, {}],
6: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var debug = require('debug')('cookie');

/**
 * Set or get cookie `name` with `value` and `options` object.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @return {Mixed}
 * @api public
 */

module.exports = function(name, value, options){
  switch (arguments.length) {
    case 3:
    case 2:
      return set(name, value, options);
    case 1:
      return get(name);
    default:
      return all();
  }
};

/**
 * Set cookie `name` to `value`.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @api private
 */

function set(name, value, options) {
  options = options || {};
  var str = encode(name) + '=' + encode(value);

  if (null == value) options.maxage = -1;

  if (options.maxage) {
    options.expires = new Date(+new Date + options.maxage);
  }

  if (options.path) str += '; path=' + options.path;
  if (options.domain) str += '; domain=' + options.domain;
  if (options.expires) str += '; expires=' + options.expires.toUTCString();
  if (options.secure) str += '; secure';

  document.cookie = str;
}

/**
 * Return all cookies.
 *
 * @return {Object}
 * @api private
 */

function all() {
  return parse(document.cookie);
}

/**
 * Get cookie `name`.
 *
 * @param {String} name
 * @return {String}
 * @api private
 */

function get(name) {
  return all()[name];
}

/**
 * Parse cookie `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parse(str) {
  var obj = {};
  var pairs = str.split(/ *; */);
  var pair;
  if ('' == pairs[0]) return obj;
  for (var i = 0; i < pairs.length; ++i) {
    pair = pairs[i].split('=');
    obj[decode(pair[0])] = decode(pair[1]);
  }
  return obj;
}

/**
 * Encode.
 */

function encode(value){
  try {
    return encodeURIComponent(value);
  } catch (e) {
    debug('error `encode(%o)` - %o', value, e)
  }
}

/**
 * Decode.
 */

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    debug('error `decode(%o)` - %o', value, e)
  }
}

}, {"debug":20}],
20: [function(require, module, exports) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Use chrome.storage.local if we are in an app
 */

var storage;

if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined')
  storage = chrome.storage.local;
else
  storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      storage.removeItem('debug');
    } else {
      storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

}, {"./debug":21}],
21: [function(require, module, exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

}, {"ms":22}],
22: [function(require, module, exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

}, {}],
7: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

}, {"indexof":23}],
23: [function(require, module, exports) {
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
}, {}],
8: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var encode = encodeURIComponent;
var decode = decodeURIComponent;
var trim = require('trim');
var type = require('type');

/**
 * Parse the given query `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if ('string' != typeof str) return {};

  str = trim(str);
  if ('' == str) return {};
  if ('?' == str.charAt(0)) str = str.slice(1);

  var obj = {};
  var pairs = str.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var parts = pairs[i].split('=');
    var key = decode(parts[0]);
    var m;

    if (m = /(\w+)\[(\d+)\]/.exec(key)) {
      obj[m[1]] = obj[m[1]] || [];
      obj[m[1]][m[2]] = decode(parts[1]);
      continue;
    }

    obj[parts[0]] = null == parts[1]
      ? ''
      : decode(parts[1]);
  }

  return obj;
};

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

exports.stringify = function(obj){
  if (!obj) return '';
  var pairs = [];

  for (var key in obj) {
    var value = obj[key];

    if ('array' == type(value)) {
      for (var i = 0; i < value.length; ++i) {
        pairs.push(encode(key + '[' + i + ']') + '=' + encode(value[i]));
      }
      continue;
    }

    pairs.push(encode(key) + '=' + encode(obj[key]));
  }

  return pairs.join('&');
};

}, {"trim":24,"type":17}],
24: [function(require, module, exports) {

exports = module.exports = trim;

function trim(str){
  if (str.trim) return str.trim();
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  if (str.trimLeft) return str.trimLeft();
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  if (str.trimRight) return str.trimRight();
  return str.replace(/\s*$/, '');
};

}, {}],
9: [function(require, module, exports) {

/**
 * Taken straight from jed's gist: https://gist.github.com/982883
 *
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f, and
 * y is replaced with a random hexadecimal digit from 8 to b.
 */

module.exports = function uuid(a){
  return a           // if the placeholder was passed, return
    ? (              // a random number from 0 to 15
      a ^            // unless b is 8,
      Math.random()  // in which case
      * 16           // a random number from
      >> a/4         // 8 to 11
      ).toString(16) // in hexadecimal
    : (              // or otherwise a concatenated string:
      [1e7] +        // 10000000 +
      -1e3 +         // -1000 +
      -4e3 +         // -4000 +
      -8e3 +         // -80000000 +
      -1e11          // -100000000000,
      ).replace(     // replacing
        /[018]/g,    // zeroes, ones, and eights with
        uuid         // random hex digits
      )
};
}, {}],
10: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
(function(document, navigator, screen, location) {
  'use strict';
  var $defaults, $endTime, $onLoadHandlers, $startTime, $timeoutId, defaults, flashdetect, result, webanalyser;
  defaults = require('defaults');
  flashdetect = require('flashdetect');
  $startTime = new Date().getTime();
  $endTime = new Date().getTime();
  $timeoutId = null;
  $onLoadHandlers = [];
  $defaults = {
    sr: screen.width + "x" + screen.height,
    vp: screen.availWidth + "x" + screen.availHeight,
    sd: screen.colorDepth,
    je: navigator.javaEnabled ? navigator.javaEnabled() : false,
    ul: navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage || navigator.browserLanguage
  };

  /**
   * webanalyser
   */
  webanalyser = (function() {
    function webanalyser() {}

    webanalyser.prototype.getResult = function() {
      var rst;
      if (defaults.dl == null) {
        rst = {
          dr: document.referrer,
          dl: location.href,
          dh: location.hostname,
          dt: document.title,
          z: new Date().getTime()
        };
        if (flashdetect.installed) {
          rst.fl = flashdetect.major + " " + flashdetect.minor + " " + flashdetect.revisionStr;
        }
        $defaults = defaults(rst, $defaults);
      }
      return $defaults;
    };

    return webanalyser;

  })();
  result = new webanalyser();
  return module.exports = result;
})(document, navigator, screen, location);

}, {"defaults":2,"flashdetect":25}],
25: [function(require, module, exports) {
/*
Copyright (c) Copyright (c) 2007, Carl S. Yestrau All rights reserved.
Code licensed under the BSD License: http://www.featureblend.com/license.txt
Version: 1.0.4
*/
var flashdetect = new function(){
    var self = this;
    self.installed = false;
    self.raw = "";
    self.major = -1;
    self.minor = -1;
    self.revision = -1;
    self.revisionStr = "";
    var activeXDetectRules = [
        {
            "name":"ShockwaveFlash.ShockwaveFlash.7",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash.6",
            "version":function(obj){
                var version = "6,0,21";
                try{
                    obj.AllowScriptAccess = "always";
                    version = getActiveXVersion(obj);
                }catch(err){}
                return version;
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        }
    ];
    /**
     * Extract the ActiveX version of the plugin.
     * 
     * @param {Object} The flash ActiveX object.
     * @type String
     */
    var getActiveXVersion = function(activeXObj){
        var version = -1;
        try{
            version = activeXObj.GetVariable("$version");
        }catch(err){}
        return version;
    };
    /**
     * Try and retrieve an ActiveX object having a specified name.
     * 
     * @param {String} name The ActiveX object name lookup.
     * @return One of ActiveX object or a simple object having an attribute of activeXError with a value of true.
     * @type Object
     */
    var getActiveXObject = function(name){
        var obj = -1;
        try{
            obj = new ActiveXObject(name);
        }catch(err){
            obj = {activeXError:true};
        }
        return obj;
    };
    /**
     * Parse an ActiveX $version string into an object.
     * 
     * @param {String} str The ActiveX Object GetVariable($version) return value. 
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     * @type Object
     */
    var parseActiveXVersion = function(str){
        var versionArray = str.split(",");//replace with regex
        return {
            "raw":str,
            "major":parseInt(versionArray[0].split(" ")[1], 10),
            "minor":parseInt(versionArray[1], 10),
            "revision":parseInt(versionArray[2], 10),
            "revisionStr":versionArray[2]
        };
    };
    /**
     * Parse a standard enabledPlugin.description into an object.
     * 
     * @param {String} str The enabledPlugin.description value.
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     * @type Object
     */
    var parseStandardVersion = function(str){
        var descParts = str.split(/ +/);
        var majorMinor = descParts[2].split(/\./);
        var revisionStr = descParts[3];
        return {
            "raw":str,
            "major":parseInt(majorMinor[0], 10),
            "minor":parseInt(majorMinor[1], 10), 
            "revisionStr":revisionStr,
            "revision":parseRevisionStrToInt(revisionStr)
        };
    };
    /**
     * Parse the plugin revision string into an integer.
     * 
     * @param {String} The revision in string format.
     * @type Number
     */
    var parseRevisionStrToInt = function(str){
        return parseInt(str.replace(/[a-zA-Z]/g, ""), 10) || self.revision;
    };
    /**
     * Is the major version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required major version.
     * @type Boolean
     */
    self.majorAtLeast = function(version){
        return self.major >= version;
    };
    /**
     * Is the minor version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required minor version.
     * @type Boolean
     */
    self.minorAtLeast = function(version){
        return self.minor >= version;
    };
    /**
     * Is the revision version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required revision version.
     * @type Boolean
     */
    self.revisionAtLeast = function(version){
        return self.revision >= version;
    };
    /**
     * Is the version greater than or equal to a specified major, minor and revision.
     * 
     * @param {Number} major The minimum required major version.
     * @param {Number} (Optional) minor The minimum required minor version.
     * @param {Number} (Optional) revision The minimum required revision version.
     * @type Boolean
     */
    self.versionAtLeast = function(major){
        var properties = [self.major, self.minor, self.revision];
        var len = Math.min(properties.length, arguments.length);
        for(i=0; i<len; i++){
            if(properties[i]>=arguments[i]){
                if(i+1<len && properties[i]==arguments[i]){
                    continue;
                }else{
                    return true;
                }
            }else{
                return false;
            }
        }
    };
    /**
     * Constructor, sets raw, major, minor, revisionStr, revision and installed public properties.
     */
    self.flashdetect = function(){
        if(navigator.plugins && navigator.plugins.length>0){
            var type = 'application/x-shockwave-flash';
            var mimeTypes = navigator.mimeTypes;
            if(mimeTypes && mimeTypes[type] && mimeTypes[type].enabledPlugin && mimeTypes[type].enabledPlugin.description){
                var version = mimeTypes[type].enabledPlugin.description;
                var versionObj = parseStandardVersion(version);
                self.raw = versionObj.raw;
                self.major = versionObj.major;
                self.minor = versionObj.minor; 
                self.revisionStr = versionObj.revisionStr;
                self.revision = versionObj.revision;
                self.installed = true;
            }
        }else if(navigator.appVersion.indexOf("Mac")==-1 && window.execScript){
            var version = -1;
            for(var i=0; i<activeXDetectRules.length && version==-1; i++){
                var obj = getActiveXObject(activeXDetectRules[i].name);
                if(!obj.activeXError){
                    self.installed = true;
                    version = activeXDetectRules[i].version(obj);
                    if(version!=-1){
                        var versionObj = parseActiveXVersion(version);
                        self.raw = versionObj.raw;
                        self.major = versionObj.major;
                        self.minor = versionObj.minor; 
                        self.revision = versionObj.revision;
                        self.revisionStr = versionObj.revisionStr;
                    }
                }
            }
        }
    }();
};
flashdetect.JS_RELEASE = "1.0.4";

module.exports = flashdetect;

}, {}],
11: [function(require, module, exports) {
myObj = null
mydefine = function(h, F){
	myObj = F().$;
};
// minified.js config start -- use this comment to re-create a configuration in the Builder
// - Only sections add, always, each, error, get, ht, 
// - ie6compatibility, ie7compatibility, ie8compatibility, ie9compatibility, off, on, onclick, 
// - parsejson, promise, ready, remove, request, set, template, tojson, trigger, 
// - values, wait.


mydefine("minified",function(){function U(a){return a.substr(0,3)}function F(a){return a!=g?""+a:""}function A(a){return"string"==typeof a}function D(a){return a&&a.nodeType}function G(a){return a}function m(a,b,c){return F(a).replace(b,c!=g?c:"")}function H(a){return m(a,/^\s+|\s+$/g)}function B(a,b,c){for(var d in a)a.hasOwnProperty(d)&&b.call(c||a,d,a[d]);return a}function q(a,b,c){if(a)for(var d=0;d<a.length;d++)b.call(c||a,a[d],d);return a}function V(a,b){var c=[],d=n(b)?b:function(a){return b!=
a};q(a,function(b,f){d.call(a,b,f)&&c.push(b)});return c}function y(a,b,c){var d=[];a(b,function(a,f){r(a=c.call(b,a,f))?q(a,function(a){d.push(a)}):a!=g&&d.push(a)});return d}function C(a,b){var c=[];q(a,function(d,e){c.push(b.call(a,d,e))});return c}function J(a,b){var c=b||{},d;for(d in a)c[d]=a[d];return c}function W(a,b,c){return b==g?c:0>b?Math.max(a.length+b,0):Math.min(a.length,b)}function K(a,b,c){if(n(a))return a.apply(c&&b,C(c||b,G))}function X(a){C(a,function(a){return K(a,void 0,void 0)})}
function P(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}function Y(a){return m(a,/[\x00-\x1f'"\u2028\u2029]/g,P)}function I(a,b){for(var c=0,d,e=[];d=b.exec(a);)e.push(a.substring(c,d.index)),c=d.index+d[0].length;e.push(a.substr(c));return e}function Z(a,b){function c(a,c){var d=[];e.call(c||a,a,function(a,c){r(a)?q(a,function(a,b){c.call(a,a,b)}):B(a,function(a,b){c.call(b,a,b)})},b||G,function(){K(d.push,d,arguments)},ba);return d.join("")}if(L[a])return L[a];var d="with(_.isObject(obj)?obj:{}){"+
C(I(a,/{{|}}}?/g),function(a,c){var b,d=H(a),e=m(d,/^{/),d=d==e?"esc(":"";if(c%2)return(b=/^each\b(\s+([\w_]+(\s*,\s*[\w_]+)?)\s*:)?(.*)/.exec(e))?"each("+(H(b[4])?b[4]:"this")+", function("+b[2]+"){":(b=/^if\b(.*)/.exec(e))?"if("+b[1]+"){":(b=/^else\b\s*(if\b(.*))?/.exec(e))?"}else "+(b[1]?"if("+b[2]+")":"")+"{":(b=/^\/(if)?/.exec(e))?b[1]?"}\n":"});\n":(b=/^(var\s.*)/.exec(e))?b[1]+";":(b=/^#(.*)/.exec(e))?b[1]:(b=/(.*)::\s*(.*)/.exec(e))?"print("+d+'_.formatValue("'+Y(b[2])+'",'+(H(b[1])?b[1]:
"this")+(d&&")")+"));\n":"print("+d+(H(e)?e:"this")+(d&&")")+");\n";if(a)return'print("'+Y(a)+'");\n'}).join("")+"}",e=new Function("obj","each","esc","print","_",d);99<ca.push(c)&&delete L[ca.shift()];return L[a]=c}function ka(a){return m(a,/[<>'"&]/g,function(a){return"&#"+a.charCodeAt(0)+";"})}function da(a,b){return Z(a,ka)(b)}function n(a){return"function"==typeof a&&!a.item}function r(a){return a&&a.length!=g&&!A(a)&&!D(a)&&!n(a)&&a!==p}function ea(a,b){for(var c=0;a&&c<a.length;c++)a[c]===
b&&a.splice(c--,1)}function M(a){return a.Nia=a.Nia||++la}function fa(a,b){var c=[],d={},e;l(a,function(a){l(b(a),function(a){d[e=M(a)]||(c.push(a),d[e]=!0)})});return c}function ma(a,b,c,d,e,f){return function(h,k){var g,u=h||p.event,aa=!f,z=k||u.target||u.srcElement;if(f)for(;z&&z!=b&&!(aa=f(z));)z=z.parentNode;aa&&(g=(!a.apply(t(f?z:b),c||[u,d])||""==e)&&"|"!=e)&&!k&&(u.preventDefault&&(u.preventDefault(),u.stopPropagation()),u.cancelBubble=!0);return!g}}function Q(a,b){l(b,function(a){a.element.detachEvent("on"+
a.a,a.b)})}function ga(a){E?E.push(a):setTimeout(a,0)}function ha(a){return y(l,a,function(a){if(r(a))return ha(a);D(a)&&(a=a.cloneNode(!0),a.removeAttribute&&a.removeAttribute("id"));return a})}function t(a,b,c){return n(a)?ga(a):new N(v(a,b,c))}function v(a,b,c){function d(a){a=y(l,a,function z(a){return r(a)?y(l,a,z):a});return f?V(a,function(a){for(;a=a.parentNode;)if(a==f||c)return a==f}):a}function e(a,b){var c=RegExp("(^|\\s+)"+a+"(?=$|\\s)","i");return function(d){return a?c.test(d[b]):!0}}
var f,h,k,g;if(b&&1!=(b=v(b)).length)return fa(b,function(b){return v(a,b,c)});f=b&&b[0];if(!A(a))return d(a);if(f&&1!=D(f))return[];if(1<(b=a.split(/\s*,\s*/)).length)return fa(b,function(a){return v(a,f,c)});if(b=/(\S+)\s+(.+)$/.exec(a))return v(b[2],v(b[1],f),c);if(a!=(b=m(a,/^#/)))return d(document.getElementById(b));h=(b=/([\w-]*)\.?([\w-]*)/.exec(a))[1];g=b[2];b=(k=document.getElementsByClassName&&g)?(f||document).getElementsByClassName(g):(f||document).getElementsByTagName(h||"*");if(h=k?h:
g)b=V(b,e(h,k?"tagName":"className"));return c?d(b):b}function na(a,b){function c(a,b){var c=RegExp("(^|\\s+)"+a+"(?=$|\\s)","i");return function(d){return a?c.test(d[b]):!0}}var d={},e=d;if(n(a))return a;if("number"==typeof a)return function(b,c){return c==a};if(!a||"*"==a||A(a)&&(e=/^([\w-]*)\.?([\w-]*)$/.exec(a))){var f=c(e[1],"tagName"),h=c(e[2],"className");return function(a){return 1==D(a)&&f(a)&&h(a)}}if(b)return function(c){return t(a,b).find(c)!=g};t(a).each(function(a){d[M(a)]=!0});return function(a){return d[M(a)]}}
function l(a,b){r(a)?q(a,b):a!=g&&b(a,0);return a}function O(){function a(a,d){b==g&&a!=g&&(b=a,h=r(d)?d:[d],setTimeout(function(){q(c,function(a){a()})},0));return b}var b,c=[],d=arguments,e=d.length,f=0,h=[];q(d,function u(b,c){try{b.then?b.then(function(b){var d;(b&&"object"==typeof b||n(b))&&n(d=b.then)?u(d,c):(h[c]=C(arguments,G),++f==e&&a(!0,2>e?h[c]:h))},function(b){h[c]=C(arguments,G);a(!1,2>e?h[c]:[h[c][0],h,c])}):b(function(){a(!0,arguments)},function(){a(!1,arguments)})}catch(d){a(!1,[d,
h,c])}});a.stop=function(){q(d,function(a){a.stop&&a.stop()});return K(a.stop0)};var k=a.then=function(d,e){function f(){try{var a=b?d:e;n(a)?function oa(a){try{var b,c=0;if((a&&"object"==typeof a||n(a))&&n(b=a.then)){if(a===k)throw new TypeError;b.call(a,function(a){c++||oa(a)},function(a){c++||k(!1,[a])});k.stop0=a.stop}else k(!0,[a])}catch(d){c++||k(!1,[d])}}(K(a,ia,h)):k(b,h)}catch(c){k(!1,[c])}}var k=O();k.stop0=a.stop;b!=g?setTimeout(f,0):c.push(f);return k};a.always=function(a){return k(a,
a)};a.error=function(a){return k(0,a)};return a}function N(a,b){var c=0;if(a)for(var d=0,e=a.length;d<e;d++){var f=a[d];if(b&&r(f))for(var h=0,k=f.length;h<k;h++)this[c++]=f[h];else this[c++]=f}else this[c++]=b;this.length=c;this._=!0}function ba(){return new N(arguments,!0)}var p=this,R={},S={},la=1,w={},E=/^[ic]/.test(document.readyState)?g:[],x=!!document.all&&!document.addEventListener,g=null,ia,T=I("January,February,March,April,May,June,July,August,September,October,November,December",/,/g);
C(T,U);T=I("Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",/,/g);C(T,U);I("am,pm",/,/g);I("am,am,am,am,am,am,am,am,am,am,am,am,pm,pm,pm,pm,pm,pm,pm,pm,pm,pm,pm,pm",/,/g);var L={},ca=[];J({each:function(a){return function(b,c,d){return a(this,b,c,d)}}(q),e:0,remove:function(){l(this,function(a){x&&1==D(a)&&(l(v("*",a),function(a){Q(0,w[a.Nia]);delete w[a.Nia]}),Q(0,w[a.Nia]),delete w[a.Nia]);a.parentNode.removeChild(a)})},get:function(a,b){var c=this,d=c[0];if(d){if(A(a)){var e=/^(\W*)(.*)/.exec(m(a,
/^%/,"@data-")),f=e[1],d=S[f]?S[f](this,e[2]):"$"==a?c.get("className"):"$$"==a?x?d.style.cssText:c.get("@style"):"$$slide"==a?c.get("$height"):"$$fade"==a||"$$show"==a?"hidden"==c.get("$visibility")||"none"==c.get("$display")?0:"$$fade"==a?x?isNaN(c.get("$filter",!0))?1:c.get("$filter",!0)/100:isNaN(c.get("$opacity",!0))?1:c.get("$opacity",!0):1:"$$scrollX"==a?p.pageXOffset!=g?p.pageXOffset:(document.documentElement||document.body.parentNode||document.body).scrollLeft:"$$scrollY"==a?p.pageXOffset!=
g?p.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:"$"==f?p.getComputedStyle?p.getComputedStyle(d,g).getPropertyValue(m(e[2],/[A-Z]/g,function(a){return"-"+a.toLowerCase()})):(d.currentStyle||d.style)[m(e[2],/^float$/,"cssFloat")]:"@"==f?d.getAttribute(e[2]):d[e[2]];return b?parseFloat(m(d,/^[^\d-]+/)):d}var h={};(r(a)?l:B)(a,function(a){h[a]=c.get(a,b)});return h}},set:function(a,b){var c=this;if(b!==ia){var d=/^(\W*)(.*)/.exec(m(m(a,/^\$float$/,"cssFloat"),
/^%/,"@data-")),e=d[1];if(R[e])R[e](this,d[2],b);else"$$fade"==a?c.set({$visibility:b?"visible":"hidden"}).set(x?1>b?{$filter:"alpha(opacity = "+100*b+")",$zoom:1}:{$filter:""}:{$opacity:b}):"$$slide"==a?c.set({$visibility:b?"visible":"hidden",$overflow:"hidden",$height:/px/.test(b)?b:function(a,c,d){a=t(d);d={$position:"absolute",$visibility:"hidden",$display:"block",$height:g};c=a.get(d);d=a.set(d).get("clientHeight");a.set(c);return d*b+"px"}}):"$$show"==a?b?c.set({$visibility:b?"visible":"hidden",
$display:""}).set({$display:function(a){return"none"==a?"block":a}}):c.set({$display:"none"}):"$$"==a?x?c.set("$cssText",b):c.set("@style",b):l(this,function(c,h){var k=n(b)?b(t(c).get(a),h,c):b;"$"==e?d[2]?c.style[d[2]]=k:l(k&&k.split(/\s+/),function(a){var b=m(a,/^[+-]/),d=c.className||"",e=m(d,RegExp("(^|\\s+)"+b+"(?=$|\\s)"));if(/^\+/.test(a)||b==a&&d==e)e+=" "+b;c.className=H(e)}):"$$scrollX"==a?c.scroll(k,t(c).get("$$scrollY")):"$$scrollY"==a?c.scroll(t(c).get("$$scrollX"),k):"@"==e?k==g?c.removeAttribute(d[2]):
c.setAttribute(d[2],k):c[d[2]]=k})}else A(a)||n(a)?c.set("$",a):B(a,function(a,b){c.set(a,b)});return c},add:function(a,b){return this.each(function(c,d){function e(a){r(a)?l(a,e):n(a)?e(a(c,d)):a!=g&&(a=D(a)?a:document.createTextNode(a),f?f.parentNode.insertBefore(a,f.nextSibling):b?b(a,c,c.parentNode):c.appendChild(a),f=a)}var f;e(d&&!n(a)?ha(a):a)})},values:function(a){var b=a||{};this.each(function(a){var d=a.name||a.id,e=F(a.value);if(/form/i.test(a.tagName))for(d=0;d<a.elements.length;d++)t(a.elements[d]).values(b);
else!d||/ox|io/i.test(a.type)&&!a.checked||(b[d]=b[d]==g?e:y(l,[b[d],e],G))});return b},on:function(a,b,c,d,e){return n(b)?this.on(g,a,b,c,e):A(d)?this.on(a,b,c,g,d):this.each(function(f,h){l(a?v(a,f):f,function(a){l(F(b).split(/\s/),function(b){var f=m(b,/[?|]/),g=!!e&&("blur"==f||"focus"==f),l=ma(c,a,d,h,m(b,/[^?|]/g),e&&na(e,a));b={element:a,b:l,a:f,c:g};(c.M=c.M||[]).push(b);x?(a.attachEvent("on"+b.a+(g?"in":""),l),f=M(a),(w[f]=w[f]||[]).push(b)):(a.addEventListener(f,l,g),(a.M=a.M||[]).push(b))})})})},
onClick:function(a,b,c,d){return n(b)?this.on(a,"click",b,c,d):this.onClick(g,a,b,c)},trigger:function(a,b){return this.each(function(c){for(var d,e=c;e&&!d;)l(x?w[e.Nia]:e.M,function(e){e.a==a&&(d=d||!e.b(b,c))}),e=e.parentNode})},ht:function(a,b){var c;if(2<arguments.length){c=arguments;var d=[];if(c)for(var e=W(c,void 0,c.length),f=W(c,1,0);f<e;f++)d.push(c[f]);c=d;d=void 0;for(e=0;e<c.length;e++)d=J(c[e],d);c=d}else c=b;return this.set("innerHTML",n(a)?a(c):/{{/.test(a)?da(a,c):/^#\S+$/.test(a)?
da(v(a,void 0,void 0)[0].text,c):a)}},N.prototype);J({request:function(a,b,c,d){d=d||{};var e,f=0,h=O(),k=c&&c.constructor==d.constructor;try{h.xhr=e=p.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Msxml2.XMLHTTP.3.0"),h.stop0=function(){e.abort()},k&&(c=y(B,c,function(a,b){return y(l,b,function(b){return encodeURIComponent(a)+(b!=g?"="+encodeURIComponent(b):"")})}).join("&")),c==g||/post/i.test(a)||(b+="?"+c,c=g),e.open(a,b,!0,d.user,d.pass),k&&/post/i.test(a)&&e.setRequestHeader("Content-Type",
"application/x-www-form-urlencoded"),B(d.headers,function(a,b){e.setRequestHeader(a,b)}),B(d.xhr,function(a,b){e[a]=b}),e.onreadystatechange=function(){4!=e.readyState||f++||(200==e.status?h(!0,[e.responseText,e]):h(!1,[e.status,e.responseText,e]))},e.send(c)}catch(m){f||h(!1,[0,g,F(m)])}return h},toJSON:function b(c){return c==g?""+c:A(c=c.valueOf())?'"'+m(c,/[\\\"\x00-\x1f\u2028\u2029]/g,P)+'"':r(c)?"["+y(l,c,b).join()+"]":c&&"object"==typeof c?"{"+y(B,c,function(c,e){return b(c)+":"+b(e)}).join()+
"}":F(c)},parseJSON:p.JSON?p.JSON.parse:function(b){b=m(b,/[\x00\xad\u0600-\uffff]/g,P);if(/^[[\],:{}\s]*$/.test(m(m(b,/\\["\\\/bfnrtu]/g),/"[^"\\\n\r]*"|true|false|null|[\d.eE+-]+/g)))return eval("("+b+")")},ready:ga,off:function(b){l(b.M,function(b){x?(b.element.detachEvent("on"+b.a+(b.c?"in":""),b.b),ea(w[b.element.Nia],b)):(b.element.removeEventListener(b.a,b.b,b.c),ea(b.element.M,b))});b.M=g},wait:function(b,c){var d=O(),e=setTimeout(function(){d(!0,c)},b);d.stop0=function(){d(!1);clearTimeout(e)};
return d}},t);J({each:q,toObject:function(b,c){var d={};q(b,function(b){d[b]=c});return d},template:Z,d:0,promise:O},ba);if(x){var ja=function(){X(E);E=g};document.attachEvent("onreadystatechange",function(){/^[ic]/.test(document.readyState)&&ja()});p.attachEvent("onload",ja)}else document.addEventListener("DOMContentLoaded",function(){X(E);E=g},!1);p.f=function(){l(w,Q)};return{$:t,M:N,getter:S,setter:R}});
module.exports = myObj;
}, {}],
4: [function(require, module, exports) {

/*!
 *  Project: gsndfp
 * ===============================
 */

(function() {
  (function(win) {
    'use strict';
    var $doc, $win, circplusTemplate, gmodal, gsnSw, gsndfpfactory, qsel, swcss, trakless, trakless2;
    trakless2 = require('trakless');
    trakless = win.trakless;
    gmodal = require('gmodal');
    swcss = require('./sw.css');
    circplusTemplate = require('./circplus.html');
    $win = win;
    qsel = $win.trakless.util.$;
    $doc = $win.document;
    gsnSw = null;

    /** 
     * gsndfpfactory
    #
     */
    gsndfpfactory = (function() {
      var didOpen;

      function gsndfpfactory() {}

      gsndfpfactory.prototype.dfpID = '';

      gsndfpfactory.prototype.count = 0;

      gsndfpfactory.prototype.rendered = 0;

      gsndfpfactory.prototype.dfpSelector = '.gsnunit';

      gsndfpfactory.prototype.dfpOptions = {};

      gsndfpfactory.prototype.dfpIsLoaded = false;

      gsndfpfactory.prototype.$adCollection = void 0;

      gsndfpfactory.prototype.adBlockerOn = false;

      gsndfpfactory.prototype.storeAs = 'gsnunit';

      gsndfpfactory.prototype.lastRefresh = 0;

      gsndfpfactory.prototype.bodyTemplate = circplusTemplate;

      didOpen = false;

      gsndfpfactory.prototype.init = function(id, options) {
        var selector, self;
        self = this;
        self.dfpLoader();
        options = options || {};
        if ((id != null)) {
          self.dfpID = id;
        }
        self.setOptions(options);
        self.dfpSelector = options.dfpSelector || '.gsnunit';
        options = self.dfpOptions;
        selector = self.dfpSelector;
        if (selector === '.circplus') {
          if (qsel(selector).length > 0) {
            if (options.templateSelector) {
              qsel(selector).ht(qsel(options.templateSelector).innerHTML);
            } else {
              qsel(selector).ht(options.bodyTemplate || self.bodyTemplate);
            }
          }
          self.$adCollection = [qsel('.cpslot1')[0], qsel('.cpslot2')[0]];
          self.storeAs = 'circplus';
          self.createAds();
          self.displayAds();
        } else if (selector === '.gsnsw') {
          if (qsel(options.displayWhenExists || '.gsnunit').length <= 0) {
            return;
          }
          self.storeAs = 'gsnsw';
          if (self.getCookie('gsnsw2') === null) {
            self.getPopup(selector);
            Gsn.Advertising.on('clickBrand', function(e) {
              $win.gmodal.hide();
            });
          } else {
            self.onCloseCallback({
              cancel: true
            });
          }
          gsnSw = self;
          return self;
        } else {
          self.$adCollection = qsel(selector);
          self.createAds();
          self.displayAds();
        }
        return this;
      };

      gsndfpfactory.prototype.setOptions = function(options) {
        var dfpOptions, k, self, v;
        self = this;
        dfpOptions = {
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
        for (k in options) {
          v = options[k];
          dfpOptions[k] = v;
        }
        self.dfpOptions = dfpOptions;
        return this;
      };

      gsndfpfactory.prototype.onOpenCallback = function(event) {
        var self;
        self = gsnSw;
        self.didOpen = true;
        qsel('.remove').remove();
        self.$adCollection = qsel(self.dfpSelector);
        self.createAds();
        self.displayAds();
        setTimeout((function() {
          if (self.adBlockerOn) {
            qsel('.sw-msg')[0].style.display = 'block';
            qsel('.sw-header-copy')[0].style.display = 'none';
            qsel('.sw-row')[0].style.display = 'none';
          }
        }), 150);
      };

      gsndfpfactory.prototype.onCloseCallback = function(event) {
        var self;
        self = gsnSw;
        $win.scrollTo(0, 0);
        if (!self.getCookie('gsnsw2')) {
          self.setCookie('gsnsw2', Gsn.Advertising.gsnNetworkId + "," + Gsn.Advertising.enableCircPlus + "," + Gsn.Advertising.disableSw, 1);
        }
        if (typeof self.dfpOptions.onClose === 'function') {
          self.dfpOptions.onClose(self.didOpen);
        }
      };

      gsndfpfactory.prototype.swSucccess = function(myrsp) {
        var data, evt, rsp, self;
        rsp = JSON.parse(myrsp);
        self = gsnSw;
        if (rsp) {
          if (!Gsn.Advertising.gsnNetworkId) {
            Gsn.Advertising.gsnNetworkId = rsp.NetworkId;
          }
          Gsn.Advertising.enableCircPlus = rsp.EnableCircPlus;
          Gsn.Advertising.disableSw = rsp.DisableSw;
          data = rsp.Template;
        }
        self.dfpID = Gsn.Advertising.getNetworkId();
        evt = {
          data: rsp,
          cancel: false
        };
        self.dfpOptions.onData(evt);
        if (evt.cancel) {
          data = null;
        }
        if (data) {
          data = data.replace(/%%CACHEBUSTER%%/g, (new Date).getTime()).replace(/%%CHAINID%%/g, Gsn.Advertising.gsnid);
          $win.gmodal.on('show', self.onOpenCallback);
          $win.gmodal.on('hide', self.onCloseCallback);
          $win.gmodal.on('click', function(evt) {
            if (evt.target.className.indexOf('sw-close') >= 0) {
              return $win.gmodal.hide();
            }
          });
          $win.gmodal.show({
            content: "<div id='sw'>" + data + "<div>",
            closeCls: 'sw-close'
          });
        } else {
          self.onCloseCallback({
            cancel: true
          });
        }
        return this;
      };

      gsndfpfactory.prototype.getPopup = function(selector) {
        var dataType, self, url;
        self = this;
        url = Gsn.Advertising.apiUrl + "/ShopperWelcome/Get/" + Gsn.Advertising.gsnid;
        dataType = 'json';
        if (!!($win.opera && $win.opera.version)) {
          if ($doc.all && !$win.atop) {
            $win.gsnswCallback = function(rsp) {
              return self.swSucccess(rsp);
            };
            url += '?callback=gsnswCallback';
            dataType = 'jsonp';
          }
        }
        if (dataType === 'jsonp') {

        } else {
          qsel.request('GET', url).then(self.swSucccess);
        }
        return this;
      };

      gsndfpfactory.prototype.getCookie = function(nameOfCookie) {
        var begin, cookieData, cookieDatas, end;
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
              cookieDatas = cookieData.split(',');
              Gsn.Advertising.gsnNetworkId = cookieDatas[0];
              Gsn.Advertising.enableCircPlus = cookieData[1];
              Gsn.Advertising.disableSw = cookieData[2];
            }
            return cookieData;
          }
        }
        return null;
      };

      gsndfpfactory.prototype.setCookie = function(nameOfCookie, value, expiredays) {
        var ExpireDate;
        ExpireDate = new Date;
        ExpireDate.setTime(ExpireDate.getTime() + expiredays * 24 * 3600 * 1000);
        $doc.cookie = nameOfCookie + '=' + encodeURI(value) + (expiredays === null ? '' : '; expires=' + ExpireDate.toGMTString()) + '; path=/';
      };

      gsndfpfactory.prototype.clearCookie = function(nameOfCookie) {
        var self;
        self = this;
        if (nameOfCookie === self.getCookie(nameOfCookie)) {
          $doc.cookie = nameOfCookie + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      };

      gsndfpfactory.prototype.createAds = function() {
        var $adUnit, $existingContent, adUnit, adUnitID, allData, dimensions, i, k, len, ref, self;
        self = this;
        self.dfpID = Gsn.Advertising.getNetworkId();
        ref = self.$adCollection;
        for (k = i = 0, len = ref.length; i < len; k = ++i) {
          adUnit = ref[k];
          $adUnit = qsel(adUnit);
          allData = trakless.util.allData(adUnit);
          self.count++;
          adUnitID = self.getID($adUnit, self.storeAs, self.count, adUnit);
          dimensions = self.getDimensions($adUnit, allData);
          $existingContent = adUnit.innerHTML;
          $adUnit.ht('').set('$', '+display-none');
          $win.googletag.cmd.push(function() {
            var $adUnitData, companion, exclusions, exclusionsGroup, googleAdUnit, j, len1, targeting, v, valueTrimmed;
            googleAdUnit = void 0;
            $adUnitData = adUnit[self.storeAs];
            if ($adUnitData) {
              return;
            }
            self.dfpID = self.dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
            if (self.dfpID.indexOf('/') !== 0) {
              self.dfpID = '/' + dfpID;
            }
            if (allData['outofpage']) {
              googleAdUnit = $win.googletag.defineOutOfPageSlot(self.dfpID, adUnitID).addService($win.googletag.pubads());
            } else {
              googleAdUnit = $win.googletag.defineSlot(self.dfpID, dimensions, adUnitID).addService($win.googletag.pubads());
            }
            companion = allData['companion'];
            if (companion != null) {
              googleAdUnit.addService($win.googletag.companionAds());
            }
            targeting = allData['targeting'];
            if (targeting) {
              if (typeof targeting === 'string') {
                targeting = eval('(' + targeting + ')');
              }
              for (k in targeting) {
                v = targeting[k];
                if (k === 'brand') {
                  Gsn.Advertising.setBrand(v);
                }
                googleAdUnit.setTargeting(k, v);
                return;
              }
            }
            exclusions = allData['exclusions'];
            if (exclusions) {
              exclusionsGroup = exclusions.split(',');
              valueTrimmed = void 0;
              for (k = j = 0, len1 = exclusionsGroup.length; j < len1; k = ++j) {
                v = exclusionsGroup[k];
                valueTrimmed = trakless.util.trim(v);
                if (valueTrimmed.length > 0) {
                  googleAdUnit.setCategoryExclusion(valueTrimmed);
                }
                return;
              }
            }
            googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded || googleAdUnit.renderEnded;
            googleAdUnit.renderEnded = function() {
              var display;
              rendered++;
              display = adUnit.style.display;
              $adUnit.set('$', '-display-none').set('$', '+display-' + display);
              if (googleAdUnit.oldRenderEnded != null) {
                googleAdUnit.oldRenderEnded();
              }
              if (typeof dfpOptions.afterEachAdLoaded === 'function') {
                dfpOptions.afterEachAdLoaded.call(this, $adUnit);
              }
              if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === self.count) {
                dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
              }
            };
            adUnit[self.storeAs] = googleAdUnit;
          });
        }
        $win.googletag.cmd.push(function() {
          var brand, exclusionsGroup, j, len1, ref1, v, valueTrimmed;
          if (typeof self.dfpOptions.setTargeting['brand'] === 'undefined') {
            brand = Gsn.Advertising.getBrand();
            if (brand != null) {
              self.dfpOptions.setTargeting['brand'] = brand;
            }
          }
          if (self.dfpOptions.enableSingleRequest) {
            $win.googletag.pubads().enableSingleRequest();
          }
          ref1 = self.dfpOptions.setTargeting;
          for (k in ref1) {
            v = ref1[k];
            if (k === 'brand') {
              Gsn.Advertising.setBrand(v);
            }
            $win.googletag.pubads().setTargeting(k, v);
          }
          if (typeof self.dfpOptions.setLocation === 'object') {
            if (typeof self.dfpOptions.setLocation.latitude === 'number' && typeof self.dfpOptions.setLocation.longitude === 'number' && typeof self.dfpOptions.setLocation.precision === 'number') {
              $win.googletag.pubads().setLocation(self.dfpOptions.setLocation.latitude, self.dfpOptions.setLocation.longitude, self.dfpOptions.setLocation.precision);
            } else if (typeof self.dfpOptions.setLocation.latitude === 'number' && typeof self.dfpOptions.setLocation.longitude === 'number') {
              $win.googletag.pubads().setLocation(self.dfpOptions.setLocation.latitude, self.dfpOptions.setLocation.longitude);
            }
          }
          if (self.dfpOptions.setCategoryExclusion.length > 0) {
            exclusionsGroup = self.dfpOptions.setCategoryExclusion.split(',');
            for (k = j = 0, len1 = exclusionsGroup.length; j < len1; k = ++j) {
              v = exclusionsGroup[k];
              valueTrimmed = trakless.util.trim(v);
              if (valueTrimmed.length > 0) {
                $win.googletag.pubads().setCategoryExclusion(valueTrimmed);
              }
            }
          }
          if (self.dfpOptions.collapseEmptyDivs || self.dfpOptions.collapseEmptyDivs === 'original') {
            $win.googletag.pubads().collapseEmptyDivs();
          }
          if (self.dfpOptions.disablePublisherConsole) {
            $win.googletag.pubads().disablePublisherConsole();
          }
          if (self.dfpOptions.disableInitialLoad) {
            $win.googletag.pubads().disableInitialLoad();
          }
          if (self.dfpOptions.noFetch) {
            $win.googletag.pubads().noFetch();
          }
          if (self.dfpSelector === '.circplus') {
            $win.googletag.companionAds().setRefreshUnfilledSlots(true);
          }
          $win.googletag.enableServices();
        });
      };

      gsndfpfactory.prototype.isInView = function(elem) {

        /**
        docViewTop = $win.scrollTop()
        docViewBottom = docViewTop + $win.height()
        elemTop = elem.offset().top
        elemBottom = elemTop + elem.height()
        
         * is more than half of the element visible
        elemTop + (elemBottom - elemTop) / 2 >= docViewTop and elemTop + (elemBottom - elemTop) / 2 <= docViewBottom
         */
        return true;
      };

      gsndfpfactory.prototype.displayAds = function() {
        var $adUnit, $adUnitData, adUnit, currentTime, i, k, len, ref, self, toPush;
        self = this;
        currentTime = (new Date()).getTime();
        if ((currentTime - self.lastRefresh) < 1000) {
          return self;
        }
        self.lastRefresh = currentTime;
        toPush = [];
        ref = self.$adCollection;
        for (k = i = 0, len = ref.length; i < len; k = ++i) {
          adUnit = ref[k];
          $adUnit = qsel(adUnit);
          $adUnitData = adUnit[self.storeAs];
          if (self.dfpOptions.refreshExisting && $adUnitData && adUnit['gsnDfpExisting']) {
            if (!self.dfpOptions.inViewOnly || self.isInView($adUnit)) {
              toPush.push($adUnitData);
            }
          } else {
            adUnit['gsnDfpExisting'] = true;
            $win.googletag.cmd.push(function() {
              return $win.googletag.display($adUnit.get('@id'));
            });
          }
        }
        if (toPush.length > 0) {
          $win.googletag.cmd.push(function() {
            return $win.googletag.pubads().refresh(toPush);
          });
        }
      };

      gsndfpfactory.prototype.getID = function($adUnit, adUnitName, count, adUnit) {
        var self;
        self = this;
        if (!self.dfpOptions.refreshExisting) {
          delete adUnit[self.storeAs];
          delete adUnit['gsnDfpExisting'];
          if ($adUnit.get('@id')) {
            $adUnit.set('@id', adUnitName + '-auto-gen-id-' + count);
          }
        }
        return $adUnit.get('@id') || $adUnit.set('@id', adUnitName + '-auto-gen-id-' + count).get('@id');
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
        var gads, node, useSsl;
        if (self.dfpIsLoaded) {
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
        useSsl = 'https:' === $doc.location.protocol;
        gads.src = (useSsl ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
        node = $doc.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(gads, node);
        self.dfpIsLoaded = true;
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
    return module.exports = gsndfpfactory;
  })(window);

}).call(this);

}, {"trakless":3,"gmodal":26,"./sw.css":27,"./circplus.html":28}],
26: [function(require, module, exports) {
(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
(function() {
  var $baseCls, $closeCls, $css, $doc, $tpl, $win, Emitter, createModal, hasCls, injectStyle, modal, result;

  Emitter = require('emitter');

  $tpl = require('./template.html');

  $css = require('./index.css');

  $win = window;

  $doc = $win.document;

  $baseCls = 'gmodal';

  $closeCls = 'gmodal-close';

  injectStyle = function(id, data) {
    var el;
    el = $doc.getElementById(id);
    if (!el) {
      el = $doc.createElement('style');
      el.type = 'text/css';
      el.appendChild($doc.createTextNode(data));
      return ($doc.head || $doc.getElementsByTagName('head')[0]).appendChild(el);
    }
  };

  hasCls = function(el, cls) {
    var i, k, len, ref, v;
    ref = cls.split(' ');
    for (k = i = 0, len = ref.length; i < len; k = ++i) {
      v = ref[k];
      if ((' ' + el.className).indexOf(' ' + v) >= 0) {
        return true;
      }
    }
    return false;
  };

  createModal = function() {
    var el, myKeypress;
    el = $doc.getElementById("gmodal");
    if (!el) {
      injectStyle('gmodal-css', $css);
      el = $doc.createElement('div');
      el.id = 'gmodal';
      el.onclick = function(evt) {
        evt = evt || $win.event;
        evt.target = evt.target || evt.srcElement;
        if (hasCls(evt.target, "gmodal-wrap " + $closeCls) || evt.target === el) {
          gmodal.emit('click', evt);
        }
        return false;
      };
      myKeypress = function(evt) {
        evt = evt || $win.event;
        evt.target = evt.target || evt.srcElement;
        if (hasCls(evt.target, "gmodal-wrap") || evt.target === el || evt.target === $doc || evt.target === $doc.body) {
          if ((evt.which || evt.keyCode) === 27) {
            gmodal.emit('esc', evt);
          }
        }
        return false;
      };
      el.onkeypress = myKeypress;
      $doc.onkeypress = myKeypress;
      el.ontap = function(evt) {
        evt = evt || $win.event;
        evt.target = evt.target || evt.srcElement;
        if (hasCls(evt.target, "gmodal-wrap " + $closeCls) || evt.target === el) {
          gmodal.emit('tap', evt);
        }
        return false;
      };
      el.innerHTML = $tpl;
      $doc.getElementsByTagName('body')[0].appendChild(el);
    }
    return el;
  };


  /**
   * modal
   */

  modal = (function() {
    function modal() {}

    modal.prototype.elWrapper = null;

    modal.prototype.el = null;

    modal.prototype.options = {};

    modal.prototype.show = function(options) {
      var self;
      self = this;
      self.elWrapper = createModal();
      if (!self.el) {
        self.el = $doc.getElementById("gmodalContent");
      }
      if ((options != null)) {
        self.options = options;
        if ((self.options.content != null)) {
          self.el.innerHTML = self.options.content;
          self.options.content = null;
        }
      }
      if (!self.options) {
        return self;
      }
      if (self.options.closeCls) {
        $closeCls = self.options.closeCls;
      }
      self.elWrapper.style.display = self.elWrapper.style.visibility = "";
      self.elWrapper.className = ($baseCls + " gmodal-show ") + (self.options.cls || '');
      self.emit('show');
      return this;
    };

    modal.prototype.hide = function() {
      var self;
      self = this;
      if (!self.elWrapper) {
        return self;
      }
      self.elWrapper.className = "" + $baseCls;
      self.emit('hide');
      return this;
    };

    modal.prototype.injectStyle = injectStyle;

    modal.prototype.hasCls = hasCls;

    return modal;

  })();

  Emitter(modal.prototype);

  result = new modal();

  $win.gmodal = result;

  module.exports = result;

}).call(this);

}, {"emitter":2,"./template.html":3,"./index.css":4}],
2: [function(require, module, exports) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

}, {}],
3: [function(require, module, exports) {
module.exports = '<div class="gmodal-wrap gmodal-top">&nbsp;<div>\n<div class="gmodal-wrap gmodal-left"></div><div class="gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div>';
}, {}],
4: [function(require, module, exports) {
module.exports = '.gmodal {\n    display: none;\n    overflow: hidden;\n    outline: 0;\n    -webkit-overflow-scrolling: touch;\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 9999990;  /* based on safari 16777271 */ \n}\n.gmodal-show { display: table }\n.gmodal-wrap,\n.gmodal-content {\n    display: table-cell;\n    width: 33%;\n}';
}, {}]}, {}, {"1":""})

}, {"emitter":18}],
27: [function(require, module, exports) {
module.exports = '.gsnsw {\n  float: left;\n}\n\n.gmodal {\n  filter: alpha(opacity=75); /* IE8 */\n  background: #000; /* IE8 */\n  background: rgba(0,0,0,0.75);\n}';
}, {}],
28: [function(require, module, exports) {
module.exports = '<div class="gsn-slot-container"><div class="cpslot cpslot2" data-companion="true" data-dimensions="300x50"></div></div><div class="gsn-slot-container"><div class="cpslot cpslot1" data-dimensions="300x100,300x120"></div></div>';
}, {}]}, {}, {"1":""})
