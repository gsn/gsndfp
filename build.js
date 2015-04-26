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
  require("./index.coffee");

}).call(this);

}, {"./index.coffee":2}],
2: [function(require, module, exports) {
(function() {
  var assert, gsndfp;

  gsndfp = require('../src/index.coffee');

  assert = require('component-assert');

  describe('gsndfp.load', function() {
    return it('should initiate shopper welcome', function() {
      return gsndfp.Advertising.load(119);
    });
  });

}).call(this);

}, {"../src/index.coffee":3,"component-assert":4}],
3: [function(require, module, exports) {
(function() {
  var Plugin, _tk, aPlugin, attrs, buildqs, circPlus, debug, doc, dom, fn, gsnContext, gsnSw2, gsndfpfactory, gsnpods, i, j, k, lastRefreshTime, len, len1, loadiframe, log, myGsn, myPlugin, oldGsnAdvertising, prefix, ref, ref1, script, trakless2, win;

  debug = require('debug');

  log = debug('gsndfp');

  trakless2 = require('trakless');

  loadiframe = require('load-iframe');

  dom = require('dom');

  gsndfpfactory = require('./gsndfpfactory.coffee');

  if (typeof console !== "undefined" && console !== null) {
    if ((console.log.bind != null)) {
      log.log = console.log.bind(console);
    }
  }

  win = window;

  doc = win.document;

  gsnContext = win.gsnContext;

  _tk = win._tk;

  myGsn = win.Gsn || {};

  oldGsnAdvertising = myGsn.Advertising;

  gsnSw2 = new gsndfpfactory();

  gsnpods = new gsndfpfactory();

  circPlus = new gsndfpfactory();

  lastRefreshTime = 0;

  if (oldGsnAdvertising != null) {
    if (oldGsnAdvertising.pluginLoaded) {
      return;
    }
  }

  Plugin = (function() {
    function Plugin() {}

    Plugin.prototype.pluginLoaded = true;

    Plugin.prototype.defP = {
      page: void 0,
      evtname: void 0,
      dept: void 0,
      deviceid: void 0,
      storeid: void 0,
      consumerid: void 0,
      isanon: true,
      loyaltyid: void 0,
      aisle: void 0,
      category: void 0,
      shelf: void 0,
      brand: void 0,
      pcode: void 0,
      pdesc: void 0,
      latlng: void 0,
      evtcategory: void 0,
      evtproperty: void 0,
      evtaction: void 0,
      evtvalue: void 0
    };

    Plugin.prototype.translator = {
      page: 'dt',
      evtname: 'en',
      dept: 'dpt',
      deviceid: 'dvceid',
      storeid: 'stid',
      consumerid: 'uid',
      isanon: 'anon',
      loyaltyid: 'loyid',
      aisle: 'aisle',
      category: 'cat',
      shelf: 'shf',
      brand: 'bn',
      pcode: 'ic',
      pdesc: 'in',
      latlng: 'lln',
      evtcategory: 'ec',
      evtproperty: 'ep',
      evtlabel: 'el',
      evtaction: 'ea',
      evtvalue: 'ev'
    };

    Plugin.prototype.isDebug = false;

    Plugin.prototype.gsnid = 0;

    Plugin.prototype.selector = 'body';

    Plugin.prototype.apiUrl = 'https://clientapi.gsngrocers.com/api/v1';

    Plugin.prototype.gsnNetworkId = void 0;

    Plugin.prototype.gsnNetworkStore = void 0;

    Plugin.prototype.onAllEvents = void 0;

    Plugin.prototype.oldGsnAdvertising = oldGsnAdvertising;

    Plugin.prototype.minSecondBetweenRefresh = 5;

    Plugin.prototype.enableCircPlus = false;

    Plugin.prototype.disableSw = '';

    Plugin.prototype.source = '';

    Plugin.prototype.targetting = {};

    Plugin.prototype.depts = '';

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

    Plugin.prototype.getNetworkId = function(includeStore) {
      var result, self;
      self = this;
      result = self.gsnNetworkId + ((self.source || "").length > 0 ? "." + self.source : "");
      if (includeStore) {
        result = result.replace(/\/$/gi, '') + (self.gsnNetworkStore || '');
      }
      return result;
    };


    /**
     * emit a gsnevent
    #
     * @param {String} en - event name
     * @param {Object} ed - event data
     * @return {Object}
     */

    Plugin.prototype.emit = function(en, ed) {
      if (en.indexOf('gsnevent') < 0) {
        en = 'gsnevent:' + en;
      }
      win.setTimeout((function() {
        _tk.emitTop(en, {
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
      trakless.on(en, cb);
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
      trakless.off(en, cb);
      return this;
    };


    /**
     * loggingn data
    #
     * @param {String} message - log message
     * @return {Object}
     */

    Plugin.prototype.log = function(message) {
      var self;
      self = myGsn.Advertising;
      if (self.isDebug || debug.enabled('gsndfp')) {
        self.isDebug = true;
        if (typeof message === 'object') {
          try {
            message = JSON.stringify(message);
          } catch (_error) {

          }
        }
        log(message);
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
      var k, k2, self, tsP, v;
      self = myGsn.Advertising;
      tsP = {};
      if (typeof actionParam === 'object') {
        for (k in actionParam) {
          v = actionParam[k];
          if (!(v != null)) {
            continue;
          }
          k2 = self.translator[k];
          if (k2) {
            tsP[k2] = v;
          }
        }
      }
      _tk.track('gsn', tsP);
      self.log(actionParam);
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
      var goodDept, self;
      self = myGsn.Advertising;
      if (dept != null) {
        goodDept = self.cleanKeyword(dept);
        goodDept = "," + goodDept;
        if (self.depts.indexOf(goodDept) < 0) {
          self.depts = "" + goodDept + self.depts;
        }
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
      var img;
      if (typeof url === 'string') {
        if (url.length < 10) {
          return;
        }
        url = url.replace('%%CACHEBUSTER%%', (new Date).getTime());
        img = new Image(1, 1);
        img.src = url;
      }
      return this;
    };


    /**
     * Trigger when a product is clicked.  AKA: clickThru
    #
     */

    Plugin.prototype.clickProduct = function(click, categoryId, brandName, productDescription, productCode, quantity, displaySize, regularPrice, currentPrice, savingsAmount, savingsStatement, adCode, creativeId) {
      this.ajaxFireUrl(click);
      this.emit('clickProduct', {
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
      this.emit('clickBrickOffer', {
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
      this.emit('clickBrand', {
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
      this.emit('clickPromotion', {
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
      this.emit('clickRecipe', {
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
      this.emit('clickLink', {
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
      var canRefresh, k, payLoad, ref, self, targetting, v;
      self = myGsn.Advertising;
      payLoad = actionParam || {};
      ref = self.defP;
      for (k in ref) {
        v = ref[k];
        if (v != null) {
          if (!payLoad[k]) {
            payLoad[k] = v;
          }
        }
      }
      if (gsnSw2.isVisible) {
        return self;
      }
      payLoad.siteid = self.gsnid;
      self.trackAction(payLoad);
      canRefresh = ((new Date).getTime() / 1000 - lastRefreshTime) >= self.minSecondBetweenRefresh;
      if (forceRefresh || canRefresh) {
        lastRefreshTime = (new Date()).getTime() / 1000;
        if ((payLoad.dept != null)) {
          self.addDept(payLoad.dept);
        }
        if (forceRefresh) {
          self.refreshExisting.pods = false;
          self.refreshExisting.circPlus = false;
        }
        targetting = {
          dept: self.depts.split(',').slice(1, 5),
          brand: self.getBrand()
        };
        if (payLoad.page) {
          targetting.kw = payLoad.page.replace(/[^a-z]/gi, '');
        }
        if (targetting.dept.length > 0) {
          self.depts = "," + targetting.dept.join(',');
        } else {
          targetting.dept = ['produce'];
        }
        gsnpods.refresh({
          setTargeting: targetting,
          sel: '.gsnunit',
          refreshExisting: self.refreshExisting.pods
        });
        self.refreshExisting.pods = true;
        if (self.enableCircPlus) {
          targetting.dept = [targetting.dept[0]];
          circPlus.refresh({
            setTargeting: targetting,
            bodyTemplate: self.bodyTemplate,
            sel: '.circplus',
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
        if (gsnSw2.isVisible) {
          return self;
        }
        gsnSw2.refresh({
          displayWhenExists: '.gsnadunit,.gsnunit',
          sel: '.gsnsw',
          onData: function(evt) {
            if ((self.source || '').length > 0) {
              return evt.cancel = self.disableSw.indexOf(self.source) > 0;
            }
          },
          onClose: function() {
            if (self.selector != null) {
              dom(self.selector)[0].onclick = function(e) {
                e = e || win.event;
                e.target = e.target || e.srcElement || e.parentNode;
                if (win.gmodal.hasCls(e.target, 'gsnaction')) {
                  return self.actionHandler(e);
                }
              };
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
      return dom('.gsnadunit,.gsnunit,.circplus').length > 0;
    };


    /**
     * set global defaults
    #
     */

    Plugin.prototype.setDefault = function(defParam) {
      var k, self, v;
      self = myGsn.Advertising;
      if (typeof defParam === 'object') {
        for (k in defParam) {
          v = defParam[k];
          if (v != null) {
            self.defP[k] = v;
          }
        }
      }
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
        if (isDebug) {
          debug.enable('gsndfp');
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

  win.gsndfp = myGsn.Advertising;

  if ((gsnContext != null)) {
    buildqs = function(k, v) {
      if (v != null) {
        v = new String(v);
        if (k !== 'ProductDescription') {
          v = v.replace(/&/, '`');
        }
        return k + '=' + v.toString();
      } else {

      }
    };
    myGsn.Advertising.on('clickRecipe', function(data) {
      if (data.type !== 'gsnevent:clickRecipe') {
        return;
      }
      win.location.replace('/Recipes/RecipeFull.aspx?recipeid=' + data.detail.RecipeId);
    });
    myGsn.Advertising.on('clickProduct', function(data) {
      var product, qs;
      if (data.type !== 'gsnevent:clickProduct') {
        return;
      }
      product = data.detail;
      if (product) {
        qs = new String('');
        qs += buildqs('DepartmentID', product.CategoryId);
        qs += '~' + buildqs('BrandName', product.BrandName);
        qs += '~' + buildqs('ProductDescription', product.Description);
        qs += '~' + buildqs('ProductCode', product.ProductCode);
        qs += '~' + buildqs('DisplaySize', product.DisplaySize);
        qs += '~' + buildqs('RegularPrice', product.RegularPrice);
        qs += '~' + buildqs('CurrentPrice', product.CurrentPrice);
        qs += '~' + buildqs('SavingsAmount', product.SavingsAmount);
        qs += '~' + buildqs('SavingsStatement', product.SavingsStatement);
        qs += '~' + buildqs('Quantity', product.Quantity);
        qs += '~' + buildqs('AdCode', product.AdCode);
        qs += '~' + buildqs('CreativeID', product.CreativeId);
        if (typeof AddAdToShoppingList === 'function') {
          AddAdToShoppingList(qs);
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
      aPlugin.isDebug = value !== "false";
      if (value) {
        return debug.enable('gsndfp');
      }
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

  trakless.store.init({
    url: '//cdn.gsngrocers.com/script/xstore.html',
    dntIgnore: true
  });

  if (aPlugin.hasGsnUnit()) {
    aPlugin.load();
  } else {
    trakless.util.ready(function() {
      return aPlugin.load();
    });
  }

  module.exports = myGsn;

}).call(this);

}, {"debug":5,"trakless":6,"load-iframe":7,"dom":8,"./gsndfpfactory.coffee":9}],
5: [function(require, module, exports) {

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

}, {"./debug":10}],
10: [function(require, module, exports) {

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

}, {"ms":11}],
11: [function(require, module, exports) {
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
6: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
var $defaults, $pixel, $sessionid, $siteid, $st, $trakless2, $userid, $uuid, Emitter, attrs, cookie, debounce, defaults, doc, docReady, fn, getImage, hasNOL, i, isDom, j, k, len, len1, lsqueue, mystore, mytrakless, myutil, prefix, query, queue, ref, ref1, script, session, tracker, trakless, traklessParent, util, uuid, webanalyser, win, xstore;

mystore = require('xstore');

xstore = new mystore();

Emitter = require('emitter');

cookie = require('cookie');

defaults = require('defaults');

query = require('querystring');

uuid = require('uuid');

webanalyser = require('webanalyser');

docReady = require('doc-ready');

debounce = require('debounce');

lsqueue = require('lsqueue');

queue = new lsqueue('tksq');

win = window;

doc = win.document;

hasNOL = win.navigator.onLine;

session = win.sessionStorage;

$siteid = 0;

$pixel = '//niiknow.github.io/pixel.gif';

$uuid = null;

$userid = null;

$st = (new Date(new Date().getFullYear(), 0, 1)).getTime();

$sessionid = new Date().getTime() - $st;

$defaults = null;

if (typeof session === 'undefined') {
  session = {
    getItem: function(k) {
      return cookie(k);
    },
    setItem: function(k, v) {
      return cookie(k, v, {
        path: '/'
      });
    }
  };
}

try {
  $sessionid = session.getItem('tklsid');
  if ($sessionid == null) {
    $sessionid = new Date().getTime() - $st;
    session.setItem('tklsid', $sessionid);
  }
} catch (_error) {

}


/**
 * Send image request to server using GET.
 * The infamous web bug (or beacon) is a transparent, single pixel (1x1) image
#
 */

getImage = function(cfgUrl, tks, qs, callback) {
  var image, url;
  image = new Image(1, 1);
  if (cfgUrl.indexOf('//') === 0) {
    cfgUrl = win.location.protocol === 'https' ? "https:" + cfgUrl : "http:" + cfgUrl;
  }
  image.onload = function() {
    var iterator;
    iterator = 0;
    if (typeof callback === 'function') {
      callback();
    }
  };
  url = cfgUrl + (cfgUrl.indexOf('?') < 0 ? '?' : '&') + (tks + "&" + qs);
  image.src = url;
  return image;
};


/**
 * determine if a object is dom
 * @param  {Object}  obj the object
 * @return {Boolean}     true or false
 */

isDom = function(obj) {
  if ((obj != null)) {
    if (obj.nodeName) {
      switch (obj.nodeType) {
        case 1:
          return true;
        case 3:
          return object.nodeValue != null;
      }
    }
  }
  return false;
};


/**
 *  util
 */

util = (function() {
  function util() {}


  /**
   * allow for getting all attributes
  #
   * @param {HTMLElement} el - element
   * @return {Object}
   */

  util.prototype.allData = function(el) {
    var attr, camelCaseName, data, i, k, len, name, ref;
    data = {};
    if ((el != null)) {
      ref = el.attributes;
      for (k = i = 0, len = ref.length; i < len; k = ++i) {
        attr = ref[k];
        name = attr.name.replace(/^data-/g, '');
        camelCaseName = name.replace(/-(.)/g, function($0, $1) {
          return $1.toUpperCase();
        });
        data[camelCaseName] = attr.value;
      }
    }
    return data;
  };


  /**
   * parse a string to JSON, return string if fail
  #
   * @param {String} v - string value
   * @return {Object}
   */

  util.prototype.parseJSON = function(v) {
    var v2;
    if (typeof v === "string") {
      if (v.indexOf('{') >= 0 || v.indexOf('[') >= 0) {
        v2 = JSON.parse(v);
        if (!(v2 == null)) {
          return v2;
        }
      }
    }
    return v;
  };


  /**
   * parse a JSON to string, return string if fail
  #
   * @param {String} v - string value
   * @return {Object}
   */

  util.prototype.stringify = function(v) {
    if (typeof v === "string") {
      return v;
    }
    return JSON.stringify(v);
  };


  /**
   * get or set session data - store in cookie
   * if no value is provided, then it is a get
  #
   * @param {String} k - key
   * @param {Object} v - value
   * @return {Object}
   */

  util.prototype.session = function(k, v) {
    if ((v != null)) {
      if (!(typeof v === "string")) {
        v = this.stringify(v);
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
    return this.parseJSON(v);
  };


  /**
   * cookie
  #
   */

  util.prototype.cookie = cookie;


  /**
   * document ready
  #
   */

  util.prototype.ready = docReady;


  /**
   * trim
  #
   */

  util.prototype.trim = function(v) {
    return v.replace(/^\s+|\s+$/gm, '');
  };

  return util;

})();

myutil = new util();


/**
 * tracker class
#
 */

tracker = (function() {
  function tracker() {}

  tracker.prototype.pixel = '//niiknow.github.io/pixel.gif';

  tracker.prototype.siteid = 0;

  tracker.prototype.store = null;

  tracker.prototype.uuid = null;

  tracker.prototype.getId = function() {
    var self;
    self = this;
    return (self.siteid + "-" + self.pixel).replace(/[^a-zA-z]/gi, '$');
  };

  tracker.prototype._tk = function(data, ht, pixel) {
    var k, myData, self, tkd, v;
    self = this;
    tkd = {
      uuid: self.uuid,
      siteid: self.siteid,
      usid: $sessionid,
      ht: ht,
      z: data.z
    };
    if ($userid) {
      tkd.uid = $userid;
    }
    myData = {};
    for (k in data) {
      v = data[k];
      if (v != null) {
        if (!(typeof v === "string") || (myutil.trim(v).length > 0)) {
          if ((k + '') !== 'undefined' && k !== 'uuid' && k !== 'z' && !isDom(v)) {
            if (typeof v === 'boollean') {
              v = v ? 1 : 0;
            }
            myData[k] = v;
          }
        }
      }
    }
    self.emit('track', {
      ht: ht,
      pixel: pixel,
      qs: [tkd, myData]
    });
    getImage(pixel, query.stringify(tkd), query.stringify(myData));
    self.emit('tracked', {
      ht: ht,
      pixel: pixel,
      qs: [tkd, myData]
    });
    return self;
  };

  tracker.prototype._track = function(ht, ctx) {
    var pixel, self;
    self = this;
    if (ctx == null) {
      ctx = {};
    }
    if (self.siteid > 0) {
      pixel = myutil.trim(this.pixel);
      if (!self.uuid) {
        self.uuid = uuid();
        $uuid = self.uuid;
        if (self.store != null) {
          self.store.get('tklsuid').then(function(id) {
            if (!id) {
              self.store.set('tklsuid', self.uuid);
            }
            self.uuid = id || self.uuid;
            $uuid = self.uuid;
            return self._tk(ctx, ht, pixel);
          });
        }
      } else {
        self._tk(ctx, ht, pixel);
      }
    }
    return this;
  };


  /**
   * track generic method
  #
   * @param {String} ht - hit types with possible values of 'pageview', 'event', 'transaction', 'item', 'social', 'exception', 'timing', 'app', 'custom'
   * @param {Object} ctx - extended data
   * @return {Object}
   */

  tracker.prototype.track = function(ht, ctx) {
    var self;
    self = this;
    myutil.ready(function() {
      ctx = ctx || {};
      if (!ctx.z) {
        ctx.z = new Date().getTime() - $st;
      }
      return self._track(ht || 'custom', ctx);
    });
    return this;
  };

  return tracker;

})();

Emitter(tracker.prototype);


/**
 * tracker factory
#
 */

mytrakless = (function() {

  /**
   * create an instance of trakless
   * @return {object}
   */
  function mytrakless() {
    var self;
    self = this;
    self._track = debounce(function() {
      var item, k, ref, v;
      self = this;
      if (!hasNOL || win.navigator.onLine) {
        item = queue.pop();
        if ((item != null)) {
          self.emit('track', item);
          ref = self.trackers;
          for (k in ref) {
            v = ref[k];
            v.track(item.ht, item.ctx);
          }
          return self.emit('tracked', item);
        }
      }
    }, 222);
    return self;
  }


  /**
   * store all trackers
   * @type {Object}
   */

  mytrakless.prototype.trackers = {};


  /**
   * set default siteid
  #
   * @param {Number} siteid - the site id
   * @return {Object}
   */

  mytrakless.prototype.setSiteId = function(siteid) {
    var mysid;
    mysid = parseInt(siteid);
    $siteid = mysid > 0 ? mysid : $siteid;
  };


  /**
   * set default pixel
  #
   * @param {String} pixel - the default pixel url
   * @return {Object}
   */

  mytrakless.prototype.setPixel = function(pixelUrl) {
    if (pixelUrl) {
      $pixel = pixelUrl || $pixel;
    }
  };


  /**
   * The domain user id.
   * @param {string} id the domain user id
   */

  mytrakless.prototype.setUserId = function(id) {
    if (id) {
      $userid = id || $userid;
    }
  };


  /**
   * the storage
  #
   * @return {Object}
   */

  mytrakless.prototype.store = xstore;


  /**
   * you can provide different siteid and pixelUrl for in multi-tracker and site scenario
  #
   * @param {Number} siteid - the siteid
   * @param {String} pixelUrl - the pixel url
   * @return {Object}
   */

  mytrakless.prototype.getTracker = function(siteid, pixelUrl) {
    var id, rst, self;
    self = this;
    rst = new tracker();
    rst.siteid = siteid != null ? siteid : $siteid;
    rst.pixel = pixelUrl != null ? pixelUrl : $pixel;
    if ((rst.siteid != null) && (rst.pixel != null)) {
      rst.store = xstore;
      id = rst.getId();
      if (!self.trackers[id]) {
        self.trackers[id] = rst;
        rst.on('tracked', self._track);
      }
      return self.trackers[id];
    }
    throw "siteid or pixelUrl is required";
  };


  /**
   * get the default racker
  #
   */

  mytrakless.prototype.getDefaultTracker = function() {
    var id, self;
    self = this;
    id = ($siteid + "-" + $pixel).replace(/[^a-zA-z]/gi, '$');
    if (self.trackers[id] == null) {
      self.getTracker();
    }
    return self.trackers[id];
  };


  /**
   * utility
  #
   */

  mytrakless.prototype.util = myutil;


  /**
   * track event
   * @param  {string} category
   * @param  {string} action
   * @param  {string} label
   * @param  {string} property
   * @param  {string} value
   * @return {object}
   */

  mytrakless.prototype.event = function(category, action, label, property, value) {
    if (value && value < 0) {
      value = null;
    }
    return this.track('event', {
      ec: category || 'event',
      ea: action,
      el: label,
      ep: property,
      ev: value
    });
  };


  /**
   * track page view
   * @param  {object} ctx context/addtional parameter
   * @return {object}
   */

  mytrakless.prototype.pageview = function(ctx) {
    return this.track('pageview', ctx);
  };


  /**
   * track anything
   * @param  {string} ht  hit type
   * @param  {object} ctx context/additonal parameter
   * @return {object}
   */

  mytrakless.prototype.track = function(ht, ctx) {
    var self;
    self = this;
    self.getDefaultTracker();
    ctx = ctx || {};
    ctx.z = new Date().getTime() - $st;
    queue.push({
      ht: ht,
      ctx: ctx,
      uuid: $uuid,
      usid: $sessionid,
      uid: $userid
    });
    self._track();
    return self;
  };


  /**
   * For situation when trakless is in an iframe, you can use this method
   * to emit event to the parent.
   * @param  {string} en event name
   * @param  {string} ed event detail
   * @return {object}    trakless
   */

  mytrakless.prototype.emitTop = function(en, ed) {
    if (typeof $trakless2 !== "undefined" && $trakless2 !== null) {
      $trakless2.emit(en, ed);
    }
    return this;
  };

  return mytrakless;

})();

trakless = new mytrakless;

Emitter(trakless);

$trakless2 = trakless;

if (win.top !== win) {
  try {
    traklessParent = win.top.trakless;
    $trakless2 = traklessParent;
  } catch (_error) {
    $trakless2 = win.parent.trakless;
  }
}

trakless.on('track', function(item) {
  var myDef;
  if (item.ht === 'pageview') {
    myDef = webanalyser.get();
    return item.ctx = defaults(item.ctx, myDef);
  }
});

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

win._tk = trakless;

module.exports = trakless;

}, {"xstore":12,"emitter":13,"cookie":14,"defaults":15,"querystring":16,"uuid":17,"webanalyser":18,"doc-ready":19,"debounce":20,"lsqueue":21}],
12: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
(function(win) {
  var cacheBust, cookie, debug, delay, dnt, doc, load, log, maxStore, mydeferred, myproxy, myq, onMessage, q, randomHash, store, usePostMessage, xstore;
  doc = win.document;
  debug = require('debug');
  log = debug('xstore');
  load = require('load-iframe');
  store = require('store.js');
  cookie = require('cookie');
  usePostMessage = win.postMessage != null;
  cacheBust = 0;
  delay = 333;
  maxStore = 6000 * 60 * 24 * 777;
  myq = [];
  q = setInterval(function() {
    if (myq.length > 0) {
      return myq.shift()();
    }
  }, delay + 5);
  dnt = win.navigator.doNotTrack || win.navigator.msDoNotTrack || win.doNotTrack;
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

    mydeferred.prototype.q = function(xs, event, item) {
      var d, dh, self;
      self = this;
      self.mycallbacks = [];
      self.myerrorbacks = [];
      dh = randomHash();
      d = [0, dh, event, item.k, item.v];
      xs.dob[dh] = self;
      if (usePostMessage) {
        xs.doPostMessage(xs, JSON.stringify(d));
      } else {
        if (xs.iframe !== null) {
          cacheBust += 1;
          d[0] = +(new Date) + cacheBust;
          xs.hash = '#' + JSON.stringify(d);
          if (xs.iframe.src) {
            xs.iframe.src = "" + proxyPage + xs.hash;
          } else if ((xs.iframe.contentWindow != null) && (xs.iframe.contentWindow.location != null)) {
            xs.iframe.contentWindow.location = "" + proxyPage + xs.hash;
          } else {
            xs.iframe.setAttribute('src', "" + proxyPage + xs.hash);
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
          if (newhash !== xs.hash) {
            xs.hash = newhash;
            self.handleProxyMessage({
              data: JSON.parse(newhash.substr(1))
            });
          }
        }), self.delay);
      }
    };

    myproxy.prototype.handleProxyMessage = function(e) {
      var d, hash, id, key, method, myCacheBust, mystore, self;
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
      mystore = store;
      if (!store.enabled) {
        mystore = {
          get: function(k) {
            return cookie(key);
          },
          set: function(k, v) {
            return cookie(k, v, {
              maxage: maxStore
            });
          },
          remove: function(k) {
            return cookie(k, null);
          },
          clear: function() {
            var cookies, i, idx, k, len, name, results, v;
            cookies = doc.cookie.split(';');
            results = [];
            for (k = i = 0, len = cookies.length; i < len; k = ++i) {
              v = cookies[k];
              idx = v.indexOf('=');
              name = idx > -1 ? v.substr(0, idx) : v;
              results.push(doc.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
            }
            return results;
          }
        };
      }
      if (method === 'get') {
        d[4] = mystore.get(key);
      } else if (method === 'set') {
        mystore.set(key, d[4]);
      } else if (method === 'remove') {
        mystore.remove(key);
      } else if (method === 'clear') {
        mystore.clear();
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
        win.location = win.location.href.replace(win.location.hash, '') + hash;
      }
    };

    return myproxy;

  })();
  randomHash = function() {
    var rh;
    rh = Math.random().toString(36).substr(2);
    return "xstore-" + rh;
  };

  /**
   * xstore class
  #
   */
  xstore = (function() {
    function xstore() {}

    xstore.prototype.hasInit = false;

    xstore.prototype.debug = debug;

    xstore.prototype.proxyPage = '//niiknow.github.io/xstore/xstore.html';

    xstore.prototype.iframe = null;

    xstore.prototype.proxyWin = null;

    xstore.prototype.hash = null;

    xstore.prototype.tempStore = {};

    xstore.prototype.dob = {};

    xstore.prototype.get = function(k) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            return fn(self.tempStore[k]);
          }
        };
      }
      return (new mydeferred()).q(this, 'get', {
        'k': k
      });
    };

    xstore.prototype.set = function(k, v) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            self.tempStore[k] = v;
            return fn(self.tempStore[k]);
          }
        };
      }
      return (new mydeferred()).q(this, 'set', {
        'k': k,
        'v': v
      });
    };

    xstore.prototype.remove = function(k) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            delete self.tempStore[k];
            return fn;
          }
        };
      }
      return (new mydeferred()).q(this, 'remove', {
        'k': k
      });
    };

    xstore.prototype.clear = function() {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            self.tempStore = {};
            return fn;
          }
        };
      }
      return (new mydeferred()).q(this, 'clear');
    };

    xstore.prototype.doPostMessage = function(xs, msg) {
      if ((xs.proxyWin != null)) {
        clearInterval(q);
        xs.proxyWin.postMessage(msg, '*');
      }
      return myq.push(function() {
        return xs.doPostMessage(xs, msg);
      });
    };

    xstore.prototype.handleMessageEvent = function(e) {
      var d, di, id, self;
      self = this;
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
      di = self.dob[id];
      if (di) {
        if (/^error-/.test(d[2])) {
          di.myreject(d[2]);
        } else {
          di.myresolve(d[4]);
        }
        return self.dob[id] = null;
      }
    };

    xstore.prototype.init = function(options) {
      var iframe, self;
      self = this;
      if (self.hasInit) {
        return self;
      }
      self.hasInit = true;
      options = options || {};
      if (options.isProxy) {
        log('init proxy');
        (new myproxy()).init();
        return self;
      }
      self.proxyPage = options.url || self.proxyPage;
      if (options.dntIgnore || typeof dnt === 'undefined' || dnt === 'unspecified' || dnt === 'no' || dnt === '0') {
        log("disable dnt");
        dnt = false;
      }
      log("init storeage dnt = " + dnt);
      return iframe = load(self.proxyPage, function() {
        log('iframe loaded');
        self.proxyWin = iframe.contentWindow;
        if (!usePostMessage) {
          self.hash = proxyWin.location.hash;
          return setInterval((function() {
            if (proxyWin.location.hash !== hash) {
              self.hash = proxyWin.location.hash;
              self.handleMessageEvent({
                origin: proxyDomain,
                data: self.hash.substr(1)
              });
            }
          }), delay);
        } else {
          return onMessage(function() {
            return self.handleMessageEvent(arguments[0]);
          });
        }
      });
    };

    return xstore;

  })();
  return module.exports = xstore;
})(window);

}, {"debug":5,"load-iframe":7,"store.js":22,"cookie":14}],
7: [function(require, module, exports) {

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
}, {"script-onload":23,"next-tick":24,"type":25}],
23: [function(require, module, exports) {

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
24: [function(require, module, exports) {
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
25: [function(require, module, exports) {
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
22: [function(require, module, exports) {
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
14: [function(require, module, exports) {

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

}, {"debug":5}],
13: [function(require, module, exports) {

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

}, {"indexof":26}],
26: [function(require, module, exports) {
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
}, {}],
15: [function(require, module, exports) {
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
16: [function(require, module, exports) {

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

}, {"trim":27,"type":25}],
27: [function(require, module, exports) {

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
17: [function(require, module, exports) {

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
18: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
(function(win) {
  'use strict';
  var $df, $doc, $loc, $nav, $scr, $win, defaults, fd, result, webanalyser;
  defaults = require('defaults');
  fd = require('flashdetect');
  $win = win;
  $doc = $win.document;
  $nav = $win.navigator;
  $scr = $win.screen;
  $loc = $win.location;
  $df = {
    sr: $scr.width + "x" + $scr.height,
    vp: $scr.availWidth + "x" + $scr.availHeight,
    sd: $scr.colorDepth,
    je: $nav.javaEnabled ? ($nav.javaEnabled() ? 1 : 0) : 0,
    ul: $nav.languages ? $nav.languages[0] : $nav.language || $nav.userLanguage || $nav.browserLanguage
  };

  /**
   * webanalyser
   */
  webanalyser = (function() {
    function webanalyser() {}

    webanalyser.prototype.get = function() {
      var rst;
      if ($df.z == null) {
        rst = {
          dr: $doc.referrer,
          dh: $loc.hostname,
          z: new Date().getTime()
        };
        if (fd.installed) {
          rst.fl = fd.major + " " + fd.minor + " " + fd.revisionStr;
        }
        $df = defaults(rst, $df);
      }
      $df.dl = $loc.href;
      $df.dt = $doc.title;
      return $df;
    };

    webanalyser.prototype.windowSize = function() {
      var rst;
      rst = {
        w: 0,
        h: 0
      };
      if (typeof $win.innerWidth === 'number') {
        rst.w = $win.innerWidth;
        rst.h = $win.innerHeight;
      } else if ($doc.documentElement && ($doc.documentElement.clientWidth || $doc.documentElement.clientHeight)) {
        rst.w = $doc.documentElement.clientWidth;
        rst.h = $doc.documentElement.clientHeight;
      } else if ($doc.body && ($doc.body.clientWidth || $doc.body.clientHeight)) {
        rst.w = $doc.body.clientWidth;
        rst.h = $doc.body.clientHeight;
      }
      return rst;
    };

    return webanalyser;

  })();
  result = new webanalyser();
  return module.exports = result;
})(window);

}, {"defaults":15,"flashdetect":28}],
28: [function(require, module, exports) {
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
19: [function(require, module, exports) {
/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {

'use strict';

var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
  // bail if already triggered or IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }

  trigger();
}

function trigger() {
  docReady.isReady = true;
  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  // trigger ready if page is ready
  if ( document.readyState === 'complete' ) {
    trigger();
  } else {
    // listen for events
    eventie.bind( document, 'DOMContentLoaded', onReady );
    eventie.bind( document, 'readystatechange', onReady );
    eventie.bind( window, 'load', onReady );
  }

  return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [ 'eventie/eventie' ], defineDocReady );
} else if ( typeof exports === 'object' ) {
  module.exports = defineDocReady( require('eventie') );
} else {
  // browser global
  window.docReady = defineDocReady( window.eventie );
}

})( window );

}, {"eventie":29}],
29: [function(require, module, exports) {
/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( window );

}, {}],
20: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var now = require('date-now');

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function debounced() {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

}, {"date-now":30}],
30: [function(require, module, exports) {
module.exports = Date.now || now

function now() {
    return new Date().getTime()
}

}, {}],
21: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
var debounce, lsqueue, store;

require('json-fallback');

debounce = require('debounce');

store = require('store.js');


/**
 * a queue backed by localStorage
 * new queue("name")
 */

lsqueue = (function() {
  function lsqueue(name) {
    var self;
    self = this;
    self.qn = name || "queue";
    self.items = [];
    self.persist = debounce(function() {
      if (!store.enabled) {
        return self;
      }
      try {
        store.set(self.qn, self.items);
      } catch (_error) {

      }
      return self;
    }, 111);
    return self;
  }

  lsqueue.prototype.push = function(v) {
    var self;
    self = this;
    self.items.push(v);
    self.persist();
    return self;
  };

  lsqueue.prototype.pop = function() {
    var rst, self;
    self = this;
    if (self.items.length > 0) {
      rst = self.items.shift();
      self.persist();
      return rst;
    }
  };

  lsqueue.prototype.clear = function() {
    var self;
    self = this;
    self.items = [];
    self.persist();
    return self;
  };

  return lsqueue;

})();

module.exports = lsqueue;

}, {"json-fallback":31,"debounce":20,"store.js":22}],
31: [function(require, module, exports) {
/*
    json2.js
    2014-02-04

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

(function () {
    'use strict';

    var JSON = module.exports = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

}, {}],
8: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var domify = require('domify');
var each = require('each');
var events = require('event');
var getKeys = require('keys');
var query = require('query');
var trim = require('trim');
var slice = [].slice;

var isArray = Array.isArray || function (val) {
  return !! val && '[object Array]' === Object.prototype.toString.call(val);
};

/**
 * Attributes supported.
 */

var attrs = [
  'id',
  'src',
  'rel',
  'cols',
  'rows',
  'type',
  'name',
  'href',
  'title',
  'style',
  'width',
  'height',
  'action',
  'method',
  'tabindex',
  'placeholder'
];

/*
 * A simple way to check for HTML strings or ID strings
 */

var quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;

/**
 * Expose `dom()`.
 */

module.exports = dom;

/**
 * Return a dom `List` for the given
 * `html`, selector, or element.
 *
 * @param {String|Element|List} selector
 * @param {String|ELement|context} context
 * @return {List}
 * @api public
 */

function dom(selector, context) {
  // array
  if (isArray(selector)) {
    return new List(selector);
  }

  // List
  if (selector instanceof List) {
    return selector;
  }

  // node
  if (selector.nodeName) {
    return new List([selector]);
  }

  if ('string' != typeof selector) {
    throw new TypeError('invalid selector');
  }

  // html
  var htmlselector = trim.left(selector);
  if (isHTML(htmlselector)) {
    return new List([domify(htmlselector)], htmlselector);
  }

  // selector
  var ctx = context
    ? (context instanceof List ? context[0] : context)
    : document;

  return new List(query.all(selector, ctx), selector);
}

/**
 * Static: Expose `List`
 */

dom.List = List;

/**
 * Static: Expose supported attrs.
 */

dom.attrs = attrs;

/**
 * Static: Mixin a function
 *
 * @param {Object|String} name
 * @param {Object|Function} obj
 * @return {List} self
 */

dom.use = function(name, fn) {
  var keys = [];
  var tmp;

  if (2 == arguments.length) {
    keys.push(name);
    tmp = {};
    tmp[name] = fn;
    fn = tmp;
  } else if (name.name) {
    // use function name
    fn = name;
    name = name.name;
    keys.push(name);
    tmp = {};
    tmp[name] = fn;
    fn = tmp;
  } else {
    keys = getKeys(name);
    fn = name;
  }

  for(var i = 0, len = keys.length; i < len; i++) {
    List.prototype[keys[i]] = fn[keys[i]];
  }

  return this;
}

/**
 * Initialize a new `List` with the
 * given array-ish of `els` and `selector`
 * string.
 *
 * @param {Mixed} els
 * @param {String} selector
 * @api private
 */

function List(els, selector) {
  els = els || [];
  var len = this.length = els.length;
  for(var i = 0; i < len; i++) this[i] = els[i];
  this.selector = selector;
}

/**
 * Remake the list
 *
 * @param {String|ELement|context} context
 * @return {List}
 * @api private
 */

List.prototype.dom = dom;

/**
 * Make `List` an array-like object
 */

List.prototype.length = 0;
List.prototype.splice = Array.prototype.splice;

/**
 * Array-like object to array
 *
 * @return {Array}
 */

List.prototype.toArray = function() {
  return slice.call(this);
}

/**
 * Attribute accessors.
 */

each(attrs, function(name){
  List.prototype[name] = function(val){
    if (0 == arguments.length) return this.attr(name);
    return this.attr(name, val);
  };
});

/**
 * Mixin the API
 */

dom.use(require('./lib/attributes'));
dom.use(require('./lib/classes'));
dom.use(require('./lib/events'));
dom.use(require('./lib/manipulate'));
dom.use(require('./lib/traverse'));

/**
 * Check if the string is HTML
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */

function isHTML(str) {
  // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
  if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

  // Run the regex
  var match = quickExpr.exec(str);
  return !!(match && match[1]);
}

}, {"domify":32,"each":33,"event":34,"keys":35,"query":36,"trim":27,"./lib/attributes":37,"./lib/classes":38,"./lib/events":39,"./lib/manipulate":40,"./lib/traverse":41}],
32: [function(require, module, exports) {

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var div = document.createElement('div');
// Setup
div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
// Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
var innerHTMLBug = !div.getElementsByTagName('link').length;
div = undefined;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

}, {}],
33: [function(require, module, exports) {

/**
 * Module dependencies.
 */

try {
  var type = require('type');
} catch (err) {
  var type = require('component-type');
}

var toFunction = require('to-function');

/**
 * HOP reference.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Iterate the given `obj` and invoke `fn(val, i)`
 * in optional context `ctx`.
 *
 * @param {String|Array|Object} obj
 * @param {Function} fn
 * @param {Object} [ctx]
 * @api public
 */

module.exports = function(obj, fn, ctx){
  fn = toFunction(fn);
  ctx = ctx || this;
  switch (type(obj)) {
    case 'array':
      return array(obj, fn, ctx);
    case 'object':
      if ('number' == typeof obj.length) return array(obj, fn, ctx);
      return object(obj, fn, ctx);
    case 'string':
      return string(obj, fn, ctx);
  }
};

/**
 * Iterate string chars.
 *
 * @param {String} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */

function string(obj, fn, ctx) {
  for (var i = 0; i < obj.length; ++i) {
    fn.call(ctx, obj.charAt(i), i);
  }
}

/**
 * Iterate object keys.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */

function object(obj, fn, ctx) {
  for (var key in obj) {
    if (has.call(obj, key)) {
      fn.call(ctx, key, obj[key]);
    }
  }
}

/**
 * Iterate array-ish.
 *
 * @param {Array|Object} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */

function array(obj, fn, ctx) {
  for (var i = 0; i < obj.length; ++i) {
    fn.call(ctx, obj[i], i);
  }
}

}, {"type":42,"component-type":42,"to-function":43}],
42: [function(require, module, exports) {

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
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

}, {}],
43: [function(require, module, exports) {

/**
 * Module Dependencies
 */

var expr;
try {
  expr = require('props');
} catch(e) {
  expr = require('component-props');
}

/**
 * Expose `toFunction()`.
 */

module.exports = toFunction;

/**
 * Convert `obj` to a `Function`.
 *
 * @param {Mixed} obj
 * @return {Function}
 * @api private
 */

function toFunction(obj) {
  switch ({}.toString.call(obj)) {
    case '[object Object]':
      return objectToFunction(obj);
    case '[object Function]':
      return obj;
    case '[object String]':
      return stringToFunction(obj);
    case '[object RegExp]':
      return regexpToFunction(obj);
    default:
      return defaultToFunction(obj);
  }
}

/**
 * Default to strict equality.
 *
 * @param {Mixed} val
 * @return {Function}
 * @api private
 */

function defaultToFunction(val) {
  return function(obj){
    return val === obj;
  };
}

/**
 * Convert `re` to a function.
 *
 * @param {RegExp} re
 * @return {Function}
 * @api private
 */

function regexpToFunction(re) {
  return function(obj){
    return re.test(obj);
  };
}

/**
 * Convert property `str` to a function.
 *
 * @param {String} str
 * @return {Function}
 * @api private
 */

function stringToFunction(str) {
  // immediate such as "> 20"
  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

  // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
  return new Function('_', 'return ' + get(str));
}

/**
 * Convert `object` to a function.
 *
 * @param {Object} object
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  var match = {};
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key]);
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  };
}

/**
 * Built the getter function. Supports getter style functions
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function get(str) {
  var props = expr(str);
  if (!props.length) return '_.' + str;

  var val, i, prop;
  for (i = 0; i < props.length; i++) {
    prop = props[i];
    val = '_.' + prop;
    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";

    // mimic negative lookbehind to avoid problems with nested properties
    str = stripNested(prop, str, val);
  }

  return str;
}

/**
 * Mimic negative lookbehind to avoid problems with nested properties.
 *
 * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
 *
 * @param {String} prop
 * @param {String} str
 * @param {String} val
 * @return {String}
 * @api private
 */

function stripNested (prop, str, val) {
  return str.replace(new RegExp('(\\.)?' + prop, 'g'), function($0, $1) {
    return $1 ? $0 : val;
  });
}

}, {"props":44,"component-props":44}],
44: [function(require, module, exports) {
/**
 * Global Names
 */

var globals = /\b(this|Array|Date|Object|Math|JSON)\b/g;

/**
 * Return immediate identifiers parsed from `str`.
 *
 * @param {String} str
 * @param {String|Function} map function or prefix
 * @return {Array}
 * @api public
 */

module.exports = function(str, fn){
  var p = unique(props(str));
  if (fn && 'string' == typeof fn) fn = prefixed(fn);
  if (fn) return map(str, p, fn);
  return p;
};

/**
 * Return immediate identifiers in `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function props(str) {
  return str
    .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
    .replace(globals, '')
    .match(/[$a-zA-Z_]\w*/g)
    || [];
}

/**
 * Return `str` with `props` mapped with `fn`.
 *
 * @param {String} str
 * @param {Array} props
 * @param {Function} fn
 * @return {String}
 * @api private
 */

function map(str, props, fn) {
  var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
  return str.replace(re, function(_){
    if ('(' == _[_.length - 1]) return fn(_);
    if (!~props.indexOf(_)) return _;
    return fn(_);
  });
}

/**
 * Return unique array.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

function unique(arr) {
  var ret = [];

  for (var i = 0; i < arr.length; i++) {
    if (~ret.indexOf(arr[i])) continue;
    ret.push(arr[i]);
  }

  return ret;
}

/**
 * Map with prefix `str`.
 */

function prefixed(str) {
  return function(_){
    return str + _;
  };
}

}, {}],
34: [function(require, module, exports) {
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
}, {}],
35: [function(require, module, exports) {
var has = Object.prototype.hasOwnProperty;

module.exports = Object.keys || function(obj){
  var keys = [];

  for (var key in obj) {
    if (has.call(obj, key)) {
      keys.push(key);
    }
  }

  return keys;
};

}, {}],
36: [function(require, module, exports) {
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

}, {}],
37: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var value = require('value');

/**
 * Set attribute `name` to `val`, or get attr `name`.
 *
 * @param {String} name
 * @param {String} [val]
 * @return {String|List} self
 * @api public
 */

exports.attr = function(name, val){
  // get
  if (1 == arguments.length) {
    return this[0] && this[0].getAttribute(name);
  }

  // remove
  if (null == val) {
    return this.removeAttr(name);
  }

  // set
  return this.forEach(function(el){
    el.setAttribute(name, val);
  });
};

/**
 * Remove attribute `name`.
 *
 * @param {String} name
 * @return {List} self
 * @api public
 */

exports.removeAttr = function(name){
  return this.forEach(function(el){
    el.removeAttribute(name);
  });
};

/**
 * Set property `name` to `val`, or get property `name`.
 *
 * @param {String} name
 * @param {String} [val]
 * @return {Object|List} self
 * @api public
 */

exports.prop = function(name, val){
  if (1 == arguments.length) {
    return this[0] && this[0][name];
  }

  return this.forEach(function(el){
    el[name] = val;
  });
};

/**
 * Get the first element's value or set selected
 * element values to `val`.
 *
 * @param {Mixed} [val]
 * @return {Mixed}
 * @api public
 */

exports.val =
exports.value = function(val){
  if (0 == arguments.length) {
    return this[0]
      ? value(this[0])
      : undefined;
  }

  return this.forEach(function(el){
    value(el, val);
  });
};

}, {"value":45}],
45: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var typeOf = require('type');

/**
 * Set or get `el`'s' value.
 *
 * @param {Element} el
 * @param {Mixed} val
 * @return {Mixed}
 * @api public
 */

module.exports = function(el, val){
  if (2 == arguments.length) return set(el, val);
  return get(el);
};

/**
 * Get `el`'s value.
 */

function get(el) {
  switch (type(el)) {
    case 'checkbox':
    case 'radio':
      if (el.checked) {
        var attr = el.getAttribute('value');
        return null == attr ? true : attr;
      } else {
        return false;
      }
    case 'radiogroup':
      for (var i = 0, radio; radio = el[i]; i++) {
        if (radio.checked) return radio.value;
      }
      break;
    case 'select':
      for (var i = 0, option; option = el.options[i]; i++) {
        if (option.selected) return option.value;
      }
      break;
    default:
      return el.value;
  }
}

/**
 * Set `el`'s value.
 */

function set(el, val) {
  switch (type(el)) {
    case 'checkbox':
    case 'radio':
      if (val) {
        el.checked = true;
      } else {
        el.checked = false;
      }
      break;
    case 'radiogroup':
      for (var i = 0, radio; radio = el[i]; i++) {
        radio.checked = radio.value === val;
      }
      break;
    case 'select':
      for (var i = 0, option; option = el.options[i]; i++) {
        option.selected = option.value === val;
      }
      break;
    default:
      el.value = val;
  }
}

/**
 * Element type.
 */

function type(el) {
  var group = 'array' == typeOf(el) || 'object' == typeOf(el);
  if (group) el = el[0];
  var name = el.nodeName.toLowerCase();
  var type = el.getAttribute('type');

  if (group && type && 'radio' == type.toLowerCase()) return 'radiogroup';
  if ('input' == name && type && 'checkbox' == type.toLowerCase()) return 'checkbox';
  if ('input' == name && type && 'radio' == type.toLowerCase()) return 'radio';
  if ('select' == name) return 'select';
  return name;
}

}, {"type":25}],
38: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var classes = require('classes');

/**
 * Add the given class `name`.
 *
 * @param {String} name
 * @return {List} self
 * @api public
 */

exports.addClass = function(name){
  return this.forEach(function(el) {
    el._classes = el._classes || classes(el);
    el._classes.add(name);
  });
};

/**
 * Remove the given class `name`.
 *
 * @param {String|RegExp} name
 * @return {List} self
 * @api public
 */

exports.removeClass = function(name){
  return this.forEach(function(el) {
    el._classes = el._classes || classes(el);
    el._classes.remove(name);
  });
};

/**
 * Toggle the given class `name`,
 * optionally a `bool` may be given
 * to indicate that the class should
 * be added when truthy.
 *
 * @param {String} name
 * @param {Boolean} bool
 * @return {List} self
 * @api public
 */

exports.toggleClass = function(name, bool){
  var fn = 'toggle';

  // toggle with boolean
  if (2 == arguments.length) {
    fn = bool ? 'add' : 'remove';
  }

  return this.forEach(function(el) {
    el._classes = el._classes || classes(el);
    el._classes[fn](name);
  })
};

/**
 * Check if the given class `name` is present.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

exports.hasClass = function(name){
  var el;

  for(var i = 0, len = this.length; i < len; i++) {
    el = this[i];
    el._classes = el._classes || classes(el);
    if (el._classes.has(name)) return true;
  }

  return false;
};

}, {"classes":46}],
46: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var str = this.el.className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

}, {"indexof":26}],
39: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var events = require('event');
var delegate = require('delegate');

/**
 * Bind to `event` and invoke `fn(e)`. When
 * a `selector` is given then events are delegated.
 *
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {List}
 * @api public
 */

exports.on = function(event, selector, fn, capture){
  if ('string' == typeof selector) {
    return this.forEach(function (el) {
      fn._delegate = delegate.bind(el, selector, event, fn, capture);
    });
  }

  capture = fn;
  fn = selector;

  return this.forEach(function (el) {
    events.bind(el, event, fn, capture);
  });
};

/**
 * Unbind to `event` and invoke `fn(e)`. When
 * a `selector` is given then delegated event
 * handlers are unbound.
 *
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {List}
 * @api public
 */

exports.off = function(event, selector, fn, capture){
  if ('string' == typeof selector) {
    return this.forEach(function (el) {
      // TODO: add selector support back
      delegate.unbind(el, event, fn._delegate, capture);
    });
  }

  capture = fn;
  fn = selector;

  return this.forEach(function (el) {
    events.unbind(el, event, fn, capture);
  });
};

}, {"event":34,"delegate":47}],
47: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var closest = require('closest')
  , event = require('event');

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, selector, type, fn, capture){
  return event.bind(el, type, function(e){
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  event.unbind(el, type, fn, capture);
};

}, {"closest":48,"event":34}],
48: [function(require, module, exports) {
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf, root) {
  element = checkYoSelf ? {parentNode: element} : element

  root = root || document

  // Make sure `element !== document` and `element != null`
  // otherwise we get an illegal invocation
  while ((element = element.parentNode) && element !== document) {
    if (matches(element, selector))
      return element
    // After `matches` on the edge case that
    // the selector matches the root
    // (when the root is not the document)
    if (element === root)
      return
  }
}

}, {"matches-selector":49}],
49: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var query = require('query');

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

}, {"query":36}],
40: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var value = require('value');
var css = require('css');
var text = require('text');

/**
 * Return element text.
 *
 * @param {String} str
 * @return {String|List}
 * @api public
 */

exports.text = function(str) {
  if (1 == arguments.length) {
    return this.forEach(function(el) {
      if (11 == el.nodeType) {
        var node;
        while (node = el.firstChild) el.removeChild(node);
        el.appendChild(document.createTextNode(str));
      } else {
        text(el, str);
      }
    });
  }

  var out = '';
  this.forEach(function(el) {
    if (11 == el.nodeType) {
      out += getText(el.firstChild);
    } else {
      out += text(el);
    }
  });

  return out;
};

/**
 * Get text helper from Sizzle.
 *
 * Source: https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L914-L947
 *
 * @param {Element|Array} el
 * @return {String}
 */

function getText(el) {
  var ret = '';
  var type = el.nodeType;
  var node;

  switch(type) {
    case 1:
    case 9:
      ret = text(el);
      break;
    case 11:
      ret = el.textContent || el.innerText;
      break;
    case 3:
    case 4:
      return el.nodeValue;
    default:
      while (node = el[i++]) {
        ret += getText(node);
      }
  }

  return ret;
}

/**
 * Return element html.
 *
 * @return {String} html
 * @api public
 */

exports.html = function(html) {
  if (1 == arguments.length) {
    return this.forEach(function(el) {
      el.innerHTML = html;
    });
  }

  // TODO: real impl
  return this[0] && this[0].innerHTML;
};

/**
 * Get and set the css value
 *
 * @param {String|Object} prop
 * @param {Mixed} val
 * @return {Mixed}
 * @api public
 */

exports.css = function(prop, val) {
  // getter
  if (!val && 'object' != typeof prop) {
    return css(this[0], prop);
  }
  // setter
  this.forEach(function(el) {
    css(el, prop, val);
  });

  return this;
};

/**
 * Prepend `val`.
 *
 * From jQuery: if there is more than one target element
 * cloned copies of the inserted element will be created
 * for each target after the first.
 *
 * @param {String|Element|List} val
 * @return {List} self
 * @api public
 */

exports.prepend = function(val) {
  var dom = this.dom;

  this.forEach(function(target, i) {
    dom(val).forEach(function(selector) {
      selector = i ? selector.cloneNode(true) : selector;
      if (target.children.length) {
        target.insertBefore(selector, target.firstChild);
      } else {
        target.appendChild(selector);
      }
    });
  });

  return this;
};

/**
 * Append `val`.
 *
 * From jQuery: if there is more than one target element
 * cloned copies of the inserted element will be created
 * for each target after the first.
 *
 * @param {String|Element|List} val
 * @return {List} self
 * @api public
 */

exports.append = function(val) {
  var dom = this.dom;

  this.forEach(function(target, i) {
    dom(val).forEach(function(el) {
      el = i ? el.cloneNode(true) : el;
      target.appendChild(el);
    });
  });

  return this;
};

/**
 * Insert self's `els` after `val`
 *
 * From jQuery: if there is more than one target element,
 * cloned copies of the inserted element will be created
 * for each target after the first, and that new set
 * (the original element plus clones) is returned.
 *
 * @param {String|Element|List} val
 * @return {List} self
 * @api public
 */

exports.insertAfter = function(val) {
  var dom = this.dom;

  this.forEach(function(el) {
    dom(val).forEach(function(target, i) {
      if (!target.parentNode) return;
      el = i ? el.cloneNode(true) : el;
      target.parentNode.insertBefore(el, target.nextSibling);
    });
  });

  return this;
};

/**
 * Append self's `el` to `val`
 *
 * @param {String|Element|List} val
 * @return {List} self
 * @api public
 */

exports.appendTo = function(val) {
  this.dom(val).append(this);
  return this;
};

/**
 * Replace elements in the DOM.
 *
 * @param {String|Element|List} val
 * @return {List} self
 * @api public
 */

exports.replace = function(val) {
  var self = this;
  var list = this.dom(val);

  list.forEach(function(el, i) {
    var old = self[i];
    var parent = old.parentNode;
    if (!parent) return;
    el = i ? el.cloneNode(true) : el;
    parent.replaceChild(el, old);
  });

  return this;
};

/**
 * Empty the dom list
 *
 * @return self
 * @api public
 */

exports.empty = function() {
  return this.forEach(function(el) {
    text(el, "");
  });
};

/**
 * Remove all elements in the dom list
 *
 * @return {List} self
 * @api public
 */

exports.remove = function() {
  return this.forEach(function(el) {
    var parent = el.parentNode;
    if (parent) parent.removeChild(el);
  });
};

/**
 * Return a cloned dom list with all elements cloned.
 *
 * @return {List}
 * @api public
 */

exports.clone = function() {
  var out = this.map(function(el) {
    return el.cloneNode(true);
  });

  return this.dom(out);
};

/**
 * Focus the first dom element in our list.
 * 
 * @return {List} self
 * @api public
 */

exports.focus = function(){
  this[0].focus();
  return this;
};

}, {"value":45,"css":50,"text":51}],
50: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var debug = require('debug')('css');
var set = require('./lib/style');
var get = require('./lib/css');

/**
 * Expose `css`
 */

module.exports = css;

/**
 * Get and set css values
 *
 * @param {Element} el
 * @param {String|Object} prop
 * @param {Mixed} val
 * @return {Element} el
 * @api public
 */

function css(el, prop, val) {
  if (!el) return;

  if (undefined !== val) {
    var obj = {};
    obj[prop] = val;
    debug('setting styles %j', obj);
    return setStyles(el, obj);
  }

  if ('object' == typeof prop) {
    debug('setting styles %j', prop);
    return setStyles(el, prop);
  }

  debug('getting %s', prop);
  return get(el, prop);
}

/**
 * Set the styles on an element
 *
 * @param {Element} el
 * @param {Object} props
 * @return {Element} el
 */

function setStyles(el, props) {
  for (var prop in props) {
    set(el, prop, props[prop]);
  }

  return el;
}

}, {"debug":5,"./lib/style":52,"./lib/css":53}],
52: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var debug = require('debug')('css:style');
var camelcase = require('to-camel-case');
var support = require('./support');
var property = require('./prop');
var hooks = require('./hooks');

/**
 * Expose `style`
 */

module.exports = style;

/**
 * Possibly-unitless properties
 *
 * Don't automatically add 'px' to these properties
 */

var cssNumber = {
  "columnCount": true,
  "fillOpacity": true,
  "fontWeight": true,
  "lineHeight": true,
  "opacity": true,
  "order": true,
  "orphans": true,
  "widows": true,
  "zIndex": true,
  "zoom": true
};

/**
 * Set a css value
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Mixed} val
 * @param {Mixed} extra
 */

function style(el, prop, val, extra) {
  // Don't set styles on text and comment nodes
  if (!el || el.nodeType === 3 || el.nodeType === 8 || !el.style ) return;

  var orig = camelcase(prop);
  var style = el.style;
  var type = typeof val;

  if (!val) return get(el, prop, orig, extra);

  prop = property(prop, style);

  var hook = hooks[prop] || hooks[orig];

  // If a number was passed in, add 'px' to the (except for certain CSS properties)
  if ('number' == type && !cssNumber[orig]) {
    debug('adding "px" to end of number');
    val += 'px';
  }

  // Fixes jQuery #8908, it can be done more correctly by specifying setters in cssHooks,
  // but it would mean to define eight (for every problematic property) identical functions
  if (!support.clearCloneStyle && '' === val && 0 === prop.indexOf('background')) {
    debug('set property (%s) value to "inherit"', prop);
    style[prop] = 'inherit';
  }

  // If a hook was provided, use that value, otherwise just set the specified value
  if (!hook || !hook.set || undefined !== (val = hook.set(el, val, extra))) {
    // Support: Chrome, Safari
    // Setting style to blank string required to delete "style: x !important;"
    debug('set hook defined. setting property (%s) to %s', prop, val);
    style[prop] = '';
    style[prop] = val;
  }

}

/**
 * Get the style
 *
 * @param {Element} el
 * @param {String} prop
 * @param {String} orig
 * @param {Mixed} extra
 * @return {String}
 */

function get(el, prop, orig, extra) {
  var style = el.style;
  var hook = hooks[prop] || hooks[orig];
  var ret;

  if (hook && hook.get && undefined !== (ret = hook.get(el, false, extra))) {
    debug('get hook defined, returning: %s', ret);
    return ret;
  }

  ret = style[prop];
  debug('getting %s', ret);
  return ret;
}

}, {"debug":5,"to-camel-case":54,"./support":55,"./prop":56,"./hooks":57}],
54: [function(require, module, exports) {

var toSpace = require('to-space-case');


/**
 * Expose `toCamelCase`.
 */

module.exports = toCamelCase;


/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */


function toCamelCase (string) {
  return toSpace(string).replace(/\s(\w)/g, function (matches, letter) {
    return letter.toUpperCase();
  });
}
}, {"to-space-case":58}],
58: [function(require, module, exports) {

var clean = require('to-no-case');


/**
 * Expose `toSpaceCase`.
 */

module.exports = toSpaceCase;


/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */


function toSpaceCase (string) {
  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
    return match ? ' ' + match : '';
  });
}
}, {"to-no-case":59}],
59: [function(require, module, exports) {

/**
 * Expose `toNoCase`.
 */

module.exports = toNoCase;


/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/;
var hasCamel = /[a-z][A-Z]/;
var hasSeparator = /[\W_]/;


/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase (string) {
  if (hasSpace.test(string)) return string.toLowerCase();

  if (hasSeparator.test(string)) string = unseparate(string);
  if (hasCamel.test(string)) string = uncamelize(string);
  return string.toLowerCase();
}


/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g;


/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate (string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : '';
  });
}


/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g;


/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize (string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ');
  });
}
}, {}],
55: [function(require, module, exports) {
/**
 * Support values
 */

var reliableMarginRight;
var boxSizingReliableVal;
var pixelPositionVal;
var clearCloneStyle;

/**
 * Container setup
 */

var docElem = document.documentElement;
var container = document.createElement('div');
var div = document.createElement('div');

/**
 * Clear clone style
 */

div.style.backgroundClip = 'content-box';
div.cloneNode(true).style.backgroundClip = '';
exports.clearCloneStyle = div.style.backgroundClip === 'content-box';

container.style.cssText = 'border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px';
container.appendChild(div);

/**
 * Pixel position
 *
 * Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
 * getComputedStyle returns percent when specified for top/left/bottom/right
 * rather than make the css module depend on the offset module, we just check for it here
 */

exports.pixelPosition = function() {
  if (undefined == pixelPositionVal) computePixelPositionAndBoxSizingReliable();
  return pixelPositionVal;
}

/**
 * Reliable box sizing
 */

exports.boxSizingReliable = function() {
  if (undefined == boxSizingReliableVal) computePixelPositionAndBoxSizingReliable();
  return boxSizingReliableVal;
}

/**
 * Reliable margin right
 *
 * Support: Android 2.3
 * Check if div with explicit width and no margin-right incorrectly
 * gets computed margin-right based on width of container. (#3333)
 * WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
 * This support function is only executed once so no memoizing is needed.
 *
 * @return {Boolean}
 */

exports.reliableMarginRight = function() {
  var ret;
  var marginDiv = div.appendChild(document.createElement("div" ));

  marginDiv.style.cssText = div.style.cssText = divReset;
  marginDiv.style.marginRight = marginDiv.style.width = "0";
  div.style.width = "1px";
  docElem.appendChild(container);

  ret = !parseFloat(window.getComputedStyle(marginDiv, null).marginRight);

  docElem.removeChild(container);

  // Clean up the div for other support tests.
  div.innerHTML = "";

  return ret;
}

/**
 * Executing both pixelPosition & boxSizingReliable tests require only one layout
 * so they're executed at the same time to save the second computation.
 */

function computePixelPositionAndBoxSizingReliable() {
  // Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
  div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
    "box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;" +
    "position:absolute;top:1%";
  docElem.appendChild(container);

  var divStyle = window.getComputedStyle(div, null);
  pixelPositionVal = divStyle.top !== "1%";
  boxSizingReliableVal = divStyle.width === "4px";

  docElem.removeChild(container);
}



}, {}],
56: [function(require, module, exports) {
/**
 * Module dependencies
 */

var debug = require('debug')('css:prop');
var camelcase = require('to-camel-case');
var vendor = require('./vendor');

/**
 * Export `prop`
 */

module.exports = prop;

/**
 * Normalize Properties
 */

var cssProps = {
  'float': 'cssFloat' in document.documentElement.style ? 'cssFloat' : 'styleFloat'
};

/**
 * Get the vendor prefixed property
 *
 * @param {String} prop
 * @param {String} style
 * @return {String} prop
 * @api private
 */

function prop(prop, style) {
  prop = cssProps[prop] || (cssProps[prop] = vendor(prop, style));
  debug('transform property: %s => %s', prop, style);
  return prop;
}

}, {"debug":5,"to-camel-case":54,"./vendor":60}],
60: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var prefixes = ['Webkit', 'O', 'Moz', 'ms'];

/**
 * Expose `vendor`
 */

module.exports = vendor;

/**
 * Get the vendor prefix for a given property
 *
 * @param {String} prop
 * @param {Object} style
 * @return {String}
 */

function vendor(prop, style) {
  // shortcut for names that are not vendor prefixed
  if (style[prop]) return prop;

  // check for vendor prefixed names
  var capName = prop[0].toUpperCase() + prop.slice(1);
  var original = prop;
  var i = prefixes.length;

  while (i--) {
    prop = prefixes[i] + capName;
    if (prop in style) return prop;
  }

  return original;
}

}, {}],
57: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var each = require('each');
var css = require('./css');
var cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;
var rnumnonpx = new RegExp( '^(' + pnum + ')(?!px)[a-z%]+$', 'i');
var rnumsplit = new RegExp( '^(' + pnum + ')(.*)$', 'i');
var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
var styles = require('./styles');
var support = require('./support');
var swap = require('./swap');
var computed = require('./computed');
var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

/**
 * Height & Width
 */

each(['width', 'height'], function(name) {
  exports[name] = {};

  exports[name].get = function(el, compute, extra) {
    if (!compute) return;
    // certain elements can have dimension info if we invisibly show them
    // however, it must have a current display style that would benefit from this
    return 0 == el.offsetWidth && rdisplayswap.test(css(el, 'display'))
      ? swap(el, cssShow, function() { return getWidthOrHeight(el, name, extra); })
      : getWidthOrHeight(el, name, extra);
  }

  exports[name].set = function(el, val, extra) {
    var styles = extra && styles(el);
    return setPositiveNumber(el, val, extra
      ? augmentWidthOrHeight(el, name, extra, 'border-box' == css(el, 'boxSizing', false, styles), styles)
      : 0
    );
  };

});

/**
 * Opacity
 */

exports.opacity = {};
exports.opacity.get = function(el, compute) {
  if (!compute) return;
  var ret = computed(el, 'opacity');
  return '' == ret ? '1' : ret;
}

/**
 * Utility: Set Positive Number
 *
 * @param {Element} el
 * @param {Mixed} val
 * @param {Number} subtract
 * @return {Number}
 */

function setPositiveNumber(el, val, subtract) {
  var matches = rnumsplit.exec(val);
  return matches ?
    // Guard against undefined 'subtract', e.g., when used as in cssHooks
    Math.max(0, matches[1]) + (matches[2] || 'px') :
    val;
}

/**
 * Utility: Get the width or height
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Mixed} extra
 * @return {String}
 */

function getWidthOrHeight(el, prop, extra) {
  // Start with offset property, which is equivalent to the border-box value
  var valueIsBorderBox = true;
  var val = prop === 'width' ? el.offsetWidth : el.offsetHeight;
  var styles = computed(el);
  var isBorderBox = support.boxSizing && css(el, 'boxSizing') === 'border-box';

  // some non-html elements return undefined for offsetWidth, so check for null/undefined
  // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
  // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
  if (val <= 0 || val == null) {
    // Fall back to computed then uncomputed css if necessary
    val = computed(el, prop, styles);

    if (val < 0 || val == null) {
      val = el.style[prop];
    }

    // Computed unit is not pixels. Stop here and return.
    if (rnumnonpx.test(val)) {
      return val;
    }

    // we need the check for style in case a browser which returns unreliable values
    // for getComputedStyle silently falls back to the reliable el.style
    valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === el.style[prop]);

    // Normalize ', auto, and prepare for extra
    val = parseFloat(val) || 0;
  }

  // use the active box-sizing model to add/subtract irrelevant styles
  extra = extra || (isBorderBox ? 'border' : 'content');
  val += augmentWidthOrHeight(el, prop, extra, valueIsBorderBox, styles);
  return val + 'px';
}

/**
 * Utility: Augment the width or the height
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Mixed} extra
 * @param {Boolean} isBorderBox
 * @param {Array} styles
 */

function augmentWidthOrHeight(el, prop, extra, isBorderBox, styles) {
  // If we already have the right measurement, avoid augmentation,
  // Otherwise initialize for horizontal or vertical properties
  var i = extra === (isBorderBox ? 'border' : 'content') ? 4 : 'width' == prop ? 1 : 0;
  var val = 0;

  for (; i < 4; i += 2) {
    // both box models exclude margin, so add it if we want it
    if (extra === 'margin') {
      val += css(el, extra + cssExpand[i], true, styles);
    }

    if (isBorderBox) {
      // border-box includes padding, so remove it if we want content
      if (extra === 'content') {
        val -= css(el, 'padding' + cssExpand[i], true, styles);
      }

      // at this point, extra isn't border nor margin, so remove border
      if (extra !== 'margin') {
        val -= css(el, 'border' + cssExpand[i] + 'Width', true, styles);
      }
    } else {
      // at this point, extra isn't content, so add padding
      val += css(el, 'padding' + cssExpand[i], true, styles);

      // at this point, extra isn't content nor padding, so add border
      if (extra !== 'padding') {
        val += css(el, 'border' + cssExpand[i] + 'Width', true, styles);
      }
    }
  }

  return val;
}

}, {"each":33,"./css":53,"./styles":61,"./support":55,"./swap":62,"./computed":63}],
53: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var debug = require('debug')('css:css');
var camelcase = require('to-camel-case');
var computed = require('./computed');
var property = require('./prop');

/**
 * Expose `css`
 */

module.exports = css;

/**
 * CSS Normal Transforms
 */

var cssNormalTransform = {
  letterSpacing: 0,
  fontWeight: 400
};

/**
 * Get a CSS value
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Mixed} extra
 * @param {Array} styles
 * @return {String}
 */

function css(el, prop, extra, styles) {
  var hooks = require('./hooks');
  var orig = camelcase(prop);
  var style = el.style;
  var val;

  prop = property(prop, style);
  var hook = hooks[prop] || hooks[orig];

  // If a hook was provided get the computed value from there
  if (hook && hook.get) {
    debug('get hook provided. use that');
    val = hook.get(el, true, extra);
  }

  // Otherwise, if a way to get the computed value exists, use that
  if (undefined == val) {
    debug('fetch the computed value of %s', prop);
    val = computed(el, prop);
  }

  if ('normal' == val && cssNormalTransform[prop]) {
    val = cssNormalTransform[prop];
    debug('normal => %s', val);
  }

  // Return, converting to number if forced or a qualifier was provided and val looks numeric
  if ('' == extra || extra) {
    debug('converting value: %s into a number', val);
    var num = parseFloat(val);
    return true === extra || isNumeric(num) ? num || 0 : val;
  }

  return val;
}

/**
 * Is Numeric
 *
 * @param {Mixed} obj
 * @return {Boolean}
 */

function isNumeric(obj) {
  return !isNan(parseFloat(obj)) && isFinite(obj);
}

}, {"debug":5,"to-camel-case":54,"./computed":63,"./prop":56,"./hooks":57}],
63: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var debug = require('debug')('css:computed');
var withinDocument = require('within-document');
var styles = require('./styles');

/**
 * Expose `computed`
 */

module.exports = computed;

/**
 * Get the computed style
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Array} precomputed (optional)
 * @return {Array}
 * @api private
 */

function computed(el, prop, precomputed) {
  var computed = precomputed || styles(el);
  var ret;
  
  if (!computed) return;

  if (computed.getPropertyValue) {
    ret = computed.getPropertyValue(prop) || computed[prop];
  } else {
    ret = computed[prop];
  }

  if ('' === ret && !withinDocument(el)) {
    debug('element not within document, try finding from style attribute');
    var style = require('./style');
    ret = style(el, prop);
  }

  debug('computed value of %s: %s', prop, ret);

  // Support: IE
  // IE returns zIndex value as an integer.
  return undefined === ret ? ret : ret + '';
}

}, {"debug":5,"within-document":64,"./styles":61,"./style":52}],
64: [function(require, module, exports) {

/**
 * Check if `el` is within the document.
 *
 * @param {Element} el
 * @return {Boolean}
 * @api private
 */

module.exports = function(el) {
  var node = el;
  while (node = node.parentNode) {
    if (node == document) return true;
  }
  return false;
};
}, {}],
61: [function(require, module, exports) {
/**
 * Expose `styles`
 */

module.exports = styles;

/**
 * Get all the styles
 *
 * @param {Element} el
 * @return {Array}
 */

function styles(el) {
  if (window.getComputedStyle) {
    return el.ownerDocument.defaultView.getComputedStyle(el, null);
  } else {
    return el.currentStyle;
  }
}

}, {}],
62: [function(require, module, exports) {
/**
 * Export `swap`
 */

module.exports = swap;

/**
 * Initialize `swap`
 *
 * @param {Element} el
 * @param {Object} options
 * @param {Function} fn
 * @param {Array} args
 * @return {Mixed}
 */

function swap(el, options, fn, args) {
  // Remember the old values, and insert the new ones
  for (var key in options) {
    old[key] = el.style[key];
    el.style[key] = options[key];
  }

  ret = fn.apply(el, args || []);

  // Revert the old values
  for (key in options) {
    el.style[key] = old[key];
  }

  return ret;
}

}, {}],
51: [function(require, module, exports) {

var text = 'innerText' in document.createElement('div')
  ? 'innerText'
  : 'textContent'

module.exports = function (el, val) {
  if (val == null) return el[text];
  el[text] = val;
};

}, {}],
41: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var proto = Array.prototype;
var each = require('each');
var traverse = require('traverse');
var toFunction = require('to-function');
var matches = require('matches-selector');

/**
 * Find children matching the given `selector`.
 *
 * @param {String} selector
 * @return {List}
 * @api public
 */

exports.find = function(selector){
  return this.dom(selector, this);
};

/**
 * Check if the any element in the selection
 * matches `selector`.
 *
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

exports.is = function(selector){
  for(var i = 0, el; el = this[i]; i++) {
    if (matches(el, selector)) return true;
  }

  return false;
};

/**
 * Get parent(s) with optional `selector` and `limit`
 *
 * @param {String} selector
 * @param {Number} limit
 * @return {List}
 * @api public
 */

exports.parent = function(selector, limit){
  return this.dom(traverse('parentNode',
    this[0],
    selector,
    limit
    || 1));
};

/**
 * Get next element(s) with optional `selector` and `limit`.
 *
 * @param {String} selector
 * @param {Number} limit
 * @retrun {List}
 * @api public
 */

exports.next = function(selector, limit){
  return this.dom(traverse('nextSibling',
    this[0],
    selector,
    limit
    || 1));
};

/**
 * Get previous element(s) with optional `selector` and `limit`.
 *
 * @param {String} selector
 * @param {Number} limit
 * @return {List}
 * @api public
 */

exports.prev =
exports.previous = function(selector, limit){
  return this.dom(traverse('previousSibling',
    this[0],
    selector,
    limit
    || 1));
};

/**
 * Iterate over each element creating a new list with
 * one item and invoking `fn(list, i)`.
 *
 * @param {Function} fn
 * @return {List} self
 * @api public
 */

exports.each = function(fn){
  var dom = this.dom;

  for (var i = 0, list, len = this.length; i < len; i++) {
    list = dom(this[i]);
    fn.call(list, list, i);
  }

  return this;
};

/**
 * Iterate over each element and invoke `fn(el, i)`
 *
 * @param {Function} fn
 * @return {List} self
 * @api public
 */

exports.forEach = function(fn) {
  for (var i = 0, len = this.length; i < len; i++) {
    fn.call(this[i], this[i], i);
  }

  return this;
};

/**
 * Map each return value from `fn(val, i)`.
 *
 * Passing a callback function:
 *
 *    inputs.map(function(input){
 *      return input.type
 *    })
 *
 * Passing a property string:
 *
 *    inputs.map('type')
 *
 * @param {Function} fn
 * @return {List} self
 * @api public
 */

exports.map = function(fn){
  fn = toFunction(fn);
  var dom = this.dom;
  var out = [];

  for (var i = 0, len = this.length; i < len; i++) {
    out.push(fn.call(dom(this[i]), this[i], i));
  }

  return this.dom(out);
};

/**
 * Select all values that return a truthy value of `fn(val, i)`.
 *
 *    inputs.select(function(input){
 *      return input.type == 'password'
 *    })
 *
 *  With a property:
 *
 *    inputs.select('type == password')
 *
 * @param {Function|String} fn
 * @return {List} self
 * @api public
 */

exports.filter =
exports.select = function(fn){
  fn = toFunction(fn);
  var dom = this.dom;
  var out = [];
  var val;

  for (var i = 0, len = this.length; i < len; i++) {
    val = fn.call(dom(this[i]), this[i], i);
    if (val) out.push(this[i]);
  }

  return this.dom(out);
};

/**
 * Reject all values that return a truthy value of `fn(val, i)`.
 *
 * Rejecting using a callback:
 *
 *    input.reject(function(user){
 *      return input.length < 20
 *    })
 *
 * Rejecting with a property:
 *
 *    items.reject('password')
 *
 * Rejecting values via `==`:
 *
 *    data.reject(null)
 *    input.reject(file)
 *
 * @param {Function|String|Mixed} fn
 * @return {List}
 * @api public
 */

exports.reject = function(fn){
  var dom = this.dom;
  var out = [];
  var len = this.length;
  var val, i;

  if ('string' == typeof fn) fn = toFunction(fn);

  if (fn) {
    for (i = 0; i < len; i++) {
      val = fn.call(dom(this[i]), this[i], i);
      if (!val) out.push(this[i]);
    }
  } else {
    for (i = 0; i < len; i++) {
      if (this[i] != fn) out.push(this[i]);
    }
  }

  return this.dom(out);
};

/**
 * Return a `List` containing the element at `i`.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

exports.at = function(i){
  return this.dom(this[i]);
};

/**
 * Return a `List` containing the first element.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

exports.first = function(){
  return this.dom(this[0]);
};

/**
 * Return a `List` containing the last element.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

exports.last = function(){
  return this.dom(this[this.length - 1]);
};

/**
 * Mixin the array functions
 */

each([
  'push',
  'pop',
  'shift',
  'splice',
  'unshift',
  'reverse',
  'sort',
  'toString',
  'concat',
  'join',
  'slice'
], function(method) {
  exports[method] = function() {
    return proto[method].apply(this.toArray(), arguments);
  };
});

}, {"each":33,"traverse":65,"to-function":66,"matches-selector":67}],
65: [function(require, module, exports) {

/**
 * dependencies
 */

var matches = require('matches-selector');

/**
 * Traverse with the given `el`, `selector` and `len`.
 *
 * @param {String} type
 * @param {Element} el
 * @param {String} selector
 * @param {Number} len
 * @return {Array}
 * @api public
 */

module.exports = function(type, el, selector, len){
  var el = el[type]
    , n = len || 1
    , ret = [];

  if (!el) return ret;

  do {
    if (n == ret.length) break;
    if (1 != el.nodeType) continue;
    if (matches(el, selector)) ret.push(el);
    if (!selector) ret.push(el);
  } while (el = el[type]);

  return ret;
}

}, {"matches-selector":49}],
66: [function(require, module, exports) {

/**
 * Module Dependencies
 */

var expr;
try {
  expr = require('props');
} catch(e) {
  expr = require('component-props');
}

/**
 * Expose `toFunction()`.
 */

module.exports = toFunction;

/**
 * Convert `obj` to a `Function`.
 *
 * @param {Mixed} obj
 * @return {Function}
 * @api private
 */

function toFunction(obj) {
  switch ({}.toString.call(obj)) {
    case '[object Object]':
      return objectToFunction(obj);
    case '[object Function]':
      return obj;
    case '[object String]':
      return stringToFunction(obj);
    case '[object RegExp]':
      return regexpToFunction(obj);
    default:
      return defaultToFunction(obj);
  }
}

/**
 * Default to strict equality.
 *
 * @param {Mixed} val
 * @return {Function}
 * @api private
 */

function defaultToFunction(val) {
  return function(obj){
    return val === obj;
  };
}

/**
 * Convert `re` to a function.
 *
 * @param {RegExp} re
 * @return {Function}
 * @api private
 */

function regexpToFunction(re) {
  return function(obj){
    return re.test(obj);
  };
}

/**
 * Convert property `str` to a function.
 *
 * @param {String} str
 * @return {Function}
 * @api private
 */

function stringToFunction(str) {
  // immediate such as "> 20"
  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

  // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
  return new Function('_', 'return ' + get(str));
}

/**
 * Convert `object` to a function.
 *
 * @param {Object} object
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  var match = {};
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key]);
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  };
}

/**
 * Built the getter function. Supports getter style functions
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function get(str) {
  var props = expr(str);
  if (!props.length) return '_.' + str;

  var val, i, prop;
  for (i = 0; i < props.length; i++) {
    prop = props[i];
    val = '_.' + prop;
    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";

    // mimic negative lookbehind to avoid problems with nested properties
    str = stripNested(prop, str, val);
  }

  return str;
}

/**
 * Mimic negative lookbehind to avoid problems with nested properties.
 *
 * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
 *
 * @param {String} prop
 * @param {String} str
 * @param {String} val
 * @return {String}
 * @api private
 */

function stripNested (prop, str, val) {
  return str.replace(new RegExp('(\\.)?' + prop, 'g'), function($0, $1) {
    return $1 ? $0 : val;
  });
}

}, {"props":44,"component-props":44}],
67: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var query = require('query');

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

}, {"query":36}],
9: [function(require, module, exports) {
(function() {
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
          self.onCloseCallback({
            cancel: true
          });
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
      var dataType, request, self, url;
      self = this;
      url = gsndfp.apiUrl + "/ShopperWelcome/Get/" + gsndfp.gsnid;
      dataType = 'json';
      if (self.ieOld) {
        $win.gsnswCallback = function(rsp) {
          return self.swSucccess(rsp);
        };
        url += '?callback=gsnswCallback';
        dataType = 'jsonp';
      }
      if (dataType === 'jsonp') {
        loadScript(url);
      } else {
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
          var req;
          req = this;
          if (req.status >= 200 && req.status < 400) {
            return self.swSucccess(req.response);
          }
        };
        request.send();
      }
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

}).call(this);

}, {"trakless":6,"gmodal":68,"load-script":69,"dom":8,"./sw.css":70,"./circplus.html":71}],
68: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
var Emitter, checkEvent, createModal, domify, gmodal, hideModalInternal, modal, modals, showModalInternal, trim, win;

Emitter = require('emitter');

domify = require('domify');

trim = require('trim');

win = window;

modals = [];

checkEvent = function(self, name, evt, el) {
  var scls, tg;
  evt = evt || win.event;
  tg = evt.target || evt.srcElement;
  if (tg.nodeType === 3) {
    tg = tg.parentNode;
  }
  if (self.hasCls(tg.parentNode, "" + self.closeCls)) {
    tg = tg.parentNode;
  }
  scls = "gmodal-wrap " + self.closeCls;
  if (name === 'click') {
    if (self.hasCls(tg, scls) || tg === el) {
      self.emit('click', tg, evt);
    }
  } else if (name === 'keypress') {
    if (self.hasCls(tg, scls) || tg === el || tg === sel.doc || tg === self.doc.body) {
      if ((evt.which || evt.keyCode) === 27) {
        self.emit('esc', tg, evt);
      }
    }
  } else if (name === 'tap') {
    if (self.hasCls(tg, scls) || tg === el) {
      self.emit('tap', tg, evt);
    }
  }
  return false;
};

createModal = function(self) {
  var el, myKeypress, oldkp;
  el = self.doc.getElementById("gmodal");
  if (!el) {
    self.injectStyle('gmodalcss', self.css);
    el = self.doc.createElement('div');
    el.id = 'gmodal';
    el.onclick = function(evt) {
      return checkEvent(self, 'click', evt, el);
    };
    myKeypress = function(evt) {
      return checkEvent(self, 'keypress', evt, el);
    };
    el.onkeypress = myKeypress;
    if (typeof self.doc.onkeypress === 'function') {
      oldkp = self.doc.onkeypress;
      self.doc.onkeypress = function(evt) {
        oldkp(evt);
        return myKeypress(evt);
      };
    } else {
      self.doc.onkeypress = myKeypress;
    }
    el.ontap = function(evt) {
      return checkEvent(self, 'tap', evt, el);
    };
    el.appendChild(domify(self.tpl));
    self.doc.getElementsByTagName('body')[0].appendChild(el);
  }
  return el;
};

showModalInternal = function(self, opts) {
  var eCls;
  if ((opts != null)) {
    self.opts = opts;
    if ((self.opts.content != null)) {
      while (self.el.firstChild) {
        self.el.removeChild(self.el.firstChild);
      }
      if (typeof self.opts.content === 'string') {
        self.el.appendChild(domify(self.opts.content));
      } else {
        self.el.appendChild(self.opts.content);
      }
      self.opts.content = null;
    }
  }
  if (self.opts.closeCls) {
    self.closeCls = self.opts.closeCls;
  }
  self.elWrapper.style.display = self.elWrapper.style.visibility = "";
  self.elWrapper.className = trim((self.baseCls + " ") + (self.opts.cls || ''));
  eCls = self.doc.getElementsByTagName('body')[0].className;
  self.doc.getElementsByTagName('body')[0].className = trim(eCls + " body-gmodal");
  self.emit('show', self);
};

hideModalInternal = function(self) {
  var eCls;
  self.elWrapper.className = "" + self.baseCls;
  eCls = self.doc.getElementsByTagName('body')[0].className;
  self.doc.getElementsByTagName('body')[0].className = trim(eCls.replace(/body\-gmodal/gi, ''));
  self.isVisible = false;
  self.emit('hide', self);
  if (typeof self.opts.hideCallback === 'function') {
    self.opts.hideCallback(self);
  }
  if (modals.length > 0) {
    return self.show();
  }
};


/**
 * modal
 */

modal = (function() {
  function modal() {}

  modal.prototype.doc = win.document;

  modal.prototype.elWrapper = null;

  modal.prototype.el = null;

  modal.prototype.opts = {};

  modal.prototype.baseCls = 'gmodal';

  modal.prototype.closeCls = 'gmodal-close';

  modal.prototype.tpl = '<div class="gmodal-wrap gmodal-left"></div><div class="gmodal-wrap gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div>';

  modal.prototype.css = '.gmodal{display:none;overflow:hidden;outline:0;-webkit-overflow-scrolling:touch;position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;z-index:9999990}.body-gmodal .gmodal{display:table}.body-gmodal{overflow:hidden}.gmodal-content,.gmodal-wrap{display:table-cell;position:relative;vertical-align: middle}.gmodal-left,.gmodal-right{width:50%}';

  modal.prototype.show = function(opts, hideCb) {
    var self;
    self = this;
    if (!self.doc || !self.doc.body) {
      return false;
    }
    self.elWrapper = createModal(self);
    if (!self.el) {
      self.el = self.doc.getElementById("gmodalContent");
    }
    if (opts) {
      opts.hideCallback = hideCb;
      modals.push(opts);
    }
    if (self.isVisible) {
      return false;
    }
    if (modals.length > 0) {
      opts = modals.shift();
    }
    if (!self.opts && !opts) {
      return false;
    }
    if ((self.opts || opts).timeout) {
      setTimeout(function() {
        return showModalInternal(self, opts);
      }, (self.opts || opts).timeout);
    } else {
      showModalInternal(self, opts);
    }
    return self.isVisible = true;
  };

  modal.prototype.hide = function() {
    var self;
    self = this;
    if (!self.elWrapper) {
      return self;
    }
    if (self.opts) {
      if (self.opts.timeout) {
        setTimeout(function() {
          return hideModalInternal(self);
        }, self.opts.timeout);
      } else {
        hideModalInternal(self);
      }
    }
    return self;
  };

  modal.prototype.injectStyle = function(id, css) {
    var el, elx, self;
    self = this;
    el = self.doc.getElementById(id);
    if (!el) {
      el = self.doc.createElement('style');
      el.id = id;
      el.type = 'text/css';
      if (el.styleSheet) {
        el.styleSheet.cssText = css;
      } else {
        el.appendChild(self.doc.createTextNode(css));
      }
      elx = self.doc.getElementsByTagName('link')[0];
      elx = elx || (self.doc.head || self.doc.getElementsByTagName('head')[0]).lastChild;
      elx.parentNode.insertBefore(el, elx);
    }
    return this;
  };

  modal.prototype.hasCls = function(el, cls) {
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

  return modal;

})();

Emitter(modal.prototype);

gmodal = new modal();

win.gmodal = gmodal;

module.exports = gmodal;

}, {"emitter":72,"domify":73,"trim":27}],
72: [function(require, module, exports) {

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
73: [function(require, module, exports) {

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var div = document.createElement('div');
// Setup
div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
// Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
var innerHTMLBug = !div.getElementsByTagName('link').length;
div = undefined;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

}, {}],
69: [function(require, module, exports) {

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

module.exports = function loadScript(options, fn){
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

  // Make the `<script>` element and insert it before the first script on the
  // page, which is guaranteed to exist since this Javascript is running.
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = options.src;

  // If we have a fn, attach event handlers, even in IE. Based off of
  // the Third-Party Javascript script loading example:
  // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
  if ('function' == type(fn)) {
    onload(script, fn);
  }

  tick(function(){
    // Append after event listeners are attached for IE.
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  });

  // Return the script element in case they want to do anything special, like
  // give it an ID or attributes.
  return script;
};
}, {"script-onload":23,"next-tick":24,"type":25}],
70: [function(require, module, exports) {
module.exports = '.gsnsw {\n  	float: left;\n}\n.gmodal {\n\n	/* IE 8- */\n	filter:alpha(opacity=90); \n	-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=90)";\n    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\n	/* works for old school versions of the Mozilla browsers like Netscape Navigator. */\n	-moz-opacity: 0.9; \n\n	/* This is for old versions of Safari (1.x) with KHTML rendering engine */\n	-khtml-opacity: 0.9; \n\n	/* This is the "most important" one because it\'s the current standard in CSS. This will work in most versions of Firefox, Safari, and Opera. */  \n	opacity: 0.9; \n  	background: #000; /* IE5+ */\n  	background: rgba(0,0,0,0.90);\n}\n.sw-pop {\n	filter: alpha(opacity=100);\n    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";\n    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n	-moz-opacity: 1; \n	-khtml-opacity: 1; \n	opacity: 1; \n	background: #777;\n	background: rgba(119, 119, 119, 1);\n}\n\n#gmodalContent {\n    vertical-align: top;\n    top: 50px;\n}\n\n@media (max-width: 640px) and (max-height: 640px){\n    .gsnsw {\n        float:none !important;\n    }\n\n    .sw-header-cta, .sw-header-break, .sw-header-right-img {\n        display:none !important;\n    }\n\n    .sw-header-break{\n        display:none !important;\n    }\n\n    .sw-pop {\n        width: 280px !important;\n        left:0 !important;\n        margin-left:0 !important;\n    }\n\n    .sw-header-dismiss {\n        position: static !important;\n        left:0 !important;\n        top:0 !important;\n        vertical-align: middle !important;\n        text-align: center !important;\n    }\n\n    .sw-close{\n        padding:1px !important;\n    }\n\n    #gmodalContent {\n        vertical-align: middle;\n        height: 80vh;\n        top: auto;\n    }\n\n    .sw-body {\n        max-height: 60vh;\n        overflow-y: scroll;\n    }\n}';
}, {}],
71: [function(require, module, exports) {
module.exports = '<div class="gsn-slot-container"><div class="cpslot cpslot2" data-companion="true" data-dimensions="300x50"></div></div><div class="gsn-slot-container"><div class="cpslot cpslot1" data-dimensions="300x100,300x120"></div></div>';
}, {}],
4: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var equals = require('equals');
var fmt = require('fmt');
var stack = require('stack');

/**
 * Assert `expr` with optional failure `msg`.
 *
 * @param {Mixed} expr
 * @param {String} [msg]
 * @api public
 */

module.exports = exports = function (expr, msg) {
  if (expr) return;
  throw error(msg || message());
};

/**
 * Assert `actual` is weak equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.equal = function (actual, expected, msg) {
  if (actual == expected) return;
  throw error(msg || fmt('Expected %o to equal %o.', actual, expected), actual, expected);
};

/**
 * Assert `actual` is not weak equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notEqual = function (actual, expected, msg) {
  if (actual != expected) return;
  throw error(msg || fmt('Expected %o not to equal %o.', actual, expected));
};

/**
 * Assert `actual` is deep equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.deepEqual = function (actual, expected, msg) {
  if (equals(actual, expected)) return;
  throw error(msg || fmt('Expected %o to deeply equal %o.', actual, expected), actual, expected);
};

/**
 * Assert `actual` is not deep equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notDeepEqual = function (actual, expected, msg) {
  if (!equals(actual, expected)) return;
  throw error(msg || fmt('Expected %o not to deeply equal %o.', actual, expected));
};

/**
 * Assert `actual` is strict equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.strictEqual = function (actual, expected, msg) {
  if (actual === expected) return;
  throw error(msg || fmt('Expected %o to strictly equal %o.', actual, expected), actual, expected);
};

/**
 * Assert `actual` is not strict equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notStrictEqual = function (actual, expected, msg) {
  if (actual !== expected) return;
  throw error(msg || fmt('Expected %o not to strictly equal %o.', actual, expected));
};

/**
 * Assert `block` throws an `error`.
 *
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [msg]
 * @api public
 */

exports.throws = function (block, err, msg) {
  var threw;
  try {
    block();
  } catch (e) {
    threw = e;
  }

  if (!threw) throw error(msg || fmt('Expected %s to throw an error.', block.toString()));
  if (err && !(threw instanceof err)) {
    throw error(msg || fmt('Expected %s to throw an %o.', block.toString(), err));
  }
};

/**
 * Assert `block` doesn't throw an `error`.
 *
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [msg]
 * @api public
 */

exports.doesNotThrow = function (block, err, msg) {
  var threw;
  try {
    block();
  } catch (e) {
    threw = e;
  }

  if (threw) throw error(msg || fmt('Expected %s not to throw an error.', block.toString()));
  if (err && (threw instanceof err)) {
    throw error(msg || fmt('Expected %s not to throw an %o.', block.toString(), err));
  }
};

/**
 * Create a message from the call stack.
 *
 * @return {String}
 * @api private
 */

function message() {
  if (!Error.captureStackTrace) return 'assertion failed';
  var callsite = stack()[2];
  var fn = callsite.getFunctionName();
  var file = callsite.getFileName();
  var line = callsite.getLineNumber() - 1;
  var col = callsite.getColumnNumber() - 1;
  var src = get(file);
  line = src.split('\n')[line].slice(col);
  var m = line.match(/assert\((.*)\)/);
  return m && m[1].trim();
}

/**
 * Load contents of `script`.
 *
 * @param {String} script
 * @return {String}
 * @api private
 */

function get(script) {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', script, false);
  xhr.send(null);
  return xhr.responseText;
}

/**
 * Error with `msg`, `actual` and `expected`.
 *
 * @param {String} msg
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @return {Error}
 */

function error(msg, actual, expected){
  var err = new Error(msg);
  err.showDiff = 3 == arguments.length;
  err.actual = actual;
  err.expected = expected;
  return err;
}

}, {"equals":74,"fmt":75,"stack":76}],
74: [function(require, module, exports) {
var type = require('type')

// (any, any, [array]) -> boolean
function equal(a, b, memos){
  // All identical values are equivalent
  if (a === b) return true
  var fnA = types[type(a)]
  var fnB = types[type(b)]
  return fnA && fnA === fnB
    ? fnA(a, b, memos)
    : false
}

var types = {}

// (Number) -> boolean
types.number = function(a, b){
  return a !== a && b !== b/*Nan check*/
}

// (function, function, array) -> boolean
types['function'] = function(a, b, memos){
  return a.toString() === b.toString()
    // Functions can act as objects
    && types.object(a, b, memos)
    && equal(a.prototype, b.prototype)
}

// (date, date) -> boolean
types.date = function(a, b){
  return +a === +b
}

// (regexp, regexp) -> boolean
types.regexp = function(a, b){
  return a.toString() === b.toString()
}

// (DOMElement, DOMElement) -> boolean
types.element = function(a, b){
  return a.outerHTML === b.outerHTML
}

// (textnode, textnode) -> boolean
types.textnode = function(a, b){
  return a.textContent === b.textContent
}

// decorate `fn` to prevent it re-checking objects
// (function) -> function
function memoGaurd(fn){
  return function(a, b, memos){
    if (!memos) return fn(a, b, [])
    var i = memos.length, memo
    while (memo = memos[--i]) {
      if (memo[0] === a && memo[1] === b) return true
    }
    return fn(a, b, memos)
  }
}

types['arguments'] =
types.array = memoGaurd(arrayEqual)

// (array, array, array) -> boolean
function arrayEqual(a, b, memos){
  var i = a.length
  if (i !== b.length) return false
  memos.push([a, b])
  while (i--) {
    if (!equal(a[i], b[i], memos)) return false
  }
  return true
}

types.object = memoGaurd(objectEqual)

// (object, object, array) -> boolean
function objectEqual(a, b, memos) {
  if (typeof a.equal == 'function') {
    memos.push([a, b])
    return a.equal(b, memos)
  }
  var ka = getEnumerableProperties(a)
  var kb = getEnumerableProperties(b)
  var i = ka.length

  // same number of properties
  if (i !== kb.length) return false

  // although not necessarily the same order
  ka.sort()
  kb.sort()

  // cheap key test
  while (i--) if (ka[i] !== kb[i]) return false

  // remember
  memos.push([a, b])

  // iterate again this time doing a thorough check
  i = ka.length
  while (i--) {
    var key = ka[i]
    if (!equal(a[key], b[key], memos)) return false
  }

  return true
}

// (object) -> array
function getEnumerableProperties (object) {
  var result = []
  for (var k in object) if (k !== 'constructor') {
    result.push(k)
  }
  return result
}

module.exports = equal

}, {"type":77}],
77: [function(require, module, exports) {

var toString = {}.toString
var DomNode = typeof window != 'undefined'
  ? window.Node
  : Function

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = exports = function(x){
  var type = typeof x
  if (type != 'object') return type
  type = types[toString.call(x)]
  if (type) return type
  if (x instanceof DomNode) switch (x.nodeType) {
    case 1:  return 'element'
    case 3:  return 'text-node'
    case 9:  return 'document'
    case 11: return 'document-fragment'
    default: return 'dom-node'
  }
}

var types = exports.types = {
  '[object Function]': 'function',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Arguments]': 'arguments',
  '[object Array]': 'array',
  '[object String]': 'string',
  '[object Null]': 'null',
  '[object Undefined]': 'undefined',
  '[object Number]': 'number',
  '[object Boolean]': 'boolean',
  '[object Object]': 'object',
  '[object Text]': 'text-node',
  '[object Uint8Array]': 'bit-array',
  '[object Uint16Array]': 'bit-array',
  '[object Uint32Array]': 'bit-array',
  '[object Uint8ClampedArray]': 'bit-array',
  '[object Error]': 'error',
  '[object FormData]': 'form-data',
  '[object File]': 'file',
  '[object Blob]': 'blob'
}

}, {}],
75: [function(require, module, exports) {

/**
 * Export `fmt`
 */

module.exports = fmt;

/**
 * Formatters
 */

fmt.o = JSON.stringify;
fmt.s = String;
fmt.d = parseInt;

/**
 * Format the given `str`.
 *
 * @param {String} str
 * @param {...} args
 * @return {String}
 * @api public
 */

function fmt(str){
  var args = [].slice.call(arguments, 1);
  var j = 0;

  return str.replace(/%([a-z])/gi, function(_, f){
    return fmt[f]
      ? fmt[f](args[j++])
      : _ + f;
  });
}

}, {}],
76: [function(require, module, exports) {

/**
 * Expose `stack()`.
 */

module.exports = stack;

/**
 * Return the stack.
 *
 * @return {Array}
 * @api public
 */

function stack() {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack){ return stack; };
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}
}, {}]}, {}, {"1":""})

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlcXVpcmUuanMiLCJ0ZXN0L3Rlc3RzLmNvZmZlZSIsInRlc3QvaW5kZXguY29mZmVlIiwic3JjL2luZGV4LmNvZmZlZSIsImNvbXBvbmVudHMvdmlzaW9ubWVkaWEtZGVidWdAMi4xLjMvYnJvd3Nlci5qcyIsImNvbXBvbmVudHMvdmlzaW9ubWVkaWEtZGVidWdAMi4xLjMvZGVidWcuanMiLCJjb21wb25lbnRzL3JhdWNoZy1tcy5qc0AwLjcuMC9pbmRleC5qcyIsImNvbXBvbmVudHMvbmlpa25vdy10cmFrbGVzc0AwLjEuNS9saWIvaW5kZXguanMiLCJjb21wb25lbnRzL25paWtub3cteHN0b3JlQDAuMS4wL2xpYi9pbmRleC5qcyIsImNvbXBvbmVudHMvc2VnbWVudGlvLWxvYWQtaWZyYW1lQDAuMS4wL2luZGV4LmpzIiwiY29tcG9uZW50cy9zZWdtZW50aW8tc2NyaXB0LW9ubG9hZEAxLjAuMS9pbmRleC5qcyIsImNvbXBvbmVudHMvdGltb3hsZXktbmV4dC10aWNrQDAuMC4yL2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtdHlwZUAxLjEuMC9pbmRleC5qcyIsImNvbXBvbmVudHMvbWFyY3Vzd2VzdGluLXN0b3JlLmpzQHYxLjMuMTcvc3RvcmUuanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC1jb29raWVAMS4xLjEvaW5kZXguanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC1lbWl0dGVyQDEuMS4wL2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtaW5kZXhvZkAwLjAuMy9pbmRleC5qcyIsImNvbXBvbmVudHMvYXZldGlzay1kZWZhdWx0c0AwLjAuNC9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LXF1ZXJ5c3RyaW5nQDEuMy4wL2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtdHJpbUAwLjAuMS9pbmRleC5qcyIsImNvbXBvbmVudHMvZ2pvaG5zb24tdXVpZEAwLjAuMS9pbmRleC5qcyIsImNvbXBvbmVudHMvbmlpa25vdy13ZWJhbmFseXNlckAwLjEuMC9saWIvaW5kZXguanMiLCJjb21wb25lbnRzL25paWtub3ctZmxhc2hkZXRlY3RAMS4wLjQvaW5kZXguanMiLCJjb21wb25lbnRzL2Rlc2FuZHJvLWRvYy1yZWFkeUB2MS4wLjQvZG9jLXJlYWR5LmpzIiwiY29tcG9uZW50cy9kZXNhbmRyby1ldmVudGllQHYxLjAuNi9ldmVudGllLmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtZGVib3VuY2VAMS4wLjAvaW5kZXguanMiLCJjb21wb25lbnRzL1JheW5vcy1kYXRlLW5vd0B2MS4wLjEvaW5kZXguanMiLCJjb21wb25lbnRzL25paWtub3ctbHNxdWV1ZUAwLjEuMC9saWIvaW5kZXguanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC1qc29uLWZhbGxiYWNrQDEuMC4wL2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtZG9tQDEuMC43L2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtZG9taWZ5QDEuMy4yL2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtZWFjaEAwLjIuNS9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LXR5cGVAMS4wLjAvaW5kZXguanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC10by1mdW5jdGlvbkAyLjAuNS9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LXByb3BzQDEuMS4yL2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtZXZlbnRAMC4xLjQvaW5kZXguanMiLCJjb21wb25lbnRzL21hdHRoZXdwLWtleXNAMC4wLjMvaW5kZXguanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC1xdWVyeUAwLjAuMy9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LWRvbUAxLjAuNy9saWIvYXR0cmlidXRlcy5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LXZhbHVlQDEuMS4wL2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtZG9tQDEuMC43L2xpYi9jbGFzc2VzLmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtY2xhc3Nlc0AxLjIuMy9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LWRvbUAxLjAuNy9saWIvZXZlbnRzLmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtZGVsZWdhdGVAMC4yLjMvaW5kZXguanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC1jbG9zZXN0QDAuMS40L2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtbWF0Y2hlcy1zZWxlY3RvckAwLjEuNS9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LWRvbUAxLjAuNy9saWIvbWFuaXB1bGF0ZS5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LWNzc0AwLjAuNi9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LWNzc0AwLjAuNi9saWIvc3R5bGUuanMiLCJjb21wb25lbnRzL2lhbnN0b3JtdGF5bG9yLXRvLWNhbWVsLWNhc2VAMC4yLjEvaW5kZXguanMiLCJjb21wb25lbnRzL2lhbnN0b3JtdGF5bG9yLXRvLXNwYWNlLWNhc2VAMC4xLjIvaW5kZXguanMiLCJjb21wb25lbnRzL2lhbnN0b3JtdGF5bG9yLXRvLW5vLWNhc2VAMC4xLjAvaW5kZXguanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC1jc3NAMC4wLjYvbGliL3N1cHBvcnQuanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC1jc3NAMC4wLjYvbGliL3Byb3AuanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC1jc3NAMC4wLjYvbGliL3ZlbmRvci5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LWNzc0AwLjAuNi9saWIvaG9va3MuanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC1jc3NAMC4wLjYvbGliL2Nzcy5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LWNzc0AwLjAuNi9saWIvY29tcHV0ZWQuanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC13aXRoaW4tZG9jdW1lbnRAMC4wLjEvaW5kZXguanMiLCJjb21wb25lbnRzL2NvbXBvbmVudC1jc3NAMC4wLjYvbGliL3N0eWxlcy5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LWNzc0AwLjAuNi9saWIvc3dhcC5qcyIsImNvbXBvbmVudHMvbWF0dGhld3AtdGV4dEAwLjAuMi9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LWRvbUAxLjAuNy9saWIvdHJhdmVyc2UuanMiLCJjb21wb25lbnRzL3lpZWxkcy10cmF2ZXJzZUAwLjEuMS9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LXRvLWZ1bmN0aW9uQDIuMC42L2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtbWF0Y2hlcy1zZWxlY3RvckAwLjEuNC9pbmRleC5qcyIsInNyYy9nc25kZnBmYWN0b3J5LmNvZmZlZSIsImNvbXBvbmVudHMvbmlpa25vdy1nbW9kYWxAMC4xLjAvbGliL2luZGV4LmpzIiwiY29tcG9uZW50cy9jb21wb25lbnQtZW1pdHRlckAxLjIuMC9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LWRvbWlmeUAxLjMuMy9pbmRleC5qcyIsImNvbXBvbmVudHMvc2VnbWVudGlvLWxvYWQtc2NyaXB0QDAuMS4zL2luZGV4LmpzIiwic3JjL3N3LmNzcyIsInNyYy9jaXJjcGx1cy5odG1sIiwiY29tcG9uZW50cy9jb21wb25lbnQtYXNzZXJ0QDAuNS4wL2luZGV4LmpzIiwiY29tcG9uZW50cy9qa3Jvc28tZXF1YWxzQDEuMC4wL2luZGV4LmpzIiwiY29tcG9uZW50cy9qa3Jvc28tdHlwZUAxLjEuMC9pbmRleC5qcyIsImNvbXBvbmVudHMveWllbGRzLWZtdEAwLjAuMi9pbmRleC5qcyIsImNvbXBvbmVudHMvY29tcG9uZW50LXN0YWNrQDAuMC4xL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2MUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25vQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM1WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDak9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3bEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDek9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzREE7OztBQ0FBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gb3V0ZXIobW9kdWxlcywgY2FjaGUsIGVudHJpZXMpe1xuXG4gIC8qKlxuICAgKiBHbG9iYWxcbiAgICovXG5cbiAgdmFyIGdsb2JhbCA9IChmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSkoKTtcblxuICAvKipcbiAgICogUmVxdWlyZSBgbmFtZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0ganVtcGVkXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmUobmFtZSwganVtcGVkKXtcbiAgICBpZiAoY2FjaGVbbmFtZV0pIHJldHVybiBjYWNoZVtuYW1lXS5leHBvcnRzO1xuICAgIGlmIChtb2R1bGVzW25hbWVdKSByZXR1cm4gY2FsbChuYW1lLCByZXF1aXJlKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBmaW5kIG1vZHVsZSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBtb2R1bGUgYGlkYCBhbmQgY2FjaGUgaXQuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpZFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXF1aXJlXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gY2FsbChpZCwgcmVxdWlyZSl7XG4gICAgdmFyIG0gPSBjYWNoZVtpZF0gPSB7IGV4cG9ydHM6IHt9IH07XG4gICAgdmFyIG1vZCA9IG1vZHVsZXNbaWRdO1xuICAgIHZhciBuYW1lID0gbW9kWzJdO1xuICAgIHZhciBmbiA9IG1vZFswXTtcblxuICAgIGZuLmNhbGwobS5leHBvcnRzLCBmdW5jdGlvbihyZXEpe1xuICAgICAgdmFyIGRlcCA9IG1vZHVsZXNbaWRdWzFdW3JlcV07XG4gICAgICByZXR1cm4gcmVxdWlyZShkZXAgPyBkZXAgOiByZXEpO1xuICAgIH0sIG0sIG0uZXhwb3J0cywgb3V0ZXIsIG1vZHVsZXMsIGNhY2hlLCBlbnRyaWVzKTtcblxuICAgIC8vIGV4cG9zZSBhcyBgbmFtZWAuXG4gICAgaWYgKG5hbWUpIGNhY2hlW25hbWVdID0gY2FjaGVbaWRdO1xuXG4gICAgcmV0dXJuIGNhY2hlW2lkXS5leHBvcnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmUgYWxsIGVudHJpZXMgZXhwb3NpbmcgdGhlbSBvbiBnbG9iYWwgaWYgbmVlZGVkLlxuICAgKi9cblxuICBmb3IgKHZhciBpZCBpbiBlbnRyaWVzKSB7XG4gICAgaWYgKGVudHJpZXNbaWRdKSB7XG4gICAgICBnbG9iYWxbZW50cmllc1tpZF1dID0gcmVxdWlyZShpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcXVpcmUoaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEdW8gZmxhZy5cbiAgICovXG5cbiAgcmVxdWlyZS5kdW8gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBFeHBvc2UgY2FjaGUuXG4gICAqL1xuXG4gIHJlcXVpcmUuY2FjaGUgPSBjYWNoZTtcblxuICAvKipcbiAgICogRXhwb3NlIG1vZHVsZXNcbiAgICovXG5cbiAgcmVxdWlyZS5tb2R1bGVzID0gbW9kdWxlcztcblxuICAvKipcbiAgICogUmV0dXJuIG5ld2VzdCByZXF1aXJlLlxuICAgKi9cblxuICAgcmV0dXJuIHJlcXVpcmU7XG59KSIsIihmdW5jdGlvbigpIHtcbiAgcmVxdWlyZShcIi4vaW5kZXguY29mZmVlXCIpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgYXNzZXJ0LCBnc25kZnA7XG5cbiAgZ3NuZGZwID0gcmVxdWlyZSgnLi4vc3JjL2luZGV4LmNvZmZlZScpO1xuXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2NvbXBvbmVudC1hc3NlcnQnKTtcblxuICBkZXNjcmliZSgnZ3NuZGZwLmxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gaXQoJ3Nob3VsZCBpbml0aWF0ZSBzaG9wcGVyIHdlbGNvbWUnLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBnc25kZnAuQWR2ZXJ0aXNpbmcubG9hZCgxMTkpO1xuICAgIH0pO1xuICB9KTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgdmFyIFBsdWdpbiwgX3RrLCBhUGx1Z2luLCBhdHRycywgYnVpbGRxcywgY2lyY1BsdXMsIGRlYnVnLCBkb2MsIGRvbSwgZm4sIGdzbkNvbnRleHQsIGdzblN3MiwgZ3NuZGZwZmFjdG9yeSwgZ3NucG9kcywgaSwgaiwgaywgbGFzdFJlZnJlc2hUaW1lLCBsZW4sIGxlbjEsIGxvYWRpZnJhbWUsIGxvZywgbXlHc24sIG15UGx1Z2luLCBvbGRHc25BZHZlcnRpc2luZywgcHJlZml4LCByZWYsIHJlZjEsIHNjcmlwdCwgdHJha2xlc3MyLCB3aW47XG5cbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpO1xuXG4gIGxvZyA9IGRlYnVnKCdnc25kZnAnKTtcblxuICB0cmFrbGVzczIgPSByZXF1aXJlKCd0cmFrbGVzcycpO1xuXG4gIGxvYWRpZnJhbWUgPSByZXF1aXJlKCdsb2FkLWlmcmFtZScpO1xuXG4gIGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuXG4gIGdzbmRmcGZhY3RvcnkgPSByZXF1aXJlKCcuL2dzbmRmcGZhY3RvcnkuY29mZmVlJyk7XG5cbiAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwpIHtcbiAgICBpZiAoKGNvbnNvbGUubG9nLmJpbmQgIT0gbnVsbCkpIHtcbiAgICAgIGxvZy5sb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuICAgIH1cbiAgfVxuXG4gIHdpbiA9IHdpbmRvdztcblxuICBkb2MgPSB3aW4uZG9jdW1lbnQ7XG5cbiAgZ3NuQ29udGV4dCA9IHdpbi5nc25Db250ZXh0O1xuXG4gIF90ayA9IHdpbi5fdGs7XG5cbiAgbXlHc24gPSB3aW4uR3NuIHx8IHt9O1xuXG4gIG9sZEdzbkFkdmVydGlzaW5nID0gbXlHc24uQWR2ZXJ0aXNpbmc7XG5cbiAgZ3NuU3cyID0gbmV3IGdzbmRmcGZhY3RvcnkoKTtcblxuICBnc25wb2RzID0gbmV3IGdzbmRmcGZhY3RvcnkoKTtcblxuICBjaXJjUGx1cyA9IG5ldyBnc25kZnBmYWN0b3J5KCk7XG5cbiAgbGFzdFJlZnJlc2hUaW1lID0gMDtcblxuICBpZiAob2xkR3NuQWR2ZXJ0aXNpbmcgIT0gbnVsbCkge1xuICAgIGlmIChvbGRHc25BZHZlcnRpc2luZy5wbHVnaW5Mb2FkZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBQbHVnaW4gPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gUGx1Z2luKCkge31cblxuICAgIFBsdWdpbi5wcm90b3R5cGUucGx1Z2luTG9hZGVkID0gdHJ1ZTtcblxuICAgIFBsdWdpbi5wcm90b3R5cGUuZGVmUCA9IHtcbiAgICAgIHBhZ2U6IHZvaWQgMCxcbiAgICAgIGV2dG5hbWU6IHZvaWQgMCxcbiAgICAgIGRlcHQ6IHZvaWQgMCxcbiAgICAgIGRldmljZWlkOiB2b2lkIDAsXG4gICAgICBzdG9yZWlkOiB2b2lkIDAsXG4gICAgICBjb25zdW1lcmlkOiB2b2lkIDAsXG4gICAgICBpc2Fub246IHRydWUsXG4gICAgICBsb3lhbHR5aWQ6IHZvaWQgMCxcbiAgICAgIGFpc2xlOiB2b2lkIDAsXG4gICAgICBjYXRlZ29yeTogdm9pZCAwLFxuICAgICAgc2hlbGY6IHZvaWQgMCxcbiAgICAgIGJyYW5kOiB2b2lkIDAsXG4gICAgICBwY29kZTogdm9pZCAwLFxuICAgICAgcGRlc2M6IHZvaWQgMCxcbiAgICAgIGxhdGxuZzogdm9pZCAwLFxuICAgICAgZXZ0Y2F0ZWdvcnk6IHZvaWQgMCxcbiAgICAgIGV2dHByb3BlcnR5OiB2b2lkIDAsXG4gICAgICBldnRhY3Rpb246IHZvaWQgMCxcbiAgICAgIGV2dHZhbHVlOiB2b2lkIDBcbiAgICB9O1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS50cmFuc2xhdG9yID0ge1xuICAgICAgcGFnZTogJ2R0JyxcbiAgICAgIGV2dG5hbWU6ICdlbicsXG4gICAgICBkZXB0OiAnZHB0JyxcbiAgICAgIGRldmljZWlkOiAnZHZjZWlkJyxcbiAgICAgIHN0b3JlaWQ6ICdzdGlkJyxcbiAgICAgIGNvbnN1bWVyaWQ6ICd1aWQnLFxuICAgICAgaXNhbm9uOiAnYW5vbicsXG4gICAgICBsb3lhbHR5aWQ6ICdsb3lpZCcsXG4gICAgICBhaXNsZTogJ2Fpc2xlJyxcbiAgICAgIGNhdGVnb3J5OiAnY2F0JyxcbiAgICAgIHNoZWxmOiAnc2hmJyxcbiAgICAgIGJyYW5kOiAnYm4nLFxuICAgICAgcGNvZGU6ICdpYycsXG4gICAgICBwZGVzYzogJ2luJyxcbiAgICAgIGxhdGxuZzogJ2xsbicsXG4gICAgICBldnRjYXRlZ29yeTogJ2VjJyxcbiAgICAgIGV2dHByb3BlcnR5OiAnZXAnLFxuICAgICAgZXZ0bGFiZWw6ICdlbCcsXG4gICAgICBldnRhY3Rpb246ICdlYScsXG4gICAgICBldnR2YWx1ZTogJ2V2J1xuICAgIH07XG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLmlzRGVidWcgPSBmYWxzZTtcblxuICAgIFBsdWdpbi5wcm90b3R5cGUuZ3NuaWQgPSAwO1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5zZWxlY3RvciA9ICdib2R5JztcblxuICAgIFBsdWdpbi5wcm90b3R5cGUuYXBpVXJsID0gJ2h0dHBzOi8vY2xpZW50YXBpLmdzbmdyb2NlcnMuY29tL2FwaS92MSc7XG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLmdzbk5ldHdvcmtJZCA9IHZvaWQgMDtcblxuICAgIFBsdWdpbi5wcm90b3R5cGUuZ3NuTmV0d29ya1N0b3JlID0gdm9pZCAwO1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5vbkFsbEV2ZW50cyA9IHZvaWQgMDtcblxuICAgIFBsdWdpbi5wcm90b3R5cGUub2xkR3NuQWR2ZXJ0aXNpbmcgPSBvbGRHc25BZHZlcnRpc2luZztcblxuICAgIFBsdWdpbi5wcm90b3R5cGUubWluU2Vjb25kQmV0d2VlblJlZnJlc2ggPSA1O1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5lbmFibGVDaXJjUGx1cyA9IGZhbHNlO1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5kaXNhYmxlU3cgPSAnJztcblxuICAgIFBsdWdpbi5wcm90b3R5cGUuc291cmNlID0gJyc7XG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLnRhcmdldHRpbmcgPSB7fTtcblxuICAgIFBsdWdpbi5wcm90b3R5cGUuZGVwdHMgPSAnJztcblxuICAgIFBsdWdpbi5wcm90b3R5cGUuY2lyY1BsdXNCb2R5ID0gdm9pZCAwO1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5yZWZyZXNoRXhpc3RpbmcgPSB7XG4gICAgICBjaXJjUGx1czogZmFsc2UsXG4gICAgICBwb2RzOiBmYWxzZVxuICAgIH07XG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLmNpcmNQbHVzRGVwdCA9IHZvaWQgMDtcblxuICAgIFBsdWdpbi5wcm90b3R5cGUudGltZXIgPSB2b2lkIDA7XG5cblxuICAgIC8qKlxuICAgICAqIGdldCBuZXR3b3JrIGlkXG4gICAgI1xuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cblxuICAgIFBsdWdpbi5wcm90b3R5cGUuZ2V0TmV0d29ya0lkID0gZnVuY3Rpb24oaW5jbHVkZVN0b3JlKSB7XG4gICAgICB2YXIgcmVzdWx0LCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICByZXN1bHQgPSBzZWxmLmdzbk5ldHdvcmtJZCArICgoc2VsZi5zb3VyY2UgfHwgXCJcIikubGVuZ3RoID4gMCA/IFwiLlwiICsgc2VsZi5zb3VyY2UgOiBcIlwiKTtcbiAgICAgIGlmIChpbmNsdWRlU3RvcmUpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoL1xcLyQvZ2ksICcnKSArIChzZWxmLmdzbk5ldHdvcmtTdG9yZSB8fCAnJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIGVtaXQgYSBnc25ldmVudFxuICAgICNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZW4gLSBldmVudCBuYW1lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVkIC0gZXZlbnQgZGF0YVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cblxuICAgIFBsdWdpbi5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGVuLCBlZCkge1xuICAgICAgaWYgKGVuLmluZGV4T2YoJ2dzbmV2ZW50JykgPCAwKSB7XG4gICAgICAgIGVuID0gJ2dzbmV2ZW50OicgKyBlbjtcbiAgICAgIH1cbiAgICAgIHdpbi5zZXRUaW1lb3V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgX3RrLmVtaXRUb3AoZW4sIHtcbiAgICAgICAgICB0eXBlOiBlbixcbiAgICAgICAgICBkZXRhaWw6IGVkXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMub25BbGxFdmVudHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLm9uQWxsRXZlbnRzKHtcbiAgICAgICAgICAgIHR5cGU6IGVuLFxuICAgICAgICAgICAgZGV0YWlsOiBlZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KSwgMTAwKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIGxpc3RlbiB0byBhIGdzbmV2ZW50XG4gICAgI1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbiAtIGV2ZW50IG5hbWVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiAtIGNhbGxiYWNrXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGVuLCBjYikge1xuICAgICAgaWYgKGVuLmluZGV4T2YoJ2dzbmV2ZW50JykgPCAwKSB7XG4gICAgICAgIGVuID0gJ2dzbmV2ZW50OicgKyBlbjtcbiAgICAgIH1cbiAgICAgIHRyYWtsZXNzLm9uKGVuLCBjYik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBkZXRhY2ggZnJvbSBldmVudFxuICAgICNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZW4gLSBldmVudCBuYW1lXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgLSBjYlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cblxuICAgIFBsdWdpbi5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24oZW4sIGNiKSB7XG4gICAgICBpZiAoZW4uaW5kZXhPZignZ3NuZXZlbnQnKSA8IDApIHtcbiAgICAgICAgZW4gPSAnZ3NuZXZlbnQ6JyArIGVuO1xuICAgICAgfVxuICAgICAgdHJha2xlc3Mub2ZmKGVuLCBjYik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBsb2dnaW5nbiBkYXRhXG4gICAgI1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIC0gbG9nIG1lc3NhZ2VcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIHZhciBzZWxmO1xuICAgICAgc2VsZiA9IG15R3NuLkFkdmVydGlzaW5nO1xuICAgICAgaWYgKHNlbGYuaXNEZWJ1ZyB8fCBkZWJ1Zy5lbmFibGVkKCdnc25kZnAnKSkge1xuICAgICAgICBzZWxmLmlzRGVidWcgPSB0cnVlO1xuICAgICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcbiAgICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsb2cobWVzc2FnZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiB0cmlnZ2VyIGFjdGlvbiB0cmFja2luZ1xuICAgICNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uUGFyYW1cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLnRyYWNrQWN0aW9uID0gZnVuY3Rpb24oYWN0aW9uUGFyYW0pIHtcbiAgICAgIHZhciBrLCBrMiwgc2VsZiwgdHNQLCB2O1xuICAgICAgc2VsZiA9IG15R3NuLkFkdmVydGlzaW5nO1xuICAgICAgdHNQID0ge307XG4gICAgICBpZiAodHlwZW9mIGFjdGlvblBhcmFtID09PSAnb2JqZWN0Jykge1xuICAgICAgICBmb3IgKGsgaW4gYWN0aW9uUGFyYW0pIHtcbiAgICAgICAgICB2ID0gYWN0aW9uUGFyYW1ba107XG4gICAgICAgICAgaWYgKCEodiAhPSBudWxsKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGsyID0gc2VsZi50cmFuc2xhdG9yW2tdO1xuICAgICAgICAgIGlmIChrMikge1xuICAgICAgICAgICAgdHNQW2syXSA9IHY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfdGsudHJhY2soJ2dzbicsIHRzUCk7XG4gICAgICBzZWxmLmxvZyhhY3Rpb25QYXJhbSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiB1dGlsaXR5IG1ldGhvZCB0byBub3JtYWxpemUgY2F0ZWdvcnlcbiAgICAjXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleXdvcmRcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLmNsZWFuS2V5d29yZCA9IGZ1bmN0aW9uKGtleXdvcmQpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICByZXN1bHQgPSBrZXl3b3JkLnJlcGxhY2UoL1teYS16QS1aMC05XSsvZ2ksICdfJykucmVwbGFjZSgvXltfXSsvZ2ksICcnKTtcbiAgICAgIGlmIChyZXN1bHQudG9Mb3dlckNhc2UgIT0gbnVsbCkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogYWRkIGEgZGVwdFxuICAgICNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGVwdFxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cblxuICAgIFBsdWdpbi5wcm90b3R5cGUuYWRkRGVwdCA9IGZ1bmN0aW9uKGRlcHQpIHtcbiAgICAgIHZhciBnb29kRGVwdCwgc2VsZjtcbiAgICAgIHNlbGYgPSBteUdzbi5BZHZlcnRpc2luZztcbiAgICAgIGlmIChkZXB0ICE9IG51bGwpIHtcbiAgICAgICAgZ29vZERlcHQgPSBzZWxmLmNsZWFuS2V5d29yZChkZXB0KTtcbiAgICAgICAgZ29vZERlcHQgPSBcIixcIiArIGdvb2REZXB0O1xuICAgICAgICBpZiAoc2VsZi5kZXB0cy5pbmRleE9mKGdvb2REZXB0KSA8IDApIHtcbiAgICAgICAgICBzZWxmLmRlcHRzID0gXCJcIiArIGdvb2REZXB0ICsgc2VsZi5kZXB0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogZmlyZSBhIHRyYWNraW5nIHVybFxuICAgICNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5hamF4RmlyZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICAgICAgdmFyIGltZztcbiAgICAgIGlmICh0eXBlb2YgdXJsID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAodXJsLmxlbmd0aCA8IDEwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKCclJUNBQ0hFQlVTVEVSJSUnLCAobmV3IERhdGUpLmdldFRpbWUoKSk7XG4gICAgICAgIGltZyA9IG5ldyBJbWFnZSgxLCAxKTtcbiAgICAgICAgaW1nLnNyYyA9IHVybDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgd2hlbiBhIHByb2R1Y3QgaXMgY2xpY2tlZC4gIEFLQTogY2xpY2tUaHJ1XG4gICAgI1xuICAgICAqL1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5jbGlja1Byb2R1Y3QgPSBmdW5jdGlvbihjbGljaywgY2F0ZWdvcnlJZCwgYnJhbmROYW1lLCBwcm9kdWN0RGVzY3JpcHRpb24sIHByb2R1Y3RDb2RlLCBxdWFudGl0eSwgZGlzcGxheVNpemUsIHJlZ3VsYXJQcmljZSwgY3VycmVudFByaWNlLCBzYXZpbmdzQW1vdW50LCBzYXZpbmdzU3RhdGVtZW50LCBhZENvZGUsIGNyZWF0aXZlSWQpIHtcbiAgICAgIHRoaXMuYWpheEZpcmVVcmwoY2xpY2spO1xuICAgICAgdGhpcy5lbWl0KCdjbGlja1Byb2R1Y3QnLCB7XG4gICAgICAgIG15UGx1Z2luOiB0aGlzLFxuICAgICAgICBDYXRlZ29yeUlkOiBjYXRlZ29yeUlkLFxuICAgICAgICBCcmFuZE5hbWU6IGJyYW5kTmFtZSxcbiAgICAgICAgRGVzY3JpcHRpb246IHByb2R1Y3REZXNjcmlwdGlvbixcbiAgICAgICAgUHJvZHVjdENvZGU6IHByb2R1Y3RDb2RlLFxuICAgICAgICBEaXNwbGF5U2l6ZTogZGlzcGxheVNpemUsXG4gICAgICAgIFJlZ3VsYXJQcmljZTogcmVndWxhclByaWNlLFxuICAgICAgICBDdXJyZW50UHJpY2U6IGN1cnJlbnRQcmljZSxcbiAgICAgICAgU2F2aW5nc0Ftb3VudDogc2F2aW5nc0Ftb3VudCxcbiAgICAgICAgU2F2aW5nc1N0YXRlbWVudDogc2F2aW5nc1N0YXRlbWVudCxcbiAgICAgICAgQWRDb2RlOiBhZENvZGUsXG4gICAgICAgIENyZWF0aXZlSWQ6IGNyZWF0aXZlSWQsXG4gICAgICAgIFF1YW50aXR5OiBxdWFudGl0eSB8fCAxXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgd2hlbiBhIGJyaWNrIG9mZmVyIGlzIGNsaWNrZWQuICBBS0E6IGJyaWNrUmVkaXJlY3RcbiAgICAjXG4gICAgICovXG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLmNsaWNrQnJpY2tPZmZlciA9IGZ1bmN0aW9uKGNsaWNrLCBvZmZlckNvZGUsIGNoZWNrQ29kZSkge1xuICAgICAgdGhpcy5hamF4RmlyZVVybChjbGljayk7XG4gICAgICB0aGlzLmVtaXQoJ2NsaWNrQnJpY2tPZmZlcicsIHtcbiAgICAgICAgbXlQbHVnaW46IHRoaXMsXG4gICAgICAgIE9mZmVyQ29kZTogb2ZmZXJDb2RlIHx8IDBcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlciB3aGVuIGEgYnJhbmQgb2ZmZXIgb3Igc2hvcHBlciB3ZWxjb21lIGlzIGNsaWNrZWQuXG4gICAgI1xuICAgICAqL1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5jbGlja0JyYW5kID0gZnVuY3Rpb24oY2xpY2ssIGJyYW5kTmFtZSkge1xuICAgICAgdGhpcy5hamF4RmlyZVVybChjbGljayk7XG4gICAgICB0aGlzLnNldEJyYW5kKGJyYW5kTmFtZSk7XG4gICAgICB0aGlzLmVtaXQoJ2NsaWNrQnJhbmQnLCB7XG4gICAgICAgIG15UGx1Z2luOiB0aGlzLFxuICAgICAgICBCcmFuZE5hbWU6IGJyYW5kTmFtZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyIHdoZW4gYSBwcm9tb3Rpb24gaXMgY2xpY2tlZC4gIEFLQTogcHJvbW90aW9uUmVkaXJlY3RcbiAgICAjXG4gICAgICovXG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLmNsaWNrUHJvbW90aW9uID0gZnVuY3Rpb24oY2xpY2ssIGFkQ29kZSkge1xuICAgICAgdGhpcy5hamF4RmlyZVVybChjbGljayk7XG4gICAgICB0aGlzLmVtaXQoJ2NsaWNrUHJvbW90aW9uJywge1xuICAgICAgICBteVBsdWdpbjogdGhpcyxcbiAgICAgICAgQWRDb2RlOiBhZENvZGVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlciB3aGVuIGEgcmVjaXBlIGlzIGNsaWNrZWQuICBBS0E6IHJlY2lwZVJlZGlyZWN0XG4gICAgI1xuICAgICAqL1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5jbGlja1JlY2lwZSA9IGZ1bmN0aW9uKGNsaWNrLCByZWNpcGVJZCkge1xuICAgICAgdGhpcy5hamF4RmlyZVVybChjbGljayk7XG4gICAgICB0aGlzLmVtaXQoJ2NsaWNrUmVjaXBlJywge1xuICAgICAgICBSZWNpcGVJZDogcmVjaXBlSWRcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlciB3aGVuIGEgZ2VuZXJpYyBsaW5rIGlzIGNsaWNrZWQuICBBS0E6IHZlcmlmeUNsaWNrVGhydVxuICAgICNcbiAgICAgKi9cblxuICAgIFBsdWdpbi5wcm90b3R5cGUuY2xpY2tMaW5rID0gZnVuY3Rpb24oY2xpY2ssIHVybCwgdGFyZ2V0KSB7XG4gICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDAgfHwgdGFyZ2V0ID09PSAnJykge1xuICAgICAgICB0YXJnZXQgPSAnX3RvcCc7XG4gICAgICB9XG4gICAgICB0aGlzLmFqYXhGaXJlVXJsKGNsaWNrKTtcbiAgICAgIHRoaXMuZW1pdCgnY2xpY2tMaW5rJywge1xuICAgICAgICBteVBsdWdpbjogdGhpcyxcbiAgICAgICAgVXJsOiB1cmwsXG4gICAgICAgIFRhcmdldDogdGFyZ2V0XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIHNldCB0aGUgYnJhbmQgZm9yIHRoZSBzZXNzaW9uXG4gICAgI1xuICAgICAqL1xuXG4gICAgUGx1Z2luLnByb3RvdHlwZS5zZXRCcmFuZCA9IGZ1bmN0aW9uKGJyYW5kTmFtZSkge1xuICAgICAgdHJha2xlc3MudXRpbC5zZXNzaW9uKCdnc25kZnA6YnJhbmQnLCBicmFuZE5hbWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBicmFuZCBjdXJyZW50bHkgaW4gc2Vzc2lvblxuICAgICNcbiAgICAgKi9cblxuICAgIFBsdWdpbi5wcm90b3R5cGUuZ2V0QnJhbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cmFrbGVzcy51dGlsLnNlc3Npb24oJ2dzbmRmcDpicmFuZCcpO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIGhhbmRsZSBhIGRvbSBldmVudFxuICAgICNcbiAgICAgKi9cblxuICAgIFBsdWdpbi5wcm90b3R5cGUuYWN0aW9uSGFuZGxlciA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgdmFyIGFsbERhdGEsIGVsZW0sIGksIGssIGxlbiwgcGF5TG9hZCwgcmVhbGssIHNlbGYsIHY7XG4gICAgICBzZWxmID0gbXlHc24uQWR2ZXJ0aXNpbmc7XG4gICAgICBlbGVtID0gZXZ0LnRhcmdldCA/IGV2dC50YXJnZXQgOiBldnQuc3JjRWxlbWVudDtcbiAgICAgIHBheUxvYWQgPSB7fTtcbiAgICAgIGlmIChlbGVtICE9IG51bGwpIHtcbiAgICAgICAgYWxsRGF0YSA9IHRyYWtsZXNzLnV0aWwuYWxsRGF0YShlbGVtKTtcbiAgICAgICAgZm9yICh2ID0gaSA9IDAsIGxlbiA9IGFsbERhdGEubGVuZ3RoOyBpIDwgbGVuOyB2ID0gKytpKSB7XG4gICAgICAgICAgayA9IGFsbERhdGFbdl07XG4gICAgICAgICAgaWYgKCEoL15nc24vZ2kudGVzdChrKSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZWFsayA9IC9eZ3NuL2kucmVwbGFjZShrLCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICBwYXlMb2FkW3JlYWxrXSA9IHY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNlbGYucmVmcmVzaChwYXlMb2FkKTtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIGludGVybmFsIG1ldGhvZCBmb3IgcmVmcmVzaGluZyBhZHBvZHNcbiAgICAjXG4gICAgICovXG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLnJlZnJlc2hBZFBvZHNJbnRlcm5hbCA9IGZ1bmN0aW9uKGFjdGlvblBhcmFtLCBmb3JjZVJlZnJlc2gpIHtcbiAgICAgIHZhciBjYW5SZWZyZXNoLCBrLCBwYXlMb2FkLCByZWYsIHNlbGYsIHRhcmdldHRpbmcsIHY7XG4gICAgICBzZWxmID0gbXlHc24uQWR2ZXJ0aXNpbmc7XG4gICAgICBwYXlMb2FkID0gYWN0aW9uUGFyYW0gfHwge307XG4gICAgICByZWYgPSBzZWxmLmRlZlA7XG4gICAgICBmb3IgKGsgaW4gcmVmKSB7XG4gICAgICAgIHYgPSByZWZba107XG4gICAgICAgIGlmICh2ICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAoIXBheUxvYWRba10pIHtcbiAgICAgICAgICAgIHBheUxvYWRba10gPSB2O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGdzblN3Mi5pc1Zpc2libGUpIHtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG4gICAgICBwYXlMb2FkLnNpdGVpZCA9IHNlbGYuZ3NuaWQ7XG4gICAgICBzZWxmLnRyYWNrQWN0aW9uKHBheUxvYWQpO1xuICAgICAgY2FuUmVmcmVzaCA9ICgobmV3IERhdGUpLmdldFRpbWUoKSAvIDEwMDAgLSBsYXN0UmVmcmVzaFRpbWUpID49IHNlbGYubWluU2Vjb25kQmV0d2VlblJlZnJlc2g7XG4gICAgICBpZiAoZm9yY2VSZWZyZXNoIHx8IGNhblJlZnJlc2gpIHtcbiAgICAgICAgbGFzdFJlZnJlc2hUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDA7XG4gICAgICAgIGlmICgocGF5TG9hZC5kZXB0ICE9IG51bGwpKSB7XG4gICAgICAgICAgc2VsZi5hZGREZXB0KHBheUxvYWQuZGVwdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcmNlUmVmcmVzaCkge1xuICAgICAgICAgIHNlbGYucmVmcmVzaEV4aXN0aW5nLnBvZHMgPSBmYWxzZTtcbiAgICAgICAgICBzZWxmLnJlZnJlc2hFeGlzdGluZy5jaXJjUGx1cyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldHRpbmcgPSB7XG4gICAgICAgICAgZGVwdDogc2VsZi5kZXB0cy5zcGxpdCgnLCcpLnNsaWNlKDEsIDUpLFxuICAgICAgICAgIGJyYW5kOiBzZWxmLmdldEJyYW5kKClcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHBheUxvYWQucGFnZSkge1xuICAgICAgICAgIHRhcmdldHRpbmcua3cgPSBwYXlMb2FkLnBhZ2UucmVwbGFjZSgvW15hLXpdL2dpLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhcmdldHRpbmcuZGVwdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc2VsZi5kZXB0cyA9IFwiLFwiICsgdGFyZ2V0dGluZy5kZXB0LmpvaW4oJywnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXR0aW5nLmRlcHQgPSBbJ3Byb2R1Y2UnXTtcbiAgICAgICAgfVxuICAgICAgICBnc25wb2RzLnJlZnJlc2goe1xuICAgICAgICAgIHNldFRhcmdldGluZzogdGFyZ2V0dGluZyxcbiAgICAgICAgICBzZWw6ICcuZ3NudW5pdCcsXG4gICAgICAgICAgcmVmcmVzaEV4aXN0aW5nOiBzZWxmLnJlZnJlc2hFeGlzdGluZy5wb2RzXG4gICAgICAgIH0pO1xuICAgICAgICBzZWxmLnJlZnJlc2hFeGlzdGluZy5wb2RzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHNlbGYuZW5hYmxlQ2lyY1BsdXMpIHtcbiAgICAgICAgICB0YXJnZXR0aW5nLmRlcHQgPSBbdGFyZ2V0dGluZy5kZXB0WzBdXTtcbiAgICAgICAgICBjaXJjUGx1cy5yZWZyZXNoKHtcbiAgICAgICAgICAgIHNldFRhcmdldGluZzogdGFyZ2V0dGluZyxcbiAgICAgICAgICAgIGJvZHlUZW1wbGF0ZTogc2VsZi5ib2R5VGVtcGxhdGUsXG4gICAgICAgICAgICBzZWw6ICcuY2lyY3BsdXMnLFxuICAgICAgICAgICAgcmVmcmVzaEV4aXN0aW5nOiBzZWxmLnJlZnJlc2hFeGlzdGluZy5jaXJjUGx1c1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNlbGYucmVmcmVzaEV4aXN0aW5nLmNpcmNQbHVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogYWRwb2RzIHJlZnJlc2hcbiAgICAjXG4gICAgICovXG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbihhY3Rpb25QYXJhbSwgZm9yY2VSZWZyZXNoKSB7XG4gICAgICB2YXIgc2VsZjtcbiAgICAgIHNlbGYgPSBteUdzbi5BZHZlcnRpc2luZztcbiAgICAgIGlmICghc2VsZi5oYXNHc25Vbml0KCkpIHtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG4gICAgICBpZiAoc2VsZi5nc25pZCkge1xuICAgICAgICBpZiAoZ3NuU3cyLmlzVmlzaWJsZSkge1xuICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9XG4gICAgICAgIGdzblN3Mi5yZWZyZXNoKHtcbiAgICAgICAgICBkaXNwbGF5V2hlbkV4aXN0czogJy5nc25hZHVuaXQsLmdzbnVuaXQnLFxuICAgICAgICAgIHNlbDogJy5nc25zdycsXG4gICAgICAgICAgb25EYXRhOiBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgIGlmICgoc2VsZi5zb3VyY2UgfHwgJycpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGV2dC5jYW5jZWwgPSBzZWxmLmRpc2FibGVTdy5pbmRleE9mKHNlbGYuc291cmNlKSA+IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdG9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgZG9tKHNlbGYuc2VsZWN0b3IpWzBdLm9uY2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZSA9IGUgfHwgd2luLmV2ZW50O1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50IHx8IGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBpZiAod2luLmdtb2RhbC5oYXNDbHMoZS50YXJnZXQsICdnc25hY3Rpb24nKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuYWN0aW9uSGFuZGxlcihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNlbGYuc2VsZWN0b3IgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYucmVmcmVzaEFkUG9kc0ludGVybmFsKGFjdGlvblBhcmFtLCBmb3JjZVJlZnJlc2gpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBkZXRlcm1pbmUgaWYgdGhlcmUgYXJlIGFkcG9kcyBvbiB0aGUgcGFnZVxuICAgICNcbiAgICAgKi9cblxuICAgIFBsdWdpbi5wcm90b3R5cGUuaGFzR3NuVW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGRvbSgnLmdzbmFkdW5pdCwuZ3NudW5pdCwuY2lyY3BsdXMnKS5sZW5ndGggPiAwO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIHNldCBnbG9iYWwgZGVmYXVsdHNcbiAgICAjXG4gICAgICovXG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLnNldERlZmF1bHQgPSBmdW5jdGlvbihkZWZQYXJhbSkge1xuICAgICAgdmFyIGssIHNlbGYsIHY7XG4gICAgICBzZWxmID0gbXlHc24uQWR2ZXJ0aXNpbmc7XG4gICAgICBpZiAodHlwZW9mIGRlZlBhcmFtID09PSAnb2JqZWN0Jykge1xuICAgICAgICBmb3IgKGsgaW4gZGVmUGFyYW0pIHtcbiAgICAgICAgICB2ID0gZGVmUGFyYW1ba107XG4gICAgICAgICAgaWYgKHYgIT0gbnVsbCkge1xuICAgICAgICAgICAgc2VsZi5kZWZQW2tdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIG1ldGhvZCBmb3Igc3VwcG9ydCByZWZyZXNoaW5nIHdpdGggdGltZXJcbiAgICAjXG4gICAgICovXG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLnJlZnJlc2hXaXRoVGltZXIgPSBmdW5jdGlvbihhY3Rpb25QYXJhbSkge1xuICAgICAgdmFyIHNlbGYsIHRpbWVyO1xuICAgICAgc2VsZiA9IG15R3NuLkFkdmVydGlzaW5nO1xuICAgICAgaWYgKGFjdGlvblBhcmFtID09IG51bGwpIHtcbiAgICAgICAgYWN0aW9uUGFyYW0gPSB7XG4gICAgICAgICAgZXZ0bmFtZTogJ3JlZnJlc2gtdGltZXInXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzZWxmLnJlZnJlc2goYWN0aW9uUGFyYW0sIHRydWUpO1xuICAgICAgdGltZXIgPSAoc2VsZi50aW1lciB8fCAwKSAqIDEwMDA7XG4gICAgICBpZiAodGltZXIgPiAwKSB7XG4gICAgICAgIHNldFRpbWVvdXQoc2VsZi5yZWZyZXNoV2l0aFRpbWVyLCB0aW1lcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiB0aGUgb25sb2FkIG1ldGhvZCwgZG9jdW1lbnQgcmVhZHkgZnJpZW5kbHlcbiAgICAjXG4gICAgICovXG5cbiAgICBQbHVnaW4ucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbihnc25pZCwgaXNEZWJ1Zykge1xuICAgICAgdmFyIHNlbGY7XG4gICAgICBzZWxmID0gbXlHc24uQWR2ZXJ0aXNpbmc7XG4gICAgICBpZiAoZ3NuaWQpIHtcbiAgICAgICAgc2VsZi5nc25pZCA9IGdzbmlkO1xuICAgICAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICAgIGRlYnVnLmVuYWJsZSgnZ3NuZGZwJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLnJlZnJlc2hXaXRoVGltZXIoe1xuICAgICAgICBldnRuYW1lOiAnbG9hZGluZydcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gUGx1Z2luO1xuXG4gIH0pKCk7XG5cbiAgbXlQbHVnaW4gPSBuZXcgUGx1Z2luO1xuXG4gIG15R3NuLkFkdmVydGlzaW5nID0gbXlQbHVnaW47XG5cbiAgbXlHc24uQWR2ZXJ0aXNpbmcuYnJpY2tSZWRpcmVjdCA9IG15UGx1Z2luLmNsaWNrQnJpY2tPZmZlcjtcblxuICBteUdzbi5BZHZlcnRpc2luZy5jbGlja0JyYW5kID0gbXlQbHVnaW4uY2xpY2tCcmFuZDtcblxuICBteUdzbi5BZHZlcnRpc2luZy5jbGlja1RocnUgPSBteVBsdWdpbi5jbGlja1Byb2R1Y3Q7XG5cbiAgbXlHc24uQWR2ZXJ0aXNpbmcucmVmcmVzaEFkUG9kcyA9IG15UGx1Z2luLnJlZnJlc2g7XG5cbiAgbXlHc24uQWR2ZXJ0aXNpbmcubG9nQWRJbXByZXNzaW9uID0gZnVuY3Rpb24oKSB7fTtcblxuICBteUdzbi5BZHZlcnRpc2luZy5sb2dBZFJlcXVlc3QgPSBmdW5jdGlvbigpIHt9O1xuXG4gIG15R3NuLkFkdmVydGlzaW5nLnByb21vdGlvblJlZGlyZWN0ID0gbXlQbHVnaW4uY2xpY2tQcm9tb3Rpb247XG5cbiAgbXlHc24uQWR2ZXJ0aXNpbmcudmVyaWZ5Q2xpY2tUaHJ1ID0gbXlQbHVnaW4uY2xpY2tMaW5rO1xuXG4gIG15R3NuLkFkdmVydGlzaW5nLnJlY2lwZVJlZGlyZWN0ID0gbXlQbHVnaW4uY2xpY2tSZWNpcGU7XG5cbiAgd2luLkdzbiA9IG15R3NuO1xuXG4gIHdpbi5nc25kZnAgPSBteUdzbi5BZHZlcnRpc2luZztcblxuICBpZiAoKGdzbkNvbnRleHQgIT0gbnVsbCkpIHtcbiAgICBidWlsZHFzID0gZnVuY3Rpb24oaywgdikge1xuICAgICAgaWYgKHYgIT0gbnVsbCkge1xuICAgICAgICB2ID0gbmV3IFN0cmluZyh2KTtcbiAgICAgICAgaWYgKGsgIT09ICdQcm9kdWN0RGVzY3JpcHRpb24nKSB7XG4gICAgICAgICAgdiA9IHYucmVwbGFjZSgvJi8sICdgJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGsgKyAnPScgKyB2LnRvU3RyaW5nKCk7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICB9XG4gICAgfTtcbiAgICBteUdzbi5BZHZlcnRpc2luZy5vbignY2xpY2tSZWNpcGUnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBpZiAoZGF0YS50eXBlICE9PSAnZ3NuZXZlbnQ6Y2xpY2tSZWNpcGUnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHdpbi5sb2NhdGlvbi5yZXBsYWNlKCcvUmVjaXBlcy9SZWNpcGVGdWxsLmFzcHg/cmVjaXBlaWQ9JyArIGRhdGEuZGV0YWlsLlJlY2lwZUlkKTtcbiAgICB9KTtcbiAgICBteUdzbi5BZHZlcnRpc2luZy5vbignY2xpY2tQcm9kdWN0JywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmFyIHByb2R1Y3QsIHFzO1xuICAgICAgaWYgKGRhdGEudHlwZSAhPT0gJ2dzbmV2ZW50OmNsaWNrUHJvZHVjdCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcHJvZHVjdCA9IGRhdGEuZGV0YWlsO1xuICAgICAgaWYgKHByb2R1Y3QpIHtcbiAgICAgICAgcXMgPSBuZXcgU3RyaW5nKCcnKTtcbiAgICAgICAgcXMgKz0gYnVpbGRxcygnRGVwYXJ0bWVudElEJywgcHJvZHVjdC5DYXRlZ29yeUlkKTtcbiAgICAgICAgcXMgKz0gJ34nICsgYnVpbGRxcygnQnJhbmROYW1lJywgcHJvZHVjdC5CcmFuZE5hbWUpO1xuICAgICAgICBxcyArPSAnficgKyBidWlsZHFzKCdQcm9kdWN0RGVzY3JpcHRpb24nLCBwcm9kdWN0LkRlc2NyaXB0aW9uKTtcbiAgICAgICAgcXMgKz0gJ34nICsgYnVpbGRxcygnUHJvZHVjdENvZGUnLCBwcm9kdWN0LlByb2R1Y3RDb2RlKTtcbiAgICAgICAgcXMgKz0gJ34nICsgYnVpbGRxcygnRGlzcGxheVNpemUnLCBwcm9kdWN0LkRpc3BsYXlTaXplKTtcbiAgICAgICAgcXMgKz0gJ34nICsgYnVpbGRxcygnUmVndWxhclByaWNlJywgcHJvZHVjdC5SZWd1bGFyUHJpY2UpO1xuICAgICAgICBxcyArPSAnficgKyBidWlsZHFzKCdDdXJyZW50UHJpY2UnLCBwcm9kdWN0LkN1cnJlbnRQcmljZSk7XG4gICAgICAgIHFzICs9ICd+JyArIGJ1aWxkcXMoJ1NhdmluZ3NBbW91bnQnLCBwcm9kdWN0LlNhdmluZ3NBbW91bnQpO1xuICAgICAgICBxcyArPSAnficgKyBidWlsZHFzKCdTYXZpbmdzU3RhdGVtZW50JywgcHJvZHVjdC5TYXZpbmdzU3RhdGVtZW50KTtcbiAgICAgICAgcXMgKz0gJ34nICsgYnVpbGRxcygnUXVhbnRpdHknLCBwcm9kdWN0LlF1YW50aXR5KTtcbiAgICAgICAgcXMgKz0gJ34nICsgYnVpbGRxcygnQWRDb2RlJywgcHJvZHVjdC5BZENvZGUpO1xuICAgICAgICBxcyArPSAnficgKyBidWlsZHFzKCdDcmVhdGl2ZUlEJywgcHJvZHVjdC5DcmVhdGl2ZUlkKTtcbiAgICAgICAgaWYgKHR5cGVvZiBBZGRBZFRvU2hvcHBpbmdMaXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgQWRkQWRUb1Nob3BwaW5nTGlzdChxcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBteUdzbi5BZHZlcnRpc2luZy5vbignY2xpY2tMaW5rJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmFyIGxpbmtEYXRhO1xuICAgICAgaWYgKGRhdGEudHlwZSAhPT0gJ2dzbmV2ZW50OmNsaWNrTGluaycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGlua0RhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgIGlmIChsaW5rRGF0YSkge1xuICAgICAgICBpZiAobGlua0RhdGEuVGFyZ2V0ID09PSB2b2lkIDAgfHwgbGlua0RhdGEuVGFyZ2V0ID09PSAnJykge1xuICAgICAgICAgIGxpbmtEYXRhLlRhcmdldCA9ICdfdG9wJztcbiAgICAgICAgfVxuICAgICAgICBpZiAobGlua0RhdGEuVGFyZ2V0ID09PSAnX2JsYW5rJykge1xuICAgICAgICAgIHdpbi5vcGVuKGxpbmtEYXRhLlVybCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2luLmxvY2F0aW9uLnJlcGxhY2UobGlua0RhdGEuVXJsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIG15R3NuLkFkdmVydGlzaW5nLm9uKCdjbGlja1Byb21vdGlvbicsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBsaW5rRGF0YTtcbiAgICAgIGlmIChkYXRhLnR5cGUgIT09ICdnc25ldmVudDpjbGlja1Byb21vdGlvbicpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGlua0RhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgIGlmIChsaW5rRGF0YSkge1xuICAgICAgICB3aW4ubG9jYXRpb24ucmVwbGFjZSgnL0Fkcy9Qcm9tb3Rpb24uYXNweD9hZGNvZGU9JyArIGxpbmtEYXRhLkFkQ29kZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbXlHc24uQWR2ZXJ0aXNpbmcub24oJ2NsaWNrQnJpY2tPZmZlcicsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBsaW5rRGF0YSwgdXJsO1xuICAgICAgaWYgKGRhdGEudHlwZSAhPT0gJ2dzbmV2ZW50OmNsaWNrQnJpY2tPZmZlcicpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGlua0RhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgIGlmIChsaW5rRGF0YSkge1xuICAgICAgICB1cmwgPSBteUdzbi5BZHZlcnRpc2luZy5hcGlVcmwgKyAnL3Byb2ZpbGUvQnJpY2tPZmZlci8nICsgZ3NuQ29udGV4dC5Db25zdW1lcklEICsgJy8nICsgbGlua0RhdGEuT2ZmZXJDb2RlO1xuICAgICAgICB3aW4ub3Blbih1cmwsICcnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFQbHVnaW4gPSBteUdzbi5BZHZlcnRpc2luZztcblxuICBpZiAoIWFQbHVnaW4pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBhdHRycyA9IHtcbiAgICBkZWJ1ZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYVBsdWdpbi5pc0RlYnVnID0gdmFsdWUgIT09IFwiZmFsc2VcIjtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZGVidWcuZW5hYmxlKCdnc25kZnAnKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFwaTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFQbHVnaW4uYXBpVXJsID0gdmFsdWU7XG4gICAgfSxcbiAgICBzb3VyY2U6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhUGx1Z2luLnNvdXJjZSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ3NuaWQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFQbHVnaW4uZ3NuaWQgPSB2YWx1ZTtcbiAgICAgIHJldHVybiB0cmFrbGVzcy5zZXRTaXRlSWQodmFsdWUpO1xuICAgIH0sXG4gICAgdGltZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhUGx1Z2luLnRpbWVyID0gdmFsdWU7XG4gICAgfSxcbiAgICBzZWxlY3RvcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFQbHVnaW4uc2VsZWN0b3IgPSB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgcmVmID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBzY3JpcHQgPSByZWZbaV07XG4gICAgaWYgKC9nc25kZnAvaS50ZXN0KHNjcmlwdC5zcmMpKSB7XG4gICAgICByZWYxID0gWycnLCAnZGF0YS0nXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICBwcmVmaXggPSByZWYxW2pdO1xuICAgICAgICBmb3IgKGsgaW4gYXR0cnMpIHtcbiAgICAgICAgICBmbiA9IGF0dHJzW2tdO1xuICAgICAgICAgIGZuKHNjcmlwdC5nZXRBdHRyaWJ1dGUocHJlZml4ICsgaykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdHJha2xlc3Muc2V0UGl4ZWwoJy8vcGkuZ3NuZ3JvY2Vycy5jb20vcGkuZ2lmJyk7XG5cbiAgdHJha2xlc3Muc3RvcmUuaW5pdCh7XG4gICAgdXJsOiAnLy9jZG4uZ3NuZ3JvY2Vycy5jb20vc2NyaXB0L3hzdG9yZS5odG1sJyxcbiAgICBkbnRJZ25vcmU6IHRydWVcbiAgfSk7XG5cbiAgaWYgKGFQbHVnaW4uaGFzR3NuVW5pdCgpKSB7XG4gICAgYVBsdWdpbi5sb2FkKCk7XG4gIH0gZWxzZSB7XG4gICAgdHJha2xlc3MudXRpbC5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBhUGx1Z2luLmxvYWQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG1vZHVsZS5leHBvcnRzID0gbXlHc247XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJcbi8qKlxuICogVGhpcyBpcyB0aGUgd2ViIGJyb3dzZXIgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuXG4vKipcbiAqIFVzZSBjaHJvbWUuc3RvcmFnZS5sb2NhbCBpZiB3ZSBhcmUgaW4gYW4gYXBwXG4gKi9cblxudmFyIHN0b3JhZ2U7XG5cbmlmICh0eXBlb2YgY2hyb21lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY2hyb21lLnN0b3JhZ2UgIT09ICd1bmRlZmluZWQnKVxuICBzdG9yYWdlID0gY2hyb21lLnN0b3JhZ2UubG9jYWw7XG5lbHNlXG4gIHN0b3JhZ2UgPSBsb2NhbHN0b3JhZ2UoKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbXG4gICdsaWdodHNlYWdyZWVuJyxcbiAgJ2ZvcmVzdGdyZWVuJyxcbiAgJ2dvbGRlbnJvZCcsXG4gICdkb2RnZXJibHVlJyxcbiAgJ2RhcmtvcmNoaWQnLFxuICAnY3JpbXNvbidcbl07XG5cbi8qKlxuICogQ3VycmVudGx5IG9ubHkgV2ViS2l0LWJhc2VkIFdlYiBJbnNwZWN0b3JzLCBGaXJlZm94ID49IHYzMSxcbiAqIGFuZCB0aGUgRmlyZWJ1ZyBleHRlbnNpb24gKGFueSBGaXJlZm94IHZlcnNpb24pIGFyZSBrbm93blxuICogdG8gc3VwcG9ydCBcIiVjXCIgQ1NTIGN1c3RvbWl6YXRpb25zLlxuICpcbiAqIFRPRE86IGFkZCBhIGBsb2NhbFN0b3JhZ2VgIHZhcmlhYmxlIHRvIGV4cGxpY2l0bHkgZW5hYmxlL2Rpc2FibGUgY29sb3JzXG4gKi9cblxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuICAvLyBpcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuICByZXR1cm4gKCdXZWJraXRBcHBlYXJhbmNlJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUpIHx8XG4gICAgLy8gaXMgZmlyZWJ1Zz8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzk4MTIwLzM3Njc3M1xuICAgICh3aW5kb3cuY29uc29sZSAmJiAoY29uc29sZS5maXJlYnVnIHx8IChjb25zb2xlLmV4Y2VwdGlvbiAmJiBjb25zb2xlLnRhYmxlKSkpIHx8XG4gICAgLy8gaXMgZmlyZWZveCA+PSB2MzE/XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Ub29scy9XZWJfQ29uc29sZSNTdHlsaW5nX21lc3NhZ2VzXG4gICAgKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxKTtcbn1cblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh2KTtcbn07XG5cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKCkge1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGFyZ3NbMF0gPSAodXNlQ29sb3JzID8gJyVjJyA6ICcnKVxuICAgICsgdGhpcy5uYW1lc3BhY2VcbiAgICArICh1c2VDb2xvcnMgPyAnICVjJyA6ICcgJylcbiAgICArIGFyZ3NbMF1cbiAgICArICh1c2VDb2xvcnMgPyAnJWMgJyA6ICcgJylcbiAgICArICcrJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuICBpZiAoIXVzZUNvbG9ycykgcmV0dXJuIGFyZ3M7XG5cbiAgdmFyIGMgPSAnY29sb3I6ICcgKyB0aGlzLmNvbG9yO1xuICBhcmdzID0gW2FyZ3NbMF0sIGMsICdjb2xvcjogaW5oZXJpdCddLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCAxKSk7XG5cbiAgLy8gdGhlIGZpbmFsIFwiJWNcIiBpcyBzb21ld2hhdCB0cmlja3ksIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgb3RoZXJcbiAgLy8gYXJndW1lbnRzIHBhc3NlZCBlaXRoZXIgYmVmb3JlIG9yIGFmdGVyIHRoZSAlYywgc28gd2UgbmVlZCB0b1xuICAvLyBmaWd1cmUgb3V0IHRoZSBjb3JyZWN0IGluZGV4IHRvIGluc2VydCB0aGUgQ1NTIGludG9cbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxhc3RDID0gMDtcbiAgYXJnc1swXS5yZXBsYWNlKC8lW2EteiVdL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgaWYgKCclJScgPT09IG1hdGNoKSByZXR1cm47XG4gICAgaW5kZXgrKztcbiAgICBpZiAoJyVjJyA9PT0gbWF0Y2gpIHtcbiAgICAgIC8vIHdlIG9ubHkgYXJlIGludGVyZXN0ZWQgaW4gdGhlICpsYXN0KiAlY1xuICAgICAgLy8gKHRoZSB1c2VyIG1heSBoYXZlIHByb3ZpZGVkIHRoZWlyIG93bilcbiAgICAgIGxhc3RDID0gaW5kZXg7XG4gICAgfVxuICB9KTtcblxuICBhcmdzLnNwbGljZShsYXN0QywgMCwgYyk7XG4gIHJldHVybiBhcmdzO1xufVxuXG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUubG9nKClgIHdoZW4gYXZhaWxhYmxlLlxuICogTm8tb3Agd2hlbiBgY29uc29sZS5sb2dgIGlzIG5vdCBhIFwiZnVuY3Rpb25cIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgLy8gdGhpcyBoYWNrZXJ5IGlzIHJlcXVpcmVkIGZvciBJRTgvOSwgd2hlcmVcbiAgLy8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24gZG9lc24ndCBoYXZlICdhcHBseSdcbiAgcmV0dXJuICdvYmplY3QnID09PSB0eXBlb2YgY29uc29sZVxuICAgICYmIGNvbnNvbGUubG9nXG4gICAgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csIGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICB0cnkge1xuICAgIGlmIChudWxsID09IG5hbWVzcGFjZXMpIHtcbiAgICAgIHN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RvcmFnZS5kZWJ1ZyA9IG5hbWVzcGFjZXM7XG4gICAgfVxuICB9IGNhdGNoKGUpIHt9XG59XG5cbi8qKlxuICogTG9hZCBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSByZXR1cm5zIHRoZSBwcmV2aW91c2x5IHBlcnNpc3RlZCBkZWJ1ZyBtb2Rlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9hZCgpIHtcbiAgdmFyIHI7XG4gIHRyeSB7XG4gICAgciA9IHN0b3JhZ2UuZGVidWc7XG4gIH0gY2F0Y2goZSkge31cbiAgcmV0dXJuIHI7XG59XG5cbi8qKlxuICogRW5hYmxlIG5hbWVzcGFjZXMgbGlzdGVkIGluIGBsb2NhbFN0b3JhZ2UuZGVidWdgIGluaXRpYWxseS5cbiAqL1xuXG5leHBvcnRzLmVuYWJsZShsb2FkKCkpO1xuXG4vKipcbiAqIExvY2Fsc3RvcmFnZSBhdHRlbXB0cyB0byByZXR1cm4gdGhlIGxvY2Fsc3RvcmFnZS5cbiAqXG4gKiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHNhZmFyaSB0aHJvd3NcbiAqIHdoZW4gYSB1c2VyIGRpc2FibGVzIGNvb2tpZXMvbG9jYWxzdG9yYWdlXG4gKiBhbmQgeW91IGF0dGVtcHQgdG8gYWNjZXNzIGl0LlxuICpcbiAqIEByZXR1cm4ge0xvY2FsU3RvcmFnZX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvY2Fsc3RvcmFnZSgpe1xuICB0cnkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICB9IGNhdGNoIChlKSB7fVxufVxuIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGRlYnVnO1xuZXhwb3J0cy5jb2VyY2UgPSBjb2VyY2U7XG5leHBvcnRzLmRpc2FibGUgPSBkaXNhYmxlO1xuZXhwb3J0cy5lbmFibGUgPSBlbmFibGU7XG5leHBvcnRzLmVuYWJsZWQgPSBlbmFibGVkO1xuZXhwb3J0cy5odW1hbml6ZSA9IHJlcXVpcmUoJ21zJyk7XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG4gKi9cblxuZXhwb3J0cy5uYW1lcyA9IFtdO1xuZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4vKipcbiAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAqXG4gKiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlcmNhc2VkIGxldHRlciwgaS5lLiBcIm5cIi5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMgPSB7fTtcblxuLyoqXG4gKiBQcmV2aW91c2x5IGFzc2lnbmVkIGNvbG9yLlxuICovXG5cbnZhciBwcmV2Q29sb3IgPSAwO1xuXG4vKipcbiAqIFByZXZpb3VzIGxvZyB0aW1lc3RhbXAuXG4gKi9cblxudmFyIHByZXZUaW1lO1xuXG4vKipcbiAqIFNlbGVjdCBhIGNvbG9yLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlbGVjdENvbG9yKCkge1xuICByZXR1cm4gZXhwb3J0cy5jb2xvcnNbcHJldkNvbG9yKysgJSBleHBvcnRzLmNvbG9ycy5sZW5ndGhdO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZWJ1ZyhuYW1lc3BhY2UpIHtcblxuICAvLyBkZWZpbmUgdGhlIGBkaXNhYmxlZGAgdmVyc2lvblxuICBmdW5jdGlvbiBkaXNhYmxlZCgpIHtcbiAgfVxuICBkaXNhYmxlZC5lbmFibGVkID0gZmFsc2U7XG5cbiAgLy8gZGVmaW5lIHRoZSBgZW5hYmxlZGAgdmVyc2lvblxuICBmdW5jdGlvbiBlbmFibGVkKCkge1xuXG4gICAgdmFyIHNlbGYgPSBlbmFibGVkO1xuXG4gICAgLy8gc2V0IGBkaWZmYCB0aW1lc3RhbXBcbiAgICB2YXIgY3VyciA9ICtuZXcgRGF0ZSgpO1xuICAgIHZhciBtcyA9IGN1cnIgLSAocHJldlRpbWUgfHwgY3Vycik7XG4gICAgc2VsZi5kaWZmID0gbXM7XG4gICAgc2VsZi5wcmV2ID0gcHJldlRpbWU7XG4gICAgc2VsZi5jdXJyID0gY3VycjtcbiAgICBwcmV2VGltZSA9IGN1cnI7XG5cbiAgICAvLyBhZGQgdGhlIGBjb2xvcmAgaWYgbm90IHNldFxuICAgIGlmIChudWxsID09IHNlbGYudXNlQ29sb3JzKSBzZWxmLnVzZUNvbG9ycyA9IGV4cG9ydHMudXNlQ29sb3JzKCk7XG4gICAgaWYgKG51bGwgPT0gc2VsZi5jb2xvciAmJiBzZWxmLnVzZUNvbG9ycykgc2VsZi5jb2xvciA9IHNlbGVjdENvbG9yKCk7XG5cbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICBhcmdzWzBdID0gZXhwb3J0cy5jb2VyY2UoYXJnc1swXSk7XG5cbiAgICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAvLyBhbnl0aGluZyBlbHNlIGxldCdzIGluc3BlY3Qgd2l0aCAlb1xuICAgICAgYXJncyA9IFsnJW8nXS5jb25jYXQoYXJncyk7XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgYW55IGBmb3JtYXR0ZXJzYCB0cmFuc2Zvcm1hdGlvbnNcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIGFyZ3NbMF0gPSBhcmdzWzBdLnJlcGxhY2UoLyUoW2EteiVdKS9nLCBmdW5jdGlvbihtYXRjaCwgZm9ybWF0KSB7XG4gICAgICAvLyBpZiB3ZSBlbmNvdW50ZXIgYW4gZXNjYXBlZCAlIHRoZW4gZG9uJ3QgaW5jcmVhc2UgdGhlIGFycmF5IGluZGV4XG4gICAgICBpZiAobWF0Y2ggPT09ICclJScpIHJldHVybiBtYXRjaDtcbiAgICAgIGluZGV4Kys7XG4gICAgICB2YXIgZm9ybWF0dGVyID0gZXhwb3J0cy5mb3JtYXR0ZXJzW2Zvcm1hdF07XG4gICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZvcm1hdHRlcikge1xuICAgICAgICB2YXIgdmFsID0gYXJnc1tpbmRleF07XG4gICAgICAgIG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTtcblxuICAgICAgICAvLyBub3cgd2UgbmVlZCB0byByZW1vdmUgYGFyZ3NbaW5kZXhdYCBzaW5jZSBpdCdzIGlubGluZWQgaW4gdGhlIGBmb3JtYXRgXG4gICAgICAgIGFyZ3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgaW5kZXgtLTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcblxuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZXhwb3J0cy5mb3JtYXRBcmdzKSB7XG4gICAgICBhcmdzID0gZXhwb3J0cy5mb3JtYXRBcmdzLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgICB2YXIgbG9nRm4gPSBlbmFibGVkLmxvZyB8fCBleHBvcnRzLmxvZyB8fCBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuICAgIGxvZ0ZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9XG4gIGVuYWJsZWQuZW5hYmxlZCA9IHRydWU7XG5cbiAgdmFyIGZuID0gZXhwb3J0cy5lbmFibGVkKG5hbWVzcGFjZSkgPyBlbmFibGVkIDogZGlzYWJsZWQ7XG5cbiAgZm4ubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuXG4gIHJldHVybiBmbjtcbn1cblxuLyoqXG4gKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gKiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZShuYW1lc3BhY2VzKSB7XG4gIGV4cG9ydHMuc2F2ZShuYW1lc3BhY2VzKTtcblxuICB2YXIgc3BsaXQgPSAobmFtZXNwYWNlcyB8fCAnJykuc3BsaXQoL1tcXHMsXSsvKTtcbiAgdmFyIGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFzcGxpdFtpXSkgY29udGludWU7IC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG4gICAgbmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG4gICAgaWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuICAgICAgZXhwb3J0cy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcyArICckJykpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgZXhwb3J0cy5lbmFibGUoJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlZChuYW1lKSB7XG4gIHZhciBpLCBsZW47XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMuc2tpcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENvZXJjZSBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY29lcmNlKHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG4gIHJldHVybiB2YWw7XG59XG4iLCIvKipcbiAqIEhlbHBlcnMuXG4gKi9cblxudmFyIHMgPSAxMDAwO1xudmFyIG0gPSBzICogNjA7XG52YXIgaCA9IG0gKiA2MDtcbnZhciBkID0gaCAqIDI0O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsLCBvcHRpb25zKXtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgdmFsKSByZXR1cm4gcGFyc2UodmFsKTtcbiAgcmV0dXJuIG9wdGlvbnMubG9uZ1xuICAgID8gbG9uZyh2YWwpXG4gICAgOiBzaG9ydCh2YWwpO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHZhciBtYXRjaCA9IC9eKCg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoc3RyKTtcbiAgaWYgKCFtYXRjaCkgcmV0dXJuO1xuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICd5ZWFycyc6XG4gICAgY2FzZSAneWVhcic6XG4gICAgY2FzZSAneXJzJzpcbiAgICBjYXNlICd5cic6XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gbiAqIHk7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtaW5zJzpcbiAgICBjYXNlICdtaW4nOlxuICAgIGNhc2UgJ20nOlxuICAgICAgcmV0dXJuIG4gKiBtO1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogcztcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzaG9ydChtcykge1xuICBpZiAobXMgPj0gZCkgcmV0dXJuIE1hdGgucm91bmQobXMgLyBkKSArICdkJztcbiAgaWYgKG1zID49IGgpIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gIGlmIChtcyA+PSBtKSByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nO1xuICBpZiAobXMgPj0gcykgcmV0dXJuIE1hdGgucm91bmQobXMgLyBzKSArICdzJztcbiAgcmV0dXJuIG1zICsgJ21zJztcbn1cblxuLyoqXG4gKiBMb25nIGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvbmcobXMpIHtcbiAgcmV0dXJuIHBsdXJhbChtcywgZCwgJ2RheScpXG4gICAgfHwgcGx1cmFsKG1zLCBoLCAnaG91cicpXG4gICAgfHwgcGx1cmFsKG1zLCBtLCAnbWludXRlJylcbiAgICB8fCBwbHVyYWwobXMsIHMsICdzZWNvbmQnKVxuICAgIHx8IG1zICsgJyBtcyc7XG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBuLCBuYW1lKSB7XG4gIGlmIChtcyA8IG4pIHJldHVybjtcbiAgaWYgKG1zIDwgbiAqIDEuNSkgcmV0dXJuIE1hdGguZmxvb3IobXMgLyBuKSArICcgJyArIG5hbWU7XG4gIHJldHVybiBNYXRoLmNlaWwobXMgLyBuKSArICcgJyArIG5hbWUgKyAncyc7XG59XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOS4yXG52YXIgJGRlZmF1bHRzLCAkcGl4ZWwsICRzZXNzaW9uaWQsICRzaXRlaWQsICRzdCwgJHRyYWtsZXNzMiwgJHVzZXJpZCwgJHV1aWQsIEVtaXR0ZXIsIGF0dHJzLCBjb29raWUsIGRlYm91bmNlLCBkZWZhdWx0cywgZG9jLCBkb2NSZWFkeSwgZm4sIGdldEltYWdlLCBoYXNOT0wsIGksIGlzRG9tLCBqLCBrLCBsZW4sIGxlbjEsIGxzcXVldWUsIG15c3RvcmUsIG15dHJha2xlc3MsIG15dXRpbCwgcHJlZml4LCBxdWVyeSwgcXVldWUsIHJlZiwgcmVmMSwgc2NyaXB0LCBzZXNzaW9uLCB0cmFja2VyLCB0cmFrbGVzcywgdHJha2xlc3NQYXJlbnQsIHV0aWwsIHV1aWQsIHdlYmFuYWx5c2VyLCB3aW4sIHhzdG9yZTtcblxubXlzdG9yZSA9IHJlcXVpcmUoJ3hzdG9yZScpO1xuXG54c3RvcmUgPSBuZXcgbXlzdG9yZSgpO1xuXG5FbWl0dGVyID0gcmVxdWlyZSgnZW1pdHRlcicpO1xuXG5jb29raWUgPSByZXF1aXJlKCdjb29raWUnKTtcblxuZGVmYXVsdHMgPSByZXF1aXJlKCdkZWZhdWx0cycpO1xuXG5xdWVyeSA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XG5cbnV1aWQgPSByZXF1aXJlKCd1dWlkJyk7XG5cbndlYmFuYWx5c2VyID0gcmVxdWlyZSgnd2ViYW5hbHlzZXInKTtcblxuZG9jUmVhZHkgPSByZXF1aXJlKCdkb2MtcmVhZHknKTtcblxuZGVib3VuY2UgPSByZXF1aXJlKCdkZWJvdW5jZScpO1xuXG5sc3F1ZXVlID0gcmVxdWlyZSgnbHNxdWV1ZScpO1xuXG5xdWV1ZSA9IG5ldyBsc3F1ZXVlKCd0a3NxJyk7XG5cbndpbiA9IHdpbmRvdztcblxuZG9jID0gd2luLmRvY3VtZW50O1xuXG5oYXNOT0wgPSB3aW4ubmF2aWdhdG9yLm9uTGluZTtcblxuc2Vzc2lvbiA9IHdpbi5zZXNzaW9uU3RvcmFnZTtcblxuJHNpdGVpZCA9IDA7XG5cbiRwaXhlbCA9ICcvL25paWtub3cuZ2l0aHViLmlvL3BpeGVsLmdpZic7XG5cbiR1dWlkID0gbnVsbDtcblxuJHVzZXJpZCA9IG51bGw7XG5cbiRzdCA9IChuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksIDAsIDEpKS5nZXRUaW1lKCk7XG5cbiRzZXNzaW9uaWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtICRzdDtcblxuJGRlZmF1bHRzID0gbnVsbDtcblxuaWYgKHR5cGVvZiBzZXNzaW9uID09PSAndW5kZWZpbmVkJykge1xuICBzZXNzaW9uID0ge1xuICAgIGdldEl0ZW06IGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiBjb29raWUoayk7XG4gICAgfSxcbiAgICBzZXRJdGVtOiBmdW5jdGlvbihrLCB2KSB7XG4gICAgICByZXR1cm4gY29va2llKGssIHYsIHtcbiAgICAgICAgcGF0aDogJy8nXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbnRyeSB7XG4gICRzZXNzaW9uaWQgPSBzZXNzaW9uLmdldEl0ZW0oJ3RrbHNpZCcpO1xuICBpZiAoJHNlc3Npb25pZCA9PSBudWxsKSB7XG4gICAgJHNlc3Npb25pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gJHN0O1xuICAgIHNlc3Npb24uc2V0SXRlbSgndGtsc2lkJywgJHNlc3Npb25pZCk7XG4gIH1cbn0gY2F0Y2ggKF9lcnJvcikge1xuXG59XG5cblxuLyoqXG4gKiBTZW5kIGltYWdlIHJlcXVlc3QgdG8gc2VydmVyIHVzaW5nIEdFVC5cbiAqIFRoZSBpbmZhbW91cyB3ZWIgYnVnIChvciBiZWFjb24pIGlzIGEgdHJhbnNwYXJlbnQsIHNpbmdsZSBwaXhlbCAoMXgxKSBpbWFnZVxuI1xuICovXG5cbmdldEltYWdlID0gZnVuY3Rpb24oY2ZnVXJsLCB0a3MsIHFzLCBjYWxsYmFjaykge1xuICB2YXIgaW1hZ2UsIHVybDtcbiAgaW1hZ2UgPSBuZXcgSW1hZ2UoMSwgMSk7XG4gIGlmIChjZmdVcmwuaW5kZXhPZignLy8nKSA9PT0gMCkge1xuICAgIGNmZ1VybCA9IHdpbi5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzJyA/IFwiaHR0cHM6XCIgKyBjZmdVcmwgOiBcImh0dHA6XCIgKyBjZmdVcmw7XG4gIH1cbiAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZXJhdG9yO1xuICAgIGl0ZXJhdG9yID0gMDtcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfTtcbiAgdXJsID0gY2ZnVXJsICsgKGNmZ1VybC5pbmRleE9mKCc/JykgPCAwID8gJz8nIDogJyYnKSArICh0a3MgKyBcIiZcIiArIHFzKTtcbiAgaW1hZ2Uuc3JjID0gdXJsO1xuICByZXR1cm4gaW1hZ2U7XG59O1xuXG5cbi8qKlxuICogZGV0ZXJtaW5lIGlmIGEgb2JqZWN0IGlzIGRvbVxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIHRoZSBvYmplY3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICB0cnVlIG9yIGZhbHNlXG4gKi9cblxuaXNEb20gPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKChvYmogIT0gbnVsbCkpIHtcbiAgICBpZiAob2JqLm5vZGVOYW1lKSB7XG4gICAgICBzd2l0Y2ggKG9iai5ub2RlVHlwZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICByZXR1cm4gb2JqZWN0Lm5vZGVWYWx1ZSAhPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qKlxuICogIHV0aWxcbiAqL1xuXG51dGlsID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiB1dGlsKCkge31cblxuXG4gIC8qKlxuICAgKiBhbGxvdyBmb3IgZ2V0dGluZyBhbGwgYXR0cmlidXRlc1xuICAjXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gZWxlbWVudFxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIHV0aWwucHJvdG90eXBlLmFsbERhdGEgPSBmdW5jdGlvbihlbCkge1xuICAgIHZhciBhdHRyLCBjYW1lbENhc2VOYW1lLCBkYXRhLCBpLCBrLCBsZW4sIG5hbWUsIHJlZjtcbiAgICBkYXRhID0ge307XG4gICAgaWYgKChlbCAhPSBudWxsKSkge1xuICAgICAgcmVmID0gZWwuYXR0cmlidXRlcztcbiAgICAgIGZvciAoayA9IGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBrID0gKytpKSB7XG4gICAgICAgIGF0dHIgPSByZWZba107XG4gICAgICAgIG5hbWUgPSBhdHRyLm5hbWUucmVwbGFjZSgvXmRhdGEtL2csICcnKTtcbiAgICAgICAgY2FtZWxDYXNlTmFtZSA9IG5hbWUucmVwbGFjZSgvLSguKS9nLCBmdW5jdGlvbigkMCwgJDEpIHtcbiAgICAgICAgICByZXR1cm4gJDEudG9VcHBlckNhc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRhdGFbY2FtZWxDYXNlTmFtZV0gPSBhdHRyLnZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBwYXJzZSBhIHN0cmluZyB0byBKU09OLCByZXR1cm4gc3RyaW5nIGlmIGZhaWxcbiAgI1xuICAgKiBAcGFyYW0ge1N0cmluZ30gdiAtIHN0cmluZyB2YWx1ZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIHV0aWwucHJvdG90eXBlLnBhcnNlSlNPTiA9IGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgdjI7XG4gICAgaWYgKHR5cGVvZiB2ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAodi5pbmRleE9mKCd7JykgPj0gMCB8fCB2LmluZGV4T2YoJ1snKSA+PSAwKSB7XG4gICAgICAgIHYyID0gSlNPTi5wYXJzZSh2KTtcbiAgICAgICAgaWYgKCEodjIgPT0gbnVsbCkpIHtcbiAgICAgICAgICByZXR1cm4gdjI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH07XG5cblxuICAvKipcbiAgICogcGFyc2UgYSBKU09OIHRvIHN0cmluZywgcmV0dXJuIHN0cmluZyBpZiBmYWlsXG4gICNcbiAgICogQHBhcmFtIHtTdHJpbmd9IHYgLSBzdHJpbmcgdmFsdWVcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICB1dGlsLnByb3RvdHlwZS5zdHJpbmdpZnkgPSBmdW5jdGlvbih2KSB7XG4gICAgaWYgKHR5cGVvZiB2ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gdjtcbiAgICB9XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIGdldCBvciBzZXQgc2Vzc2lvbiBkYXRhIC0gc3RvcmUgaW4gY29va2llXG4gICAqIGlmIG5vIHZhbHVlIGlzIHByb3ZpZGVkLCB0aGVuIGl0IGlzIGEgZ2V0XG4gICNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGsgLSBrZXlcbiAgICogQHBhcmFtIHtPYmplY3R9IHYgLSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIHV0aWwucHJvdG90eXBlLnNlc3Npb24gPSBmdW5jdGlvbihrLCB2KSB7XG4gICAgaWYgKCh2ICE9IG51bGwpKSB7XG4gICAgICBpZiAoISh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgdiA9IHRoaXMuc3RyaW5naWZ5KHYpO1xuICAgICAgfVxuICAgICAgY29va2llKCd0bHM6JyArIGssIHYsIHtcbiAgICAgICAgcGF0aDogJy8nXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2O1xuICAgIH1cbiAgICB2ID0gY29va2llKCd0bHM6JyArIGspO1xuICAgIGlmICh0eXBlb2YgdiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wYXJzZUpTT04odik7XG4gIH07XG5cblxuICAvKipcbiAgICogY29va2llXG4gICNcbiAgICovXG5cbiAgdXRpbC5wcm90b3R5cGUuY29va2llID0gY29va2llO1xuXG5cbiAgLyoqXG4gICAqIGRvY3VtZW50IHJlYWR5XG4gICNcbiAgICovXG5cbiAgdXRpbC5wcm90b3R5cGUucmVhZHkgPSBkb2NSZWFkeTtcblxuXG4gIC8qKlxuICAgKiB0cmltXG4gICNcbiAgICovXG5cbiAgdXRpbC5wcm90b3R5cGUudHJpbSA9IGZ1bmN0aW9uKHYpIHtcbiAgICByZXR1cm4gdi5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpO1xuICB9O1xuXG4gIHJldHVybiB1dGlsO1xuXG59KSgpO1xuXG5teXV0aWwgPSBuZXcgdXRpbCgpO1xuXG5cbi8qKlxuICogdHJhY2tlciBjbGFzc1xuI1xuICovXG5cbnRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHRyYWNrZXIoKSB7fVxuXG4gIHRyYWNrZXIucHJvdG90eXBlLnBpeGVsID0gJy8vbmlpa25vdy5naXRodWIuaW8vcGl4ZWwuZ2lmJztcblxuICB0cmFja2VyLnByb3RvdHlwZS5zaXRlaWQgPSAwO1xuXG4gIHRyYWNrZXIucHJvdG90eXBlLnN0b3JlID0gbnVsbDtcblxuICB0cmFja2VyLnByb3RvdHlwZS51dWlkID0gbnVsbDtcblxuICB0cmFja2VyLnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiAoc2VsZi5zaXRlaWQgKyBcIi1cIiArIHNlbGYucGl4ZWwpLnJlcGxhY2UoL1teYS16QS16XS9naSwgJyQnKTtcbiAgfTtcblxuICB0cmFja2VyLnByb3RvdHlwZS5fdGsgPSBmdW5jdGlvbihkYXRhLCBodCwgcGl4ZWwpIHtcbiAgICB2YXIgaywgbXlEYXRhLCBzZWxmLCB0a2QsIHY7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgdGtkID0ge1xuICAgICAgdXVpZDogc2VsZi51dWlkLFxuICAgICAgc2l0ZWlkOiBzZWxmLnNpdGVpZCxcbiAgICAgIHVzaWQ6ICRzZXNzaW9uaWQsXG4gICAgICBodDogaHQsXG4gICAgICB6OiBkYXRhLnpcbiAgICB9O1xuICAgIGlmICgkdXNlcmlkKSB7XG4gICAgICB0a2QudWlkID0gJHVzZXJpZDtcbiAgICB9XG4gICAgbXlEYXRhID0ge307XG4gICAgZm9yIChrIGluIGRhdGEpIHtcbiAgICAgIHYgPSBkYXRhW2tdO1xuICAgICAgaWYgKHYgIT0gbnVsbCkge1xuICAgICAgICBpZiAoISh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIikgfHwgKG15dXRpbC50cmltKHYpLmxlbmd0aCA+IDApKSB7XG4gICAgICAgICAgaWYgKChrICsgJycpICE9PSAndW5kZWZpbmVkJyAmJiBrICE9PSAndXVpZCcgJiYgayAhPT0gJ3onICYmICFpc0RvbSh2KSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2ID09PSAnYm9vbGxlYW4nKSB7XG4gICAgICAgICAgICAgIHYgPSB2ID8gMSA6IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBteURhdGFba10gPSB2O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLmVtaXQoJ3RyYWNrJywge1xuICAgICAgaHQ6IGh0LFxuICAgICAgcGl4ZWw6IHBpeGVsLFxuICAgICAgcXM6IFt0a2QsIG15RGF0YV1cbiAgICB9KTtcbiAgICBnZXRJbWFnZShwaXhlbCwgcXVlcnkuc3RyaW5naWZ5KHRrZCksIHF1ZXJ5LnN0cmluZ2lmeShteURhdGEpKTtcbiAgICBzZWxmLmVtaXQoJ3RyYWNrZWQnLCB7XG4gICAgICBodDogaHQsXG4gICAgICBwaXhlbDogcGl4ZWwsXG4gICAgICBxczogW3RrZCwgbXlEYXRhXVxuICAgIH0pO1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG4gIHRyYWNrZXIucHJvdG90eXBlLl90cmFjayA9IGZ1bmN0aW9uKGh0LCBjdHgpIHtcbiAgICB2YXIgcGl4ZWwsIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgaWYgKGN0eCA9PSBudWxsKSB7XG4gICAgICBjdHggPSB7fTtcbiAgICB9XG4gICAgaWYgKHNlbGYuc2l0ZWlkID4gMCkge1xuICAgICAgcGl4ZWwgPSBteXV0aWwudHJpbSh0aGlzLnBpeGVsKTtcbiAgICAgIGlmICghc2VsZi51dWlkKSB7XG4gICAgICAgIHNlbGYudXVpZCA9IHV1aWQoKTtcbiAgICAgICAgJHV1aWQgPSBzZWxmLnV1aWQ7XG4gICAgICAgIGlmIChzZWxmLnN0b3JlICE9IG51bGwpIHtcbiAgICAgICAgICBzZWxmLnN0b3JlLmdldCgndGtsc3VpZCcpLnRoZW4oZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgc2VsZi5zdG9yZS5zZXQoJ3RrbHN1aWQnLCBzZWxmLnV1aWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi51dWlkID0gaWQgfHwgc2VsZi51dWlkO1xuICAgICAgICAgICAgJHV1aWQgPSBzZWxmLnV1aWQ7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fdGsoY3R4LCBodCwgcGl4ZWwpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLl90ayhjdHgsIGh0LCBwaXhlbCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIHRyYWNrIGdlbmVyaWMgbWV0aG9kXG4gICNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGh0IC0gaGl0IHR5cGVzIHdpdGggcG9zc2libGUgdmFsdWVzIG9mICdwYWdldmlldycsICdldmVudCcsICd0cmFuc2FjdGlvbicsICdpdGVtJywgJ3NvY2lhbCcsICdleGNlcHRpb24nLCAndGltaW5nJywgJ2FwcCcsICdjdXN0b20nXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdHggLSBleHRlbmRlZCBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG5cbiAgdHJhY2tlci5wcm90b3R5cGUudHJhY2sgPSBmdW5jdGlvbihodCwgY3R4KSB7XG4gICAgdmFyIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgbXl1dGlsLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgY3R4ID0gY3R4IHx8IHt9O1xuICAgICAgaWYgKCFjdHgueikge1xuICAgICAgICBjdHgueiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gJHN0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGYuX3RyYWNrKGh0IHx8ICdjdXN0b20nLCBjdHgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiB0cmFja2VyO1xuXG59KSgpO1xuXG5FbWl0dGVyKHRyYWNrZXIucHJvdG90eXBlKTtcblxuXG4vKipcbiAqIHRyYWNrZXIgZmFjdG9yeVxuI1xuICovXG5cbm15dHJha2xlc3MgPSAoZnVuY3Rpb24oKSB7XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBhbiBpbnN0YW5jZSBvZiB0cmFrbGVzc1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBmdW5jdGlvbiBteXRyYWtsZXNzKCkge1xuICAgIHZhciBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX3RyYWNrID0gZGVib3VuY2UoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaXRlbSwgaywgcmVmLCB2O1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoIWhhc05PTCB8fCB3aW4ubmF2aWdhdG9yLm9uTGluZSkge1xuICAgICAgICBpdGVtID0gcXVldWUucG9wKCk7XG4gICAgICAgIGlmICgoaXRlbSAhPSBudWxsKSkge1xuICAgICAgICAgIHNlbGYuZW1pdCgndHJhY2snLCBpdGVtKTtcbiAgICAgICAgICByZWYgPSBzZWxmLnRyYWNrZXJzO1xuICAgICAgICAgIGZvciAoayBpbiByZWYpIHtcbiAgICAgICAgICAgIHYgPSByZWZba107XG4gICAgICAgICAgICB2LnRyYWNrKGl0ZW0uaHQsIGl0ZW0uY3R4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHNlbGYuZW1pdCgndHJhY2tlZCcsIGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgMjIyKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIHN0b3JlIGFsbCB0cmFja2Vyc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cblxuICBteXRyYWtsZXNzLnByb3RvdHlwZS50cmFja2VycyA9IHt9O1xuXG5cbiAgLyoqXG4gICAqIHNldCBkZWZhdWx0IHNpdGVpZFxuICAjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXRlaWQgLSB0aGUgc2l0ZSBpZFxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIG15dHJha2xlc3MucHJvdG90eXBlLnNldFNpdGVJZCA9IGZ1bmN0aW9uKHNpdGVpZCkge1xuICAgIHZhciBteXNpZDtcbiAgICBteXNpZCA9IHBhcnNlSW50KHNpdGVpZCk7XG4gICAgJHNpdGVpZCA9IG15c2lkID4gMCA/IG15c2lkIDogJHNpdGVpZDtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBzZXQgZGVmYXVsdCBwaXhlbFxuICAjXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwaXhlbCAtIHRoZSBkZWZhdWx0IHBpeGVsIHVybFxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIG15dHJha2xlc3MucHJvdG90eXBlLnNldFBpeGVsID0gZnVuY3Rpb24ocGl4ZWxVcmwpIHtcbiAgICBpZiAocGl4ZWxVcmwpIHtcbiAgICAgICRwaXhlbCA9IHBpeGVsVXJsIHx8ICRwaXhlbDtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogVGhlIGRvbWFpbiB1c2VyIGlkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgdGhlIGRvbWFpbiB1c2VyIGlkXG4gICAqL1xuXG4gIG15dHJha2xlc3MucHJvdG90eXBlLnNldFVzZXJJZCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgaWYgKGlkKSB7XG4gICAgICAkdXNlcmlkID0gaWQgfHwgJHVzZXJpZDtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogdGhlIHN0b3JhZ2VcbiAgI1xuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuXG4gIG15dHJha2xlc3MucHJvdG90eXBlLnN0b3JlID0geHN0b3JlO1xuXG5cbiAgLyoqXG4gICAqIHlvdSBjYW4gcHJvdmlkZSBkaWZmZXJlbnQgc2l0ZWlkIGFuZCBwaXhlbFVybCBmb3IgaW4gbXVsdGktdHJhY2tlciBhbmQgc2l0ZSBzY2VuYXJpb1xuICAjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXRlaWQgLSB0aGUgc2l0ZWlkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwaXhlbFVybCAtIHRoZSBwaXhlbCB1cmxcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cblxuICBteXRyYWtsZXNzLnByb3RvdHlwZS5nZXRUcmFja2VyID0gZnVuY3Rpb24oc2l0ZWlkLCBwaXhlbFVybCkge1xuICAgIHZhciBpZCwgcnN0LCBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIHJzdCA9IG5ldyB0cmFja2VyKCk7XG4gICAgcnN0LnNpdGVpZCA9IHNpdGVpZCAhPSBudWxsID8gc2l0ZWlkIDogJHNpdGVpZDtcbiAgICByc3QucGl4ZWwgPSBwaXhlbFVybCAhPSBudWxsID8gcGl4ZWxVcmwgOiAkcGl4ZWw7XG4gICAgaWYgKChyc3Quc2l0ZWlkICE9IG51bGwpICYmIChyc3QucGl4ZWwgIT0gbnVsbCkpIHtcbiAgICAgIHJzdC5zdG9yZSA9IHhzdG9yZTtcbiAgICAgIGlkID0gcnN0LmdldElkKCk7XG4gICAgICBpZiAoIXNlbGYudHJhY2tlcnNbaWRdKSB7XG4gICAgICAgIHNlbGYudHJhY2tlcnNbaWRdID0gcnN0O1xuICAgICAgICByc3Qub24oJ3RyYWNrZWQnLCBzZWxmLl90cmFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZi50cmFja2Vyc1tpZF07XG4gICAgfVxuICAgIHRocm93IFwic2l0ZWlkIG9yIHBpeGVsVXJsIGlzIHJlcXVpcmVkXCI7XG4gIH07XG5cblxuICAvKipcbiAgICogZ2V0IHRoZSBkZWZhdWx0IHJhY2tlclxuICAjXG4gICAqL1xuXG4gIG15dHJha2xlc3MucHJvdG90eXBlLmdldERlZmF1bHRUcmFja2VyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlkLCBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIGlkID0gKCRzaXRlaWQgKyBcIi1cIiArICRwaXhlbCkucmVwbGFjZSgvW15hLXpBLXpdL2dpLCAnJCcpO1xuICAgIGlmIChzZWxmLnRyYWNrZXJzW2lkXSA9PSBudWxsKSB7XG4gICAgICBzZWxmLmdldFRyYWNrZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGYudHJhY2tlcnNbaWRdO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIHV0aWxpdHlcbiAgI1xuICAgKi9cblxuICBteXRyYWtsZXNzLnByb3RvdHlwZS51dGlsID0gbXl1dGlsO1xuXG5cbiAgLyoqXG4gICAqIHRyYWNrIGV2ZW50XG4gICAqIEBwYXJhbSAge3N0cmluZ30gY2F0ZWdvcnlcbiAgICogQHBhcmFtICB7c3RyaW5nfSBhY3Rpb25cbiAgICogQHBhcmFtICB7c3RyaW5nfSBsYWJlbFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHByb3BlcnR5XG4gICAqIEBwYXJhbSAge3N0cmluZ30gdmFsdWVcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cblxuICBteXRyYWtsZXNzLnByb3RvdHlwZS5ldmVudCA9IGZ1bmN0aW9uKGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgJiYgdmFsdWUgPCAwKSB7XG4gICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRyYWNrKCdldmVudCcsIHtcbiAgICAgIGVjOiBjYXRlZ29yeSB8fCAnZXZlbnQnLFxuICAgICAgZWE6IGFjdGlvbixcbiAgICAgIGVsOiBsYWJlbCxcbiAgICAgIGVwOiBwcm9wZXJ0eSxcbiAgICAgIGV2OiB2YWx1ZVxuICAgIH0pO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIHRyYWNrIHBhZ2Ugdmlld1xuICAgKiBAcGFyYW0gIHtvYmplY3R9IGN0eCBjb250ZXh0L2FkZHRpb25hbCBwYXJhbWV0ZXJcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cblxuICBteXRyYWtsZXNzLnByb3RvdHlwZS5wYWdldmlldyA9IGZ1bmN0aW9uKGN0eCkge1xuICAgIHJldHVybiB0aGlzLnRyYWNrKCdwYWdldmlldycsIGN0eCk7XG4gIH07XG5cblxuICAvKipcbiAgICogdHJhY2sgYW55dGhpbmdcbiAgICogQHBhcmFtICB7c3RyaW5nfSBodCAgaGl0IHR5cGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBjdHggY29udGV4dC9hZGRpdG9uYWwgcGFyYW1ldGVyXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG5cbiAgbXl0cmFrbGVzcy5wcm90b3R5cGUudHJhY2sgPSBmdW5jdGlvbihodCwgY3R4KSB7XG4gICAgdmFyIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5nZXREZWZhdWx0VHJhY2tlcigpO1xuICAgIGN0eCA9IGN0eCB8fCB7fTtcbiAgICBjdHgueiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gJHN0O1xuICAgIHF1ZXVlLnB1c2goe1xuICAgICAgaHQ6IGh0LFxuICAgICAgY3R4OiBjdHgsXG4gICAgICB1dWlkOiAkdXVpZCxcbiAgICAgIHVzaWQ6ICRzZXNzaW9uaWQsXG4gICAgICB1aWQ6ICR1c2VyaWRcbiAgICB9KTtcbiAgICBzZWxmLl90cmFjaygpO1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEZvciBzaXR1YXRpb24gd2hlbiB0cmFrbGVzcyBpcyBpbiBhbiBpZnJhbWUsIHlvdSBjYW4gdXNlIHRoaXMgbWV0aG9kXG4gICAqIHRvIGVtaXQgZXZlbnQgdG8gdGhlIHBhcmVudC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBlbiBldmVudCBuYW1lXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZWQgZXZlbnQgZGV0YWlsXG4gICAqIEByZXR1cm4ge29iamVjdH0gICAgdHJha2xlc3NcbiAgICovXG5cbiAgbXl0cmFrbGVzcy5wcm90b3R5cGUuZW1pdFRvcCA9IGZ1bmN0aW9uKGVuLCBlZCkge1xuICAgIGlmICh0eXBlb2YgJHRyYWtsZXNzMiAhPT0gXCJ1bmRlZmluZWRcIiAmJiAkdHJha2xlc3MyICE9PSBudWxsKSB7XG4gICAgICAkdHJha2xlc3MyLmVtaXQoZW4sIGVkKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIG15dHJha2xlc3M7XG5cbn0pKCk7XG5cbnRyYWtsZXNzID0gbmV3IG15dHJha2xlc3M7XG5cbkVtaXR0ZXIodHJha2xlc3MpO1xuXG4kdHJha2xlc3MyID0gdHJha2xlc3M7XG5cbmlmICh3aW4udG9wICE9PSB3aW4pIHtcbiAgdHJ5IHtcbiAgICB0cmFrbGVzc1BhcmVudCA9IHdpbi50b3AudHJha2xlc3M7XG4gICAgJHRyYWtsZXNzMiA9IHRyYWtsZXNzUGFyZW50O1xuICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAkdHJha2xlc3MyID0gd2luLnBhcmVudC50cmFrbGVzcztcbiAgfVxufVxuXG50cmFrbGVzcy5vbigndHJhY2snLCBmdW5jdGlvbihpdGVtKSB7XG4gIHZhciBteURlZjtcbiAgaWYgKGl0ZW0uaHQgPT09ICdwYWdldmlldycpIHtcbiAgICBteURlZiA9IHdlYmFuYWx5c2VyLmdldCgpO1xuICAgIHJldHVybiBpdGVtLmN0eCA9IGRlZmF1bHRzKGl0ZW0uY3R4LCBteURlZik7XG4gIH1cbn0pO1xuXG5hdHRycyA9IHtcbiAgc2l0ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHJha2xlc3Muc2V0U2l0ZUlkKHZhbHVlKTtcbiAgfSxcbiAgcGl4ZWw6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gdHJha2xlc3Muc2V0UGl4ZWwodmFsdWUpO1xuICB9XG59O1xuXG5yZWYgPSB3aW4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5mb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgc2NyaXB0ID0gcmVmW2ldO1xuICBpZiAoL3RyYWtsZXNzL2kudGVzdChzY3JpcHQuc3JjKSkge1xuICAgIHJlZjEgPSBbJycsICdkYXRhLSddO1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgcHJlZml4ID0gcmVmMVtqXTtcbiAgICAgIGZvciAoayBpbiBhdHRycykge1xuICAgICAgICBmbiA9IGF0dHJzW2tdO1xuICAgICAgICBmbihzY3JpcHQuZ2V0QXR0cmlidXRlKHByZWZpeCArIGspKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxud2luLnRyYWtsZXNzID0gdHJha2xlc3M7XG5cbndpbi5fdGsgPSB0cmFrbGVzcztcblxubW9kdWxlLmV4cG9ydHMgPSB0cmFrbGVzcztcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS45LjJcbihmdW5jdGlvbih3aW4pIHtcbiAgdmFyIGNhY2hlQnVzdCwgY29va2llLCBkZWJ1ZywgZGVsYXksIGRudCwgZG9jLCBsb2FkLCBsb2csIG1heFN0b3JlLCBteWRlZmVycmVkLCBteXByb3h5LCBteXEsIG9uTWVzc2FnZSwgcSwgcmFuZG9tSGFzaCwgc3RvcmUsIHVzZVBvc3RNZXNzYWdlLCB4c3RvcmU7XG4gIGRvYyA9IHdpbi5kb2N1bWVudDtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpO1xuICBsb2cgPSBkZWJ1ZygneHN0b3JlJyk7XG4gIGxvYWQgPSByZXF1aXJlKCdsb2FkLWlmcmFtZScpO1xuICBzdG9yZSA9IHJlcXVpcmUoJ3N0b3JlLmpzJyk7XG4gIGNvb2tpZSA9IHJlcXVpcmUoJ2Nvb2tpZScpO1xuICB1c2VQb3N0TWVzc2FnZSA9IHdpbi5wb3N0TWVzc2FnZSAhPSBudWxsO1xuICBjYWNoZUJ1c3QgPSAwO1xuICBkZWxheSA9IDMzMztcbiAgbWF4U3RvcmUgPSA2MDAwICogNjAgKiAyNCAqIDc3NztcbiAgbXlxID0gW107XG4gIHEgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBpZiAobXlxLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBteXEuc2hpZnQoKSgpO1xuICAgIH1cbiAgfSwgZGVsYXkgKyA1KTtcbiAgZG50ID0gd2luLm5hdmlnYXRvci5kb05vdFRyYWNrIHx8IHdpbi5uYXZpZ2F0b3IubXNEb05vdFRyYWNrIHx8IHdpbi5kb05vdFRyYWNrO1xuICBvbk1lc3NhZ2UgPSBmdW5jdGlvbihmbikge1xuICAgIGlmICh3aW4uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIHdpbi5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmbiwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gd2luLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIGZuKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIGRlZmVyL3Byb21pc2UgY2xhc3NcbiAgI1xuICAgKi9cbiAgbXlkZWZlcnJlZCA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgaSwgaywgbGVuLCByZWYsIHY7XG5cbiAgICBmdW5jdGlvbiBteWRlZmVycmVkKCkge31cblxuICAgIG15ZGVmZXJyZWQucHJvdG90eXBlLnEgPSBmdW5jdGlvbih4cywgZXZlbnQsIGl0ZW0pIHtcbiAgICAgIHZhciBkLCBkaCwgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5teWNhbGxiYWNrcyA9IFtdO1xuICAgICAgc2VsZi5teWVycm9yYmFja3MgPSBbXTtcbiAgICAgIGRoID0gcmFuZG9tSGFzaCgpO1xuICAgICAgZCA9IFswLCBkaCwgZXZlbnQsIGl0ZW0uaywgaXRlbS52XTtcbiAgICAgIHhzLmRvYltkaF0gPSBzZWxmO1xuICAgICAgaWYgKHVzZVBvc3RNZXNzYWdlKSB7XG4gICAgICAgIHhzLmRvUG9zdE1lc3NhZ2UoeHMsIEpTT04uc3RyaW5naWZ5KGQpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh4cy5pZnJhbWUgIT09IG51bGwpIHtcbiAgICAgICAgICBjYWNoZUJ1c3QgKz0gMTtcbiAgICAgICAgICBkWzBdID0gKyhuZXcgRGF0ZSkgKyBjYWNoZUJ1c3Q7XG4gICAgICAgICAgeHMuaGFzaCA9ICcjJyArIEpTT04uc3RyaW5naWZ5KGQpO1xuICAgICAgICAgIGlmICh4cy5pZnJhbWUuc3JjKSB7XG4gICAgICAgICAgICB4cy5pZnJhbWUuc3JjID0gXCJcIiArIHByb3h5UGFnZSArIHhzLmhhc2g7XG4gICAgICAgICAgfSBlbHNlIGlmICgoeHMuaWZyYW1lLmNvbnRlbnRXaW5kb3cgIT0gbnVsbCkgJiYgKHhzLmlmcmFtZS5jb250ZW50V2luZG93LmxvY2F0aW9uICE9IG51bGwpKSB7XG4gICAgICAgICAgICB4cy5pZnJhbWUuY29udGVudFdpbmRvdy5sb2NhdGlvbiA9IFwiXCIgKyBwcm94eVBhZ2UgKyB4cy5oYXNoO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4cy5pZnJhbWUuc2V0QXR0cmlidXRlKCdzcmMnLCBcIlwiICsgcHJveHlQYWdlICsgeHMuaGFzaCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZWxmLnRoZW4gPSBmdW5jdGlvbihmbiwgZm5FcnIpIHtcbiAgICAgICAgaWYgKGZuRXJyKSB7XG4gICAgICAgICAgc2VsZi5teWVycm9yYmFja3MucHVzaChmbkVycik7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5teWNhbGxiYWNrcy5wdXNoKGZuKTtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcblxuICAgIG15ZGVmZXJyZWQucHJvdG90eXBlLm15cmVzb2x2ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBpLCBrLCBsZW4sIHJlZiwgc2VsZiwgdjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgcmVmID0gc2VsZi5teWNhbGxiYWNrcyB8fCBbXTtcbiAgICAgIGZvciAoayA9IGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBrID0gKytpKSB7XG4gICAgICAgIHYgPSByZWZba107XG4gICAgICAgIHYoZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuXG4gICAgbXlkZWZlcnJlZC5wcm90b3R5cGUubXlyZWplY3QgPSBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgc2VsZjtcbiAgICAgIHJldHVybiBzZWxmID0gdGhpcztcbiAgICB9O1xuXG4gICAgcmVmID0gc2VsZi5teWVycm9yYmFja3MgfHwgW107XG4gICAgZm9yIChrID0gaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGsgPSArK2kpIHtcbiAgICAgIHYgPSByZWZba107XG4gICAgICB2KGRhdGEpO1xuICAgIH1cblxuICAgIHNlbGY7XG5cbiAgICByZXR1cm4gbXlkZWZlcnJlZDtcblxuICB9KSgpO1xuICBteXByb3h5ID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIG15cHJveHkoKSB7fVxuXG4gICAgbXlwcm94eS5wcm90b3R5cGUuZGVsYXkgPSAzMzM7XG5cbiAgICBteXByb3h5LnByb3RvdHlwZS5oYXNoID0gd2luLmxvY2F0aW9uLmhhc2g7XG5cbiAgICBteXByb3h5LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKHVzZVBvc3RNZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBvbk1lc3NhZ2Uoc2VsZi5oYW5kbGVQcm94eU1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNldEludGVydmFsKChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgbmV3aGFzaDtcbiAgICAgICAgICBuZXdoYXNoID0gd2luLmxvY2F0aW9uLmhhc2g7XG4gICAgICAgICAgaWYgKG5ld2hhc2ggIT09IHhzLmhhc2gpIHtcbiAgICAgICAgICAgIHhzLmhhc2ggPSBuZXdoYXNoO1xuICAgICAgICAgICAgc2VsZi5oYW5kbGVQcm94eU1lc3NhZ2Uoe1xuICAgICAgICAgICAgICBkYXRhOiBKU09OLnBhcnNlKG5ld2hhc2guc3Vic3RyKDEpKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSwgc2VsZi5kZWxheSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG15cHJveHkucHJvdG90eXBlLmhhbmRsZVByb3h5TWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBkLCBoYXNoLCBpZCwga2V5LCBtZXRob2QsIG15Q2FjaGVCdXN0LCBteXN0b3JlLCBzZWxmO1xuICAgICAgZCA9IGUuZGF0YTtcbiAgICAgIGlmICh0eXBlb2YgZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBpZiAoL154c3RvcmUtLy50ZXN0KGQpKSB7XG4gICAgICAgICAgZCA9IGQuc3BsaXQoXCIsXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkID0gSlNPTi5wYXJzZShkKTtcbiAgICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghKGQgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWQgPSBkWzFdO1xuICAgICAgaWYgKCEvXnhzdG9yZS0vLnRlc3QoaWQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAga2V5ID0gZFszXSB8fCAneHN0b3JlJztcbiAgICAgIG1ldGhvZCA9IGRbMl07XG4gICAgICBjYWNoZUJ1c3QgPSAwO1xuICAgICAgbXlzdG9yZSA9IHN0b3JlO1xuICAgICAgaWYgKCFzdG9yZS5lbmFibGVkKSB7XG4gICAgICAgIG15c3RvcmUgPSB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICByZXR1cm4gY29va2llKGtleSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgICAgICAgIHJldHVybiBjb29raWUoaywgdiwge1xuICAgICAgICAgICAgICBtYXhhZ2U6IG1heFN0b3JlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlbW92ZTogZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZShrLCBudWxsKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjb29raWVzLCBpLCBpZHgsIGssIGxlbiwgbmFtZSwgcmVzdWx0cywgdjtcbiAgICAgICAgICAgIGNvb2tpZXMgPSBkb2MuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgICBmb3IgKGsgPSBpID0gMCwgbGVuID0gY29va2llcy5sZW5ndGg7IGkgPCBsZW47IGsgPSArK2kpIHtcbiAgICAgICAgICAgICAgdiA9IGNvb2tpZXNba107XG4gICAgICAgICAgICAgIGlkeCA9IHYuaW5kZXhPZignPScpO1xuICAgICAgICAgICAgICBuYW1lID0gaWR4ID4gLTEgPyB2LnN1YnN0cigwLCBpZHgpIDogdjtcbiAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGRvYy5jb29raWUgPSBuYW1lICsgJz07ZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKG1ldGhvZCA9PT0gJ2dldCcpIHtcbiAgICAgICAgZFs0XSA9IG15c3RvcmUuZ2V0KGtleSk7XG4gICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ3NldCcpIHtcbiAgICAgICAgbXlzdG9yZS5zZXQoa2V5LCBkWzRdKTtcbiAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSAncmVtb3ZlJykge1xuICAgICAgICBteXN0b3JlLnJlbW92ZShrZXkpO1xuICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdjbGVhcicpIHtcbiAgICAgICAgbXlzdG9yZS5jbGVhcigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZFsyXSA9ICdlcnJvci0nICsgbWV0aG9kO1xuICAgICAgfVxuICAgICAgZFsxXSA9IGlkLnJlcGxhY2UoJ3hzdG9yZS0nLCAneHN0b3JlcHJveHktJyk7XG4gICAgICBpZiAodXNlUG9zdE1lc3NhZ2UpIHtcbiAgICAgICAgZS5zb3VyY2UucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoZCksICcqJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWNoZUJ1c3QgKz0gMTtcbiAgICAgICAgbXlDYWNoZUJ1c3QgPSArKG5ldyBEYXRlKSArIGNhY2hlQnVzdDtcbiAgICAgICAgZFswXSA9IG15Q2FjaGVCdXN0O1xuICAgICAgICBoYXNoID0gJyMnICsgSlNPTi5zdHJpbmdpZnkoZCk7XG4gICAgICAgIHdpbi5sb2NhdGlvbiA9IHdpbi5sb2NhdGlvbi5ocmVmLnJlcGxhY2Uod2luLmxvY2F0aW9uLmhhc2gsICcnKSArIGhhc2g7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBteXByb3h5O1xuXG4gIH0pKCk7XG4gIHJhbmRvbUhhc2ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmg7XG4gICAgcmggPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMik7XG4gICAgcmV0dXJuIFwieHN0b3JlLVwiICsgcmg7XG4gIH07XG5cbiAgLyoqXG4gICAqIHhzdG9yZSBjbGFzc1xuICAjXG4gICAqL1xuICB4c3RvcmUgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24geHN0b3JlKCkge31cblxuICAgIHhzdG9yZS5wcm90b3R5cGUuaGFzSW5pdCA9IGZhbHNlO1xuXG4gICAgeHN0b3JlLnByb3RvdHlwZS5kZWJ1ZyA9IGRlYnVnO1xuXG4gICAgeHN0b3JlLnByb3RvdHlwZS5wcm94eVBhZ2UgPSAnLy9uaWlrbm93LmdpdGh1Yi5pby94c3RvcmUveHN0b3JlLmh0bWwnO1xuXG4gICAgeHN0b3JlLnByb3RvdHlwZS5pZnJhbWUgPSBudWxsO1xuXG4gICAgeHN0b3JlLnByb3RvdHlwZS5wcm94eVdpbiA9IG51bGw7XG5cbiAgICB4c3RvcmUucHJvdG90eXBlLmhhc2ggPSBudWxsO1xuXG4gICAgeHN0b3JlLnByb3RvdHlwZS50ZW1wU3RvcmUgPSB7fTtcblxuICAgIHhzdG9yZS5wcm90b3R5cGUuZG9iID0ge307XG5cbiAgICB4c3RvcmUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGspIHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgaWYgKGRudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRoZW46IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4oc2VsZi50ZW1wU3RvcmVba10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAobmV3IG15ZGVmZXJyZWQoKSkucSh0aGlzLCAnZ2V0Jywge1xuICAgICAgICAnayc6IGtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB4c3RvcmUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgaWYgKGRudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRoZW46IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgICBzZWxmLnRlbXBTdG9yZVtrXSA9IHY7XG4gICAgICAgICAgICByZXR1cm4gZm4oc2VsZi50ZW1wU3RvcmVba10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAobmV3IG15ZGVmZXJyZWQoKSkucSh0aGlzLCAnc2V0Jywge1xuICAgICAgICAnayc6IGssXG4gICAgICAgICd2JzogdlxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHhzdG9yZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaykge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgICBpZiAoZG50KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdGhlbjogZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgIGRlbGV0ZSBzZWxmLnRlbXBTdG9yZVtrXTtcbiAgICAgICAgICAgIHJldHVybiBmbjtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gKG5ldyBteWRlZmVycmVkKCkpLnEodGhpcywgJ3JlbW92ZScsIHtcbiAgICAgICAgJ2snOiBrXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgeHN0b3JlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgICBpZiAoZG50KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdGhlbjogZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgIHNlbGYudGVtcFN0b3JlID0ge307XG4gICAgICAgICAgICByZXR1cm4gZm47XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIChuZXcgbXlkZWZlcnJlZCgpKS5xKHRoaXMsICdjbGVhcicpO1xuICAgIH07XG5cbiAgICB4c3RvcmUucHJvdG90eXBlLmRvUG9zdE1lc3NhZ2UgPSBmdW5jdGlvbih4cywgbXNnKSB7XG4gICAgICBpZiAoKHhzLnByb3h5V2luICE9IG51bGwpKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwocSk7XG4gICAgICAgIHhzLnByb3h5V2luLnBvc3RNZXNzYWdlKG1zZywgJyonKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBteXEucHVzaChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHhzLmRvUG9zdE1lc3NhZ2UoeHMsIG1zZyk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgeHN0b3JlLnByb3RvdHlwZS5oYW5kbGVNZXNzYWdlRXZlbnQgPSBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgZCwgZGksIGlkLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBkID0gZS5kYXRhO1xuICAgICAgaWYgKHR5cGVvZiBkID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGlmICgvXnhzdG9yZXByb3h5LS8udGVzdChkKSkge1xuICAgICAgICAgIGQgPSBkLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZCA9IEpTT04ucGFyc2UoZCk7XG4gICAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIShkIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlkID0gZFsxXTtcbiAgICAgIGlmICghL154c3RvcmVwcm94eS0vLnRlc3QoaWQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlkID0gaWQucmVwbGFjZSgneHN0b3JlcHJveHktJywgJ3hzdG9yZS0nKTtcbiAgICAgIGRpID0gc2VsZi5kb2JbaWRdO1xuICAgICAgaWYgKGRpKSB7XG4gICAgICAgIGlmICgvXmVycm9yLS8udGVzdChkWzJdKSkge1xuICAgICAgICAgIGRpLm15cmVqZWN0KGRbMl0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpLm15cmVzb2x2ZShkWzRdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZi5kb2JbaWRdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgeHN0b3JlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIGlmcmFtZSwgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKHNlbGYuaGFzSW5pdCkge1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cbiAgICAgIHNlbGYuaGFzSW5pdCA9IHRydWU7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIGlmIChvcHRpb25zLmlzUHJveHkpIHtcbiAgICAgICAgbG9nKCdpbml0IHByb3h5Jyk7XG4gICAgICAgIChuZXcgbXlwcm94eSgpKS5pbml0KCk7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuICAgICAgc2VsZi5wcm94eVBhZ2UgPSBvcHRpb25zLnVybCB8fCBzZWxmLnByb3h5UGFnZTtcbiAgICAgIGlmIChvcHRpb25zLmRudElnbm9yZSB8fCB0eXBlb2YgZG50ID09PSAndW5kZWZpbmVkJyB8fCBkbnQgPT09ICd1bnNwZWNpZmllZCcgfHwgZG50ID09PSAnbm8nIHx8IGRudCA9PT0gJzAnKSB7XG4gICAgICAgIGxvZyhcImRpc2FibGUgZG50XCIpO1xuICAgICAgICBkbnQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGxvZyhcImluaXQgc3RvcmVhZ2UgZG50ID0gXCIgKyBkbnQpO1xuICAgICAgcmV0dXJuIGlmcmFtZSA9IGxvYWQoc2VsZi5wcm94eVBhZ2UsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2coJ2lmcmFtZSBsb2FkZWQnKTtcbiAgICAgICAgc2VsZi5wcm94eVdpbiA9IGlmcmFtZS5jb250ZW50V2luZG93O1xuICAgICAgICBpZiAoIXVzZVBvc3RNZXNzYWdlKSB7XG4gICAgICAgICAgc2VsZi5oYXNoID0gcHJveHlXaW4ubG9jYXRpb24uaGFzaDtcbiAgICAgICAgICByZXR1cm4gc2V0SW50ZXJ2YWwoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHByb3h5V2luLmxvY2F0aW9uLmhhc2ggIT09IGhhc2gpIHtcbiAgICAgICAgICAgICAgc2VsZi5oYXNoID0gcHJveHlXaW4ubG9jYXRpb24uaGFzaDtcbiAgICAgICAgICAgICAgc2VsZi5oYW5kbGVNZXNzYWdlRXZlbnQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbjogcHJveHlEb21haW4sXG4gICAgICAgICAgICAgICAgZGF0YTogc2VsZi5oYXNoLnN1YnN0cigxKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSwgZGVsYXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvbk1lc3NhZ2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5oYW5kbGVNZXNzYWdlRXZlbnQoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB4c3RvcmU7XG5cbiAgfSkoKTtcbiAgcmV0dXJuIG1vZHVsZS5leHBvcnRzID0geHN0b3JlO1xufSkod2luZG93KTtcbiIsIlxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBvbmxvYWQgPSByZXF1aXJlKCdzY3JpcHQtb25sb2FkJyk7XG52YXIgdGljayA9IHJlcXVpcmUoJ25leHQtdGljaycpO1xudmFyIHR5cGUgPSByZXF1aXJlKCd0eXBlJyk7XG5cbi8qKlxuICogRXhwb3NlIGBsb2FkU2NyaXB0YC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsb2FkSWZyYW1lKG9wdGlvbnMsIGZuKXtcbiAgaWYgKCFvcHRpb25zKSB0aHJvdyBuZXcgRXJyb3IoJ0NhbnQgbG9hZCBub3RoaW5nLi4uJyk7XG5cbiAgLy8gQWxsb3cgZm9yIHRoZSBzaW1wbGVzdCBjYXNlLCBqdXN0IHBhc3NpbmcgYSBgc3JjYCBzdHJpbmcuXG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlKG9wdGlvbnMpKSBvcHRpb25zID0geyBzcmMgOiBvcHRpb25zIH07XG5cbiAgdmFyIGh0dHBzID0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwczonIHx8XG4gICAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonO1xuXG4gIC8vIElmIHlvdSB1c2UgcHJvdG9jb2wgcmVsYXRpdmUgVVJMcywgdGhpcmQtcGFydHkgc2NyaXB0cyBsaWtlIEdvb2dsZVxuICAvLyBBbmFseXRpY3MgYnJlYWsgd2hlbiB0ZXN0aW5nIHdpdGggYGZpbGU6YCBzbyB0aGlzIGZpeGVzIHRoYXQuXG4gIGlmIChvcHRpb25zLnNyYyAmJiBvcHRpb25zLnNyYy5pbmRleE9mKCcvLycpID09PSAwKSB7XG4gICAgb3B0aW9ucy5zcmMgPSBodHRwcyA/ICdodHRwczonICsgb3B0aW9ucy5zcmMgOiAnaHR0cDonICsgb3B0aW9ucy5zcmM7XG4gIH1cblxuICAvLyBBbGxvdyB0aGVtIHRvIHBhc3MgaW4gZGlmZmVyZW50IFVSTHMgZGVwZW5kaW5nIG9uIHRoZSBwcm90b2NvbC5cbiAgaWYgKGh0dHBzICYmIG9wdGlvbnMuaHR0cHMpIG9wdGlvbnMuc3JjID0gb3B0aW9ucy5odHRwcztcbiAgZWxzZSBpZiAoIWh0dHBzICYmIG9wdGlvbnMuaHR0cCkgb3B0aW9ucy5zcmMgPSBvcHRpb25zLmh0dHA7XG5cbiAgLy8gTWFrZSB0aGUgYDxpZnJhbWU+YCBlbGVtZW50IGFuZCBpbnNlcnQgaXQgYmVmb3JlIHRoZSBmaXJzdCBpZnJhbWUgb24gdGhlXG4gIC8vIHBhZ2UsIHdoaWNoIGlzIGd1YXJhbnRlZWQgdG8gZXhpc3Qgc2luY2UgdGhpcyBKYXZhaWZyYW1lIGlzIHJ1bm5pbmcuXG4gIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgaWZyYW1lLnNyYyA9IG9wdGlvbnMuc3JjO1xuICBpZnJhbWUud2lkdGggPSBvcHRpb25zLndpZHRoIHx8IDE7XG4gIGlmcmFtZS5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCAxO1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAvLyBJZiB3ZSBoYXZlIGEgZm4sIGF0dGFjaCBldmVudCBoYW5kbGVycywgZXZlbiBpbiBJRS4gQmFzZWQgb2ZmIG9mXG4gIC8vIHRoZSBUaGlyZC1QYXJ0eSBKYXZhc2NyaXB0IHNjcmlwdCBsb2FkaW5nIGV4YW1wbGU6XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90aGlyZHBhcnR5anMvdGhpcmRwYXJ0eWpzLWNvZGUvYmxvYi9tYXN0ZXIvZXhhbXBsZXMvdGVtcGxhdGVzLzAyL2xvYWRpbmctZmlsZXMvaW5kZXguaHRtbFxuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlKGZuKSkge1xuICAgIG9ubG9hZChpZnJhbWUsIGZuKTtcbiAgfVxuXG4gIHRpY2soZnVuY3Rpb24oKXtcbiAgICAvLyBBcHBlbmQgYWZ0ZXIgZXZlbnQgbGlzdGVuZXJzIGFyZSBhdHRhY2hlZCBmb3IgSUUuXG4gICAgdmFyIGZpcnN0U2NyaXB0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgIGZpcnN0U2NyaXB0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGlmcmFtZSwgZmlyc3RTY3JpcHQpO1xuICB9KTtcblxuICAvLyBSZXR1cm4gdGhlIGlmcmFtZSBlbGVtZW50IGluIGNhc2UgdGhleSB3YW50IHRvIGRvIGFueXRoaW5nIHNwZWNpYWwsIGxpa2VcbiAgLy8gZ2l2ZSBpdCBhbiBJRCBvciBhdHRyaWJ1dGVzLlxuICByZXR1cm4gaWZyYW1lO1xufTsiLCJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90aGlyZHBhcnR5anMvdGhpcmRwYXJ0eWpzLWNvZGUvYmxvYi9tYXN0ZXIvZXhhbXBsZXMvdGVtcGxhdGVzLzAyL2xvYWRpbmctZmlsZXMvaW5kZXguaHRtbFxuXG4vKipcbiAqIEludm9rZSBgZm4oZXJyKWAgd2hlbiB0aGUgZ2l2ZW4gYGVsYCBzY3JpcHQgbG9hZHMuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbCwgZm4pe1xuICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lclxuICAgID8gYWRkKGVsLCBmbilcbiAgICA6IGF0dGFjaChlbCwgZm4pO1xufTtcblxuLyoqXG4gKiBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gYGVsYCwgYGZuKClgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBhZGQoZWwsIGZuKXtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKF8sIGUpeyBmbihudWxsLCBlKTsgfSwgZmFsc2UpO1xuICBlbC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ3NjcmlwdCBlcnJvciBcIicgKyBlbC5zcmMgKyAnXCInKTtcbiAgICBlcnIuZXZlbnQgPSBlO1xuICAgIGZuKGVycik7XG4gIH0sIGZhbHNlKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggZXZuZXQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGF0dGFjaChlbCwgZm4pe1xuICBlbC5hdHRhY2hFdmVudCgnb25yZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24oZSl7XG4gICAgaWYgKCEvY29tcGxldGV8bG9hZGVkLy50ZXN0KGVsLnJlYWR5U3RhdGUpKSByZXR1cm47XG4gICAgZm4obnVsbCwgZSk7XG4gIH0pO1xuICBlbC5hdHRhY2hFdmVudCgnb25lcnJvcicsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ2ZhaWxlZCB0byBsb2FkIHRoZSBzY3JpcHQgXCInICsgZWwuc3JjICsgJ1wiJyk7XG4gICAgZXJyLmV2ZW50ID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgZm4oZXJyKTtcbiAgfSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG5pZiAodHlwZW9mIHNldEltbWVkaWF0ZSA9PSAnZnVuY3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZil7IHNldEltbWVkaWF0ZShmKSB9XG59XG4vLyBsZWdhY3kgbm9kZS5qc1xuZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MubmV4dFRpY2sgPT0gJ2Z1bmN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHByb2Nlc3MubmV4dFRpY2tcbn1cbi8vIGZhbGxiYWNrIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLyBwb3N0TWVzc2FnZSBiZWhhdmVzIGJhZGx5IG9uIElFOFxuZWxzZSBpZiAodHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCB3aW5kb3cuQWN0aXZlWE9iamVjdCB8fCAhd2luZG93LnBvc3RNZXNzYWdlKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZil7IHNldFRpbWVvdXQoZikgfTtcbn0gZWxzZSB7XG4gIHZhciBxID0gW107XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbigpe1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHEubGVuZ3RoKSB7XG4gICAgICB0cnkgeyBxW2krK10oKTsgfVxuICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcSA9IHEuc2xpY2UoaSk7XG4gICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgndGljIScsICcqJyk7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICAgIHEubGVuZ3RoID0gMDtcbiAgfSwgdHJ1ZSk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbil7XG4gICAgaWYgKCFxLmxlbmd0aCkgd2luZG93LnBvc3RNZXNzYWdlKCd0aWMhJywgJyonKTtcbiAgICBxLnB1c2goZm4pO1xuICB9XG59XG4iLCIvKipcbiAqIHRvU3RyaW5nIHJlZi5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBvZiBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xuICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwodmFsKSkge1xuICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOiByZXR1cm4gJ2RhdGUnO1xuICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6IHJldHVybiAncmVnZXhwJztcbiAgICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOiByZXR1cm4gJ2FyZ3VtZW50cyc7XG4gICAgY2FzZSAnW29iamVjdCBBcnJheV0nOiByZXR1cm4gJ2FycmF5JztcbiAgICBjYXNlICdbb2JqZWN0IEVycm9yXSc6IHJldHVybiAnZXJyb3InO1xuICB9XG5cbiAgaWYgKHZhbCA9PT0gbnVsbCkgcmV0dXJuICdudWxsJztcbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICh2YWwgIT09IHZhbCkgcmV0dXJuICduYW4nO1xuICBpZiAodmFsICYmIHZhbC5ub2RlVHlwZSA9PT0gMSkgcmV0dXJuICdlbGVtZW50JztcblxuICB2YWwgPSB2YWwudmFsdWVPZlxuICAgID8gdmFsLnZhbHVlT2YoKVxuICAgIDogT2JqZWN0LnByb3RvdHlwZS52YWx1ZU9mLmFwcGx5KHZhbClcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07XG4iLCI7KGZ1bmN0aW9uKHdpbil7XG5cdHZhciBzdG9yZSA9IHt9LFxuXHRcdGRvYyA9IHdpbi5kb2N1bWVudCxcblx0XHRsb2NhbFN0b3JhZ2VOYW1lID0gJ2xvY2FsU3RvcmFnZScsXG5cdFx0c2NyaXB0VGFnID0gJ3NjcmlwdCcsXG5cdFx0c3RvcmFnZVxuXG5cdHN0b3JlLmRpc2FibGVkID0gZmFsc2Vcblx0c3RvcmUudmVyc2lvbiA9ICcxLjMuMTcnXG5cdHN0b3JlLnNldCA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHt9XG5cdHN0b3JlLmdldCA9IGZ1bmN0aW9uKGtleSwgZGVmYXVsdFZhbCkge31cblx0c3RvcmUuaGFzID0gZnVuY3Rpb24oa2V5KSB7IHJldHVybiBzdG9yZS5nZXQoa2V5KSAhPT0gdW5kZWZpbmVkIH1cblx0c3RvcmUucmVtb3ZlID0gZnVuY3Rpb24oa2V5KSB7fVxuXHRzdG9yZS5jbGVhciA9IGZ1bmN0aW9uKCkge31cblx0c3RvcmUudHJhbnNhY3QgPSBmdW5jdGlvbihrZXksIGRlZmF1bHRWYWwsIHRyYW5zYWN0aW9uRm4pIHtcblx0XHRpZiAodHJhbnNhY3Rpb25GbiA9PSBudWxsKSB7XG5cdFx0XHR0cmFuc2FjdGlvbkZuID0gZGVmYXVsdFZhbFxuXHRcdFx0ZGVmYXVsdFZhbCA9IG51bGxcblx0XHR9XG5cdFx0aWYgKGRlZmF1bHRWYWwgPT0gbnVsbCkge1xuXHRcdFx0ZGVmYXVsdFZhbCA9IHt9XG5cdFx0fVxuXHRcdHZhciB2YWwgPSBzdG9yZS5nZXQoa2V5LCBkZWZhdWx0VmFsKVxuXHRcdHRyYW5zYWN0aW9uRm4odmFsKVxuXHRcdHN0b3JlLnNldChrZXksIHZhbClcblx0fVxuXHRzdG9yZS5nZXRBbGwgPSBmdW5jdGlvbigpIHt9XG5cdHN0b3JlLmZvckVhY2ggPSBmdW5jdGlvbigpIHt9XG5cblx0c3RvcmUuc2VyaWFsaXplID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpXG5cdH1cblx0c3RvcmUuZGVzZXJpYWxpemUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHsgcmV0dXJuIHVuZGVmaW5lZCB9XG5cdFx0dHJ5IHsgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpIH1cblx0XHRjYXRjaChlKSB7IHJldHVybiB2YWx1ZSB8fCB1bmRlZmluZWQgfVxuXHR9XG5cblx0Ly8gRnVuY3Rpb25zIHRvIGVuY2Fwc3VsYXRlIHF1ZXN0aW9uYWJsZSBGaXJlRm94IDMuNi4xMyBiZWhhdmlvclxuXHQvLyB3aGVuIGFib3V0LmNvbmZpZzo6ZG9tLnN0b3JhZ2UuZW5hYmxlZCA9PT0gZmFsc2Vcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjdXN3ZXN0aW4vc3RvcmUuanMvaXNzdWVzI2lzc3VlLzEzXG5cdGZ1bmN0aW9uIGlzTG9jYWxTdG9yYWdlTmFtZVN1cHBvcnRlZCgpIHtcblx0XHR0cnkgeyByZXR1cm4gKGxvY2FsU3RvcmFnZU5hbWUgaW4gd2luICYmIHdpbltsb2NhbFN0b3JhZ2VOYW1lXSkgfVxuXHRcdGNhdGNoKGVycikgeyByZXR1cm4gZmFsc2UgfVxuXHR9XG5cblx0aWYgKGlzTG9jYWxTdG9yYWdlTmFtZVN1cHBvcnRlZCgpKSB7XG5cdFx0c3RvcmFnZSA9IHdpbltsb2NhbFN0b3JhZ2VOYW1lXVxuXHRcdHN0b3JlLnNldCA9IGZ1bmN0aW9uKGtleSwgdmFsKSB7XG5cdFx0XHRpZiAodmFsID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHN0b3JlLnJlbW92ZShrZXkpIH1cblx0XHRcdHN0b3JhZ2Uuc2V0SXRlbShrZXksIHN0b3JlLnNlcmlhbGl6ZSh2YWwpKVxuXHRcdFx0cmV0dXJuIHZhbFxuXHRcdH1cblx0XHRzdG9yZS5nZXQgPSBmdW5jdGlvbihrZXksIGRlZmF1bHRWYWwpIHtcblx0XHRcdHZhciB2YWwgPSBzdG9yZS5kZXNlcmlhbGl6ZShzdG9yYWdlLmdldEl0ZW0oa2V5KSlcblx0XHRcdHJldHVybiAodmFsID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsIDogdmFsKVxuXHRcdH1cblx0XHRzdG9yZS5yZW1vdmUgPSBmdW5jdGlvbihrZXkpIHsgc3RvcmFnZS5yZW1vdmVJdGVtKGtleSkgfVxuXHRcdHN0b3JlLmNsZWFyID0gZnVuY3Rpb24oKSB7IHN0b3JhZ2UuY2xlYXIoKSB9XG5cdFx0c3RvcmUuZ2V0QWxsID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcmV0ID0ge31cblx0XHRcdHN0b3JlLmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWwpIHtcblx0XHRcdFx0cmV0W2tleV0gPSB2YWxcblx0XHRcdH0pXG5cdFx0XHRyZXR1cm4gcmV0XG5cdFx0fVxuXHRcdHN0b3JlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0Zm9yICh2YXIgaT0wOyBpPHN0b3JhZ2UubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIGtleSA9IHN0b3JhZ2Uua2V5KGkpXG5cdFx0XHRcdGNhbGxiYWNrKGtleSwgc3RvcmUuZ2V0KGtleSkpXG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgaWYgKGRvYy5kb2N1bWVudEVsZW1lbnQuYWRkQmVoYXZpb3IpIHtcblx0XHR2YXIgc3RvcmFnZU93bmVyLFxuXHRcdFx0c3RvcmFnZUNvbnRhaW5lclxuXHRcdC8vIFNpbmNlICN1c2VyRGF0YSBzdG9yYWdlIGFwcGxpZXMgb25seSB0byBzcGVjaWZpYyBwYXRocywgd2UgbmVlZCB0b1xuXHRcdC8vIHNvbWVob3cgbGluayBvdXIgZGF0YSB0byBhIHNwZWNpZmljIHBhdGguICBXZSBjaG9vc2UgL2Zhdmljb24uaWNvXG5cdFx0Ly8gYXMgYSBwcmV0dHkgc2FmZSBvcHRpb24sIHNpbmNlIGFsbCBicm93c2VycyBhbHJlYWR5IG1ha2UgYSByZXF1ZXN0IHRvXG5cdFx0Ly8gdGhpcyBVUkwgYW55d2F5IGFuZCBiZWluZyBhIDQwNCB3aWxsIG5vdCBodXJ0IHVzIGhlcmUuICBXZSB3cmFwIGFuXG5cdFx0Ly8gaWZyYW1lIHBvaW50aW5nIHRvIHRoZSBmYXZpY29uIGluIGFuIEFjdGl2ZVhPYmplY3QoaHRtbGZpbGUpIG9iamVjdFxuXHRcdC8vIChzZWU6IGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9hYTc1MjU3NCh2PVZTLjg1KS5hc3B4KVxuXHRcdC8vIHNpbmNlIHRoZSBpZnJhbWUgYWNjZXNzIHJ1bGVzIGFwcGVhciB0byBhbGxvdyBkaXJlY3QgYWNjZXNzIGFuZFxuXHRcdC8vIG1hbmlwdWxhdGlvbiBvZiB0aGUgZG9jdW1lbnQgZWxlbWVudCwgZXZlbiBmb3IgYSA0MDQgcGFnZS4gIFRoaXNcblx0XHQvLyBkb2N1bWVudCBjYW4gYmUgdXNlZCBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IGRvY3VtZW50ICh3aGljaCB3b3VsZFxuXHRcdC8vIGhhdmUgYmVlbiBsaW1pdGVkIHRvIHRoZSBjdXJyZW50IHBhdGgpIHRvIHBlcmZvcm0gI3VzZXJEYXRhIHN0b3JhZ2UuXG5cdFx0dHJ5IHtcblx0XHRcdHN0b3JhZ2VDb250YWluZXIgPSBuZXcgQWN0aXZlWE9iamVjdCgnaHRtbGZpbGUnKVxuXHRcdFx0c3RvcmFnZUNvbnRhaW5lci5vcGVuKClcblx0XHRcdHN0b3JhZ2VDb250YWluZXIud3JpdGUoJzwnK3NjcmlwdFRhZysnPmRvY3VtZW50Lnc9d2luZG93PC8nK3NjcmlwdFRhZysnPjxpZnJhbWUgc3JjPVwiL2Zhdmljb24uaWNvXCI+PC9pZnJhbWU+Jylcblx0XHRcdHN0b3JhZ2VDb250YWluZXIuY2xvc2UoKVxuXHRcdFx0c3RvcmFnZU93bmVyID0gc3RvcmFnZUNvbnRhaW5lci53LmZyYW1lc1swXS5kb2N1bWVudFxuXHRcdFx0c3RvcmFnZSA9IHN0b3JhZ2VPd25lci5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0Ly8gc29tZWhvdyBBY3RpdmVYT2JqZWN0IGluc3RhbnRpYXRpb24gZmFpbGVkIChwZXJoYXBzIHNvbWUgc3BlY2lhbFxuXHRcdFx0Ly8gc2VjdXJpdHkgc2V0dGluZ3Mgb3Igb3RoZXJ3c2UpLCBmYWxsIGJhY2sgdG8gcGVyLXBhdGggc3RvcmFnZVxuXHRcdFx0c3RvcmFnZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0c3RvcmFnZU93bmVyID0gZG9jLmJvZHlcblx0XHR9XG5cdFx0dmFyIHdpdGhJRVN0b3JhZ2UgPSBmdW5jdGlvbihzdG9yZUZ1bmN0aW9uKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxuXHRcdFx0XHRhcmdzLnVuc2hpZnQoc3RvcmFnZSlcblx0XHRcdFx0Ly8gU2VlIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzMTA4MSh2PVZTLjg1KS5hc3B4XG5cdFx0XHRcdC8vIGFuZCBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1MzE0MjQodj1WUy44NSkuYXNweFxuXHRcdFx0XHRzdG9yYWdlT3duZXIuYXBwZW5kQ2hpbGQoc3RvcmFnZSlcblx0XHRcdFx0c3RvcmFnZS5hZGRCZWhhdmlvcignI2RlZmF1bHQjdXNlckRhdGEnKVxuXHRcdFx0XHRzdG9yYWdlLmxvYWQobG9jYWxTdG9yYWdlTmFtZSlcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHN0b3JlRnVuY3Rpb24uYXBwbHkoc3RvcmUsIGFyZ3MpXG5cdFx0XHRcdHN0b3JhZ2VPd25lci5yZW1vdmVDaGlsZChzdG9yYWdlKVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSW4gSUU3LCBrZXlzIGNhbm5vdCBzdGFydCB3aXRoIGEgZGlnaXQgb3IgY29udGFpbiBjZXJ0YWluIGNoYXJzLlxuXHRcdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFyY3Vzd2VzdGluL3N0b3JlLmpzL2lzc3Vlcy80MFxuXHRcdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFyY3Vzd2VzdGluL3N0b3JlLmpzL2lzc3Vlcy84M1xuXHRcdHZhciBmb3JiaWRkZW5DaGFyc1JlZ2V4ID0gbmV3IFJlZ0V4cChcIlshXFxcIiMkJSYnKCkqKywvXFxcXFxcXFw6Ozw9Pj9AW1xcXFxdXmB7fH1+XVwiLCBcImdcIilcblx0XHRmdW5jdGlvbiBpZUtleUZpeChrZXkpIHtcblx0XHRcdHJldHVybiBrZXkucmVwbGFjZSgvXmQvLCAnX19fJCYnKS5yZXBsYWNlKGZvcmJpZGRlbkNoYXJzUmVnZXgsICdfX18nKVxuXHRcdH1cblx0XHRzdG9yZS5zZXQgPSB3aXRoSUVTdG9yYWdlKGZ1bmN0aW9uKHN0b3JhZ2UsIGtleSwgdmFsKSB7XG5cdFx0XHRrZXkgPSBpZUtleUZpeChrZXkpXG5cdFx0XHRpZiAodmFsID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHN0b3JlLnJlbW92ZShrZXkpIH1cblx0XHRcdHN0b3JhZ2Uuc2V0QXR0cmlidXRlKGtleSwgc3RvcmUuc2VyaWFsaXplKHZhbCkpXG5cdFx0XHRzdG9yYWdlLnNhdmUobG9jYWxTdG9yYWdlTmFtZSlcblx0XHRcdHJldHVybiB2YWxcblx0XHR9KVxuXHRcdHN0b3JlLmdldCA9IHdpdGhJRVN0b3JhZ2UoZnVuY3Rpb24oc3RvcmFnZSwga2V5LCBkZWZhdWx0VmFsKSB7XG5cdFx0XHRrZXkgPSBpZUtleUZpeChrZXkpXG5cdFx0XHR2YXIgdmFsID0gc3RvcmUuZGVzZXJpYWxpemUoc3RvcmFnZS5nZXRBdHRyaWJ1dGUoa2V5KSlcblx0XHRcdHJldHVybiAodmFsID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsIDogdmFsKVxuXHRcdH0pXG5cdFx0c3RvcmUucmVtb3ZlID0gd2l0aElFU3RvcmFnZShmdW5jdGlvbihzdG9yYWdlLCBrZXkpIHtcblx0XHRcdGtleSA9IGllS2V5Rml4KGtleSlcblx0XHRcdHN0b3JhZ2UucmVtb3ZlQXR0cmlidXRlKGtleSlcblx0XHRcdHN0b3JhZ2Uuc2F2ZShsb2NhbFN0b3JhZ2VOYW1lKVxuXHRcdH0pXG5cdFx0c3RvcmUuY2xlYXIgPSB3aXRoSUVTdG9yYWdlKGZ1bmN0aW9uKHN0b3JhZ2UpIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gc3RvcmFnZS5YTUxEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXR0cmlidXRlc1xuXHRcdFx0c3RvcmFnZS5sb2FkKGxvY2FsU3RvcmFnZU5hbWUpXG5cdFx0XHRmb3IgKHZhciBpPTAsIGF0dHI7IGF0dHI9YXR0cmlidXRlc1tpXTsgaSsrKSB7XG5cdFx0XHRcdHN0b3JhZ2UucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSlcblx0XHRcdH1cblx0XHRcdHN0b3JhZ2Uuc2F2ZShsb2NhbFN0b3JhZ2VOYW1lKVxuXHRcdH0pXG5cdFx0c3RvcmUuZ2V0QWxsID0gZnVuY3Rpb24oc3RvcmFnZSkge1xuXHRcdFx0dmFyIHJldCA9IHt9XG5cdFx0XHRzdG9yZS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsKSB7XG5cdFx0XHRcdHJldFtrZXldID0gdmFsXG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIHJldFxuXHRcdH1cblx0XHRzdG9yZS5mb3JFYWNoID0gd2l0aElFU3RvcmFnZShmdW5jdGlvbihzdG9yYWdlLCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBzdG9yYWdlLlhNTERvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hdHRyaWJ1dGVzXG5cdFx0XHRmb3IgKHZhciBpPTAsIGF0dHI7IGF0dHI9YXR0cmlidXRlc1tpXTsgKytpKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGF0dHIubmFtZSwgc3RvcmUuZGVzZXJpYWxpemUoc3RvcmFnZS5nZXRBdHRyaWJ1dGUoYXR0ci5uYW1lKSkpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG5cdHRyeSB7XG5cdFx0dmFyIHRlc3RLZXkgPSAnX19zdG9yZWpzX18nXG5cdFx0c3RvcmUuc2V0KHRlc3RLZXksIHRlc3RLZXkpXG5cdFx0aWYgKHN0b3JlLmdldCh0ZXN0S2V5KSAhPSB0ZXN0S2V5KSB7IHN0b3JlLmRpc2FibGVkID0gdHJ1ZSB9XG5cdFx0c3RvcmUucmVtb3ZlKHRlc3RLZXkpXG5cdH0gY2F0Y2goZSkge1xuXHRcdHN0b3JlLmRpc2FibGVkID0gdHJ1ZVxuXHR9XG5cdHN0b3JlLmVuYWJsZWQgPSAhc3RvcmUuZGlzYWJsZWRcblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0aGlzLm1vZHVsZSAhPT0gbW9kdWxlKSB7IG1vZHVsZS5leHBvcnRzID0gc3RvcmUgfVxuXHRlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHsgZGVmaW5lKHN0b3JlKSB9XG5cdGVsc2UgeyB3aW4uc3RvcmUgPSBzdG9yZSB9XG5cbn0pKEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCkpO1xuIiwiXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnY29va2llJyk7XG5cbi8qKlxuICogU2V0IG9yIGdldCBjb29raWUgYG5hbWVgIHdpdGggYHZhbHVlYCBhbmQgYG9wdGlvbnNgIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIG9wdGlvbnMpe1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDM6XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIHNldChuYW1lLCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIGdldChuYW1lKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGFsbCgpO1xuICB9XG59O1xuXG4vKipcbiAqIFNldCBjb29raWUgYG5hbWVgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNldChuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHN0ciA9IGVuY29kZShuYW1lKSArICc9JyArIGVuY29kZSh2YWx1ZSk7XG5cbiAgaWYgKG51bGwgPT0gdmFsdWUpIG9wdGlvbnMubWF4YWdlID0gLTE7XG5cbiAgaWYgKG9wdGlvbnMubWF4YWdlKSB7XG4gICAgb3B0aW9ucy5leHBpcmVzID0gbmV3IERhdGUoK25ldyBEYXRlICsgb3B0aW9ucy5tYXhhZ2UpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMucGF0aCkgc3RyICs9ICc7IHBhdGg9JyArIG9wdGlvbnMucGF0aDtcbiAgaWYgKG9wdGlvbnMuZG9tYWluKSBzdHIgKz0gJzsgZG9tYWluPScgKyBvcHRpb25zLmRvbWFpbjtcbiAgaWYgKG9wdGlvbnMuZXhwaXJlcykgc3RyICs9ICc7IGV4cGlyZXM9JyArIG9wdGlvbnMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICBpZiAob3B0aW9ucy5zZWN1cmUpIHN0ciArPSAnOyBzZWN1cmUnO1xuXG4gIGRvY3VtZW50LmNvb2tpZSA9IHN0cjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYWxsIGNvb2tpZXMuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gYWxsKCkge1xuICByZXR1cm4gcGFyc2UoZG9jdW1lbnQuY29va2llKTtcbn1cblxuLyoqXG4gKiBHZXQgY29va2llIGBuYW1lYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZ2V0KG5hbWUpIHtcbiAgcmV0dXJuIGFsbCgpW25hbWVdO1xufVxuXG4vKipcbiAqIFBhcnNlIGNvb2tpZSBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShzdHIpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQoLyAqOyAqLyk7XG4gIHZhciBwYWlyO1xuICBpZiAoJycgPT0gcGFpcnNbMF0pIHJldHVybiBvYmo7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFpcnMubGVuZ3RoOyArK2kpIHtcbiAgICBwYWlyID0gcGFpcnNbaV0uc3BsaXQoJz0nKTtcbiAgICBvYmpbZGVjb2RlKHBhaXJbMF0pXSA9IGRlY29kZShwYWlyWzFdKTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIEVuY29kZS5cbiAqL1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsdWUpe1xuICB0cnkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZGVidWcoJ2Vycm9yIGBlbmNvZGUoJW8pYCAtICVvJywgdmFsdWUsIGUpXG4gIH1cbn1cblxuLyoqXG4gKiBEZWNvZGUuXG4gKi9cblxuZnVuY3Rpb24gZGVjb2RlKHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBkZWJ1ZygnZXJyb3IgYGRlY29kZSglbylgIC0gJW8nLCB2YWx1ZSwgZSlcbiAgfVxufVxuIiwiXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGluZGV4ID0gcmVxdWlyZSgnaW5kZXhvZicpO1xuXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgc2VsZi5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgZm4uX29mZiA9IG9uO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGkgPSBpbmRleChjYWxsYmFja3MsIGZuLl9vZmYgfHwgZm4pO1xuICBpZiAofmkpIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFyciwgb2JqKXtcbiAgaWYgKGFyci5pbmRleE9mKSByZXR1cm4gYXJyLmluZGV4T2Yob2JqKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoYXJyW2ldID09PSBvYmopIHJldHVybiBpO1xuICB9XG4gIHJldHVybiAtMTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1lcmdlIGRlZmF1bHQgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0XG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdHNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cbnZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uIChkZXN0LCBzcmMsIHJlY3Vyc2l2ZSkge1xuICBmb3IgKHZhciBwcm9wIGluIHNyYykge1xuICAgIGlmIChyZWN1cnNpdmUgJiYgZGVzdFtwcm9wXSBpbnN0YW5jZW9mIE9iamVjdCAmJiBzcmNbcHJvcF0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIGRlc3RbcHJvcF0gPSBkZWZhdWx0cyhkZXN0W3Byb3BdLCBzcmNbcHJvcF0sIHRydWUpO1xuICAgIH0gZWxzZSBpZiAoISAocHJvcCBpbiBkZXN0KSkge1xuICAgICAgZGVzdFtwcm9wXSA9IHNyY1twcm9wXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVzdDtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBkZWZhdWx0c2AuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgZW5jb2RlID0gZW5jb2RlVVJJQ29tcG9uZW50O1xudmFyIGRlY29kZSA9IGRlY29kZVVSSUNvbXBvbmVudDtcbnZhciB0cmltID0gcmVxdWlyZSgndHJpbScpO1xudmFyIHR5cGUgPSByZXF1aXJlKCd0eXBlJyk7XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIHF1ZXJ5IGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uKHN0cil7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2Ygc3RyKSByZXR1cm4ge307XG5cbiAgc3RyID0gdHJpbShzdHIpO1xuICBpZiAoJycgPT0gc3RyKSByZXR1cm4ge307XG4gIGlmICgnPycgPT0gc3RyLmNoYXJBdCgwKSkgc3RyID0gc3RyLnNsaWNlKDEpO1xuXG4gIHZhciBvYmogPSB7fTtcbiAgdmFyIHBhaXJzID0gc3RyLnNwbGl0KCcmJyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFpcnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGFydHMgPSBwYWlyc1tpXS5zcGxpdCgnPScpO1xuICAgIHZhciBrZXkgPSBkZWNvZGUocGFydHNbMF0pO1xuICAgIHZhciBtO1xuXG4gICAgaWYgKG0gPSAvKFxcdyspXFxbKFxcZCspXFxdLy5leGVjKGtleSkpIHtcbiAgICAgIG9ialttWzFdXSA9IG9ialttWzFdXSB8fCBbXTtcbiAgICAgIG9ialttWzFdXVttWzJdXSA9IGRlY29kZShwYXJ0c1sxXSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBvYmpbcGFydHNbMF1dID0gbnVsbCA9PSBwYXJ0c1sxXVxuICAgICAgPyAnJ1xuICAgICAgOiBkZWNvZGUocGFydHNbMV0pO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbi8qKlxuICogU3RyaW5naWZ5IHRoZSBnaXZlbiBgb2JqYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuc3RyaW5naWZ5ID0gZnVuY3Rpb24ob2JqKXtcbiAgaWYgKCFvYmopIHJldHVybiAnJztcbiAgdmFyIHBhaXJzID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuXG4gICAgaWYgKCdhcnJheScgPT0gdHlwZSh2YWx1ZSkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcGFpcnMucHVzaChlbmNvZGUoa2V5ICsgJ1snICsgaSArICddJykgKyAnPScgKyBlbmNvZGUodmFsdWVbaV0pKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHBhaXJzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUob2JqW2tleV0pKTtcbiAgfVxuXG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59O1xuIiwiXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB0cmltO1xuXG5mdW5jdGlvbiB0cmltKHN0cil7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKCk7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpO1xufVxuXG5leHBvcnRzLmxlZnQgPSBmdW5jdGlvbihzdHIpe1xuICBpZiAoc3RyLnRyaW1MZWZ0KSByZXR1cm4gc3RyLnRyaW1MZWZ0KCk7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJyk7XG59O1xuXG5leHBvcnRzLnJpZ2h0ID0gZnVuY3Rpb24oc3RyKXtcbiAgaWYgKHN0ci50cmltUmlnaHQpIHJldHVybiBzdHIudHJpbVJpZ2h0KCk7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59O1xuIiwiXG4vKipcbiAqIFRha2VuIHN0cmFpZ2h0IGZyb20gamVkJ3MgZ2lzdDogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vOTgyODgzXG4gKlxuICogUmV0dXJucyBhIHJhbmRvbSB2NCBVVUlEIG9mIHRoZSBmb3JtIHh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCxcbiAqIHdoZXJlIGVhY2ggeCBpcyByZXBsYWNlZCB3aXRoIGEgcmFuZG9tIGhleGFkZWNpbWFsIGRpZ2l0IGZyb20gMCB0byBmLCBhbmRcbiAqIHkgaXMgcmVwbGFjZWQgd2l0aCBhIHJhbmRvbSBoZXhhZGVjaW1hbCBkaWdpdCBmcm9tIDggdG8gYi5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHV1aWQoYSl7XG4gIHJldHVybiBhICAgICAgICAgICAvLyBpZiB0aGUgcGxhY2Vob2xkZXIgd2FzIHBhc3NlZCwgcmV0dXJuXG4gICAgPyAoICAgICAgICAgICAgICAvLyBhIHJhbmRvbSBudW1iZXIgZnJvbSAwIHRvIDE1XG4gICAgICBhIF4gICAgICAgICAgICAvLyB1bmxlc3MgYiBpcyA4LFxuICAgICAgTWF0aC5yYW5kb20oKSAgLy8gaW4gd2hpY2ggY2FzZVxuICAgICAgKiAxNiAgICAgICAgICAgLy8gYSByYW5kb20gbnVtYmVyIGZyb21cbiAgICAgID4+IGEvNCAgICAgICAgIC8vIDggdG8gMTFcbiAgICAgICkudG9TdHJpbmcoMTYpIC8vIGluIGhleGFkZWNpbWFsXG4gICAgOiAoICAgICAgICAgICAgICAvLyBvciBvdGhlcndpc2UgYSBjb25jYXRlbmF0ZWQgc3RyaW5nOlxuICAgICAgWzFlN10gKyAgICAgICAgLy8gMTAwMDAwMDAgK1xuICAgICAgLTFlMyArICAgICAgICAgLy8gLTEwMDAgK1xuICAgICAgLTRlMyArICAgICAgICAgLy8gLTQwMDAgK1xuICAgICAgLThlMyArICAgICAgICAgLy8gLTgwMDAwMDAwICtcbiAgICAgIC0xZTExICAgICAgICAgIC8vIC0xMDAwMDAwMDAwMDAsXG4gICAgICApLnJlcGxhY2UoICAgICAvLyByZXBsYWNpbmdcbiAgICAgICAgL1swMThdL2csICAgIC8vIHplcm9lcywgb25lcywgYW5kIGVpZ2h0cyB3aXRoXG4gICAgICAgIHV1aWQgICAgICAgICAvLyByYW5kb20gaGV4IGRpZ2l0c1xuICAgICAgKVxufTsiLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOS4yXG4oZnVuY3Rpb24od2luKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyICRkZiwgJGRvYywgJGxvYywgJG5hdiwgJHNjciwgJHdpbiwgZGVmYXVsdHMsIGZkLCByZXN1bHQsIHdlYmFuYWx5c2VyO1xuICBkZWZhdWx0cyA9IHJlcXVpcmUoJ2RlZmF1bHRzJyk7XG4gIGZkID0gcmVxdWlyZSgnZmxhc2hkZXRlY3QnKTtcbiAgJHdpbiA9IHdpbjtcbiAgJGRvYyA9ICR3aW4uZG9jdW1lbnQ7XG4gICRuYXYgPSAkd2luLm5hdmlnYXRvcjtcbiAgJHNjciA9ICR3aW4uc2NyZWVuO1xuICAkbG9jID0gJHdpbi5sb2NhdGlvbjtcbiAgJGRmID0ge1xuICAgIHNyOiAkc2NyLndpZHRoICsgXCJ4XCIgKyAkc2NyLmhlaWdodCxcbiAgICB2cDogJHNjci5hdmFpbFdpZHRoICsgXCJ4XCIgKyAkc2NyLmF2YWlsSGVpZ2h0LFxuICAgIHNkOiAkc2NyLmNvbG9yRGVwdGgsXG4gICAgamU6ICRuYXYuamF2YUVuYWJsZWQgPyAoJG5hdi5qYXZhRW5hYmxlZCgpID8gMSA6IDApIDogMCxcbiAgICB1bDogJG5hdi5sYW5ndWFnZXMgPyAkbmF2Lmxhbmd1YWdlc1swXSA6ICRuYXYubGFuZ3VhZ2UgfHwgJG5hdi51c2VyTGFuZ3VhZ2UgfHwgJG5hdi5icm93c2VyTGFuZ3VhZ2VcbiAgfTtcblxuICAvKipcbiAgICogd2ViYW5hbHlzZXJcbiAgICovXG4gIHdlYmFuYWx5c2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIHdlYmFuYWx5c2VyKCkge31cblxuICAgIHdlYmFuYWx5c2VyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByc3Q7XG4gICAgICBpZiAoJGRmLnogPT0gbnVsbCkge1xuICAgICAgICByc3QgPSB7XG4gICAgICAgICAgZHI6ICRkb2MucmVmZXJyZXIsXG4gICAgICAgICAgZGg6ICRsb2MuaG9zdG5hbWUsXG4gICAgICAgICAgejogbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGZkLmluc3RhbGxlZCkge1xuICAgICAgICAgIHJzdC5mbCA9IGZkLm1ham9yICsgXCIgXCIgKyBmZC5taW5vciArIFwiIFwiICsgZmQucmV2aXNpb25TdHI7XG4gICAgICAgIH1cbiAgICAgICAgJGRmID0gZGVmYXVsdHMocnN0LCAkZGYpO1xuICAgICAgfVxuICAgICAgJGRmLmRsID0gJGxvYy5ocmVmO1xuICAgICAgJGRmLmR0ID0gJGRvYy50aXRsZTtcbiAgICAgIHJldHVybiAkZGY7XG4gICAgfTtcblxuICAgIHdlYmFuYWx5c2VyLnByb3RvdHlwZS53aW5kb3dTaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcnN0O1xuICAgICAgcnN0ID0ge1xuICAgICAgICB3OiAwLFxuICAgICAgICBoOiAwXG4gICAgICB9O1xuICAgICAgaWYgKHR5cGVvZiAkd2luLmlubmVyV2lkdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJzdC53ID0gJHdpbi5pbm5lcldpZHRoO1xuICAgICAgICByc3QuaCA9ICR3aW4uaW5uZXJIZWlnaHQ7XG4gICAgICB9IGVsc2UgaWYgKCRkb2MuZG9jdW1lbnRFbGVtZW50ICYmICgkZG9jLmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fCAkZG9jLmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpKSB7XG4gICAgICAgIHJzdC53ID0gJGRvYy5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIHJzdC5oID0gJGRvYy5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgfSBlbHNlIGlmICgkZG9jLmJvZHkgJiYgKCRkb2MuYm9keS5jbGllbnRXaWR0aCB8fCAkZG9jLmJvZHkuY2xpZW50SGVpZ2h0KSkge1xuICAgICAgICByc3QudyA9ICRkb2MuYm9keS5jbGllbnRXaWR0aDtcbiAgICAgICAgcnN0LmggPSAkZG9jLmJvZHkuY2xpZW50SGVpZ2h0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJzdDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHdlYmFuYWx5c2VyO1xuXG4gIH0pKCk7XG4gIHJlc3VsdCA9IG5ldyB3ZWJhbmFseXNlcigpO1xuICByZXR1cm4gbW9kdWxlLmV4cG9ydHMgPSByZXN1bHQ7XG59KSh3aW5kb3cpO1xuIiwiLypcbkNvcHlyaWdodCAoYykgQ29weXJpZ2h0IChjKSAyMDA3LCBDYXJsIFMuIFllc3RyYXUgQWxsIHJpZ2h0cyByZXNlcnZlZC5cbkNvZGUgbGljZW5zZWQgdW5kZXIgdGhlIEJTRCBMaWNlbnNlOiBodHRwOi8vd3d3LmZlYXR1cmVibGVuZC5jb20vbGljZW5zZS50eHRcblZlcnNpb246IDEuMC40XG4qL1xudmFyIGZsYXNoZGV0ZWN0ID0gbmV3IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuaW5zdGFsbGVkID0gZmFsc2U7XG4gICAgc2VsZi5yYXcgPSBcIlwiO1xuICAgIHNlbGYubWFqb3IgPSAtMTtcbiAgICBzZWxmLm1pbm9yID0gLTE7XG4gICAgc2VsZi5yZXZpc2lvbiA9IC0xO1xuICAgIHNlbGYucmV2aXNpb25TdHIgPSBcIlwiO1xuICAgIHZhciBhY3RpdmVYRGV0ZWN0UnVsZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOlwiU2hvY2t3YXZlRmxhc2guU2hvY2t3YXZlRmxhc2guN1wiLFxuICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6ZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0QWN0aXZlWFZlcnNpb24ob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6XCJTaG9ja3dhdmVGbGFzaC5TaG9ja3dhdmVGbGFzaC42XCIsXG4gICAgICAgICAgICBcInZlcnNpb25cIjpmdW5jdGlvbihvYmope1xuICAgICAgICAgICAgICAgIHZhciB2ZXJzaW9uID0gXCI2LDAsMjFcIjtcbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIG9iai5BbGxvd1NjcmlwdEFjY2VzcyA9IFwiYWx3YXlzXCI7XG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb24gPSBnZXRBY3RpdmVYVmVyc2lvbihvYmopO1xuICAgICAgICAgICAgICAgIH1jYXRjaChlcnIpe31cbiAgICAgICAgICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6XCJTaG9ja3dhdmVGbGFzaC5TaG9ja3dhdmVGbGFzaFwiLFxuICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6ZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0QWN0aXZlWFZlcnNpb24ob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF07XG4gICAgLyoqXG4gICAgICogRXh0cmFjdCB0aGUgQWN0aXZlWCB2ZXJzaW9uIG9mIHRoZSBwbHVnaW4uXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFRoZSBmbGFzaCBBY3RpdmVYIG9iamVjdC5cbiAgICAgKiBAdHlwZSBTdHJpbmdcbiAgICAgKi9cbiAgICB2YXIgZ2V0QWN0aXZlWFZlcnNpb24gPSBmdW5jdGlvbihhY3RpdmVYT2JqKXtcbiAgICAgICAgdmFyIHZlcnNpb24gPSAtMTtcbiAgICAgICAgdHJ5e1xuICAgICAgICAgICAgdmVyc2lvbiA9IGFjdGl2ZVhPYmouR2V0VmFyaWFibGUoXCIkdmVyc2lvblwiKTtcbiAgICAgICAgfWNhdGNoKGVycil7fVxuICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRyeSBhbmQgcmV0cmlldmUgYW4gQWN0aXZlWCBvYmplY3QgaGF2aW5nIGEgc3BlY2lmaWVkIG5hbWUuXG4gICAgICogXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIEFjdGl2ZVggb2JqZWN0IG5hbWUgbG9va3VwLlxuICAgICAqIEByZXR1cm4gT25lIG9mIEFjdGl2ZVggb2JqZWN0IG9yIGEgc2ltcGxlIG9iamVjdCBoYXZpbmcgYW4gYXR0cmlidXRlIG9mIGFjdGl2ZVhFcnJvciB3aXRoIGEgdmFsdWUgb2YgdHJ1ZS5cbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICB2YXIgZ2V0QWN0aXZlWE9iamVjdCA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgICB2YXIgb2JqID0gLTE7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIG9iaiA9IG5ldyBBY3RpdmVYT2JqZWN0KG5hbWUpO1xuICAgICAgICB9Y2F0Y2goZXJyKXtcbiAgICAgICAgICAgIG9iaiA9IHthY3RpdmVYRXJyb3I6dHJ1ZX07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFBhcnNlIGFuIEFjdGl2ZVggJHZlcnNpb24gc3RyaW5nIGludG8gYW4gb2JqZWN0LlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIEFjdGl2ZVggT2JqZWN0IEdldFZhcmlhYmxlKCR2ZXJzaW9uKSByZXR1cm4gdmFsdWUuIFxuICAgICAqIEByZXR1cm4gQW4gb2JqZWN0IGhhdmluZyByYXcsIG1ham9yLCBtaW5vciwgcmV2aXNpb24gYW5kIHJldmlzaW9uU3RyIGF0dHJpYnV0ZXMuXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgdmFyIHBhcnNlQWN0aXZlWFZlcnNpb24gPSBmdW5jdGlvbihzdHIpe1xuICAgICAgICB2YXIgdmVyc2lvbkFycmF5ID0gc3RyLnNwbGl0KFwiLFwiKTsvL3JlcGxhY2Ugd2l0aCByZWdleFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJyYXdcIjpzdHIsXG4gICAgICAgICAgICBcIm1ham9yXCI6cGFyc2VJbnQodmVyc2lvbkFycmF5WzBdLnNwbGl0KFwiIFwiKVsxXSwgMTApLFxuICAgICAgICAgICAgXCJtaW5vclwiOnBhcnNlSW50KHZlcnNpb25BcnJheVsxXSwgMTApLFxuICAgICAgICAgICAgXCJyZXZpc2lvblwiOnBhcnNlSW50KHZlcnNpb25BcnJheVsyXSwgMTApLFxuICAgICAgICAgICAgXCJyZXZpc2lvblN0clwiOnZlcnNpb25BcnJheVsyXVxuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUGFyc2UgYSBzdGFuZGFyZCBlbmFibGVkUGx1Z2luLmRlc2NyaXB0aW9uIGludG8gYW4gb2JqZWN0LlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIGVuYWJsZWRQbHVnaW4uZGVzY3JpcHRpb24gdmFsdWUuXG4gICAgICogQHJldHVybiBBbiBvYmplY3QgaGF2aW5nIHJhdywgbWFqb3IsIG1pbm9yLCByZXZpc2lvbiBhbmQgcmV2aXNpb25TdHIgYXR0cmlidXRlcy5cbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICB2YXIgcGFyc2VTdGFuZGFyZFZlcnNpb24gPSBmdW5jdGlvbihzdHIpe1xuICAgICAgICB2YXIgZGVzY1BhcnRzID0gc3RyLnNwbGl0KC8gKy8pO1xuICAgICAgICB2YXIgbWFqb3JNaW5vciA9IGRlc2NQYXJ0c1syXS5zcGxpdCgvXFwuLyk7XG4gICAgICAgIHZhciByZXZpc2lvblN0ciA9IGRlc2NQYXJ0c1szXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicmF3XCI6c3RyLFxuICAgICAgICAgICAgXCJtYWpvclwiOnBhcnNlSW50KG1ham9yTWlub3JbMF0sIDEwKSxcbiAgICAgICAgICAgIFwibWlub3JcIjpwYXJzZUludChtYWpvck1pbm9yWzFdLCAxMCksIFxuICAgICAgICAgICAgXCJyZXZpc2lvblN0clwiOnJldmlzaW9uU3RyLFxuICAgICAgICAgICAgXCJyZXZpc2lvblwiOnBhcnNlUmV2aXNpb25TdHJUb0ludChyZXZpc2lvblN0cilcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFBhcnNlIHRoZSBwbHVnaW4gcmV2aXNpb24gc3RyaW5nIGludG8gYW4gaW50ZWdlci5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gVGhlIHJldmlzaW9uIGluIHN0cmluZyBmb3JtYXQuXG4gICAgICogQHR5cGUgTnVtYmVyXG4gICAgICovXG4gICAgdmFyIHBhcnNlUmV2aXNpb25TdHJUb0ludCA9IGZ1bmN0aW9uKHN0cil7XG4gICAgICAgIHJldHVybiBwYXJzZUludChzdHIucmVwbGFjZSgvW2EtekEtWl0vZywgXCJcIiksIDEwKSB8fCBzZWxmLnJldmlzaW9uO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSXMgdGhlIG1ham9yIHZlcnNpb24gZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIGEgc3BlY2lmaWVkIHZlcnNpb24uXG4gICAgICogXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZlcnNpb24gVGhlIG1pbmltdW0gcmVxdWlyZWQgbWFqb3IgdmVyc2lvbi5cbiAgICAgKiBAdHlwZSBCb29sZWFuXG4gICAgICovXG4gICAgc2VsZi5tYWpvckF0TGVhc3QgPSBmdW5jdGlvbih2ZXJzaW9uKXtcbiAgICAgICAgcmV0dXJuIHNlbGYubWFqb3IgPj0gdmVyc2lvbjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIElzIHRoZSBtaW5vciB2ZXJzaW9uIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBhIHNwZWNpZmllZCB2ZXJzaW9uLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2ZXJzaW9uIFRoZSBtaW5pbXVtIHJlcXVpcmVkIG1pbm9yIHZlcnNpb24uXG4gICAgICogQHR5cGUgQm9vbGVhblxuICAgICAqL1xuICAgIHNlbGYubWlub3JBdExlYXN0ID0gZnVuY3Rpb24odmVyc2lvbil7XG4gICAgICAgIHJldHVybiBzZWxmLm1pbm9yID49IHZlcnNpb247XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJcyB0aGUgcmV2aXNpb24gdmVyc2lvbiBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gYSBzcGVjaWZpZWQgdmVyc2lvbi5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdmVyc2lvbiBUaGUgbWluaW11bSByZXF1aXJlZCByZXZpc2lvbiB2ZXJzaW9uLlxuICAgICAqIEB0eXBlIEJvb2xlYW5cbiAgICAgKi9cbiAgICBzZWxmLnJldmlzaW9uQXRMZWFzdCA9IGZ1bmN0aW9uKHZlcnNpb24pe1xuICAgICAgICByZXR1cm4gc2VsZi5yZXZpc2lvbiA+PSB2ZXJzaW9uO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSXMgdGhlIHZlcnNpb24gZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIGEgc3BlY2lmaWVkIG1ham9yLCBtaW5vciBhbmQgcmV2aXNpb24uXG4gICAgICogXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG1ham9yIFRoZSBtaW5pbXVtIHJlcXVpcmVkIG1ham9yIHZlcnNpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IChPcHRpb25hbCkgbWlub3IgVGhlIG1pbmltdW0gcmVxdWlyZWQgbWlub3IgdmVyc2lvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gKE9wdGlvbmFsKSByZXZpc2lvbiBUaGUgbWluaW11bSByZXF1aXJlZCByZXZpc2lvbiB2ZXJzaW9uLlxuICAgICAqIEB0eXBlIEJvb2xlYW5cbiAgICAgKi9cbiAgICBzZWxmLnZlcnNpb25BdExlYXN0ID0gZnVuY3Rpb24obWFqb3Ipe1xuICAgICAgICB2YXIgcHJvcGVydGllcyA9IFtzZWxmLm1ham9yLCBzZWxmLm1pbm9yLCBzZWxmLnJldmlzaW9uXTtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGgubWluKHByb3BlcnRpZXMubGVuZ3RoLCBhcmd1bWVudHMubGVuZ3RoKTtcbiAgICAgICAgZm9yKGk9MDsgaTxsZW47IGkrKyl7XG4gICAgICAgICAgICBpZihwcm9wZXJ0aWVzW2ldPj1hcmd1bWVudHNbaV0pe1xuICAgICAgICAgICAgICAgIGlmKGkrMTxsZW4gJiYgcHJvcGVydGllc1tpXT09YXJndW1lbnRzW2ldKXtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3IsIHNldHMgcmF3LCBtYWpvciwgbWlub3IsIHJldmlzaW9uU3RyLCByZXZpc2lvbiBhbmQgaW5zdGFsbGVkIHB1YmxpYyBwcm9wZXJ0aWVzLlxuICAgICAqL1xuICAgIHNlbGYuZmxhc2hkZXRlY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZihuYXZpZ2F0b3IucGx1Z2lucyAmJiBuYXZpZ2F0b3IucGx1Z2lucy5sZW5ndGg+MCl7XG4gICAgICAgICAgICB2YXIgdHlwZSA9ICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCc7XG4gICAgICAgICAgICB2YXIgbWltZVR5cGVzID0gbmF2aWdhdG9yLm1pbWVUeXBlcztcbiAgICAgICAgICAgIGlmKG1pbWVUeXBlcyAmJiBtaW1lVHlwZXNbdHlwZV0gJiYgbWltZVR5cGVzW3R5cGVdLmVuYWJsZWRQbHVnaW4gJiYgbWltZVR5cGVzW3R5cGVdLmVuYWJsZWRQbHVnaW4uZGVzY3JpcHRpb24pe1xuICAgICAgICAgICAgICAgIHZhciB2ZXJzaW9uID0gbWltZVR5cGVzW3R5cGVdLmVuYWJsZWRQbHVnaW4uZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgdmFyIHZlcnNpb25PYmogPSBwYXJzZVN0YW5kYXJkVmVyc2lvbih2ZXJzaW9uKTtcbiAgICAgICAgICAgICAgICBzZWxmLnJhdyA9IHZlcnNpb25PYmoucmF3O1xuICAgICAgICAgICAgICAgIHNlbGYubWFqb3IgPSB2ZXJzaW9uT2JqLm1ham9yO1xuICAgICAgICAgICAgICAgIHNlbGYubWlub3IgPSB2ZXJzaW9uT2JqLm1pbm9yOyBcbiAgICAgICAgICAgICAgICBzZWxmLnJldmlzaW9uU3RyID0gdmVyc2lvbk9iai5yZXZpc2lvblN0cjtcbiAgICAgICAgICAgICAgICBzZWxmLnJldmlzaW9uID0gdmVyc2lvbk9iai5yZXZpc2lvbjtcbiAgICAgICAgICAgICAgICBzZWxmLmluc3RhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNlIGlmKG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJNYWNcIik9PS0xICYmIHdpbmRvdy5leGVjU2NyaXB0KXtcbiAgICAgICAgICAgIHZhciB2ZXJzaW9uID0gLTE7XG4gICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxhY3RpdmVYRGV0ZWN0UnVsZXMubGVuZ3RoICYmIHZlcnNpb249PS0xOyBpKyspe1xuICAgICAgICAgICAgICAgIHZhciBvYmogPSBnZXRBY3RpdmVYT2JqZWN0KGFjdGl2ZVhEZXRlY3RSdWxlc1tpXS5uYW1lKTtcbiAgICAgICAgICAgICAgICBpZighb2JqLmFjdGl2ZVhFcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5zdGFsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmVyc2lvbiA9IGFjdGl2ZVhEZXRlY3RSdWxlc1tpXS52ZXJzaW9uKG9iaik7XG4gICAgICAgICAgICAgICAgICAgIGlmKHZlcnNpb24hPS0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ZXJzaW9uT2JqID0gcGFyc2VBY3RpdmVYVmVyc2lvbih2ZXJzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmF3ID0gdmVyc2lvbk9iai5yYXc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1ham9yID0gdmVyc2lvbk9iai5tYWpvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubWlub3IgPSB2ZXJzaW9uT2JqLm1pbm9yOyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmV2aXNpb24gPSB2ZXJzaW9uT2JqLnJldmlzaW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZXZpc2lvblN0ciA9IHZlcnNpb25PYmoucmV2aXNpb25TdHI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KCk7XG59O1xuZmxhc2hkZXRlY3QuSlNfUkVMRUFTRSA9IFwiMS4wLjRcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmbGFzaGRldGVjdDtcbiIsIi8qIVxuICogZG9jUmVhZHkgdjEuMC40XG4gKiBDcm9zcyBicm93c2VyIERPTUNvbnRlbnRMb2FkZWQgZXZlbnQgZW1pdHRlclxuICogTUlUIGxpY2Vuc2VcbiAqL1xuXG4vKmpzaGludCBicm93c2VyOiB0cnVlLCBzdHJpY3Q6IHRydWUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHRydWUqL1xuLypnbG9iYWwgZGVmaW5lOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cblxuKCBmdW5jdGlvbiggd2luZG93ICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbi8vIGNvbGxlY3Rpb24gb2YgZnVuY3Rpb25zIHRvIGJlIHRyaWdnZXJlZCBvbiByZWFkeVxudmFyIHF1ZXVlID0gW107XG5cbmZ1bmN0aW9uIGRvY1JlYWR5KCBmbiApIHtcbiAgLy8gdGhyb3cgb3V0IG5vbi1mdW5jdGlvbnNcbiAgaWYgKCB0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCBkb2NSZWFkeS5pc1JlYWR5ICkge1xuICAgIC8vIHJlYWR5IG5vdywgaGl0IGl0XG4gICAgZm4oKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBxdWV1ZSBmdW5jdGlvbiB3aGVuIHJlYWR5XG4gICAgcXVldWUucHVzaCggZm4gKTtcbiAgfVxufVxuXG5kb2NSZWFkeS5pc1JlYWR5ID0gZmFsc2U7XG5cbi8vIHRyaWdnZXJlZCBvbiB2YXJpb3VzIGRvYyByZWFkeSBldmVudHNcbmZ1bmN0aW9uIG9uUmVhZHkoIGV2ZW50ICkge1xuICAvLyBiYWlsIGlmIGFscmVhZHkgdHJpZ2dlcmVkIG9yIElFOCBkb2N1bWVudCBpcyBub3QgcmVhZHkganVzdCB5ZXRcbiAgdmFyIGlzSUU4Tm90UmVhZHkgPSBldmVudC50eXBlID09PSAncmVhZHlzdGF0ZWNoYW5nZScgJiYgZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJztcbiAgaWYgKCBkb2NSZWFkeS5pc1JlYWR5IHx8IGlzSUU4Tm90UmVhZHkgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdHJpZ2dlcigpO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyKCkge1xuICBkb2NSZWFkeS5pc1JlYWR5ID0gdHJ1ZTtcbiAgLy8gcHJvY2VzcyBxdWV1ZVxuICBmb3IgKCB2YXIgaT0wLCBsZW4gPSBxdWV1ZS5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpXTtcbiAgICBmbigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlZmluZURvY1JlYWR5KCBldmVudGllICkge1xuICAvLyB0cmlnZ2VyIHJlYWR5IGlmIHBhZ2UgaXMgcmVhZHlcbiAgaWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnICkge1xuICAgIHRyaWdnZXIoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBsaXN0ZW4gZm9yIGV2ZW50c1xuICAgIGV2ZW50aWUuYmluZCggZG9jdW1lbnQsICdET01Db250ZW50TG9hZGVkJywgb25SZWFkeSApO1xuICAgIGV2ZW50aWUuYmluZCggZG9jdW1lbnQsICdyZWFkeXN0YXRlY2hhbmdlJywgb25SZWFkeSApO1xuICAgIGV2ZW50aWUuYmluZCggd2luZG93LCAnbG9hZCcsIG9uUmVhZHkgKTtcbiAgfVxuXG4gIHJldHVybiBkb2NSZWFkeTtcbn1cblxuLy8gdHJhbnNwb3J0XG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgLy8gQU1EXG4gIGRlZmluZSggWyAnZXZlbnRpZS9ldmVudGllJyBdLCBkZWZpbmVEb2NSZWFkeSApO1xufSBlbHNlIGlmICggdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluZURvY1JlYWR5KCByZXF1aXJlKCdldmVudGllJykgKTtcbn0gZWxzZSB7XG4gIC8vIGJyb3dzZXIgZ2xvYmFsXG4gIHdpbmRvdy5kb2NSZWFkeSA9IGRlZmluZURvY1JlYWR5KCB3aW5kb3cuZXZlbnRpZSApO1xufVxuXG59KSggd2luZG93ICk7XG4iLCIvKiFcbiAqIGV2ZW50aWUgdjEuMC42XG4gKiBldmVudCBiaW5kaW5nIGhlbHBlclxuICogICBldmVudGllLmJpbmQoIGVsZW0sICdjbGljaycsIG15Rm4gKVxuICogICBldmVudGllLnVuYmluZCggZWxlbSwgJ2NsaWNrJywgbXlGbiApXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHRydWUgKi9cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cblxuKCBmdW5jdGlvbiggd2luZG93ICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG52YXIgYmluZCA9IGZ1bmN0aW9uKCkge307XG5cbmZ1bmN0aW9uIGdldElFRXZlbnQoIG9iaiApIHtcbiAgdmFyIGV2ZW50ID0gd2luZG93LmV2ZW50O1xuICAvLyBhZGQgZXZlbnQudGFyZ2V0XG4gIGV2ZW50LnRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50IHx8IG9iajtcbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5pZiAoIGRvY0VsZW0uYWRkRXZlbnRMaXN0ZW5lciApIHtcbiAgYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBmbiwgZmFsc2UgKTtcbiAgfTtcbn0gZWxzZSBpZiAoIGRvY0VsZW0uYXR0YWNoRXZlbnQgKSB7XG4gIGJpbmQgPSBmdW5jdGlvbiggb2JqLCB0eXBlLCBmbiApIHtcbiAgICBvYmpbIHR5cGUgKyBmbiBdID0gZm4uaGFuZGxlRXZlbnQgP1xuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudCA9IGdldElFRXZlbnQoIG9iaiApO1xuICAgICAgICBmbi5oYW5kbGVFdmVudC5jYWxsKCBmbiwgZXZlbnQgKTtcbiAgICAgIH0gOlxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudCA9IGdldElFRXZlbnQoIG9iaiApO1xuICAgICAgICBmbi5jYWxsKCBvYmosIGV2ZW50ICk7XG4gICAgICB9O1xuICAgIG9iai5hdHRhY2hFdmVudCggXCJvblwiICsgdHlwZSwgb2JqWyB0eXBlICsgZm4gXSApO1xuICB9O1xufVxuXG52YXIgdW5iaW5kID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKCBkb2NFbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIgKSB7XG4gIHVuYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBmbiwgZmFsc2UgKTtcbiAgfTtcbn0gZWxzZSBpZiAoIGRvY0VsZW0uZGV0YWNoRXZlbnQgKSB7XG4gIHVuYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5kZXRhY2hFdmVudCggXCJvblwiICsgdHlwZSwgb2JqWyB0eXBlICsgZm4gXSApO1xuICAgIHRyeSB7XG4gICAgICBkZWxldGUgb2JqWyB0eXBlICsgZm4gXTtcbiAgICB9IGNhdGNoICggZXJyICkge1xuICAgICAgLy8gY2FuJ3QgZGVsZXRlIHdpbmRvdyBvYmplY3QgcHJvcGVydGllc1xuICAgICAgb2JqWyB0eXBlICsgZm4gXSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG59XG5cbnZhciBldmVudGllID0ge1xuICBiaW5kOiBiaW5kLFxuICB1bmJpbmQ6IHVuYmluZFxufTtcblxuLy8gLS0tLS0gbW9kdWxlIGRlZmluaXRpb24gLS0tLS0gLy9cblxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gIC8vIEFNRFxuICBkZWZpbmUoIGV2ZW50aWUgKTtcbn0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcbiAgLy8gQ29tbW9uSlNcbiAgbW9kdWxlLmV4cG9ydHMgPSBldmVudGllO1xufSBlbHNlIHtcbiAgLy8gYnJvd3NlciBnbG9iYWxcbiAgd2luZG93LmV2ZW50aWUgPSBldmVudGllO1xufVxuXG59KSggd2luZG93ICk7XG4iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgbm93ID0gcmVxdWlyZSgnZGF0ZS1ub3cnKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gKiBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gKiBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAqIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gKlxuICogQHNvdXJjZSB1bmRlcnNjb3JlLmpzXG4gKiBAc2VlIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jdGlvbiB0byB3cmFwXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZW91dCBpbiBtcyAoYDEwMGApXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHdoZXRoZXIgdG8gZXhlY3V0ZSBhdCB0aGUgYmVnaW5uaW5nIChgZmFsc2VgKVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSl7XG4gIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcbiAgaWYgKG51bGwgPT0gd2FpdCkgd2FpdCA9IDEwMDtcblxuICBmdW5jdGlvbiBsYXRlcigpIHtcbiAgICB2YXIgbGFzdCA9IG5vdygpIC0gdGltZXN0YW1wO1xuXG4gICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPiAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIGNvbnRleHQgPSB0aGlzO1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdGltZXN0YW1wID0gbm93KCk7XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IERhdGUubm93IHx8IG5vd1xuXG5mdW5jdGlvbiBub3coKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpXG59XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOS4yXG52YXIgZGVib3VuY2UsIGxzcXVldWUsIHN0b3JlO1xuXG5yZXF1aXJlKCdqc29uLWZhbGxiYWNrJyk7XG5cbmRlYm91bmNlID0gcmVxdWlyZSgnZGVib3VuY2UnKTtcblxuc3RvcmUgPSByZXF1aXJlKCdzdG9yZS5qcycpO1xuXG5cbi8qKlxuICogYSBxdWV1ZSBiYWNrZWQgYnkgbG9jYWxTdG9yYWdlXG4gKiBuZXcgcXVldWUoXCJuYW1lXCIpXG4gKi9cblxubHNxdWV1ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gbHNxdWV1ZShuYW1lKSB7XG4gICAgdmFyIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5xbiA9IG5hbWUgfHwgXCJxdWV1ZVwiO1xuICAgIHNlbGYuaXRlbXMgPSBbXTtcbiAgICBzZWxmLnBlcnNpc3QgPSBkZWJvdW5jZShmdW5jdGlvbigpIHtcbiAgICAgIGlmICghc3RvcmUuZW5hYmxlZCkge1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHN0b3JlLnNldChzZWxmLnFuLCBzZWxmLml0ZW1zKTtcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuXG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9LCAxMTEpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG5cbiAgbHNxdWV1ZS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKHYpIHtcbiAgICB2YXIgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcbiAgICBzZWxmLml0ZW1zLnB1c2godik7XG4gICAgc2VsZi5wZXJzaXN0KCk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG5cbiAgbHNxdWV1ZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJzdCwgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICByc3QgPSBzZWxmLml0ZW1zLnNoaWZ0KCk7XG4gICAgICBzZWxmLnBlcnNpc3QoKTtcbiAgICAgIHJldHVybiByc3Q7XG4gICAgfVxuICB9O1xuXG4gIGxzcXVldWUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5pdGVtcyA9IFtdO1xuICAgIHNlbGYucGVyc2lzdCgpO1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG4gIHJldHVybiBsc3F1ZXVlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxzcXVldWU7XG4iLCIvKlxuICAgIGpzb24yLmpzXG4gICAgMjAxNC0wMi0wNFxuXG4gICAgUHVibGljIERvbWFpbi5cblxuICAgIE5PIFdBUlJBTlRZIEVYUFJFU1NFRCBPUiBJTVBMSUVELiBVU0UgQVQgWU9VUiBPV04gUklTSy5cblxuICAgIFNlZSBodHRwOi8vd3d3LkpTT04ub3JnL2pzLmh0bWxcblxuXG4gICAgVGhpcyBjb2RlIHNob3VsZCBiZSBtaW5pZmllZCBiZWZvcmUgZGVwbG95bWVudC5cbiAgICBTZWUgaHR0cDovL2phdmFzY3JpcHQuY3JvY2tmb3JkLmNvbS9qc21pbi5odG1sXG5cbiAgICBVU0UgWU9VUiBPV04gQ09QWS4gSVQgSVMgRVhUUkVNRUxZIFVOV0lTRSBUTyBMT0FEIENPREUgRlJPTSBTRVJWRVJTIFlPVSBET1xuICAgIE5PVCBDT05UUk9MLlxuXG5cbiAgICBUaGlzIGZpbGUgY3JlYXRlcyBhIGdsb2JhbCBKU09OIG9iamVjdCBjb250YWluaW5nIHR3byBtZXRob2RzOiBzdHJpbmdpZnlcbiAgICBhbmQgcGFyc2UuXG5cbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSlcbiAgICAgICAgICAgIHZhbHVlICAgICAgIGFueSBKYXZhU2NyaXB0IHZhbHVlLCB1c3VhbGx5IGFuIG9iamVjdCBvciBhcnJheS5cblxuICAgICAgICAgICAgcmVwbGFjZXIgICAgYW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRoYXQgZGV0ZXJtaW5lcyBob3cgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgYXJlIHN0cmluZ2lmaWVkIGZvciBvYmplY3RzLiBJdCBjYW4gYmUgYVxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cblxuICAgICAgICAgICAgc3BhY2UgICAgICAgYW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRoYXQgc3BlY2lmaWVzIHRoZSBpbmRlbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgb2YgbmVzdGVkIHN0cnVjdHVyZXMuIElmIGl0IGlzIG9taXR0ZWQsIHRoZSB0ZXh0IHdpbGxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlIHBhY2tlZCB3aXRob3V0IGV4dHJhIHdoaXRlc3BhY2UuIElmIGl0IGlzIGEgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXQgd2lsbCBzcGVjaWZ5IHRoZSBudW1iZXIgb2Ygc3BhY2VzIHRvIGluZGVudCBhdCBlYWNoXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXZlbC4gSWYgaXQgaXMgYSBzdHJpbmcgKHN1Y2ggYXMgJ1xcdCcgb3IgJyZuYnNwOycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXQgY29udGFpbnMgdGhlIGNoYXJhY3RlcnMgdXNlZCB0byBpbmRlbnQgYXQgZWFjaCBsZXZlbC5cblxuICAgICAgICAgICAgVGhpcyBtZXRob2QgcHJvZHVjZXMgYSBKU09OIHRleHQgZnJvbSBhIEphdmFTY3JpcHQgdmFsdWUuXG5cbiAgICAgICAgICAgIFdoZW4gYW4gb2JqZWN0IHZhbHVlIGlzIGZvdW5kLCBpZiB0aGUgb2JqZWN0IGNvbnRhaW5zIGEgdG9KU09OXG4gICAgICAgICAgICBtZXRob2QsIGl0cyB0b0pTT04gbWV0aG9kIHdpbGwgYmUgY2FsbGVkIGFuZCB0aGUgcmVzdWx0IHdpbGwgYmVcbiAgICAgICAgICAgIHN0cmluZ2lmaWVkLiBBIHRvSlNPTiBtZXRob2QgZG9lcyBub3Qgc2VyaWFsaXplOiBpdCByZXR1cm5zIHRoZVxuICAgICAgICAgICAgdmFsdWUgcmVwcmVzZW50ZWQgYnkgdGhlIG5hbWUvdmFsdWUgcGFpciB0aGF0IHNob3VsZCBiZSBzZXJpYWxpemVkLFxuICAgICAgICAgICAgb3IgdW5kZWZpbmVkIGlmIG5vdGhpbmcgc2hvdWxkIGJlIHNlcmlhbGl6ZWQuIFRoZSB0b0pTT04gbWV0aG9kXG4gICAgICAgICAgICB3aWxsIGJlIHBhc3NlZCB0aGUga2V5IGFzc29jaWF0ZWQgd2l0aCB0aGUgdmFsdWUsIGFuZCB0aGlzIHdpbGwgYmVcbiAgICAgICAgICAgIGJvdW5kIHRvIHRoZSB2YWx1ZVxuXG4gICAgICAgICAgICBGb3IgZXhhbXBsZSwgdGhpcyB3b3VsZCBzZXJpYWxpemUgRGF0ZXMgYXMgSVNPIHN0cmluZ3MuXG5cbiAgICAgICAgICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGYobikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IGludGVnZXJzIHRvIGhhdmUgYXQgbGVhc3QgdHdvIGRpZ2l0cy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuIDogbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVUQ0Z1bGxZZWFyKCkgICArICctJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ01vbnRoKCkgKyAxKSArICctJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ0RhdGUoKSkgICAgICArICdUJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ0hvdXJzKCkpICAgICArICc6JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ01pbnV0ZXMoKSkgICArICc6JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ1NlY29uZHMoKSkgICArICdaJztcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBZb3UgY2FuIHByb3ZpZGUgYW4gb3B0aW9uYWwgcmVwbGFjZXIgbWV0aG9kLiBJdCB3aWxsIGJlIHBhc3NlZCB0aGVcbiAgICAgICAgICAgIGtleSBhbmQgdmFsdWUgb2YgZWFjaCBtZW1iZXIsIHdpdGggdGhpcyBib3VuZCB0byB0aGUgY29udGFpbmluZ1xuICAgICAgICAgICAgb2JqZWN0LiBUaGUgdmFsdWUgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHlvdXIgbWV0aG9kIHdpbGwgYmVcbiAgICAgICAgICAgIHNlcmlhbGl6ZWQuIElmIHlvdXIgbWV0aG9kIHJldHVybnMgdW5kZWZpbmVkLCB0aGVuIHRoZSBtZW1iZXIgd2lsbFxuICAgICAgICAgICAgYmUgZXhjbHVkZWQgZnJvbSB0aGUgc2VyaWFsaXphdGlvbi5cblxuICAgICAgICAgICAgSWYgdGhlIHJlcGxhY2VyIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiBzdHJpbmdzLCB0aGVuIGl0IHdpbGwgYmVcbiAgICAgICAgICAgIHVzZWQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHNlcmlhbGl6ZWQuIEl0IGZpbHRlcnMgdGhlIHJlc3VsdHNcbiAgICAgICAgICAgIHN1Y2ggdGhhdCBvbmx5IG1lbWJlcnMgd2l0aCBrZXlzIGxpc3RlZCBpbiB0aGUgcmVwbGFjZXIgYXJyYXkgYXJlXG4gICAgICAgICAgICBzdHJpbmdpZmllZC5cblxuICAgICAgICAgICAgVmFsdWVzIHRoYXQgZG8gbm90IGhhdmUgSlNPTiByZXByZXNlbnRhdGlvbnMsIHN1Y2ggYXMgdW5kZWZpbmVkIG9yXG4gICAgICAgICAgICBmdW5jdGlvbnMsIHdpbGwgbm90IGJlIHNlcmlhbGl6ZWQuIFN1Y2ggdmFsdWVzIGluIG9iamVjdHMgd2lsbCBiZVxuICAgICAgICAgICAgZHJvcHBlZDsgaW4gYXJyYXlzIHRoZXkgd2lsbCBiZSByZXBsYWNlZCB3aXRoIG51bGwuIFlvdSBjYW4gdXNlXG4gICAgICAgICAgICBhIHJlcGxhY2VyIGZ1bmN0aW9uIHRvIHJlcGxhY2UgdGhvc2Ugd2l0aCBKU09OIHZhbHVlcy5cbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHVuZGVmaW5lZCkgcmV0dXJucyB1bmRlZmluZWQuXG5cbiAgICAgICAgICAgIFRoZSBvcHRpb25hbCBzcGFjZSBwYXJhbWV0ZXIgcHJvZHVjZXMgYSBzdHJpbmdpZmljYXRpb24gb2YgdGhlXG4gICAgICAgICAgICB2YWx1ZSB0aGF0IGlzIGZpbGxlZCB3aXRoIGxpbmUgYnJlYWtzIGFuZCBpbmRlbnRhdGlvbiB0byBtYWtlIGl0XG4gICAgICAgICAgICBlYXNpZXIgdG8gcmVhZC5cblxuICAgICAgICAgICAgSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG5vbi1lbXB0eSBzdHJpbmcsIHRoZW4gdGhhdCBzdHJpbmcgd2lsbFxuICAgICAgICAgICAgYmUgdXNlZCBmb3IgaW5kZW50YXRpb24uIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBudW1iZXIsIHRoZW5cbiAgICAgICAgICAgIHRoZSBpbmRlbnRhdGlvbiB3aWxsIGJlIHRoYXQgbWFueSBzcGFjZXMuXG5cbiAgICAgICAgICAgIEV4YW1wbGU6XG5cbiAgICAgICAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShbJ2UnLCB7cGx1cmlidXM6ICd1bnVtJ31dKTtcbiAgICAgICAgICAgIC8vIHRleHQgaXMgJ1tcImVcIix7XCJwbHVyaWJ1c1wiOlwidW51bVwifV0nXG5cblxuICAgICAgICAgICAgdGV4dCA9IEpTT04uc3RyaW5naWZ5KFsnZScsIHtwbHVyaWJ1czogJ3VudW0nfV0sIG51bGwsICdcXHQnKTtcbiAgICAgICAgICAgIC8vIHRleHQgaXMgJ1tcXG5cXHRcImVcIixcXG5cXHR7XFxuXFx0XFx0XCJwbHVyaWJ1c1wiOiBcInVudW1cIlxcblxcdH1cXG5dJ1xuXG4gICAgICAgICAgICB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoW25ldyBEYXRlKCldLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2tleV0gaW5zdGFuY2VvZiBEYXRlID9cbiAgICAgICAgICAgICAgICAgICAgJ0RhdGUoJyArIHRoaXNba2V5XSArICcpJyA6IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyB0ZXh0IGlzICdbXCJEYXRlKC0tLWN1cnJlbnQgdGltZS0tLSlcIl0nXG5cblxuICAgICAgICBKU09OLnBhcnNlKHRleHQsIHJldml2ZXIpXG4gICAgICAgICAgICBUaGlzIG1ldGhvZCBwYXJzZXMgYSBKU09OIHRleHQgdG8gcHJvZHVjZSBhbiBvYmplY3Qgb3IgYXJyYXkuXG4gICAgICAgICAgICBJdCBjYW4gdGhyb3cgYSBTeW50YXhFcnJvciBleGNlcHRpb24uXG5cbiAgICAgICAgICAgIFRoZSBvcHRpb25hbCByZXZpdmVyIHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGZpbHRlciBhbmRcbiAgICAgICAgICAgIHRyYW5zZm9ybSB0aGUgcmVzdWx0cy4gSXQgcmVjZWl2ZXMgZWFjaCBvZiB0aGUga2V5cyBhbmQgdmFsdWVzLFxuICAgICAgICAgICAgYW5kIGl0cyByZXR1cm4gdmFsdWUgaXMgdXNlZCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbiAgICAgICAgICAgIElmIGl0IHJldHVybnMgd2hhdCBpdCByZWNlaXZlZCwgdGhlbiB0aGUgc3RydWN0dXJlIGlzIG5vdCBtb2RpZmllZC5cbiAgICAgICAgICAgIElmIGl0IHJldHVybnMgdW5kZWZpbmVkIHRoZW4gdGhlIG1lbWJlciBpcyBkZWxldGVkLlxuXG4gICAgICAgICAgICBFeGFtcGxlOlxuXG4gICAgICAgICAgICAvLyBQYXJzZSB0aGUgdGV4dC4gVmFsdWVzIHRoYXQgbG9vayBsaWtlIElTTyBkYXRlIHN0cmluZ3Mgd2lsbFxuICAgICAgICAgICAgLy8gYmUgY29udmVydGVkIHRvIERhdGUgb2JqZWN0cy5cblxuICAgICAgICAgICAgbXlEYXRhID0gSlNPTi5wYXJzZSh0ZXh0LCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBhO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgPVxuL14oXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KD86XFwuXFxkKik/KVokLy5leGVjKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygrYVsxXSwgK2FbMl0gLSAxLCArYVszXSwgK2FbNF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgK2FbNV0sICthWzZdKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG15RGF0YSA9IEpTT04ucGFyc2UoJ1tcIkRhdGUoMDkvMDkvMjAwMSlcIl0nLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBkO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zbGljZSgwLCA1KSA9PT0gJ0RhdGUoJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2xpY2UoLTEpID09PSAnKScpIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IG5ldyBEYXRlKHZhbHVlLnNsaWNlKDUsIC0xKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgVGhpcyBpcyBhIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbi4gWW91IGFyZSBmcmVlIHRvIGNvcHksIG1vZGlmeSwgb3JcbiAgICByZWRpc3RyaWJ1dGUuXG4qL1xuXG4vKmpzbGludCBldmlsOiB0cnVlLCByZWdleHA6IHRydWUgKi9cblxuLyptZW1iZXJzIFwiXCIsIFwiXFxiXCIsIFwiXFx0XCIsIFwiXFxuXCIsIFwiXFxmXCIsIFwiXFxyXCIsIFwiXFxcIlwiLCBKU09OLCBcIlxcXFxcIiwgYXBwbHksXG4gICAgY2FsbCwgY2hhckNvZGVBdCwgZ2V0VVRDRGF0ZSwgZ2V0VVRDRnVsbFllYXIsIGdldFVUQ0hvdXJzLFxuICAgIGdldFVUQ01pbnV0ZXMsIGdldFVUQ01vbnRoLCBnZXRVVENTZWNvbmRzLCBoYXNPd25Qcm9wZXJ0eSwgam9pbixcbiAgICBsYXN0SW5kZXgsIGxlbmd0aCwgcGFyc2UsIHByb3RvdHlwZSwgcHVzaCwgcmVwbGFjZSwgc2xpY2UsIHN0cmluZ2lmeSxcbiAgICB0ZXN0LCB0b0pTT04sIHRvU3RyaW5nLCB2YWx1ZU9mXG4qL1xuXG5cbi8vIENyZWF0ZSBhIEpTT04gb2JqZWN0IG9ubHkgaWYgb25lIGRvZXMgbm90IGFscmVhZHkgZXhpc3QuIFdlIGNyZWF0ZSB0aGVcbi8vIG1ldGhvZHMgaW4gYSBjbG9zdXJlIHRvIGF2b2lkIGNyZWF0aW5nIGdsb2JhbCB2YXJpYWJsZXMuXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIEpTT04gPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZihuKSB7XG4gICAgICAgIC8vIEZvcm1hdCBpbnRlZ2VycyB0byBoYXZlIGF0IGxlYXN0IHR3byBkaWdpdHMuXG4gICAgICAgIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuIDogbjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIERhdGUucHJvdG90eXBlLnRvSlNPTiAhPT0gJ2Z1bmN0aW9uJykge1xuXG4gICAgICAgIERhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgcmV0dXJuIGlzRmluaXRlKHRoaXMudmFsdWVPZigpKVxuICAgICAgICAgICAgICAgID8gdGhpcy5nZXRVVENGdWxsWWVhcigpICAgICArICctJyArXG4gICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENNb250aCgpICsgMSkgKyAnLScgK1xuICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDRGF0ZSgpKSAgICAgICsgJ1QnICtcbiAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ0hvdXJzKCkpICAgICArICc6JyArXG4gICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENNaW51dGVzKCkpICAgKyAnOicgK1xuICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDU2Vjb25kcygpKSAgICsgJ1onXG4gICAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIFN0cmluZy5wcm90b3R5cGUudG9KU09OICAgICAgPVxuICAgICAgICAgICAgTnVtYmVyLnByb3RvdHlwZS50b0pTT04gID1cbiAgICAgICAgICAgIEJvb2xlYW4ucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCk7XG4gICAgICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBjeCxcbiAgICAgICAgZXNjYXBhYmxlLFxuICAgICAgICBnYXAsXG4gICAgICAgIGluZGVudCxcbiAgICAgICAgbWV0YSxcbiAgICAgICAgcmVwO1xuXG5cbiAgICBmdW5jdGlvbiBxdW90ZShzdHJpbmcpIHtcblxuLy8gSWYgdGhlIHN0cmluZyBjb250YWlucyBubyBjb250cm9sIGNoYXJhY3RlcnMsIG5vIHF1b3RlIGNoYXJhY3RlcnMsIGFuZCBub1xuLy8gYmFja3NsYXNoIGNoYXJhY3RlcnMsIHRoZW4gd2UgY2FuIHNhZmVseSBzbGFwIHNvbWUgcXVvdGVzIGFyb3VuZCBpdC5cbi8vIE90aGVyd2lzZSB3ZSBtdXN0IGFsc28gcmVwbGFjZSB0aGUgb2ZmZW5kaW5nIGNoYXJhY3RlcnMgd2l0aCBzYWZlIGVzY2FwZVxuLy8gc2VxdWVuY2VzLlxuXG4gICAgICAgIGVzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xuICAgICAgICByZXR1cm4gZXNjYXBhYmxlLnRlc3Qoc3RyaW5nKSA/ICdcIicgKyBzdHJpbmcucmVwbGFjZShlc2NhcGFibGUsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYyA9IG1ldGFbYV07XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgPyBjXG4gICAgICAgICAgICAgICAgOiAnXFxcXHUnICsgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfSkgKyAnXCInIDogJ1wiJyArIHN0cmluZyArICdcIic7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBzdHIoa2V5LCBob2xkZXIpIHtcblxuLy8gUHJvZHVjZSBhIHN0cmluZyBmcm9tIGhvbGRlcltrZXldLlxuXG4gICAgICAgIHZhciBpLCAgICAgICAgICAvLyBUaGUgbG9vcCBjb3VudGVyLlxuICAgICAgICAgICAgaywgICAgICAgICAgLy8gVGhlIG1lbWJlciBrZXkuXG4gICAgICAgICAgICB2LCAgICAgICAgICAvLyBUaGUgbWVtYmVyIHZhbHVlLlxuICAgICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgICAgbWluZCA9IGdhcCxcbiAgICAgICAgICAgIHBhcnRpYWwsXG4gICAgICAgICAgICB2YWx1ZSA9IGhvbGRlcltrZXldO1xuXG4vLyBJZiB0aGUgdmFsdWUgaGFzIGEgdG9KU09OIG1ldGhvZCwgY2FsbCBpdCB0byBvYnRhaW4gYSByZXBsYWNlbWVudCB2YWx1ZS5cblxuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9KU09OKGtleSk7XG4gICAgICAgIH1cblxuLy8gSWYgd2Ugd2VyZSBjYWxsZWQgd2l0aCBhIHJlcGxhY2VyIGZ1bmN0aW9uLCB0aGVuIGNhbGwgdGhlIHJlcGxhY2VyIHRvXG4vLyBvYnRhaW4gYSByZXBsYWNlbWVudCB2YWx1ZS5cblxuICAgICAgICBpZiAodHlwZW9mIHJlcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFsdWUgPSByZXAuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG5cbi8vIFdoYXQgaGFwcGVucyBuZXh0IGRlcGVuZHMgb24gdGhlIHZhbHVlJ3MgdHlwZS5cblxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgcmV0dXJuIHF1b3RlKHZhbHVlKTtcblxuICAgICAgICBjYXNlICdudW1iZXInOlxuXG4vLyBKU09OIG51bWJlcnMgbXVzdCBiZSBmaW5pdGUuIEVuY29kZSBub24tZmluaXRlIG51bWJlcnMgYXMgbnVsbC5cblxuICAgICAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSA/IFN0cmluZyh2YWx1ZSkgOiAnbnVsbCc7XG5cbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGNhc2UgJ251bGwnOlxuXG4vLyBJZiB0aGUgdmFsdWUgaXMgYSBib29sZWFuIG9yIG51bGwsIGNvbnZlcnQgaXQgdG8gYSBzdHJpbmcuIE5vdGU6XG4vLyB0eXBlb2YgbnVsbCBkb2VzIG5vdCBwcm9kdWNlICdudWxsJy4gVGhlIGNhc2UgaXMgaW5jbHVkZWQgaGVyZSBpblxuLy8gdGhlIHJlbW90ZSBjaGFuY2UgdGhhdCB0aGlzIGdldHMgZml4ZWQgc29tZWRheS5cblxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG5cbi8vIElmIHRoZSB0eXBlIGlzICdvYmplY3QnLCB3ZSBtaWdodCBiZSBkZWFsaW5nIHdpdGggYW4gb2JqZWN0IG9yIGFuIGFycmF5IG9yXG4vLyBudWxsLlxuXG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG5cbi8vIER1ZSB0byBhIHNwZWNpZmljYXRpb24gYmx1bmRlciBpbiBFQ01BU2NyaXB0LCB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0Jyxcbi8vIHNvIHdhdGNoIG91dCBmb3IgdGhhdCBjYXNlLlxuXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdudWxsJztcbiAgICAgICAgICAgIH1cblxuLy8gTWFrZSBhbiBhcnJheSB0byBob2xkIHRoZSBwYXJ0aWFsIHJlc3VsdHMgb2Ygc3RyaW5naWZ5aW5nIHRoaXMgb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgICAgICBnYXAgKz0gaW5kZW50O1xuICAgICAgICAgICAgcGFydGlhbCA9IFtdO1xuXG4vLyBJcyB0aGUgdmFsdWUgYW4gYXJyYXk/XG5cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuXG4vLyBUaGUgdmFsdWUgaXMgYW4gYXJyYXkuIFN0cmluZ2lmeSBldmVyeSBlbGVtZW50LiBVc2UgbnVsbCBhcyBhIHBsYWNlaG9sZGVyXG4vLyBmb3Igbm9uLUpTT04gdmFsdWVzLlxuXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsW2ldID0gc3RyKGksIHZhbHVlKSB8fCAnbnVsbCc7XG4gICAgICAgICAgICAgICAgfVxuXG4vLyBKb2luIGFsbCBvZiB0aGUgZWxlbWVudHMgdG9nZXRoZXIsIHNlcGFyYXRlZCB3aXRoIGNvbW1hcywgYW5kIHdyYXAgdGhlbSBpblxuLy8gYnJhY2tldHMuXG5cbiAgICAgICAgICAgICAgICB2ID0gcGFydGlhbC5sZW5ndGggPT09IDBcbiAgICAgICAgICAgICAgICAgICAgPyAnW10nXG4gICAgICAgICAgICAgICAgICAgIDogZ2FwXG4gICAgICAgICAgICAgICAgICAgID8gJ1tcXG4nICsgZ2FwICsgcGFydGlhbC5qb2luKCcsXFxuJyArIGdhcCkgKyAnXFxuJyArIG1pbmQgKyAnXSdcbiAgICAgICAgICAgICAgICAgICAgOiAnWycgKyBwYXJ0aWFsLmpvaW4oJywnKSArICddJztcbiAgICAgICAgICAgICAgICBnYXAgPSBtaW5kO1xuICAgICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgICAgfVxuXG4vLyBJZiB0aGUgcmVwbGFjZXIgaXMgYW4gYXJyYXksIHVzZSBpdCB0byBzZWxlY3QgdGhlIG1lbWJlcnMgdG8gYmUgc3RyaW5naWZpZWQuXG5cbiAgICAgICAgICAgIGlmIChyZXAgJiYgdHlwZW9mIHJlcCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByZXAubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcFtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSByZXBbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKGdhcCA/ICc6ICcgOiAnOicpICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4vLyBPdGhlcndpc2UsIGl0ZXJhdGUgdGhyb3VnaCBhbGwgb2YgdGhlIGtleXMgaW4gdGhlIG9iamVjdC5cblxuICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChnYXAgPyAnOiAnIDogJzonKSArIHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4vLyBKb2luIGFsbCBvZiB0aGUgbWVtYmVyIHRleHRzIHRvZ2V0aGVyLCBzZXBhcmF0ZWQgd2l0aCBjb21tYXMsXG4vLyBhbmQgd3JhcCB0aGVtIGluIGJyYWNlcy5cblxuICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgPyAne30nXG4gICAgICAgICAgICAgICAgOiBnYXBcbiAgICAgICAgICAgICAgICA/ICd7XFxuJyArIGdhcCArIHBhcnRpYWwuam9pbignLFxcbicgKyBnYXApICsgJ1xcbicgKyBtaW5kICsgJ30nXG4gICAgICAgICAgICAgICAgOiAneycgKyBwYXJ0aWFsLmpvaW4oJywnKSArICd9JztcbiAgICAgICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgfVxuICAgIH1cblxuLy8gSWYgdGhlIEpTT04gb2JqZWN0IGRvZXMgbm90IHlldCBoYXZlIGEgc3RyaW5naWZ5IG1ldGhvZCwgZ2l2ZSBpdCBvbmUuXG5cbiAgICBpZiAodHlwZW9mIEpTT04uc3RyaW5naWZ5ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVzY2FwYWJsZSA9IC9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxceDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XG4gICAgICAgIG1ldGEgPSB7ICAgIC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXG4gICAgICAgICAgICAnXFxiJzogJ1xcXFxiJyxcbiAgICAgICAgICAgICdcXHQnOiAnXFxcXHQnLFxuICAgICAgICAgICAgJ1xcbic6ICdcXFxcbicsXG4gICAgICAgICAgICAnXFxmJzogJ1xcXFxmJyxcbiAgICAgICAgICAgICdcXHInOiAnXFxcXHInLFxuICAgICAgICAgICAgJ1wiJyA6ICdcXFxcXCInLFxuICAgICAgICAgICAgJ1xcXFwnOiAnXFxcXFxcXFwnXG4gICAgICAgIH07XG4gICAgICAgIEpTT04uc3RyaW5naWZ5ID0gZnVuY3Rpb24gKHZhbHVlLCByZXBsYWNlciwgc3BhY2UpIHtcblxuLy8gVGhlIHN0cmluZ2lmeSBtZXRob2QgdGFrZXMgYSB2YWx1ZSBhbmQgYW4gb3B0aW9uYWwgcmVwbGFjZXIsIGFuZCBhbiBvcHRpb25hbFxuLy8gc3BhY2UgcGFyYW1ldGVyLCBhbmQgcmV0dXJucyBhIEpTT04gdGV4dC4gVGhlIHJlcGxhY2VyIGNhbiBiZSBhIGZ1bmN0aW9uXG4vLyB0aGF0IGNhbiByZXBsYWNlIHZhbHVlcywgb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IHdpbGwgc2VsZWN0IHRoZSBrZXlzLlxuLy8gQSBkZWZhdWx0IHJlcGxhY2VyIG1ldGhvZCBjYW4gYmUgcHJvdmlkZWQuIFVzZSBvZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGNhblxuLy8gcHJvZHVjZSB0ZXh0IHRoYXQgaXMgbW9yZSBlYXNpbHkgcmVhZGFibGUuXG5cbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgZ2FwID0gJyc7XG4gICAgICAgICAgICBpbmRlbnQgPSAnJztcblxuLy8gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG51bWJlciwgbWFrZSBhbiBpbmRlbnQgc3RyaW5nIGNvbnRhaW5pbmcgdGhhdFxuLy8gbWFueSBzcGFjZXMuXG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BhY2UgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNwYWNlOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ICs9ICcgJztcbiAgICAgICAgICAgICAgICB9XG5cbi8vIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgdXNlZCBhcyB0aGUgaW5kZW50IHN0cmluZy5cblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5kZW50ID0gc3BhY2U7XG4gICAgICAgICAgICB9XG5cbi8vIElmIHRoZXJlIGlzIGEgcmVwbGFjZXIsIGl0IG11c3QgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheS5cbi8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3IuXG5cbiAgICAgICAgICAgIHJlcCA9IHJlcGxhY2VyO1xuICAgICAgICAgICAgaWYgKHJlcGxhY2VyICYmIHR5cGVvZiByZXBsYWNlciAhPT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgICAgICAgICAgICAodHlwZW9mIHJlcGxhY2VyICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgcmVwbGFjZXIubGVuZ3RoICE9PSAnbnVtYmVyJykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0pTT04uc3RyaW5naWZ5Jyk7XG4gICAgICAgICAgICB9XG5cbi8vIE1ha2UgYSBmYWtlIHJvb3Qgb2JqZWN0IGNvbnRhaW5pbmcgb3VyIHZhbHVlIHVuZGVyIHRoZSBrZXkgb2YgJycuXG4vLyBSZXR1cm4gdGhlIHJlc3VsdCBvZiBzdHJpbmdpZnlpbmcgdGhlIHZhbHVlLlxuXG4gICAgICAgICAgICByZXR1cm4gc3RyKCcnLCB7Jyc6IHZhbHVlfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbi8vIElmIHRoZSBKU09OIG9iamVjdCBkb2VzIG5vdCB5ZXQgaGF2ZSBhIHBhcnNlIG1ldGhvZCwgZ2l2ZSBpdCBvbmUuXG5cbiAgICBpZiAodHlwZW9mIEpTT04ucGFyc2UgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY3ggPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZztcbiAgICAgICAgSlNPTi5wYXJzZSA9IGZ1bmN0aW9uICh0ZXh0LCByZXZpdmVyKSB7XG5cbi8vIFRoZSBwYXJzZSBtZXRob2QgdGFrZXMgYSB0ZXh0IGFuZCBhbiBvcHRpb25hbCByZXZpdmVyIGZ1bmN0aW9uLCBhbmQgcmV0dXJuc1xuLy8gYSBKYXZhU2NyaXB0IHZhbHVlIGlmIHRoZSB0ZXh0IGlzIGEgdmFsaWQgSlNPTiB0ZXh0LlxuXG4gICAgICAgICAgICB2YXIgajtcblxuICAgICAgICAgICAgZnVuY3Rpb24gd2Fsayhob2xkZXIsIGtleSkge1xuXG4vLyBUaGUgd2FsayBtZXRob2QgaXMgdXNlZCB0byByZWN1cnNpdmVseSB3YWxrIHRoZSByZXN1bHRpbmcgc3RydWN0dXJlIHNvXG4vLyB0aGF0IG1vZGlmaWNhdGlvbnMgY2FuIGJlIG1hZGUuXG5cbiAgICAgICAgICAgICAgICB2YXIgaywgdiwgdmFsdWUgPSBob2xkZXJba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHdhbGsodmFsdWUsIGspO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG5cbi8vIFBhcnNpbmcgaGFwcGVucyBpbiBmb3VyIHN0YWdlcy4gSW4gdGhlIGZpcnN0IHN0YWdlLCB3ZSByZXBsYWNlIGNlcnRhaW5cbi8vIFVuaWNvZGUgY2hhcmFjdGVycyB3aXRoIGVzY2FwZSBzZXF1ZW5jZXMuIEphdmFTY3JpcHQgaGFuZGxlcyBtYW55IGNoYXJhY3RlcnNcbi8vIGluY29ycmVjdGx5LCBlaXRoZXIgc2lsZW50bHkgZGVsZXRpbmcgdGhlbSwgb3IgdHJlYXRpbmcgdGhlbSBhcyBsaW5lIGVuZGluZ3MuXG5cbiAgICAgICAgICAgIHRleHQgPSBTdHJpbmcodGV4dCk7XG4gICAgICAgICAgICBjeC5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgaWYgKGN4LnRlc3QodGV4dCkpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGN4LCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1xcXFx1JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAoJzAwMDAnICsgYS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4vLyBJbiB0aGUgc2Vjb25kIHN0YWdlLCB3ZSBydW4gdGhlIHRleHQgYWdhaW5zdCByZWd1bGFyIGV4cHJlc3Npb25zIHRoYXQgbG9va1xuLy8gZm9yIG5vbi1KU09OIHBhdHRlcm5zLiBXZSBhcmUgZXNwZWNpYWxseSBjb25jZXJuZWQgd2l0aCAnKCknIGFuZCAnbmV3J1xuLy8gYmVjYXVzZSB0aGV5IGNhbiBjYXVzZSBpbnZvY2F0aW9uLCBhbmQgJz0nIGJlY2F1c2UgaXQgY2FuIGNhdXNlIG11dGF0aW9uLlxuLy8gQnV0IGp1c3QgdG8gYmUgc2FmZSwgd2Ugd2FudCB0byByZWplY3QgYWxsIHVuZXhwZWN0ZWQgZm9ybXMuXG5cbi8vIFdlIHNwbGl0IHRoZSBzZWNvbmQgc3RhZ2UgaW50byA0IHJlZ2V4cCBvcGVyYXRpb25zIGluIG9yZGVyIHRvIHdvcmsgYXJvdW5kXG4vLyBjcmlwcGxpbmcgaW5lZmZpY2llbmNpZXMgaW4gSUUncyBhbmQgU2FmYXJpJ3MgcmVnZXhwIGVuZ2luZXMuIEZpcnN0IHdlXG4vLyByZXBsYWNlIHRoZSBKU09OIGJhY2tzbGFzaCBwYWlycyB3aXRoICdAJyAoYSBub24tSlNPTiBjaGFyYWN0ZXIpLiBTZWNvbmQsIHdlXG4vLyByZXBsYWNlIGFsbCBzaW1wbGUgdmFsdWUgdG9rZW5zIHdpdGggJ10nIGNoYXJhY3RlcnMuIFRoaXJkLCB3ZSBkZWxldGUgYWxsXG4vLyBvcGVuIGJyYWNrZXRzIHRoYXQgZm9sbG93IGEgY29sb24gb3IgY29tbWEgb3IgdGhhdCBiZWdpbiB0aGUgdGV4dC4gRmluYWxseSxcbi8vIHdlIGxvb2sgdG8gc2VlIHRoYXQgdGhlIHJlbWFpbmluZyBjaGFyYWN0ZXJzIGFyZSBvbmx5IHdoaXRlc3BhY2Ugb3IgJ10nIG9yXG4vLyAnLCcgb3IgJzonIG9yICd7JyBvciAnfScuIElmIHRoYXQgaXMgc28sIHRoZW4gdGhlIHRleHQgaXMgc2FmZSBmb3IgZXZhbC5cblxuICAgICAgICAgICAgaWYgKC9eW1xcXSw6e31cXHNdKiQvXG4gICAgICAgICAgICAgICAgICAgIC50ZXN0KHRleHQucmVwbGFjZSgvXFxcXCg/OltcIlxcXFxcXC9iZm5ydF18dVswLTlhLWZBLUZdezR9KS9nLCAnQCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCJbXlwiXFxcXFxcblxccl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2csICddJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oPzpefDp8LCkoPzpcXHMqXFxbKSsvZywgJycpKSkge1xuXG4vLyBJbiB0aGUgdGhpcmQgc3RhZ2Ugd2UgdXNlIHRoZSBldmFsIGZ1bmN0aW9uIHRvIGNvbXBpbGUgdGhlIHRleHQgaW50byBhXG4vLyBKYXZhU2NyaXB0IHN0cnVjdHVyZS4gVGhlICd7JyBvcGVyYXRvciBpcyBzdWJqZWN0IHRvIGEgc3ludGFjdGljIGFtYmlndWl0eVxuLy8gaW4gSmF2YVNjcmlwdDogaXQgY2FuIGJlZ2luIGEgYmxvY2sgb3IgYW4gb2JqZWN0IGxpdGVyYWwuIFdlIHdyYXAgdGhlIHRleHRcbi8vIGluIHBhcmVucyB0byBlbGltaW5hdGUgdGhlIGFtYmlndWl0eS5cblxuICAgICAgICAgICAgICAgIGogPSBldmFsKCcoJyArIHRleHQgKyAnKScpO1xuXG4vLyBJbiB0aGUgb3B0aW9uYWwgZm91cnRoIHN0YWdlLCB3ZSByZWN1cnNpdmVseSB3YWxrIHRoZSBuZXcgc3RydWN0dXJlLCBwYXNzaW5nXG4vLyBlYWNoIG5hbWUvdmFsdWUgcGFpciB0byBhIHJldml2ZXIgZnVuY3Rpb24gZm9yIHBvc3NpYmxlIHRyYW5zZm9ybWF0aW9uLlxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByZXZpdmVyID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgICAgID8gd2Fsayh7Jyc6IGp9LCAnJylcbiAgICAgICAgICAgICAgICAgICAgOiBqO1xuICAgICAgICAgICAgfVxuXG4vLyBJZiB0aGUgdGV4dCBpcyBub3QgSlNPTiBwYXJzZWFibGUsIHRoZW4gYSBTeW50YXhFcnJvciBpcyB0aHJvd24uXG5cbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignSlNPTi5wYXJzZScpO1xuICAgICAgICB9O1xuICAgIH1cbn0oKSk7XG4iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGRvbWlmeSA9IHJlcXVpcmUoJ2RvbWlmeScpO1xudmFyIGVhY2ggPSByZXF1aXJlKCdlYWNoJyk7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnQnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgna2V5cycpO1xudmFyIHF1ZXJ5ID0gcmVxdWlyZSgncXVlcnknKTtcbnZhciB0cmltID0gcmVxdWlyZSgndHJpbScpO1xudmFyIHNsaWNlID0gW10uc2xpY2U7XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAodmFsKSB7XG4gIHJldHVybiAhISB2YWwgJiYgJ1tvYmplY3QgQXJyYXldJyA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCk7XG59O1xuXG4vKipcbiAqIEF0dHJpYnV0ZXMgc3VwcG9ydGVkLlxuICovXG5cbnZhciBhdHRycyA9IFtcbiAgJ2lkJyxcbiAgJ3NyYycsXG4gICdyZWwnLFxuICAnY29scycsXG4gICdyb3dzJyxcbiAgJ3R5cGUnLFxuICAnbmFtZScsXG4gICdocmVmJyxcbiAgJ3RpdGxlJyxcbiAgJ3N0eWxlJyxcbiAgJ3dpZHRoJyxcbiAgJ2hlaWdodCcsXG4gICdhY3Rpb24nLFxuICAnbWV0aG9kJyxcbiAgJ3RhYmluZGV4JyxcbiAgJ3BsYWNlaG9sZGVyJ1xuXTtcblxuLypcbiAqIEEgc2ltcGxlIHdheSB0byBjaGVjayBmb3IgSFRNTCBzdHJpbmdzIG9yIElEIHN0cmluZ3NcbiAqL1xuXG52YXIgcXVpY2tFeHByID0gL14oPzpbXiM8XSooPFtcXHdcXFddKz4pW14+XSokfCMoW1xcd1xcLV0qKSQpLztcblxuLyoqXG4gKiBFeHBvc2UgYGRvbSgpYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbTtcblxuLyoqXG4gKiBSZXR1cm4gYSBkb20gYExpc3RgIGZvciB0aGUgZ2l2ZW5cbiAqIGBodG1sYCwgc2VsZWN0b3IsIG9yIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxMaXN0fSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd8RUxlbWVudHxjb250ZXh0fSBjb250ZXh0XG4gKiBAcmV0dXJuIHtMaXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkb20oc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgLy8gYXJyYXlcbiAgaWYgKGlzQXJyYXkoc2VsZWN0b3IpKSB7XG4gICAgcmV0dXJuIG5ldyBMaXN0KHNlbGVjdG9yKTtcbiAgfVxuXG4gIC8vIExpc3RcbiAgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgTGlzdCkge1xuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxuXG4gIC8vIG5vZGVcbiAgaWYgKHNlbGVjdG9yLm5vZGVOYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBMaXN0KFtzZWxlY3Rvcl0pO1xuICB9XG5cbiAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBzZWxlY3Rvcikge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgc2VsZWN0b3InKTtcbiAgfVxuXG4gIC8vIGh0bWxcbiAgdmFyIGh0bWxzZWxlY3RvciA9IHRyaW0ubGVmdChzZWxlY3Rvcik7XG4gIGlmIChpc0hUTUwoaHRtbHNlbGVjdG9yKSkge1xuICAgIHJldHVybiBuZXcgTGlzdChbZG9taWZ5KGh0bWxzZWxlY3RvcildLCBodG1sc2VsZWN0b3IpO1xuICB9XG5cbiAgLy8gc2VsZWN0b3JcbiAgdmFyIGN0eCA9IGNvbnRleHRcbiAgICA/IChjb250ZXh0IGluc3RhbmNlb2YgTGlzdCA/IGNvbnRleHRbMF0gOiBjb250ZXh0KVxuICAgIDogZG9jdW1lbnQ7XG5cbiAgcmV0dXJuIG5ldyBMaXN0KHF1ZXJ5LmFsbChzZWxlY3RvciwgY3R4KSwgc2VsZWN0b3IpO1xufVxuXG4vKipcbiAqIFN0YXRpYzogRXhwb3NlIGBMaXN0YFxuICovXG5cbmRvbS5MaXN0ID0gTGlzdDtcblxuLyoqXG4gKiBTdGF0aWM6IEV4cG9zZSBzdXBwb3J0ZWQgYXR0cnMuXG4gKi9cblxuZG9tLmF0dHJzID0gYXR0cnM7XG5cbi8qKlxuICogU3RhdGljOiBNaXhpbiBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge09iamVjdHxGdW5jdGlvbn0gb2JqXG4gKiBAcmV0dXJuIHtMaXN0fSBzZWxmXG4gKi9cblxuZG9tLnVzZSA9IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gIHZhciBrZXlzID0gW107XG4gIHZhciB0bXA7XG5cbiAgaWYgKDIgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGtleXMucHVzaChuYW1lKTtcbiAgICB0bXAgPSB7fTtcbiAgICB0bXBbbmFtZV0gPSBmbjtcbiAgICBmbiA9IHRtcDtcbiAgfSBlbHNlIGlmIChuYW1lLm5hbWUpIHtcbiAgICAvLyB1c2UgZnVuY3Rpb24gbmFtZVxuICAgIGZuID0gbmFtZTtcbiAgICBuYW1lID0gbmFtZS5uYW1lO1xuICAgIGtleXMucHVzaChuYW1lKTtcbiAgICB0bXAgPSB7fTtcbiAgICB0bXBbbmFtZV0gPSBmbjtcbiAgICBmbiA9IHRtcDtcbiAgfSBlbHNlIHtcbiAgICBrZXlzID0gZ2V0S2V5cyhuYW1lKTtcbiAgICBmbiA9IG5hbWU7XG4gIH1cblxuICBmb3IodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgTGlzdC5wcm90b3R5cGVba2V5c1tpXV0gPSBmbltrZXlzW2ldXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYExpc3RgIHdpdGggdGhlXG4gKiBnaXZlbiBhcnJheS1pc2ggb2YgYGVsc2AgYW5kIGBzZWxlY3RvcmBcbiAqIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSBlbHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gTGlzdChlbHMsIHNlbGVjdG9yKSB7XG4gIGVscyA9IGVscyB8fCBbXTtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoID0gZWxzLmxlbmd0aDtcbiAgZm9yKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB0aGlzW2ldID0gZWxzW2ldO1xuICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG59XG5cbi8qKlxuICogUmVtYWtlIHRoZSBsaXN0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd8RUxlbWVudHxjb250ZXh0fSBjb250ZXh0XG4gKiBAcmV0dXJuIHtMaXN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuTGlzdC5wcm90b3R5cGUuZG9tID0gZG9tO1xuXG4vKipcbiAqIE1ha2UgYExpc3RgIGFuIGFycmF5LWxpa2Ugb2JqZWN0XG4gKi9cblxuTGlzdC5wcm90b3R5cGUubGVuZ3RoID0gMDtcbkxpc3QucHJvdG90eXBlLnNwbGljZSA9IEFycmF5LnByb3RvdHlwZS5zcGxpY2U7XG5cbi8qKlxuICogQXJyYXktbGlrZSBvYmplY3QgdG8gYXJyYXlcbiAqXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5MaXN0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBzbGljZS5jYWxsKHRoaXMpO1xufVxuXG4vKipcbiAqIEF0dHJpYnV0ZSBhY2Nlc3NvcnMuXG4gKi9cblxuZWFjaChhdHRycywgZnVuY3Rpb24obmFtZSl7XG4gIExpc3QucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24odmFsKXtcbiAgICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy5hdHRyKG5hbWUpO1xuICAgIHJldHVybiB0aGlzLmF0dHIobmFtZSwgdmFsKTtcbiAgfTtcbn0pO1xuXG4vKipcbiAqIE1peGluIHRoZSBBUElcbiAqL1xuXG5kb20udXNlKHJlcXVpcmUoJy4vbGliL2F0dHJpYnV0ZXMnKSk7XG5kb20udXNlKHJlcXVpcmUoJy4vbGliL2NsYXNzZXMnKSk7XG5kb20udXNlKHJlcXVpcmUoJy4vbGliL2V2ZW50cycpKTtcbmRvbS51c2UocmVxdWlyZSgnLi9saWIvbWFuaXB1bGF0ZScpKTtcbmRvbS51c2UocmVxdWlyZSgnLi9saWIvdHJhdmVyc2UnKSk7XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHN0cmluZyBpcyBIVE1MXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzSFRNTChzdHIpIHtcbiAgLy8gRmFzdGVyIHRoYW4gcnVubmluZyByZWdleCwgaWYgc3RyIHN0YXJ0cyB3aXRoIGA8YCBhbmQgZW5kcyB3aXRoIGA+YCwgYXNzdW1lIGl0J3MgSFRNTFxuICBpZiAoc3RyLmNoYXJBdCgwKSA9PT0gJzwnICYmIHN0ci5jaGFyQXQoc3RyLmxlbmd0aCAtIDEpID09PSAnPicgJiYgc3RyLmxlbmd0aCA+PSAzKSByZXR1cm4gdHJ1ZTtcblxuICAvLyBSdW4gdGhlIHJlZ2V4XG4gIHZhciBtYXRjaCA9IHF1aWNrRXhwci5leGVjKHN0cik7XG4gIHJldHVybiAhIShtYXRjaCAmJiBtYXRjaFsxXSk7XG59XG4iLCJcbi8qKlxuICogRXhwb3NlIGBwYXJzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcblxuLyoqXG4gKiBUZXN0cyBmb3IgYnJvd3NlciBzdXBwb3J0LlxuICovXG5cbnZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbi8vIFNldHVwXG5kaXYuaW5uZXJIVE1MID0gJyAgPGxpbmsvPjx0YWJsZT48L3RhYmxlPjxhIGhyZWY9XCIvYVwiPmE8L2E+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiLz4nO1xuLy8gTWFrZSBzdXJlIHRoYXQgbGluayBlbGVtZW50cyBnZXQgc2VyaWFsaXplZCBjb3JyZWN0bHkgYnkgaW5uZXJIVE1MXG4vLyBUaGlzIHJlcXVpcmVzIGEgd3JhcHBlciBlbGVtZW50IGluIElFXG52YXIgaW5uZXJIVE1MQnVnID0gIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGluaycpLmxlbmd0aDtcbmRpdiA9IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBXcmFwIG1hcCBmcm9tIGpxdWVyeS5cbiAqL1xuXG52YXIgbWFwID0ge1xuICBsZWdlbmQ6IFsxLCAnPGZpZWxkc2V0PicsICc8L2ZpZWxkc2V0PiddLFxuICB0cjogWzIsICc8dGFibGU+PHRib2R5PicsICc8L3Rib2R5PjwvdGFibGU+J10sXG4gIGNvbDogWzIsICc8dGFibGU+PHRib2R5PjwvdGJvZHk+PGNvbGdyb3VwPicsICc8L2NvbGdyb3VwPjwvdGFibGU+J10sXG4gIC8vIGZvciBzY3JpcHQvbGluay9zdHlsZSB0YWdzIHRvIHdvcmsgaW4gSUU2LTgsIHlvdSBoYXZlIHRvIHdyYXBcbiAgLy8gaW4gYSBkaXYgd2l0aCBhIG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlciBpbiBmcm9udCwgaGEhXG4gIF9kZWZhdWx0OiBpbm5lckhUTUxCdWcgPyBbMSwgJ1g8ZGl2PicsICc8L2Rpdj4nXSA6IFswLCAnJywgJyddXG59O1xuXG5tYXAudGQgPVxubWFwLnRoID0gWzMsICc8dGFibGU+PHRib2R5Pjx0cj4nLCAnPC90cj48L3Rib2R5PjwvdGFibGU+J107XG5cbm1hcC5vcHRpb24gPVxubWFwLm9wdGdyb3VwID0gWzEsICc8c2VsZWN0IG11bHRpcGxlPVwibXVsdGlwbGVcIj4nLCAnPC9zZWxlY3Q+J107XG5cbm1hcC50aGVhZCA9XG5tYXAudGJvZHkgPVxubWFwLmNvbGdyb3VwID1cbm1hcC5jYXB0aW9uID1cbm1hcC50Zm9vdCA9IFsxLCAnPHRhYmxlPicsICc8L3RhYmxlPiddO1xuXG5tYXAucG9seWxpbmUgPVxubWFwLmVsbGlwc2UgPVxubWFwLnBvbHlnb24gPVxubWFwLmNpcmNsZSA9XG5tYXAudGV4dCA9XG5tYXAubGluZSA9XG5tYXAucGF0aCA9XG5tYXAucmVjdCA9XG5tYXAuZyA9IFsxLCAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjEuMVwiPicsJzwvc3ZnPiddO1xuXG4vKipcbiAqIFBhcnNlIGBodG1sYCBhbmQgcmV0dXJuIGEgRE9NIE5vZGUgaW5zdGFuY2UsIHdoaWNoIGNvdWxkIGJlIGEgVGV4dE5vZGUsXG4gKiBIVE1MIERPTSBOb2RlIG9mIHNvbWUga2luZCAoPGRpdj4gZm9yIGV4YW1wbGUpLCBvciBhIERvY3VtZW50RnJhZ21lbnRcbiAqIGluc3RhbmNlLCBkZXBlbmRpbmcgb24gdGhlIGNvbnRlbnRzIG9mIHRoZSBgaHRtbGAgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sIC0gSFRNTCBzdHJpbmcgdG8gXCJkb21pZnlcIlxuICogQHBhcmFtIHtEb2N1bWVudH0gZG9jIC0gVGhlIGBkb2N1bWVudGAgaW5zdGFuY2UgdG8gY3JlYXRlIHRoZSBOb2RlIGZvclxuICogQHJldHVybiB7RE9NTm9kZX0gdGhlIFRleHROb2RlLCBET00gTm9kZSwgb3IgRG9jdW1lbnRGcmFnbWVudCBpbnN0YW5jZVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2UoaHRtbCwgZG9jKSB7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgaHRtbCkgdGhyb3cgbmV3IFR5cGVFcnJvcignU3RyaW5nIGV4cGVjdGVkJyk7XG5cbiAgLy8gZGVmYXVsdCB0byB0aGUgZ2xvYmFsIGBkb2N1bWVudGAgb2JqZWN0XG4gIGlmICghZG9jKSBkb2MgPSBkb2N1bWVudDtcblxuICAvLyB0YWcgbmFtZVxuICB2YXIgbSA9IC88KFtcXHc6XSspLy5leGVjKGh0bWwpO1xuICBpZiAoIW0pIHJldHVybiBkb2MuY3JlYXRlVGV4dE5vZGUoaHRtbCk7XG5cbiAgaHRtbCA9IGh0bWwucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpOyAvLyBSZW1vdmUgbGVhZGluZy90cmFpbGluZyB3aGl0ZXNwYWNlXG5cbiAgdmFyIHRhZyA9IG1bMV07XG5cbiAgLy8gYm9keSBzdXBwb3J0XG4gIGlmICh0YWcgPT0gJ2JvZHknKSB7XG4gICAgdmFyIGVsID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICBlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICB9XG5cbiAgLy8gd3JhcCBtYXBcbiAgdmFyIHdyYXAgPSBtYXBbdGFnXSB8fCBtYXAuX2RlZmF1bHQ7XG4gIHZhciBkZXB0aCA9IHdyYXBbMF07XG4gIHZhciBwcmVmaXggPSB3cmFwWzFdO1xuICB2YXIgc3VmZml4ID0gd3JhcFsyXTtcbiAgdmFyIGVsID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBlbC5pbm5lckhUTUwgPSBwcmVmaXggKyBodG1sICsgc3VmZml4O1xuICB3aGlsZSAoZGVwdGgtLSkgZWwgPSBlbC5sYXN0Q2hpbGQ7XG5cbiAgLy8gb25lIGVsZW1lbnRcbiAgaWYgKGVsLmZpcnN0Q2hpbGQgPT0gZWwubGFzdENoaWxkKSB7XG4gICAgcmV0dXJuIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpO1xuICB9XG5cbiAgLy8gc2V2ZXJhbCBlbGVtZW50c1xuICB2YXIgZnJhZ21lbnQgPSBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkge1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpKTtcbiAgfVxuXG4gIHJldHVybiBmcmFnbWVudDtcbn1cbiIsIlxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnRyeSB7XG4gIHZhciB0eXBlID0gcmVxdWlyZSgndHlwZScpO1xufSBjYXRjaCAoZXJyKSB7XG4gIHZhciB0eXBlID0gcmVxdWlyZSgnY29tcG9uZW50LXR5cGUnKTtcbn1cblxudmFyIHRvRnVuY3Rpb24gPSByZXF1aXJlKCd0by1mdW5jdGlvbicpO1xuXG4vKipcbiAqIEhPUCByZWZlcmVuY2UuXG4gKi9cblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogSXRlcmF0ZSB0aGUgZ2l2ZW4gYG9iamAgYW5kIGludm9rZSBgZm4odmFsLCBpKWBcbiAqIGluIG9wdGlvbmFsIGNvbnRleHQgYGN0eGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl8T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdH0gW2N0eF1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIGZuLCBjdHgpe1xuICBmbiA9IHRvRnVuY3Rpb24oZm4pO1xuICBjdHggPSBjdHggfHwgdGhpcztcbiAgc3dpdGNoICh0eXBlKG9iaikpIHtcbiAgICBjYXNlICdhcnJheSc6XG4gICAgICByZXR1cm4gYXJyYXkob2JqLCBmbiwgY3R4KTtcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgaWYgKCdudW1iZXInID09IHR5cGVvZiBvYmoubGVuZ3RoKSByZXR1cm4gYXJyYXkob2JqLCBmbiwgY3R4KTtcbiAgICAgIHJldHVybiBvYmplY3Qob2JqLCBmbiwgY3R4KTtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHN0cmluZyhvYmosIGZuLCBjdHgpO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgc3RyaW5nIGNoYXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBvYmpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzdHJpbmcob2JqLCBmbiwgY3R4KSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgKytpKSB7XG4gICAgZm4uY2FsbChjdHgsIG9iai5jaGFyQXQoaSksIGkpO1xuICB9XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvYmplY3Qga2V5cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gb2JqZWN0KG9iaiwgZm4sIGN0eCkge1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhcy5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgZm4uY2FsbChjdHgsIGtleSwgb2JqW2tleV0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEl0ZXJhdGUgYXJyYXktaXNoLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBhcnJheShvYmosIGZuLCBjdHgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyArK2kpIHtcbiAgICBmbi5jYWxsKGN0eCwgb2JqW2ldLCBpKTtcbiAgfVxufVxuIiwiXG4vKipcbiAqIHRvU3RyaW5nIHJlZi5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBvZiBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xuICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwodmFsKSkge1xuICAgIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzogcmV0dXJuICdmdW5jdGlvbic7XG4gICAgY2FzZSAnW29iamVjdCBEYXRlXSc6IHJldHVybiAnZGF0ZSc7XG4gICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzogcmV0dXJuICdyZWdleHAnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6IHJldHVybiAnYXJndW1lbnRzJztcbiAgICBjYXNlICdbb2JqZWN0IEFycmF5XSc6IHJldHVybiAnYXJyYXknO1xuICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6IHJldHVybiAnc3RyaW5nJztcbiAgfVxuXG4gIGlmICh2YWwgPT09IG51bGwpIHJldHVybiAnbnVsbCc7XG4gIGlmICh2YWwgPT09IHVuZGVmaW5lZCkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAodmFsICYmIHZhbC5ub2RlVHlwZSA9PT0gMSkgcmV0dXJuICdlbGVtZW50JztcbiAgaWYgKHZhbCA9PT0gT2JqZWN0KHZhbCkpIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07XG4iLCJcbi8qKlxuICogTW9kdWxlIERlcGVuZGVuY2llc1xuICovXG5cbnZhciBleHByO1xudHJ5IHtcbiAgZXhwciA9IHJlcXVpcmUoJ3Byb3BzJyk7XG59IGNhdGNoKGUpIHtcbiAgZXhwciA9IHJlcXVpcmUoJ2NvbXBvbmVudC1wcm9wcycpO1xufVxuXG4vKipcbiAqIEV4cG9zZSBgdG9GdW5jdGlvbigpYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvRnVuY3Rpb247XG5cbi8qKlxuICogQ29udmVydCBgb2JqYCB0byBhIGBGdW5jdGlvbmAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gb2JqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHRvRnVuY3Rpb24ob2JqKSB7XG4gIHN3aXRjaCAoe30udG9TdHJpbmcuY2FsbChvYmopKSB7XG4gICAgY2FzZSAnW29iamVjdCBPYmplY3RdJzpcbiAgICAgIHJldHVybiBvYmplY3RUb0Z1bmN0aW9uKG9iaik7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOlxuICAgICAgcmV0dXJuIG9iajtcbiAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgcmV0dXJuIHN0cmluZ1RvRnVuY3Rpb24ob2JqKTtcbiAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgcmV0dXJuIHJlZ2V4cFRvRnVuY3Rpb24ob2JqKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGRlZmF1bHRUb0Z1bmN0aW9uKG9iaik7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZhdWx0IHRvIHN0cmljdCBlcXVhbGl0eS5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZGVmYXVsdFRvRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmope1xuICAgIHJldHVybiB2YWwgPT09IG9iajtcbiAgfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGByZWAgdG8gYSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1JlZ0V4cH0gcmVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcmVnZXhwVG9GdW5jdGlvbihyZSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqKXtcbiAgICByZXR1cm4gcmUudGVzdChvYmopO1xuICB9O1xufVxuXG4vKipcbiAqIENvbnZlcnQgcHJvcGVydHkgYHN0cmAgdG8gYSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ1RvRnVuY3Rpb24oc3RyKSB7XG4gIC8vIGltbWVkaWF0ZSBzdWNoIGFzIFwiPiAyMFwiXG4gIGlmICgvXiAqXFxXKy8udGVzdChzdHIpKSByZXR1cm4gbmV3IEZ1bmN0aW9uKCdfJywgJ3JldHVybiBfICcgKyBzdHIpO1xuXG4gIC8vIHByb3BlcnRpZXMgc3VjaCBhcyBcIm5hbWUuZmlyc3RcIiBvciBcImFnZSA+IDE4XCIgb3IgXCJhZ2UgPiAxOCAmJiBhZ2UgPCAzNlwiXG4gIHJldHVybiBuZXcgRnVuY3Rpb24oJ18nLCAncmV0dXJuICcgKyBnZXQoc3RyKSk7XG59XG5cbi8qKlxuICogQ29udmVydCBgb2JqZWN0YCB0byBhIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gb2JqZWN0VG9GdW5jdGlvbihvYmopIHtcbiAgdmFyIG1hdGNoID0ge307XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBtYXRjaFtrZXldID0gdHlwZW9mIG9ialtrZXldID09PSAnc3RyaW5nJ1xuICAgICAgPyBkZWZhdWx0VG9GdW5jdGlvbihvYmpba2V5XSlcbiAgICAgIDogdG9GdW5jdGlvbihvYmpba2V5XSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCl7XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yICh2YXIga2V5IGluIG1hdGNoKSB7XG4gICAgICBpZiAoIShrZXkgaW4gdmFsKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFtYXRjaFtrZXldKHZhbFtrZXldKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cblxuLyoqXG4gKiBCdWlsdCB0aGUgZ2V0dGVyIGZ1bmN0aW9uLiBTdXBwb3J0cyBnZXR0ZXIgc3R5bGUgZnVuY3Rpb25zXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZ2V0KHN0cikge1xuICB2YXIgcHJvcHMgPSBleHByKHN0cik7XG4gIGlmICghcHJvcHMubGVuZ3RoKSByZXR1cm4gJ18uJyArIHN0cjtcblxuICB2YXIgdmFsLCBpLCBwcm9wO1xuICBmb3IgKGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICBwcm9wID0gcHJvcHNbaV07XG4gICAgdmFsID0gJ18uJyArIHByb3A7XG4gICAgdmFsID0gXCIoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgXCIgKyB2YWwgKyBcIiA/IFwiICsgdmFsICsgXCIoKSA6IFwiICsgdmFsICsgXCIpXCI7XG5cbiAgICAvLyBtaW1pYyBuZWdhdGl2ZSBsb29rYmVoaW5kIHRvIGF2b2lkIHByb2JsZW1zIHdpdGggbmVzdGVkIHByb3BlcnRpZXNcbiAgICBzdHIgPSBzdHJpcE5lc3RlZChwcm9wLCBzdHIsIHZhbCk7XG4gIH1cblxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIE1pbWljIG5lZ2F0aXZlIGxvb2tiZWhpbmQgdG8gYXZvaWQgcHJvYmxlbXMgd2l0aCBuZXN0ZWQgcHJvcGVydGllcy5cbiAqXG4gKiBTZWU6IGh0dHA6Ly9ibG9nLnN0ZXZlbmxldml0aGFuLmNvbS9hcmNoaXZlcy9taW1pYy1sb29rYmVoaW5kLWphdmFzY3JpcHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc3RyaXBOZXN0ZWQgKHByb3AsIHN0ciwgdmFsKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShuZXcgUmVnRXhwKCcoXFxcXC4pPycgKyBwcm9wLCAnZycpLCBmdW5jdGlvbigkMCwgJDEpIHtcbiAgICByZXR1cm4gJDEgPyAkMCA6IHZhbDtcbiAgfSk7XG59XG4iLCIvKipcbiAqIEdsb2JhbCBOYW1lc1xuICovXG5cbnZhciBnbG9iYWxzID0gL1xcYih0aGlzfEFycmF5fERhdGV8T2JqZWN0fE1hdGh8SlNPTilcXGIvZztcblxuLyoqXG4gKiBSZXR1cm4gaW1tZWRpYXRlIGlkZW50aWZpZXJzIHBhcnNlZCBmcm9tIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSBtYXAgZnVuY3Rpb24gb3IgcHJlZml4XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIsIGZuKXtcbiAgdmFyIHAgPSB1bmlxdWUocHJvcHMoc3RyKSk7XG4gIGlmIChmbiAmJiAnc3RyaW5nJyA9PSB0eXBlb2YgZm4pIGZuID0gcHJlZml4ZWQoZm4pO1xuICBpZiAoZm4pIHJldHVybiBtYXAoc3RyLCBwLCBmbik7XG4gIHJldHVybiBwO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaW1tZWRpYXRlIGlkZW50aWZpZXJzIGluIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcHJvcHMoc3RyKSB7XG4gIHJldHVybiBzdHJcbiAgICAucmVwbGFjZSgvXFwuXFx3K3xcXHcrICpcXCh8XCJbXlwiXSpcInwnW14nXSonfFxcLyhbXi9dKylcXC8vZywgJycpXG4gICAgLnJlcGxhY2UoZ2xvYmFscywgJycpXG4gICAgLm1hdGNoKC9bJGEtekEtWl9dXFx3Ki9nKVxuICAgIHx8IFtdO1xufVxuXG4vKipcbiAqIFJldHVybiBgc3RyYCB3aXRoIGBwcm9wc2AgbWFwcGVkIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1hcChzdHIsIHByb3BzLCBmbikge1xuICB2YXIgcmUgPSAvXFwuXFx3K3xcXHcrICpcXCh8XCJbXlwiXSpcInwnW14nXSonfFxcLyhbXi9dKylcXC98W2EtekEtWl9dXFx3Ki9nO1xuICByZXR1cm4gc3RyLnJlcGxhY2UocmUsIGZ1bmN0aW9uKF8pe1xuICAgIGlmICgnKCcgPT0gX1tfLmxlbmd0aCAtIDFdKSByZXR1cm4gZm4oXyk7XG4gICAgaWYgKCF+cHJvcHMuaW5kZXhPZihfKSkgcmV0dXJuIF87XG4gICAgcmV0dXJuIGZuKF8pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdW5pcXVlIGFycmF5LlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB1bmlxdWUoYXJyKSB7XG4gIHZhciByZXQgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGlmICh+cmV0LmluZGV4T2YoYXJyW2ldKSkgY29udGludWU7XG4gICAgcmV0LnB1c2goYXJyW2ldKTtcbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogTWFwIHdpdGggcHJlZml4IGBzdHJgLlxuICovXG5cbmZ1bmN0aW9uIHByZWZpeGVkKHN0cikge1xuICByZXR1cm4gZnVuY3Rpb24oXyl7XG4gICAgcmV0dXJuIHN0ciArIF87XG4gIH07XG59XG4iLCJ2YXIgYmluZCA9IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ2F0dGFjaEV2ZW50JyxcbiAgICB1bmJpbmQgPSB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciA/ICdyZW1vdmVFdmVudExpc3RlbmVyJyA6ICdkZXRhY2hFdmVudCcsXG4gICAgcHJlZml4ID0gYmluZCAhPT0gJ2FkZEV2ZW50TGlzdGVuZXInID8gJ29uJyA6ICcnO1xuXG4vKipcbiAqIEJpbmQgYGVsYCBldmVudCBgdHlwZWAgdG8gYGZuYC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FwdHVyZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuYmluZCA9IGZ1bmN0aW9uKGVsLCB0eXBlLCBmbiwgY2FwdHVyZSl7XG4gIGVsW2JpbmRdKHByZWZpeCArIHR5cGUsIGZuLCBjYXB0dXJlIHx8IGZhbHNlKTtcbiAgcmV0dXJuIGZuO1xufTtcblxuLyoqXG4gKiBVbmJpbmQgYGVsYCBldmVudCBgdHlwZWAncyBjYWxsYmFjayBgZm5gLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtCb29sZWFufSBjYXB0dXJlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy51bmJpbmQgPSBmdW5jdGlvbihlbCwgdHlwZSwgZm4sIGNhcHR1cmUpe1xuICBlbFt1bmJpbmRdKHByZWZpeCArIHR5cGUsIGZuLCBjYXB0dXJlIHx8IGZhbHNlKTtcbiAgcmV0dXJuIGZuO1xufTsiLCJ2YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbihvYmope1xuICB2YXIga2V5cyA9IFtdO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzLmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn07XG4iLCJmdW5jdGlvbiBvbmUoc2VsZWN0b3IsIGVsKSB7XG4gIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbn1cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VsZWN0b3IsIGVsKXtcbiAgZWwgPSBlbCB8fCBkb2N1bWVudDtcbiAgcmV0dXJuIG9uZShzZWxlY3RvciwgZWwpO1xufTtcblxuZXhwb3J0cy5hbGwgPSBmdW5jdGlvbihzZWxlY3RvciwgZWwpe1xuICBlbCA9IGVsIHx8IGRvY3VtZW50O1xuICByZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG59O1xuXG5leHBvcnRzLmVuZ2luZSA9IGZ1bmN0aW9uKG9iail7XG4gIGlmICghb2JqLm9uZSkgdGhyb3cgbmV3IEVycm9yKCcub25lIGNhbGxiYWNrIHJlcXVpcmVkJyk7XG4gIGlmICghb2JqLmFsbCkgdGhyb3cgbmV3IEVycm9yKCcuYWxsIGNhbGxiYWNrIHJlcXVpcmVkJyk7XG4gIG9uZSA9IG9iai5vbmU7XG4gIGV4cG9ydHMuYWxsID0gb2JqLmFsbDtcbiAgcmV0dXJuIGV4cG9ydHM7XG59O1xuIiwiLyoqXG4gKiBNb2R1bGUgRGVwZW5kZW5jaWVzXG4gKi9cblxudmFyIHZhbHVlID0gcmVxdWlyZSgndmFsdWUnKTtcblxuLyoqXG4gKiBTZXQgYXR0cmlidXRlIGBuYW1lYCB0byBgdmFsYCwgb3IgZ2V0IGF0dHIgYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gW3ZhbF1cbiAqIEByZXR1cm4ge1N0cmluZ3xMaXN0fSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uKG5hbWUsIHZhbCl7XG4gIC8vIGdldFxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXNbMF0gJiYgdGhpc1swXS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gIH1cblxuICAvLyByZW1vdmVcbiAgaWYgKG51bGwgPT0gdmFsKSB7XG4gICAgcmV0dXJuIHRoaXMucmVtb3ZlQXR0cihuYW1lKTtcbiAgfVxuXG4gIC8vIHNldFxuICByZXR1cm4gdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcbiAgICBlbC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhdHRyaWJ1dGUgYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtMaXN0fSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMucmVtb3ZlQXR0ciA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBTZXQgcHJvcGVydHkgYG5hbWVgIHRvIGB2YWxgLCBvciBnZXQgcHJvcGVydHkgYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gW3ZhbF1cbiAqIEByZXR1cm4ge09iamVjdHxMaXN0fSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMucHJvcCA9IGZ1bmN0aW9uKG5hbWUsIHZhbCl7XG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpc1swXSAmJiB0aGlzWzBdW25hbWVdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZm9yRWFjaChmdW5jdGlvbihlbCl7XG4gICAgZWxbbmFtZV0gPSB2YWw7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIGZpcnN0IGVsZW1lbnQncyB2YWx1ZSBvciBzZXQgc2VsZWN0ZWRcbiAqIGVsZW1lbnQgdmFsdWVzIHRvIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IFt2YWxdXG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy52YWwgPVxuZXhwb3J0cy52YWx1ZSA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpc1swXVxuICAgICAgPyB2YWx1ZSh0aGlzWzBdKVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKXtcbiAgICB2YWx1ZShlbCwgdmFsKTtcbiAgfSk7XG59O1xuIiwiXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIHR5cGVPZiA9IHJlcXVpcmUoJ3R5cGUnKTtcblxuLyoqXG4gKiBTZXQgb3IgZ2V0IGBlbGAncycgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbCwgdmFsKXtcbiAgaWYgKDIgPT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHNldChlbCwgdmFsKTtcbiAgcmV0dXJuIGdldChlbCk7XG59O1xuXG4vKipcbiAqIEdldCBgZWxgJ3MgdmFsdWUuXG4gKi9cblxuZnVuY3Rpb24gZ2V0KGVsKSB7XG4gIHN3aXRjaCAodHlwZShlbCkpIHtcbiAgICBjYXNlICdjaGVja2JveCc6XG4gICAgY2FzZSAncmFkaW8nOlxuICAgICAgaWYgKGVsLmNoZWNrZWQpIHtcbiAgICAgICAgdmFyIGF0dHIgPSBlbC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgICAgIHJldHVybiBudWxsID09IGF0dHIgPyB0cnVlIDogYXR0cjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICBjYXNlICdyYWRpb2dyb3VwJzpcbiAgICAgIGZvciAodmFyIGkgPSAwLCByYWRpbzsgcmFkaW8gPSBlbFtpXTsgaSsrKSB7XG4gICAgICAgIGlmIChyYWRpby5jaGVja2VkKSByZXR1cm4gcmFkaW8udmFsdWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgZm9yICh2YXIgaSA9IDAsIG9wdGlvbjsgb3B0aW9uID0gZWwub3B0aW9uc1tpXTsgaSsrKSB7XG4gICAgICAgIGlmIChvcHRpb24uc2VsZWN0ZWQpIHJldHVybiBvcHRpb24udmFsdWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGVsLnZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogU2V0IGBlbGAncyB2YWx1ZS5cbiAqL1xuXG5mdW5jdGlvbiBzZXQoZWwsIHZhbCkge1xuICBzd2l0Y2ggKHR5cGUoZWwpKSB7XG4gICAgY2FzZSAnY2hlY2tib3gnOlxuICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5jaGVja2VkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyYWRpb2dyb3VwJzpcbiAgICAgIGZvciAodmFyIGkgPSAwLCByYWRpbzsgcmFkaW8gPSBlbFtpXTsgaSsrKSB7XG4gICAgICAgIHJhZGlvLmNoZWNrZWQgPSByYWRpby52YWx1ZSA9PT0gdmFsO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGZvciAodmFyIGkgPSAwLCBvcHRpb247IG9wdGlvbiA9IGVsLm9wdGlvbnNbaV07IGkrKykge1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBvcHRpb24udmFsdWUgPT09IHZhbDtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBlbC52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKipcbiAqIEVsZW1lbnQgdHlwZS5cbiAqL1xuXG5mdW5jdGlvbiB0eXBlKGVsKSB7XG4gIHZhciBncm91cCA9ICdhcnJheScgPT0gdHlwZU9mKGVsKSB8fCAnb2JqZWN0JyA9PSB0eXBlT2YoZWwpO1xuICBpZiAoZ3JvdXApIGVsID0gZWxbMF07XG4gIHZhciBuYW1lID0gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgdmFyIHR5cGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcblxuICBpZiAoZ3JvdXAgJiYgdHlwZSAmJiAncmFkaW8nID09IHR5cGUudG9Mb3dlckNhc2UoKSkgcmV0dXJuICdyYWRpb2dyb3VwJztcbiAgaWYgKCdpbnB1dCcgPT0gbmFtZSAmJiB0eXBlICYmICdjaGVja2JveCcgPT0gdHlwZS50b0xvd2VyQ2FzZSgpKSByZXR1cm4gJ2NoZWNrYm94JztcbiAgaWYgKCdpbnB1dCcgPT0gbmFtZSAmJiB0eXBlICYmICdyYWRpbycgPT0gdHlwZS50b0xvd2VyQ2FzZSgpKSByZXR1cm4gJ3JhZGlvJztcbiAgaWYgKCdzZWxlY3QnID09IG5hbWUpIHJldHVybiAnc2VsZWN0JztcbiAgcmV0dXJuIG5hbWU7XG59XG4iLCIvKipcbiAqIE1vZHVsZSBEZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgY2xhc3NlcyA9IHJlcXVpcmUoJ2NsYXNzZXMnKTtcblxuLyoqXG4gKiBBZGQgdGhlIGdpdmVuIGNsYXNzIGBuYW1lYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7TGlzdH0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmFkZENsYXNzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiB0aGlzLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICBlbC5fY2xhc3NlcyA9IGVsLl9jbGFzc2VzIHx8IGNsYXNzZXMoZWwpO1xuICAgIGVsLl9jbGFzc2VzLmFkZChuYW1lKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2xhc3MgYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gbmFtZVxuICogQHJldHVybiB7TGlzdH0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiB0aGlzLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICBlbC5fY2xhc3NlcyA9IGVsLl9jbGFzc2VzIHx8IGNsYXNzZXMoZWwpO1xuICAgIGVsLl9jbGFzc2VzLnJlbW92ZShuYW1lKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFRvZ2dsZSB0aGUgZ2l2ZW4gY2xhc3MgYG5hbWVgLFxuICogb3B0aW9uYWxseSBhIGBib29sYCBtYXkgYmUgZ2l2ZW5cbiAqIHRvIGluZGljYXRlIHRoYXQgdGhlIGNsYXNzIHNob3VsZFxuICogYmUgYWRkZWQgd2hlbiB0cnV0aHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYm9vbFxuICogQHJldHVybiB7TGlzdH0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24obmFtZSwgYm9vbCl7XG4gIHZhciBmbiA9ICd0b2dnbGUnO1xuXG4gIC8vIHRvZ2dsZSB3aXRoIGJvb2xlYW5cbiAgaWYgKDIgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGZuID0gYm9vbCA/ICdhZGQnIDogJ3JlbW92ZSc7XG4gIH1cblxuICByZXR1cm4gdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgZWwuX2NsYXNzZXMgPSBlbC5fY2xhc3NlcyB8fCBjbGFzc2VzKGVsKTtcbiAgICBlbC5fY2xhc3Nlc1tmbl0obmFtZSk7XG4gIH0pXG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiBjbGFzcyBgbmFtZWAgaXMgcHJlc2VudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5oYXNDbGFzcyA9IGZ1bmN0aW9uKG5hbWUpe1xuICB2YXIgZWw7XG5cbiAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGVsID0gdGhpc1tpXTtcbiAgICBlbC5fY2xhc3NlcyA9IGVsLl9jbGFzc2VzIHx8IGNsYXNzZXMoZWwpO1xuICAgIGlmIChlbC5fY2xhc3Nlcy5oYXMobmFtZSkpIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgaW5kZXggPSByZXF1aXJlKCdpbmRleG9mJyk7XG5cbi8qKlxuICogV2hpdGVzcGFjZSByZWdleHAuXG4gKi9cblxudmFyIHJlID0gL1xccysvO1xuXG4vKipcbiAqIHRvU3RyaW5nIHJlZmVyZW5jZS5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFdyYXAgYGVsYCBpbiBhIGBDbGFzc0xpc3RgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEByZXR1cm4ge0NsYXNzTGlzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbCl7XG4gIHJldHVybiBuZXcgQ2xhc3NMaXN0KGVsKTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBDbGFzc0xpc3QgZm9yIGBlbGAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gQ2xhc3NMaXN0KGVsKSB7XG4gIGlmICghZWwgfHwgIWVsLm5vZGVUeXBlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBIERPTSBlbGVtZW50IHJlZmVyZW5jZSBpcyByZXF1aXJlZCcpO1xuICB9XG4gIHRoaXMuZWwgPSBlbDtcbiAgdGhpcy5saXN0ID0gZWwuY2xhc3NMaXN0O1xufVxuXG4vKipcbiAqIEFkZCBjbGFzcyBgbmFtZWAgaWYgbm90IGFscmVhZHkgcHJlc2VudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Q2xhc3NMaXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5DbGFzc0xpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG5hbWUpe1xuICAvLyBjbGFzc0xpc3RcbiAgaWYgKHRoaXMubGlzdCkge1xuICAgIHRoaXMubGlzdC5hZGQobmFtZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBmYWxsYmFja1xuICB2YXIgYXJyID0gdGhpcy5hcnJheSgpO1xuICB2YXIgaSA9IGluZGV4KGFyciwgbmFtZSk7XG4gIGlmICghfmkpIGFyci5wdXNoKG5hbWUpO1xuICB0aGlzLmVsLmNsYXNzTmFtZSA9IGFyci5qb2luKCcgJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgY2xhc3MgYG5hbWVgIHdoZW4gcHJlc2VudCwgb3JcbiAqIHBhc3MgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcmVtb3ZlXG4gKiBhbnkgd2hpY2ggbWF0Y2guXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBuYW1lXG4gKiBAcmV0dXJuIHtDbGFzc0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNsYXNzTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24obmFtZSl7XG4gIGlmICgnW29iamVjdCBSZWdFeHBdJyA9PSB0b1N0cmluZy5jYWxsKG5hbWUpKSB7XG4gICAgcmV0dXJuIHRoaXMucmVtb3ZlTWF0Y2hpbmcobmFtZSk7XG4gIH1cblxuICAvLyBjbGFzc0xpc3RcbiAgaWYgKHRoaXMubGlzdCkge1xuICAgIHRoaXMubGlzdC5yZW1vdmUobmFtZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBmYWxsYmFja1xuICB2YXIgYXJyID0gdGhpcy5hcnJheSgpO1xuICB2YXIgaSA9IGluZGV4KGFyciwgbmFtZSk7XG4gIGlmICh+aSkgYXJyLnNwbGljZShpLCAxKTtcbiAgdGhpcy5lbC5jbGFzc05hbWUgPSBhcnIuam9pbignICcpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBjbGFzc2VzIG1hdGNoaW5nIGByZWAuXG4gKlxuICogQHBhcmFtIHtSZWdFeHB9IHJlXG4gKiBAcmV0dXJuIHtDbGFzc0xpc3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5DbGFzc0xpc3QucHJvdG90eXBlLnJlbW92ZU1hdGNoaW5nID0gZnVuY3Rpb24ocmUpe1xuICB2YXIgYXJyID0gdGhpcy5hcnJheSgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGlmIChyZS50ZXN0KGFycltpXSkpIHtcbiAgICAgIHRoaXMucmVtb3ZlKGFycltpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBUb2dnbGUgY2xhc3MgYG5hbWVgLCBjYW4gZm9yY2Ugc3RhdGUgdmlhIGBmb3JjZWAuXG4gKlxuICogRm9yIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBjbGFzc0xpc3QsIGJ1dCBkbyBub3Qgc3VwcG9ydCBgZm9yY2VgIHlldCxcbiAqIHRoZSBtaXN0YWtlIHdpbGwgYmUgZGV0ZWN0ZWQgYW5kIGNvcnJlY3RlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtCb29sZWFufSBmb3JjZVxuICogQHJldHVybiB7Q2xhc3NMaXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5DbGFzc0xpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKG5hbWUsIGZvcmNlKXtcbiAgLy8gY2xhc3NMaXN0XG4gIGlmICh0aGlzLmxpc3QpIHtcbiAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGZvcmNlKSB7XG4gICAgICBpZiAoZm9yY2UgIT09IHRoaXMubGlzdC50b2dnbGUobmFtZSwgZm9yY2UpKSB7XG4gICAgICAgIHRoaXMubGlzdC50b2dnbGUobmFtZSk7IC8vIHRvZ2dsZSBhZ2FpbiB0byBjb3JyZWN0XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGlzdC50b2dnbGUobmFtZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZmFsbGJhY2tcbiAgaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBmb3JjZSkge1xuICAgIGlmICghZm9yY2UpIHtcbiAgICAgIHRoaXMucmVtb3ZlKG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZChuYW1lKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoaXMuaGFzKG5hbWUpKSB7XG4gICAgICB0aGlzLnJlbW92ZShuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGQobmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBhcnJheSBvZiBjbGFzc2VzLlxuICpcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5DbGFzc0xpc3QucHJvdG90eXBlLmFycmF5ID0gZnVuY3Rpb24oKXtcbiAgdmFyIHN0ciA9IHRoaXMuZWwuY2xhc3NOYW1lLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbiAgdmFyIGFyciA9IHN0ci5zcGxpdChyZSk7XG4gIGlmICgnJyA9PT0gYXJyWzBdKSBhcnIuc2hpZnQoKTtcbiAgcmV0dXJuIGFycjtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgY2xhc3MgYG5hbWVgIGlzIHByZXNlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0NsYXNzTGlzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ2xhc3NMaXN0LnByb3RvdHlwZS5oYXMgPVxuQ2xhc3NMaXN0LnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gdGhpcy5saXN0XG4gICAgPyB0aGlzLmxpc3QuY29udGFpbnMobmFtZSlcbiAgICA6ICEhIH5pbmRleCh0aGlzLmFycmF5KCksIG5hbWUpO1xufTtcbiIsIi8qKlxuICogTW9kdWxlIERlcGVuZGVuY2llc1xuICovXG5cbnZhciBldmVudHMgPSByZXF1aXJlKCdldmVudCcpO1xudmFyIGRlbGVnYXRlID0gcmVxdWlyZSgnZGVsZWdhdGUnKTtcblxuLyoqXG4gKiBCaW5kIHRvIGBldmVudGAgYW5kIGludm9rZSBgZm4oZSlgLiBXaGVuXG4gKiBhIGBzZWxlY3RvcmAgaXMgZ2l2ZW4gdGhlbiBldmVudHMgYXJlIGRlbGVnYXRlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc2VsZWN0b3JdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtCb29sZWFufSBjYXB0dXJlXG4gKiBAcmV0dXJuIHtMaXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLm9uID0gZnVuY3Rpb24oZXZlbnQsIHNlbGVjdG9yLCBmbiwgY2FwdHVyZSl7XG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgZm4uX2RlbGVnYXRlID0gZGVsZWdhdGUuYmluZChlbCwgc2VsZWN0b3IsIGV2ZW50LCBmbiwgY2FwdHVyZSk7XG4gICAgfSk7XG4gIH1cblxuICBjYXB0dXJlID0gZm47XG4gIGZuID0gc2VsZWN0b3I7XG5cbiAgcmV0dXJuIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBldmVudHMuYmluZChlbCwgZXZlbnQsIGZuLCBjYXB0dXJlKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFVuYmluZCB0byBgZXZlbnRgIGFuZCBpbnZva2UgYGZuKGUpYC4gV2hlblxuICogYSBgc2VsZWN0b3JgIGlzIGdpdmVuIHRoZW4gZGVsZWdhdGVkIGV2ZW50XG4gKiBoYW5kbGVycyBhcmUgdW5ib3VuZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc2VsZWN0b3JdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtCb29sZWFufSBjYXB0dXJlXG4gKiBAcmV0dXJuIHtMaXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLm9mZiA9IGZ1bmN0aW9uKGV2ZW50LCBzZWxlY3RvciwgZm4sIGNhcHR1cmUpe1xuICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIC8vIFRPRE86IGFkZCBzZWxlY3RvciBzdXBwb3J0IGJhY2tcbiAgICAgIGRlbGVnYXRlLnVuYmluZChlbCwgZXZlbnQsIGZuLl9kZWxlZ2F0ZSwgY2FwdHVyZSk7XG4gICAgfSk7XG4gIH1cblxuICBjYXB0dXJlID0gZm47XG4gIGZuID0gc2VsZWN0b3I7XG5cbiAgcmV0dXJuIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBldmVudHMudW5iaW5kKGVsLCBldmVudCwgZm4sIGNhcHR1cmUpO1xuICB9KTtcbn07XG4iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGNsb3Nlc3QgPSByZXF1aXJlKCdjbG9zZXN0JylcbiAgLCBldmVudCA9IHJlcXVpcmUoJ2V2ZW50Jyk7XG5cbi8qKlxuICogRGVsZWdhdGUgZXZlbnQgYHR5cGVgIHRvIGBzZWxlY3RvcmBcbiAqIGFuZCBpbnZva2UgYGZuKGUpYC4gQSBjYWxsYmFjayBmdW5jdGlvblxuICogaXMgcmV0dXJuZWQgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byBgLnVuYmluZCgpYC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtCb29sZWFufSBjYXB0dXJlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yLCB0eXBlLCBmbiwgY2FwdHVyZSl7XG4gIHJldHVybiBldmVudC5iaW5kKGVsLCB0eXBlLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuICAgIGUuZGVsZWdhdGVUYXJnZXQgPSBjbG9zZXN0KHRhcmdldCwgc2VsZWN0b3IsIHRydWUsIGVsKTtcbiAgICBpZiAoZS5kZWxlZ2F0ZVRhcmdldCkgZm4uY2FsbChlbCwgZSk7XG4gIH0sIGNhcHR1cmUpO1xufTtcblxuLyoqXG4gKiBVbmJpbmQgZXZlbnQgYHR5cGVgJ3MgY2FsbGJhY2sgYGZuYC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FwdHVyZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnVuYmluZCA9IGZ1bmN0aW9uKGVsLCB0eXBlLCBmbiwgY2FwdHVyZSl7XG4gIGV2ZW50LnVuYmluZChlbCwgdHlwZSwgZm4sIGNhcHR1cmUpO1xufTtcbiIsInZhciBtYXRjaGVzID0gcmVxdWlyZSgnbWF0Y2hlcy1zZWxlY3RvcicpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsZW1lbnQsIHNlbGVjdG9yLCBjaGVja1lvU2VsZiwgcm9vdCkge1xuICBlbGVtZW50ID0gY2hlY2tZb1NlbGYgPyB7cGFyZW50Tm9kZTogZWxlbWVudH0gOiBlbGVtZW50XG5cbiAgcm9vdCA9IHJvb3QgfHwgZG9jdW1lbnRcblxuICAvLyBNYWtlIHN1cmUgYGVsZW1lbnQgIT09IGRvY3VtZW50YCBhbmQgYGVsZW1lbnQgIT0gbnVsbGBcbiAgLy8gb3RoZXJ3aXNlIHdlIGdldCBhbiBpbGxlZ2FsIGludm9jYXRpb25cbiAgd2hpbGUgKChlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSAmJiBlbGVtZW50ICE9PSBkb2N1bWVudCkge1xuICAgIGlmIChtYXRjaGVzKGVsZW1lbnQsIHNlbGVjdG9yKSlcbiAgICAgIHJldHVybiBlbGVtZW50XG4gICAgLy8gQWZ0ZXIgYG1hdGNoZXNgIG9uIHRoZSBlZGdlIGNhc2UgdGhhdFxuICAgIC8vIHRoZSBzZWxlY3RvciBtYXRjaGVzIHRoZSByb290XG4gICAgLy8gKHdoZW4gdGhlIHJvb3QgaXMgbm90IHRoZSBkb2N1bWVudClcbiAgICBpZiAoZWxlbWVudCA9PT0gcm9vdClcbiAgICAgIHJldHVyblxuICB9XG59XG4iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIHF1ZXJ5ID0gcmVxdWlyZSgncXVlcnknKTtcblxuLyoqXG4gKiBFbGVtZW50IHByb3RvdHlwZS5cbiAqL1xuXG52YXIgcHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcblxuLyoqXG4gKiBWZW5kb3IgZnVuY3Rpb24uXG4gKi9cblxudmFyIHZlbmRvciA9IHByb3RvLm1hdGNoZXNcbiAgfHwgcHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm1vek1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5tc01hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5vTWF0Y2hlc1NlbGVjdG9yO1xuXG4vKipcbiAqIEV4cG9zZSBgbWF0Y2goKWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaDtcblxuLyoqXG4gKiBNYXRjaCBgZWxgIHRvIGBzZWxlY3RvcmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcbiAgaWYgKCFlbCB8fCBlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuIGZhbHNlO1xuICBpZiAodmVuZG9yKSByZXR1cm4gdmVuZG9yLmNhbGwoZWwsIHNlbGVjdG9yKTtcbiAgdmFyIG5vZGVzID0gcXVlcnkuYWxsKHNlbGVjdG9yLCBlbC5wYXJlbnROb2RlKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgIGlmIChub2Rlc1tpXSA9PSBlbCkgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiLyoqXG4gKiBNb2R1bGUgRGVwZW5kZW5jaWVzXG4gKi9cblxudmFyIHZhbHVlID0gcmVxdWlyZSgndmFsdWUnKTtcbnZhciBjc3MgPSByZXF1aXJlKCdjc3MnKTtcbnZhciB0ZXh0ID0gcmVxdWlyZSgndGV4dCcpO1xuXG4vKipcbiAqIFJldHVybiBlbGVtZW50IHRleHQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfExpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMudGV4dCA9IGZ1bmN0aW9uKHN0cikge1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgaWYgKDExID09IGVsLm5vZGVUeXBlKSB7XG4gICAgICAgIHZhciBub2RlO1xuICAgICAgICB3aGlsZSAobm9kZSA9IGVsLmZpcnN0Q2hpbGQpIGVsLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQoZWwsIHN0cik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YXIgb3V0ID0gJyc7XG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgIGlmICgxMSA9PSBlbC5ub2RlVHlwZSkge1xuICAgICAgb3V0ICs9IGdldFRleHQoZWwuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSB0ZXh0KGVsKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEdldCB0ZXh0IGhlbHBlciBmcm9tIFNpenpsZS5cbiAqXG4gKiBTb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvc2l6emxlL2Jsb2IvbWFzdGVyL3NyYy9zaXp6bGUuanMjTDkxNC1MOTQ3XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fEFycmF5fSBlbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIGdldFRleHQoZWwpIHtcbiAgdmFyIHJldCA9ICcnO1xuICB2YXIgdHlwZSA9IGVsLm5vZGVUeXBlO1xuICB2YXIgbm9kZTtcblxuICBzd2l0Y2godHlwZSkge1xuICAgIGNhc2UgMTpcbiAgICBjYXNlIDk6XG4gICAgICByZXQgPSB0ZXh0KGVsKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMTE6XG4gICAgICByZXQgPSBlbC50ZXh0Q29udGVudCB8fCBlbC5pbm5lclRleHQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDM6XG4gICAgY2FzZSA0OlxuICAgICAgcmV0dXJuIGVsLm5vZGVWYWx1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgd2hpbGUgKG5vZGUgPSBlbFtpKytdKSB7XG4gICAgICAgIHJldCArPSBnZXRUZXh0KG5vZGUpO1xuICAgICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gZWxlbWVudCBodG1sLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gaHRtbFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmh0bWwgPSBmdW5jdGlvbihodG1sKSB7XG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICBlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gVE9ETzogcmVhbCBpbXBsXG4gIHJldHVybiB0aGlzWzBdICYmIHRoaXNbMF0uaW5uZXJIVE1MO1xufTtcblxuLyoqXG4gKiBHZXQgYW5kIHNldCB0aGUgY3NzIHZhbHVlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBwcm9wXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmNzcyA9IGZ1bmN0aW9uKHByb3AsIHZhbCkge1xuICAvLyBnZXR0ZXJcbiAgaWYgKCF2YWwgJiYgJ29iamVjdCcgIT0gdHlwZW9mIHByb3ApIHtcbiAgICByZXR1cm4gY3NzKHRoaXNbMF0sIHByb3ApO1xuICB9XG4gIC8vIHNldHRlclxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICBjc3MoZWwsIHByb3AsIHZhbCk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBQcmVwZW5kIGB2YWxgLlxuICpcbiAqIEZyb20galF1ZXJ5OiBpZiB0aGVyZSBpcyBtb3JlIHRoYW4gb25lIHRhcmdldCBlbGVtZW50XG4gKiBjbG9uZWQgY29waWVzIG9mIHRoZSBpbnNlcnRlZCBlbGVtZW50IHdpbGwgYmUgY3JlYXRlZFxuICogZm9yIGVhY2ggdGFyZ2V0IGFmdGVyIHRoZSBmaXJzdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fExpc3R9IHZhbFxuICogQHJldHVybiB7TGlzdH0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnByZXBlbmQgPSBmdW5jdGlvbih2YWwpIHtcbiAgdmFyIGRvbSA9IHRoaXMuZG9tO1xuXG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbih0YXJnZXQsIGkpIHtcbiAgICBkb20odmFsKS5mb3JFYWNoKGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IGkgPyBzZWxlY3Rvci5jbG9uZU5vZGUodHJ1ZSkgOiBzZWxlY3RvcjtcbiAgICAgIGlmICh0YXJnZXQuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIHRhcmdldC5pbnNlcnRCZWZvcmUoc2VsZWN0b3IsIHRhcmdldC5maXJzdENoaWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChzZWxlY3Rvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBcHBlbmQgYHZhbGAuXG4gKlxuICogRnJvbSBqUXVlcnk6IGlmIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgdGFyZ2V0IGVsZW1lbnRcbiAqIGNsb25lZCBjb3BpZXMgb2YgdGhlIGluc2VydGVkIGVsZW1lbnQgd2lsbCBiZSBjcmVhdGVkXG4gKiBmb3IgZWFjaCB0YXJnZXQgYWZ0ZXIgdGhlIGZpcnN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8TGlzdH0gdmFsXG4gKiBAcmV0dXJuIHtMaXN0fSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuYXBwZW5kID0gZnVuY3Rpb24odmFsKSB7XG4gIHZhciBkb20gPSB0aGlzLmRvbTtcblxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odGFyZ2V0LCBpKSB7XG4gICAgZG9tKHZhbCkuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgZWwgPSBpID8gZWwuY2xvbmVOb2RlKHRydWUpIDogZWw7XG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSW5zZXJ0IHNlbGYncyBgZWxzYCBhZnRlciBgdmFsYFxuICpcbiAqIEZyb20galF1ZXJ5OiBpZiB0aGVyZSBpcyBtb3JlIHRoYW4gb25lIHRhcmdldCBlbGVtZW50LFxuICogY2xvbmVkIGNvcGllcyBvZiB0aGUgaW5zZXJ0ZWQgZWxlbWVudCB3aWxsIGJlIGNyZWF0ZWRcbiAqIGZvciBlYWNoIHRhcmdldCBhZnRlciB0aGUgZmlyc3QsIGFuZCB0aGF0IG5ldyBzZXRcbiAqICh0aGUgb3JpZ2luYWwgZWxlbWVudCBwbHVzIGNsb25lcykgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxMaXN0fSB2YWxcbiAqIEByZXR1cm4ge0xpc3R9IHNlbGZcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5pbnNlcnRBZnRlciA9IGZ1bmN0aW9uKHZhbCkge1xuICB2YXIgZG9tID0gdGhpcy5kb207XG5cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgZG9tKHZhbCkuZm9yRWFjaChmdW5jdGlvbih0YXJnZXQsIGkpIHtcbiAgICAgIGlmICghdGFyZ2V0LnBhcmVudE5vZGUpIHJldHVybjtcbiAgICAgIGVsID0gaSA/IGVsLmNsb25lTm9kZSh0cnVlKSA6IGVsO1xuICAgICAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQubmV4dFNpYmxpbmcpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQXBwZW5kIHNlbGYncyBgZWxgIHRvIGB2YWxgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxMaXN0fSB2YWxcbiAqIEByZXR1cm4ge0xpc3R9IHNlbGZcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5hcHBlbmRUbyA9IGZ1bmN0aW9uKHZhbCkge1xuICB0aGlzLmRvbSh2YWwpLmFwcGVuZCh0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlcGxhY2UgZWxlbWVudHMgaW4gdGhlIERPTS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fExpc3R9IHZhbFxuICogQHJldHVybiB7TGlzdH0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnJlcGxhY2UgPSBmdW5jdGlvbih2YWwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgbGlzdCA9IHRoaXMuZG9tKHZhbCk7XG5cbiAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsLCBpKSB7XG4gICAgdmFyIG9sZCA9IHNlbGZbaV07XG4gICAgdmFyIHBhcmVudCA9IG9sZC5wYXJlbnROb2RlO1xuICAgIGlmICghcGFyZW50KSByZXR1cm47XG4gICAgZWwgPSBpID8gZWwuY2xvbmVOb2RlKHRydWUpIDogZWw7XG4gICAgcGFyZW50LnJlcGxhY2VDaGlsZChlbCwgb2xkKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtcHR5IHRoZSBkb20gbGlzdFxuICpcbiAqIEByZXR1cm4gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmVtcHR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICB0ZXh0KGVsLCBcIlwiKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgZWxlbWVudHMgaW4gdGhlIGRvbSBsaXN0XG4gKlxuICogQHJldHVybiB7TGlzdH0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgdmFyIHBhcmVudCA9IGVsLnBhcmVudE5vZGU7XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKGVsKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGNsb25lZCBkb20gbGlzdCB3aXRoIGFsbCBlbGVtZW50cyBjbG9uZWQuXG4gKlxuICogQHJldHVybiB7TGlzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgb3V0ID0gdGhpcy5tYXAoZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gZWwuY2xvbmVOb2RlKHRydWUpO1xuICB9KTtcblxuICByZXR1cm4gdGhpcy5kb20ob3V0KTtcbn07XG5cbi8qKlxuICogRm9jdXMgdGhlIGZpcnN0IGRvbSBlbGVtZW50IGluIG91ciBsaXN0LlxuICogXG4gKiBAcmV0dXJuIHtMaXN0fSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuZm9jdXMgPSBmdW5jdGlvbigpe1xuICB0aGlzWzBdLmZvY3VzKCk7XG4gIHJldHVybiB0aGlzO1xufTtcbiIsIi8qKlxuICogTW9kdWxlIERlcGVuZGVuY2llc1xuICovXG5cbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2NzcycpO1xudmFyIHNldCA9IHJlcXVpcmUoJy4vbGliL3N0eWxlJyk7XG52YXIgZ2V0ID0gcmVxdWlyZSgnLi9saWIvY3NzJyk7XG5cbi8qKlxuICogRXhwb3NlIGBjc3NgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBjc3M7XG5cbi8qKlxuICogR2V0IGFuZCBzZXQgY3NzIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gcHJvcFxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtFbGVtZW50fSBlbFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBjc3MoZWwsIHByb3AsIHZhbCkge1xuICBpZiAoIWVsKSByZXR1cm47XG5cbiAgaWYgKHVuZGVmaW5lZCAhPT0gdmFsKSB7XG4gICAgdmFyIG9iaiA9IHt9O1xuICAgIG9ialtwcm9wXSA9IHZhbDtcbiAgICBkZWJ1Zygnc2V0dGluZyBzdHlsZXMgJWonLCBvYmopO1xuICAgIHJldHVybiBzZXRTdHlsZXMoZWwsIG9iaik7XG4gIH1cblxuICBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIHByb3ApIHtcbiAgICBkZWJ1Zygnc2V0dGluZyBzdHlsZXMgJWonLCBwcm9wKTtcbiAgICByZXR1cm4gc2V0U3R5bGVzKGVsLCBwcm9wKTtcbiAgfVxuXG4gIGRlYnVnKCdnZXR0aW5nICVzJywgcHJvcCk7XG4gIHJldHVybiBnZXQoZWwsIHByb3ApO1xufVxuXG4vKipcbiAqIFNldCB0aGUgc3R5bGVzIG9uIGFuIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAqIEByZXR1cm4ge0VsZW1lbnR9IGVsXG4gKi9cblxuZnVuY3Rpb24gc2V0U3R5bGVzKGVsLCBwcm9wcykge1xuICBmb3IgKHZhciBwcm9wIGluIHByb3BzKSB7XG4gICAgc2V0KGVsLCBwcm9wLCBwcm9wc1twcm9wXSk7XG4gIH1cblxuICByZXR1cm4gZWw7XG59XG4iLCIvKipcbiAqIE1vZHVsZSBEZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdjc3M6c3R5bGUnKTtcbnZhciBjYW1lbGNhc2UgPSByZXF1aXJlKCd0by1jYW1lbC1jYXNlJyk7XG52YXIgc3VwcG9ydCA9IHJlcXVpcmUoJy4vc3VwcG9ydCcpO1xudmFyIHByb3BlcnR5ID0gcmVxdWlyZSgnLi9wcm9wJyk7XG52YXIgaG9va3MgPSByZXF1aXJlKCcuL2hvb2tzJyk7XG5cbi8qKlxuICogRXhwb3NlIGBzdHlsZWBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlO1xuXG4vKipcbiAqIFBvc3NpYmx5LXVuaXRsZXNzIHByb3BlcnRpZXNcbiAqXG4gKiBEb24ndCBhdXRvbWF0aWNhbGx5IGFkZCAncHgnIHRvIHRoZXNlIHByb3BlcnRpZXNcbiAqL1xuXG52YXIgY3NzTnVtYmVyID0ge1xuICBcImNvbHVtbkNvdW50XCI6IHRydWUsXG4gIFwiZmlsbE9wYWNpdHlcIjogdHJ1ZSxcbiAgXCJmb250V2VpZ2h0XCI6IHRydWUsXG4gIFwibGluZUhlaWdodFwiOiB0cnVlLFxuICBcIm9wYWNpdHlcIjogdHJ1ZSxcbiAgXCJvcmRlclwiOiB0cnVlLFxuICBcIm9ycGhhbnNcIjogdHJ1ZSxcbiAgXCJ3aWRvd3NcIjogdHJ1ZSxcbiAgXCJ6SW5kZXhcIjogdHJ1ZSxcbiAgXCJ6b29tXCI6IHRydWVcbn07XG5cbi8qKlxuICogU2V0IGEgY3NzIHZhbHVlXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHBhcmFtIHtNaXhlZH0gZXh0cmFcbiAqL1xuXG5mdW5jdGlvbiBzdHlsZShlbCwgcHJvcCwgdmFsLCBleHRyYSkge1xuICAvLyBEb24ndCBzZXQgc3R5bGVzIG9uIHRleHQgYW5kIGNvbW1lbnQgbm9kZXNcbiAgaWYgKCFlbCB8fCBlbC5ub2RlVHlwZSA9PT0gMyB8fCBlbC5ub2RlVHlwZSA9PT0gOCB8fCAhZWwuc3R5bGUgKSByZXR1cm47XG5cbiAgdmFyIG9yaWcgPSBjYW1lbGNhc2UocHJvcCk7XG4gIHZhciBzdHlsZSA9IGVsLnN0eWxlO1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWw7XG5cbiAgaWYgKCF2YWwpIHJldHVybiBnZXQoZWwsIHByb3AsIG9yaWcsIGV4dHJhKTtcblxuICBwcm9wID0gcHJvcGVydHkocHJvcCwgc3R5bGUpO1xuXG4gIHZhciBob29rID0gaG9va3NbcHJvcF0gfHwgaG9va3Nbb3JpZ107XG5cbiAgLy8gSWYgYSBudW1iZXIgd2FzIHBhc3NlZCBpbiwgYWRkICdweCcgdG8gdGhlIChleGNlcHQgZm9yIGNlcnRhaW4gQ1NTIHByb3BlcnRpZXMpXG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlICYmICFjc3NOdW1iZXJbb3JpZ10pIHtcbiAgICBkZWJ1ZygnYWRkaW5nIFwicHhcIiB0byBlbmQgb2YgbnVtYmVyJyk7XG4gICAgdmFsICs9ICdweCc7XG4gIH1cblxuICAvLyBGaXhlcyBqUXVlcnkgIzg5MDgsIGl0IGNhbiBiZSBkb25lIG1vcmUgY29ycmVjdGx5IGJ5IHNwZWNpZnlpbmcgc2V0dGVycyBpbiBjc3NIb29rcyxcbiAgLy8gYnV0IGl0IHdvdWxkIG1lYW4gdG8gZGVmaW5lIGVpZ2h0IChmb3IgZXZlcnkgcHJvYmxlbWF0aWMgcHJvcGVydHkpIGlkZW50aWNhbCBmdW5jdGlvbnNcbiAgaWYgKCFzdXBwb3J0LmNsZWFyQ2xvbmVTdHlsZSAmJiAnJyA9PT0gdmFsICYmIDAgPT09IHByb3AuaW5kZXhPZignYmFja2dyb3VuZCcpKSB7XG4gICAgZGVidWcoJ3NldCBwcm9wZXJ0eSAoJXMpIHZhbHVlIHRvIFwiaW5oZXJpdFwiJywgcHJvcCk7XG4gICAgc3R5bGVbcHJvcF0gPSAnaW5oZXJpdCc7XG4gIH1cblxuICAvLyBJZiBhIGhvb2sgd2FzIHByb3ZpZGVkLCB1c2UgdGhhdCB2YWx1ZSwgb3RoZXJ3aXNlIGp1c3Qgc2V0IHRoZSBzcGVjaWZpZWQgdmFsdWVcbiAgaWYgKCFob29rIHx8ICFob29rLnNldCB8fCB1bmRlZmluZWQgIT09ICh2YWwgPSBob29rLnNldChlbCwgdmFsLCBleHRyYSkpKSB7XG4gICAgLy8gU3VwcG9ydDogQ2hyb21lLCBTYWZhcmlcbiAgICAvLyBTZXR0aW5nIHN0eWxlIHRvIGJsYW5rIHN0cmluZyByZXF1aXJlZCB0byBkZWxldGUgXCJzdHlsZTogeCAhaW1wb3J0YW50O1wiXG4gICAgZGVidWcoJ3NldCBob29rIGRlZmluZWQuIHNldHRpbmcgcHJvcGVydHkgKCVzKSB0byAlcycsIHByb3AsIHZhbCk7XG4gICAgc3R5bGVbcHJvcF0gPSAnJztcbiAgICBzdHlsZVtwcm9wXSA9IHZhbDtcbiAgfVxuXG59XG5cbi8qKlxuICogR2V0IHRoZSBzdHlsZVxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wXG4gKiBAcGFyYW0ge1N0cmluZ30gb3JpZ1xuICogQHBhcmFtIHtNaXhlZH0gZXh0cmFcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBnZXQoZWwsIHByb3AsIG9yaWcsIGV4dHJhKSB7XG4gIHZhciBzdHlsZSA9IGVsLnN0eWxlO1xuICB2YXIgaG9vayA9IGhvb2tzW3Byb3BdIHx8IGhvb2tzW29yaWddO1xuICB2YXIgcmV0O1xuXG4gIGlmIChob29rICYmIGhvb2suZ2V0ICYmIHVuZGVmaW5lZCAhPT0gKHJldCA9IGhvb2suZ2V0KGVsLCBmYWxzZSwgZXh0cmEpKSkge1xuICAgIGRlYnVnKCdnZXQgaG9vayBkZWZpbmVkLCByZXR1cm5pbmc6ICVzJywgcmV0KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcmV0ID0gc3R5bGVbcHJvcF07XG4gIGRlYnVnKCdnZXR0aW5nICVzJywgcmV0KTtcbiAgcmV0dXJuIHJldDtcbn1cbiIsIlxudmFyIHRvU3BhY2UgPSByZXF1aXJlKCd0by1zcGFjZS1jYXNlJyk7XG5cblxuLyoqXG4gKiBFeHBvc2UgYHRvQ2FtZWxDYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvQ2FtZWxDYXNlO1xuXG5cbi8qKlxuICogQ29udmVydCBhIGBzdHJpbmdgIHRvIGNhbWVsIGNhc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cblxuZnVuY3Rpb24gdG9DYW1lbENhc2UgKHN0cmluZykge1xuICByZXR1cm4gdG9TcGFjZShzdHJpbmcpLnJlcGxhY2UoL1xccyhcXHcpL2csIGZ1bmN0aW9uIChtYXRjaGVzLCBsZXR0ZXIpIHtcbiAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufSIsIlxudmFyIGNsZWFuID0gcmVxdWlyZSgndG8tbm8tY2FzZScpO1xuXG5cbi8qKlxuICogRXhwb3NlIGB0b1NwYWNlQ2FzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0b1NwYWNlQ2FzZTtcblxuXG4vKipcbiAqIENvbnZlcnQgYSBgc3RyaW5nYCB0byBzcGFjZSBjYXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5cbmZ1bmN0aW9uIHRvU3BhY2VDYXNlIChzdHJpbmcpIHtcbiAgcmV0dXJuIGNsZWFuKHN0cmluZykucmVwbGFjZSgvW1xcV19dKygufCQpL2csIGZ1bmN0aW9uIChtYXRjaGVzLCBtYXRjaCkge1xuICAgIHJldHVybiBtYXRjaCA/ICcgJyArIG1hdGNoIDogJyc7XG4gIH0pO1xufSIsIlxuLyoqXG4gKiBFeHBvc2UgYHRvTm9DYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTm9DYXNlO1xuXG5cbi8qKlxuICogVGVzdCB3aGV0aGVyIGEgc3RyaW5nIGlzIGNhbWVsLWNhc2UuXG4gKi9cblxudmFyIGhhc1NwYWNlID0gL1xccy87XG52YXIgaGFzQ2FtZWwgPSAvW2Etel1bQS1aXS87XG52YXIgaGFzU2VwYXJhdG9yID0gL1tcXFdfXS87XG5cblxuLyoqXG4gKiBSZW1vdmUgYW55IHN0YXJ0aW5nIGNhc2UgZnJvbSBhIGBzdHJpbmdgLCBsaWtlIGNhbWVsIG9yIHNuYWtlLCBidXQga2VlcFxuICogc3BhY2VzIGFuZCBwdW5jdHVhdGlvbiB0aGF0IG1heSBiZSBpbXBvcnRhbnQgb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB0b05vQ2FzZSAoc3RyaW5nKSB7XG4gIGlmIChoYXNTcGFjZS50ZXN0KHN0cmluZykpIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKTtcblxuICBpZiAoaGFzU2VwYXJhdG9yLnRlc3Qoc3RyaW5nKSkgc3RyaW5nID0gdW5zZXBhcmF0ZShzdHJpbmcpO1xuICBpZiAoaGFzQ2FtZWwudGVzdChzdHJpbmcpKSBzdHJpbmcgPSB1bmNhbWVsaXplKHN0cmluZyk7XG4gIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKTtcbn1cblxuXG4vKipcbiAqIFNlcGFyYXRvciBzcGxpdHRlci5cbiAqL1xuXG52YXIgc2VwYXJhdG9yU3BsaXR0ZXIgPSAvW1xcV19dKygufCQpL2c7XG5cblxuLyoqXG4gKiBVbi1zZXBhcmF0ZSBhIGBzdHJpbmdgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB1bnNlcGFyYXRlIChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHNlcGFyYXRvclNwbGl0dGVyLCBmdW5jdGlvbiAobSwgbmV4dCkge1xuICAgIHJldHVybiBuZXh0ID8gJyAnICsgbmV4dCA6ICcnO1xuICB9KTtcbn1cblxuXG4vKipcbiAqIENhbWVsY2FzZSBzcGxpdHRlci5cbiAqL1xuXG52YXIgY2FtZWxTcGxpdHRlciA9IC8oLikoW0EtWl0rKS9nO1xuXG5cbi8qKlxuICogVW4tY2FtZWxjYXNlIGEgYHN0cmluZ2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHVuY2FtZWxpemUgKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoY2FtZWxTcGxpdHRlciwgZnVuY3Rpb24gKG0sIHByZXZpb3VzLCB1cHBlcnMpIHtcbiAgICByZXR1cm4gcHJldmlvdXMgKyAnICcgKyB1cHBlcnMudG9Mb3dlckNhc2UoKS5zcGxpdCgnJykuam9pbignICcpO1xuICB9KTtcbn0iLCIvKipcbiAqIFN1cHBvcnQgdmFsdWVzXG4gKi9cblxudmFyIHJlbGlhYmxlTWFyZ2luUmlnaHQ7XG52YXIgYm94U2l6aW5nUmVsaWFibGVWYWw7XG52YXIgcGl4ZWxQb3NpdGlvblZhbDtcbnZhciBjbGVhckNsb25lU3R5bGU7XG5cbi8qKlxuICogQ29udGFpbmVyIHNldHVwXG4gKi9cblxudmFyIGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG52YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG52YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbi8qKlxuICogQ2xlYXIgY2xvbmUgc3R5bGVcbiAqL1xuXG5kaXYuc3R5bGUuYmFja2dyb3VuZENsaXAgPSAnY29udGVudC1ib3gnO1xuZGl2LmNsb25lTm9kZSh0cnVlKS5zdHlsZS5iYWNrZ3JvdW5kQ2xpcCA9ICcnO1xuZXhwb3J0cy5jbGVhckNsb25lU3R5bGUgPSBkaXYuc3R5bGUuYmFja2dyb3VuZENsaXAgPT09ICdjb250ZW50LWJveCc7XG5cbmNvbnRhaW5lci5zdHlsZS5jc3NUZXh0ID0gJ2JvcmRlcjowO3dpZHRoOjA7aGVpZ2h0OjA7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDotOTk5OXB4O21hcmdpbi10b3A6MXB4JztcbmNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXG4vKipcbiAqIFBpeGVsIHBvc2l0aW9uXG4gKlxuICogV2Via2l0IGJ1ZzogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTI5MDg0XG4gKiBnZXRDb21wdXRlZFN0eWxlIHJldHVybnMgcGVyY2VudCB3aGVuIHNwZWNpZmllZCBmb3IgdG9wL2xlZnQvYm90dG9tL3JpZ2h0XG4gKiByYXRoZXIgdGhhbiBtYWtlIHRoZSBjc3MgbW9kdWxlIGRlcGVuZCBvbiB0aGUgb2Zmc2V0IG1vZHVsZSwgd2UganVzdCBjaGVjayBmb3IgaXQgaGVyZVxuICovXG5cbmV4cG9ydHMucGl4ZWxQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICBpZiAodW5kZWZpbmVkID09IHBpeGVsUG9zaXRpb25WYWwpIGNvbXB1dGVQaXhlbFBvc2l0aW9uQW5kQm94U2l6aW5nUmVsaWFibGUoKTtcbiAgcmV0dXJuIHBpeGVsUG9zaXRpb25WYWw7XG59XG5cbi8qKlxuICogUmVsaWFibGUgYm94IHNpemluZ1xuICovXG5cbmV4cG9ydHMuYm94U2l6aW5nUmVsaWFibGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHVuZGVmaW5lZCA9PSBib3hTaXppbmdSZWxpYWJsZVZhbCkgY29tcHV0ZVBpeGVsUG9zaXRpb25BbmRCb3hTaXppbmdSZWxpYWJsZSgpO1xuICByZXR1cm4gYm94U2l6aW5nUmVsaWFibGVWYWw7XG59XG5cbi8qKlxuICogUmVsaWFibGUgbWFyZ2luIHJpZ2h0XG4gKlxuICogU3VwcG9ydDogQW5kcm9pZCAyLjNcbiAqIENoZWNrIGlmIGRpdiB3aXRoIGV4cGxpY2l0IHdpZHRoIGFuZCBubyBtYXJnaW4tcmlnaHQgaW5jb3JyZWN0bHlcbiAqIGdldHMgY29tcHV0ZWQgbWFyZ2luLXJpZ2h0IGJhc2VkIG9uIHdpZHRoIG9mIGNvbnRhaW5lci4gKCMzMzMzKVxuICogV2ViS2l0IEJ1ZyAxMzM0MyAtIGdldENvbXB1dGVkU3R5bGUgcmV0dXJucyB3cm9uZyB2YWx1ZSBmb3IgbWFyZ2luLXJpZ2h0XG4gKiBUaGlzIHN1cHBvcnQgZnVuY3Rpb24gaXMgb25seSBleGVjdXRlZCBvbmNlIHNvIG5vIG1lbW9pemluZyBpcyBuZWVkZWQuXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLnJlbGlhYmxlTWFyZ2luUmlnaHQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJldDtcbiAgdmFyIG1hcmdpbkRpdiA9IGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIgKSk7XG5cbiAgbWFyZ2luRGl2LnN0eWxlLmNzc1RleHQgPSBkaXYuc3R5bGUuY3NzVGV4dCA9IGRpdlJlc2V0O1xuICBtYXJnaW5EaXYuc3R5bGUubWFyZ2luUmlnaHQgPSBtYXJnaW5EaXYuc3R5bGUud2lkdGggPSBcIjBcIjtcbiAgZGl2LnN0eWxlLndpZHRoID0gXCIxcHhcIjtcbiAgZG9jRWxlbS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG4gIHJldCA9ICFwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG1hcmdpbkRpdiwgbnVsbCkubWFyZ2luUmlnaHQpO1xuXG4gIGRvY0VsZW0ucmVtb3ZlQ2hpbGQoY29udGFpbmVyKTtcblxuICAvLyBDbGVhbiB1cCB0aGUgZGl2IGZvciBvdGhlciBzdXBwb3J0IHRlc3RzLlxuICBkaXYuaW5uZXJIVE1MID0gXCJcIjtcblxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEV4ZWN1dGluZyBib3RoIHBpeGVsUG9zaXRpb24gJiBib3hTaXppbmdSZWxpYWJsZSB0ZXN0cyByZXF1aXJlIG9ubHkgb25lIGxheW91dFxuICogc28gdGhleSdyZSBleGVjdXRlZCBhdCB0aGUgc2FtZSB0aW1lIHRvIHNhdmUgdGhlIHNlY29uZCBjb21wdXRhdGlvbi5cbiAqL1xuXG5mdW5jdGlvbiBjb21wdXRlUGl4ZWxQb3NpdGlvbkFuZEJveFNpemluZ1JlbGlhYmxlKCkge1xuICAvLyBTdXBwb3J0OiBGaXJlZm94LCBBbmRyb2lkIDIuMyAoUHJlZml4ZWQgYm94LXNpemluZyB2ZXJzaW9ucykuXG4gIGRpdi5zdHlsZS5jc3NUZXh0ID0gXCItd2Via2l0LWJveC1zaXppbmc6Ym9yZGVyLWJveDstbW96LWJveC1zaXppbmc6Ym9yZGVyLWJveDtcIiArXG4gICAgXCJib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzoxcHg7Ym9yZGVyOjFweDtkaXNwbGF5OmJsb2NrO3dpZHRoOjRweDttYXJnaW4tdG9wOjElO1wiICtcbiAgICBcInBvc2l0aW9uOmFic29sdXRlO3RvcDoxJVwiO1xuICBkb2NFbGVtLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgdmFyIGRpdlN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZGl2LCBudWxsKTtcbiAgcGl4ZWxQb3NpdGlvblZhbCA9IGRpdlN0eWxlLnRvcCAhPT0gXCIxJVwiO1xuICBib3hTaXppbmdSZWxpYWJsZVZhbCA9IGRpdlN0eWxlLndpZHRoID09PSBcIjRweFwiO1xuXG4gIGRvY0VsZW0ucmVtb3ZlQ2hpbGQoY29udGFpbmVyKTtcbn1cblxuXG4iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdjc3M6cHJvcCcpO1xudmFyIGNhbWVsY2FzZSA9IHJlcXVpcmUoJ3RvLWNhbWVsLWNhc2UnKTtcbnZhciB2ZW5kb3IgPSByZXF1aXJlKCcuL3ZlbmRvcicpO1xuXG4vKipcbiAqIEV4cG9ydCBgcHJvcGBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHByb3A7XG5cbi8qKlxuICogTm9ybWFsaXplIFByb3BlcnRpZXNcbiAqL1xuXG52YXIgY3NzUHJvcHMgPSB7XG4gICdmbG9hdCc6ICdjc3NGbG9hdCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlID8gJ2Nzc0Zsb2F0JyA6ICdzdHlsZUZsb2F0J1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIHZlbmRvciBwcmVmaXhlZCBwcm9wZXJ0eVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wXG4gKiBAcGFyYW0ge1N0cmluZ30gc3R5bGVcbiAqIEByZXR1cm4ge1N0cmluZ30gcHJvcFxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcHJvcChwcm9wLCBzdHlsZSkge1xuICBwcm9wID0gY3NzUHJvcHNbcHJvcF0gfHwgKGNzc1Byb3BzW3Byb3BdID0gdmVuZG9yKHByb3AsIHN0eWxlKSk7XG4gIGRlYnVnKCd0cmFuc2Zvcm0gcHJvcGVydHk6ICVzID0+ICVzJywgcHJvcCwgc3R5bGUpO1xuICByZXR1cm4gcHJvcDtcbn1cbiIsIi8qKlxuICogTW9kdWxlIERlcGVuZGVuY2llc1xuICovXG5cbnZhciBwcmVmaXhlcyA9IFsnV2Via2l0JywgJ08nLCAnTW96JywgJ21zJ107XG5cbi8qKlxuICogRXhwb3NlIGB2ZW5kb3JgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB2ZW5kb3I7XG5cbi8qKlxuICogR2V0IHRoZSB2ZW5kb3IgcHJlZml4IGZvciBhIGdpdmVuIHByb3BlcnR5XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHZlbmRvcihwcm9wLCBzdHlsZSkge1xuICAvLyBzaG9ydGN1dCBmb3IgbmFtZXMgdGhhdCBhcmUgbm90IHZlbmRvciBwcmVmaXhlZFxuICBpZiAoc3R5bGVbcHJvcF0pIHJldHVybiBwcm9wO1xuXG4gIC8vIGNoZWNrIGZvciB2ZW5kb3IgcHJlZml4ZWQgbmFtZXNcbiAgdmFyIGNhcE5hbWUgPSBwcm9wWzBdLnRvVXBwZXJDYXNlKCkgKyBwcm9wLnNsaWNlKDEpO1xuICB2YXIgb3JpZ2luYWwgPSBwcm9wO1xuICB2YXIgaSA9IHByZWZpeGVzLmxlbmd0aDtcblxuICB3aGlsZSAoaS0tKSB7XG4gICAgcHJvcCA9IHByZWZpeGVzW2ldICsgY2FwTmFtZTtcbiAgICBpZiAocHJvcCBpbiBzdHlsZSkgcmV0dXJuIHByb3A7XG4gIH1cblxuICByZXR1cm4gb3JpZ2luYWw7XG59XG4iLCIvKipcbiAqIE1vZHVsZSBEZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgZWFjaCA9IHJlcXVpcmUoJ2VhY2gnKTtcbnZhciBjc3MgPSByZXF1aXJlKCcuL2NzcycpO1xudmFyIGNzc1Nob3cgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB2aXNpYmlsaXR5OiAnaGlkZGVuJywgZGlzcGxheTogJ2Jsb2NrJyB9O1xudmFyIHBudW0gPSAoL1srLV0/KD86XFxkKlxcLnwpXFxkKyg/OltlRV1bKy1dP1xcZCt8KS8pLnNvdXJjZTtcbnZhciBybnVtbm9ucHggPSBuZXcgUmVnRXhwKCAnXignICsgcG51bSArICcpKD8hcHgpW2EteiVdKyQnLCAnaScpO1xudmFyIHJudW1zcGxpdCA9IG5ldyBSZWdFeHAoICdeKCcgKyBwbnVtICsgJykoLiopJCcsICdpJyk7XG52YXIgcmRpc3BsYXlzd2FwID0gL14obm9uZXx0YWJsZSg/IS1jW2VhXSkuKykvO1xudmFyIHN0eWxlcyA9IHJlcXVpcmUoJy4vc3R5bGVzJyk7XG52YXIgc3VwcG9ydCA9IHJlcXVpcmUoJy4vc3VwcG9ydCcpO1xudmFyIHN3YXAgPSByZXF1aXJlKCcuL3N3YXAnKTtcbnZhciBjb21wdXRlZCA9IHJlcXVpcmUoJy4vY29tcHV0ZWQnKTtcbnZhciBjc3NFeHBhbmQgPSBbIFwiVG9wXCIsIFwiUmlnaHRcIiwgXCJCb3R0b21cIiwgXCJMZWZ0XCIgXTtcblxuLyoqXG4gKiBIZWlnaHQgJiBXaWR0aFxuICovXG5cbmVhY2goWyd3aWR0aCcsICdoZWlnaHQnXSwgZnVuY3Rpb24obmFtZSkge1xuICBleHBvcnRzW25hbWVdID0ge307XG5cbiAgZXhwb3J0c1tuYW1lXS5nZXQgPSBmdW5jdGlvbihlbCwgY29tcHV0ZSwgZXh0cmEpIHtcbiAgICBpZiAoIWNvbXB1dGUpIHJldHVybjtcbiAgICAvLyBjZXJ0YWluIGVsZW1lbnRzIGNhbiBoYXZlIGRpbWVuc2lvbiBpbmZvIGlmIHdlIGludmlzaWJseSBzaG93IHRoZW1cbiAgICAvLyBob3dldmVyLCBpdCBtdXN0IGhhdmUgYSBjdXJyZW50IGRpc3BsYXkgc3R5bGUgdGhhdCB3b3VsZCBiZW5lZml0IGZyb20gdGhpc1xuICAgIHJldHVybiAwID09IGVsLm9mZnNldFdpZHRoICYmIHJkaXNwbGF5c3dhcC50ZXN0KGNzcyhlbCwgJ2Rpc3BsYXknKSlcbiAgICAgID8gc3dhcChlbCwgY3NzU2hvdywgZnVuY3Rpb24oKSB7IHJldHVybiBnZXRXaWR0aE9ySGVpZ2h0KGVsLCBuYW1lLCBleHRyYSk7IH0pXG4gICAgICA6IGdldFdpZHRoT3JIZWlnaHQoZWwsIG5hbWUsIGV4dHJhKTtcbiAgfVxuXG4gIGV4cG9ydHNbbmFtZV0uc2V0ID0gZnVuY3Rpb24oZWwsIHZhbCwgZXh0cmEpIHtcbiAgICB2YXIgc3R5bGVzID0gZXh0cmEgJiYgc3R5bGVzKGVsKTtcbiAgICByZXR1cm4gc2V0UG9zaXRpdmVOdW1iZXIoZWwsIHZhbCwgZXh0cmFcbiAgICAgID8gYXVnbWVudFdpZHRoT3JIZWlnaHQoZWwsIG5hbWUsIGV4dHJhLCAnYm9yZGVyLWJveCcgPT0gY3NzKGVsLCAnYm94U2l6aW5nJywgZmFsc2UsIHN0eWxlcyksIHN0eWxlcylcbiAgICAgIDogMFxuICAgICk7XG4gIH07XG5cbn0pO1xuXG4vKipcbiAqIE9wYWNpdHlcbiAqL1xuXG5leHBvcnRzLm9wYWNpdHkgPSB7fTtcbmV4cG9ydHMub3BhY2l0eS5nZXQgPSBmdW5jdGlvbihlbCwgY29tcHV0ZSkge1xuICBpZiAoIWNvbXB1dGUpIHJldHVybjtcbiAgdmFyIHJldCA9IGNvbXB1dGVkKGVsLCAnb3BhY2l0eScpO1xuICByZXR1cm4gJycgPT0gcmV0ID8gJzEnIDogcmV0O1xufVxuXG4vKipcbiAqIFV0aWxpdHk6IFNldCBQb3NpdGl2ZSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdWJ0cmFjdFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5cbmZ1bmN0aW9uIHNldFBvc2l0aXZlTnVtYmVyKGVsLCB2YWwsIHN1YnRyYWN0KSB7XG4gIHZhciBtYXRjaGVzID0gcm51bXNwbGl0LmV4ZWModmFsKTtcbiAgcmV0dXJuIG1hdGNoZXMgP1xuICAgIC8vIEd1YXJkIGFnYWluc3QgdW5kZWZpbmVkICdzdWJ0cmFjdCcsIGUuZy4sIHdoZW4gdXNlZCBhcyBpbiBjc3NIb29rc1xuICAgIE1hdGgubWF4KDAsIG1hdGNoZXNbMV0pICsgKG1hdGNoZXNbMl0gfHwgJ3B4JykgOlxuICAgIHZhbDtcbn1cblxuLyoqXG4gKiBVdGlsaXR5OiBHZXQgdGhlIHdpZHRoIG9yIGhlaWdodFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wXG4gKiBAcGFyYW0ge01peGVkfSBleHRyYVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIGdldFdpZHRoT3JIZWlnaHQoZWwsIHByb3AsIGV4dHJhKSB7XG4gIC8vIFN0YXJ0IHdpdGggb2Zmc2V0IHByb3BlcnR5LCB3aGljaCBpcyBlcXVpdmFsZW50IHRvIHRoZSBib3JkZXItYm94IHZhbHVlXG4gIHZhciB2YWx1ZUlzQm9yZGVyQm94ID0gdHJ1ZTtcbiAgdmFyIHZhbCA9IHByb3AgPT09ICd3aWR0aCcgPyBlbC5vZmZzZXRXaWR0aCA6IGVsLm9mZnNldEhlaWdodDtcbiAgdmFyIHN0eWxlcyA9IGNvbXB1dGVkKGVsKTtcbiAgdmFyIGlzQm9yZGVyQm94ID0gc3VwcG9ydC5ib3hTaXppbmcgJiYgY3NzKGVsLCAnYm94U2l6aW5nJykgPT09ICdib3JkZXItYm94JztcblxuICAvLyBzb21lIG5vbi1odG1sIGVsZW1lbnRzIHJldHVybiB1bmRlZmluZWQgZm9yIG9mZnNldFdpZHRoLCBzbyBjaGVjayBmb3IgbnVsbC91bmRlZmluZWRcbiAgLy8gc3ZnIC0gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NjQ5Mjg1XG4gIC8vIE1hdGhNTCAtIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTQ5MTY2OFxuICBpZiAodmFsIDw9IDAgfHwgdmFsID09IG51bGwpIHtcbiAgICAvLyBGYWxsIGJhY2sgdG8gY29tcHV0ZWQgdGhlbiB1bmNvbXB1dGVkIGNzcyBpZiBuZWNlc3NhcnlcbiAgICB2YWwgPSBjb21wdXRlZChlbCwgcHJvcCwgc3R5bGVzKTtcblxuICAgIGlmICh2YWwgPCAwIHx8IHZhbCA9PSBudWxsKSB7XG4gICAgICB2YWwgPSBlbC5zdHlsZVtwcm9wXTtcbiAgICB9XG5cbiAgICAvLyBDb21wdXRlZCB1bml0IGlzIG5vdCBwaXhlbHMuIFN0b3AgaGVyZSBhbmQgcmV0dXJuLlxuICAgIGlmIChybnVtbm9ucHgudGVzdCh2YWwpKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIC8vIHdlIG5lZWQgdGhlIGNoZWNrIGZvciBzdHlsZSBpbiBjYXNlIGEgYnJvd3NlciB3aGljaCByZXR1cm5zIHVucmVsaWFibGUgdmFsdWVzXG4gICAgLy8gZm9yIGdldENvbXB1dGVkU3R5bGUgc2lsZW50bHkgZmFsbHMgYmFjayB0byB0aGUgcmVsaWFibGUgZWwuc3R5bGVcbiAgICB2YWx1ZUlzQm9yZGVyQm94ID0gaXNCb3JkZXJCb3ggJiYgKHN1cHBvcnQuYm94U2l6aW5nUmVsaWFibGUoKSB8fCB2YWwgPT09IGVsLnN0eWxlW3Byb3BdKTtcblxuICAgIC8vIE5vcm1hbGl6ZSAnLCBhdXRvLCBhbmQgcHJlcGFyZSBmb3IgZXh0cmFcbiAgICB2YWwgPSBwYXJzZUZsb2F0KHZhbCkgfHwgMDtcbiAgfVxuXG4gIC8vIHVzZSB0aGUgYWN0aXZlIGJveC1zaXppbmcgbW9kZWwgdG8gYWRkL3N1YnRyYWN0IGlycmVsZXZhbnQgc3R5bGVzXG4gIGV4dHJhID0gZXh0cmEgfHwgKGlzQm9yZGVyQm94ID8gJ2JvcmRlcicgOiAnY29udGVudCcpO1xuICB2YWwgKz0gYXVnbWVudFdpZHRoT3JIZWlnaHQoZWwsIHByb3AsIGV4dHJhLCB2YWx1ZUlzQm9yZGVyQm94LCBzdHlsZXMpO1xuICByZXR1cm4gdmFsICsgJ3B4Jztcbn1cblxuLyoqXG4gKiBVdGlsaXR5OiBBdWdtZW50IHRoZSB3aWR0aCBvciB0aGUgaGVpZ2h0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEBwYXJhbSB7TWl4ZWR9IGV4dHJhXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzQm9yZGVyQm94XG4gKiBAcGFyYW0ge0FycmF5fSBzdHlsZXNcbiAqL1xuXG5mdW5jdGlvbiBhdWdtZW50V2lkdGhPckhlaWdodChlbCwgcHJvcCwgZXh0cmEsIGlzQm9yZGVyQm94LCBzdHlsZXMpIHtcbiAgLy8gSWYgd2UgYWxyZWFkeSBoYXZlIHRoZSByaWdodCBtZWFzdXJlbWVudCwgYXZvaWQgYXVnbWVudGF0aW9uLFxuICAvLyBPdGhlcndpc2UgaW5pdGlhbGl6ZSBmb3IgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCBwcm9wZXJ0aWVzXG4gIHZhciBpID0gZXh0cmEgPT09IChpc0JvcmRlckJveCA/ICdib3JkZXInIDogJ2NvbnRlbnQnKSA/IDQgOiAnd2lkdGgnID09IHByb3AgPyAxIDogMDtcbiAgdmFyIHZhbCA9IDA7XG5cbiAgZm9yICg7IGkgPCA0OyBpICs9IDIpIHtcbiAgICAvLyBib3RoIGJveCBtb2RlbHMgZXhjbHVkZSBtYXJnaW4sIHNvIGFkZCBpdCBpZiB3ZSB3YW50IGl0XG4gICAgaWYgKGV4dHJhID09PSAnbWFyZ2luJykge1xuICAgICAgdmFsICs9IGNzcyhlbCwgZXh0cmEgKyBjc3NFeHBhbmRbaV0sIHRydWUsIHN0eWxlcyk7XG4gICAgfVxuXG4gICAgaWYgKGlzQm9yZGVyQm94KSB7XG4gICAgICAvLyBib3JkZXItYm94IGluY2x1ZGVzIHBhZGRpbmcsIHNvIHJlbW92ZSBpdCBpZiB3ZSB3YW50IGNvbnRlbnRcbiAgICAgIGlmIChleHRyYSA9PT0gJ2NvbnRlbnQnKSB7XG4gICAgICAgIHZhbCAtPSBjc3MoZWwsICdwYWRkaW5nJyArIGNzc0V4cGFuZFtpXSwgdHJ1ZSwgc3R5bGVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gYXQgdGhpcyBwb2ludCwgZXh0cmEgaXNuJ3QgYm9yZGVyIG5vciBtYXJnaW4sIHNvIHJlbW92ZSBib3JkZXJcbiAgICAgIGlmIChleHRyYSAhPT0gJ21hcmdpbicpIHtcbiAgICAgICAgdmFsIC09IGNzcyhlbCwgJ2JvcmRlcicgKyBjc3NFeHBhbmRbaV0gKyAnV2lkdGgnLCB0cnVlLCBzdHlsZXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhdCB0aGlzIHBvaW50LCBleHRyYSBpc24ndCBjb250ZW50LCBzbyBhZGQgcGFkZGluZ1xuICAgICAgdmFsICs9IGNzcyhlbCwgJ3BhZGRpbmcnICsgY3NzRXhwYW5kW2ldLCB0cnVlLCBzdHlsZXMpO1xuXG4gICAgICAvLyBhdCB0aGlzIHBvaW50LCBleHRyYSBpc24ndCBjb250ZW50IG5vciBwYWRkaW5nLCBzbyBhZGQgYm9yZGVyXG4gICAgICBpZiAoZXh0cmEgIT09ICdwYWRkaW5nJykge1xuICAgICAgICB2YWwgKz0gY3NzKGVsLCAnYm9yZGVyJyArIGNzc0V4cGFuZFtpXSArICdXaWR0aCcsIHRydWUsIHN0eWxlcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn1cbiIsIi8qKlxuICogTW9kdWxlIERlcGVuZGVuY2llc1xuICovXG5cbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2Nzczpjc3MnKTtcbnZhciBjYW1lbGNhc2UgPSByZXF1aXJlKCd0by1jYW1lbC1jYXNlJyk7XG52YXIgY29tcHV0ZWQgPSByZXF1aXJlKCcuL2NvbXB1dGVkJyk7XG52YXIgcHJvcGVydHkgPSByZXF1aXJlKCcuL3Byb3AnKTtcblxuLyoqXG4gKiBFeHBvc2UgYGNzc2BcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNzcztcblxuLyoqXG4gKiBDU1MgTm9ybWFsIFRyYW5zZm9ybXNcbiAqL1xuXG52YXIgY3NzTm9ybWFsVHJhbnNmb3JtID0ge1xuICBsZXR0ZXJTcGFjaW5nOiAwLFxuICBmb250V2VpZ2h0OiA0MDBcbn07XG5cbi8qKlxuICogR2V0IGEgQ1NTIHZhbHVlXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEBwYXJhbSB7TWl4ZWR9IGV4dHJhXG4gKiBAcGFyYW0ge0FycmF5fSBzdHlsZXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBjc3MoZWwsIHByb3AsIGV4dHJhLCBzdHlsZXMpIHtcbiAgdmFyIGhvb2tzID0gcmVxdWlyZSgnLi9ob29rcycpO1xuICB2YXIgb3JpZyA9IGNhbWVsY2FzZShwcm9wKTtcbiAgdmFyIHN0eWxlID0gZWwuc3R5bGU7XG4gIHZhciB2YWw7XG5cbiAgcHJvcCA9IHByb3BlcnR5KHByb3AsIHN0eWxlKTtcbiAgdmFyIGhvb2sgPSBob29rc1twcm9wXSB8fCBob29rc1tvcmlnXTtcblxuICAvLyBJZiBhIGhvb2sgd2FzIHByb3ZpZGVkIGdldCB0aGUgY29tcHV0ZWQgdmFsdWUgZnJvbSB0aGVyZVxuICBpZiAoaG9vayAmJiBob29rLmdldCkge1xuICAgIGRlYnVnKCdnZXQgaG9vayBwcm92aWRlZC4gdXNlIHRoYXQnKTtcbiAgICB2YWwgPSBob29rLmdldChlbCwgdHJ1ZSwgZXh0cmEpO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBpZiBhIHdheSB0byBnZXQgdGhlIGNvbXB1dGVkIHZhbHVlIGV4aXN0cywgdXNlIHRoYXRcbiAgaWYgKHVuZGVmaW5lZCA9PSB2YWwpIHtcbiAgICBkZWJ1ZygnZmV0Y2ggdGhlIGNvbXB1dGVkIHZhbHVlIG9mICVzJywgcHJvcCk7XG4gICAgdmFsID0gY29tcHV0ZWQoZWwsIHByb3ApO1xuICB9XG5cbiAgaWYgKCdub3JtYWwnID09IHZhbCAmJiBjc3NOb3JtYWxUcmFuc2Zvcm1bcHJvcF0pIHtcbiAgICB2YWwgPSBjc3NOb3JtYWxUcmFuc2Zvcm1bcHJvcF07XG4gICAgZGVidWcoJ25vcm1hbCA9PiAlcycsIHZhbCk7XG4gIH1cblxuICAvLyBSZXR1cm4sIGNvbnZlcnRpbmcgdG8gbnVtYmVyIGlmIGZvcmNlZCBvciBhIHF1YWxpZmllciB3YXMgcHJvdmlkZWQgYW5kIHZhbCBsb29rcyBudW1lcmljXG4gIGlmICgnJyA9PSBleHRyYSB8fCBleHRyYSkge1xuICAgIGRlYnVnKCdjb252ZXJ0aW5nIHZhbHVlOiAlcyBpbnRvIGEgbnVtYmVyJywgdmFsKTtcbiAgICB2YXIgbnVtID0gcGFyc2VGbG9hdCh2YWwpO1xuICAgIHJldHVybiB0cnVlID09PSBleHRyYSB8fCBpc051bWVyaWMobnVtKSA/IG51bSB8fCAwIDogdmFsO1xuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn1cblxuLyoqXG4gKiBJcyBOdW1lcmljXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmZ1bmN0aW9uIGlzTnVtZXJpYyhvYmopIHtcbiAgcmV0dXJuICFpc05hbihwYXJzZUZsb2F0KG9iaikpICYmIGlzRmluaXRlKG9iaik7XG59XG4iLCIvKipcbiAqIE1vZHVsZSBEZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdjc3M6Y29tcHV0ZWQnKTtcbnZhciB3aXRoaW5Eb2N1bWVudCA9IHJlcXVpcmUoJ3dpdGhpbi1kb2N1bWVudCcpO1xudmFyIHN0eWxlcyA9IHJlcXVpcmUoJy4vc3R5bGVzJyk7XG5cbi8qKlxuICogRXhwb3NlIGBjb21wdXRlZGBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXB1dGVkO1xuXG4vKipcbiAqIEdldCB0aGUgY29tcHV0ZWQgc3R5bGVcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICogQHBhcmFtIHtBcnJheX0gcHJlY29tcHV0ZWQgKG9wdGlvbmFsKVxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjb21wdXRlZChlbCwgcHJvcCwgcHJlY29tcHV0ZWQpIHtcbiAgdmFyIGNvbXB1dGVkID0gcHJlY29tcHV0ZWQgfHwgc3R5bGVzKGVsKTtcbiAgdmFyIHJldDtcbiAgXG4gIGlmICghY29tcHV0ZWQpIHJldHVybjtcblxuICBpZiAoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSkge1xuICAgIHJldCA9IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUocHJvcCkgfHwgY29tcHV0ZWRbcHJvcF07XG4gIH0gZWxzZSB7XG4gICAgcmV0ID0gY29tcHV0ZWRbcHJvcF07XG4gIH1cblxuICBpZiAoJycgPT09IHJldCAmJiAhd2l0aGluRG9jdW1lbnQoZWwpKSB7XG4gICAgZGVidWcoJ2VsZW1lbnQgbm90IHdpdGhpbiBkb2N1bWVudCwgdHJ5IGZpbmRpbmcgZnJvbSBzdHlsZSBhdHRyaWJ1dGUnKTtcbiAgICB2YXIgc3R5bGUgPSByZXF1aXJlKCcuL3N0eWxlJyk7XG4gICAgcmV0ID0gc3R5bGUoZWwsIHByb3ApO1xuICB9XG5cbiAgZGVidWcoJ2NvbXB1dGVkIHZhbHVlIG9mICVzOiAlcycsIHByb3AsIHJldCk7XG5cbiAgLy8gU3VwcG9ydDogSUVcbiAgLy8gSUUgcmV0dXJucyB6SW5kZXggdmFsdWUgYXMgYW4gaW50ZWdlci5cbiAgcmV0dXJuIHVuZGVmaW5lZCA9PT0gcmV0ID8gcmV0IDogcmV0ICsgJyc7XG59XG4iLCJcbi8qKlxuICogQ2hlY2sgaWYgYGVsYCBpcyB3aXRoaW4gdGhlIGRvY3VtZW50LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsKSB7XG4gIHZhciBub2RlID0gZWw7XG4gIHdoaWxlIChub2RlID0gbm9kZS5wYXJlbnROb2RlKSB7XG4gICAgaWYgKG5vZGUgPT0gZG9jdW1lbnQpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07IiwiLyoqXG4gKiBFeHBvc2UgYHN0eWxlc2BcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlcztcblxuLyoqXG4gKiBHZXQgYWxsIHRoZSBzdHlsZXNcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBzdHlsZXMoZWwpIHtcbiAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgcmV0dXJuIGVsLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgbnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGVsLmN1cnJlbnRTdHlsZTtcbiAgfVxufVxuIiwiLyoqXG4gKiBFeHBvcnQgYHN3YXBgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBzd2FwO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYHN3YXBgXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzXG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqL1xuXG5mdW5jdGlvbiBzd2FwKGVsLCBvcHRpb25zLCBmbiwgYXJncykge1xuICAvLyBSZW1lbWJlciB0aGUgb2xkIHZhbHVlcywgYW5kIGluc2VydCB0aGUgbmV3IG9uZXNcbiAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMpIHtcbiAgICBvbGRba2V5XSA9IGVsLnN0eWxlW2tleV07XG4gICAgZWwuc3R5bGVba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgfVxuXG4gIHJldCA9IGZuLmFwcGx5KGVsLCBhcmdzIHx8IFtdKTtcblxuICAvLyBSZXZlcnQgdGhlIG9sZCB2YWx1ZXNcbiAgZm9yIChrZXkgaW4gb3B0aW9ucykge1xuICAgIGVsLnN0eWxlW2tleV0gPSBvbGRba2V5XTtcbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG4iLCJcbnZhciB0ZXh0ID0gJ2lubmVyVGV4dCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgPyAnaW5uZXJUZXh0J1xuICA6ICd0ZXh0Q29udGVudCdcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWwsIHZhbCkge1xuICBpZiAodmFsID09IG51bGwpIHJldHVybiBlbFt0ZXh0XTtcbiAgZWxbdGV4dF0gPSB2YWw7XG59O1xuIiwiLyoqXG4gKiBNb2R1bGUgRGVwZW5kZW5jaWVzXG4gKi9cblxudmFyIHByb3RvID0gQXJyYXkucHJvdG90eXBlO1xudmFyIGVhY2ggPSByZXF1aXJlKCdlYWNoJyk7XG52YXIgdHJhdmVyc2UgPSByZXF1aXJlKCd0cmF2ZXJzZScpO1xudmFyIHRvRnVuY3Rpb24gPSByZXF1aXJlKCd0by1mdW5jdGlvbicpO1xudmFyIG1hdGNoZXMgPSByZXF1aXJlKCdtYXRjaGVzLXNlbGVjdG9yJyk7XG5cbi8qKlxuICogRmluZCBjaGlsZHJlbiBtYXRjaGluZyB0aGUgZ2l2ZW4gYHNlbGVjdG9yYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm4ge0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuZmluZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcbiAgcmV0dXJuIHRoaXMuZG9tKHNlbGVjdG9yLCB0aGlzKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGFueSBlbGVtZW50IGluIHRoZSBzZWxlY3Rpb25cbiAqIG1hdGNoZXMgYHNlbGVjdG9yYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuaXMgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG4gIGZvcih2YXIgaSA9IDAsIGVsOyBlbCA9IHRoaXNbaV07IGkrKykge1xuICAgIGlmIChtYXRjaGVzKGVsLCBzZWxlY3RvcikpIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBHZXQgcGFyZW50KHMpIHdpdGggb3B0aW9uYWwgYHNlbGVjdG9yYCBhbmQgYGxpbWl0YFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtOdW1iZXJ9IGxpbWl0XG4gKiBAcmV0dXJuIHtMaXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnBhcmVudCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBsaW1pdCl7XG4gIHJldHVybiB0aGlzLmRvbSh0cmF2ZXJzZSgncGFyZW50Tm9kZScsXG4gICAgdGhpc1swXSxcbiAgICBzZWxlY3RvcixcbiAgICBsaW1pdFxuICAgIHx8IDEpKTtcbn07XG5cbi8qKlxuICogR2V0IG5leHQgZWxlbWVudChzKSB3aXRoIG9wdGlvbmFsIGBzZWxlY3RvcmAgYW5kIGBsaW1pdGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0gbGltaXRcbiAqIEByZXRydW4ge0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMubmV4dCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBsaW1pdCl7XG4gIHJldHVybiB0aGlzLmRvbSh0cmF2ZXJzZSgnbmV4dFNpYmxpbmcnLFxuICAgIHRoaXNbMF0sXG4gICAgc2VsZWN0b3IsXG4gICAgbGltaXRcbiAgICB8fCAxKSk7XG59O1xuXG4vKipcbiAqIEdldCBwcmV2aW91cyBlbGVtZW50KHMpIHdpdGggb3B0aW9uYWwgYHNlbGVjdG9yYCBhbmQgYGxpbWl0YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSBsaW1pdFxuICogQHJldHVybiB7TGlzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5wcmV2ID1cbmV4cG9ydHMucHJldmlvdXMgPSBmdW5jdGlvbihzZWxlY3RvciwgbGltaXQpe1xuICByZXR1cm4gdGhpcy5kb20odHJhdmVyc2UoJ3ByZXZpb3VzU2libGluZycsXG4gICAgdGhpc1swXSxcbiAgICBzZWxlY3RvcixcbiAgICBsaW1pdFxuICAgIHx8IDEpKTtcbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGVhY2ggZWxlbWVudCBjcmVhdGluZyBhIG5ldyBsaXN0IHdpdGhcbiAqIG9uZSBpdGVtIGFuZCBpbnZva2luZyBgZm4obGlzdCwgaSlgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtMaXN0fSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uKGZuKXtcbiAgdmFyIGRvbSA9IHRoaXMuZG9tO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsaXN0LCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgbGlzdCA9IGRvbSh0aGlzW2ldKTtcbiAgICBmbi5jYWxsKGxpc3QsIGxpc3QsIGkpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBlYWNoIGVsZW1lbnQgYW5kIGludm9rZSBgZm4oZWwsIGkpYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtMaXN0fSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuZm9yRWFjaCA9IGZ1bmN0aW9uKGZuKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZm4uY2FsbCh0aGlzW2ldLCB0aGlzW2ldLCBpKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBNYXAgZWFjaCByZXR1cm4gdmFsdWUgZnJvbSBgZm4odmFsLCBpKWAuXG4gKlxuICogUGFzc2luZyBhIGNhbGxiYWNrIGZ1bmN0aW9uOlxuICpcbiAqICAgIGlucHV0cy5tYXAoZnVuY3Rpb24oaW5wdXQpe1xuICogICAgICByZXR1cm4gaW5wdXQudHlwZVxuICogICAgfSlcbiAqXG4gKiBQYXNzaW5nIGEgcHJvcGVydHkgc3RyaW5nOlxuICpcbiAqICAgIGlucHV0cy5tYXAoJ3R5cGUnKVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtMaXN0fSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMubWFwID0gZnVuY3Rpb24oZm4pe1xuICBmbiA9IHRvRnVuY3Rpb24oZm4pO1xuICB2YXIgZG9tID0gdGhpcy5kb207XG4gIHZhciBvdXQgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIG91dC5wdXNoKGZuLmNhbGwoZG9tKHRoaXNbaV0pLCB0aGlzW2ldLCBpKSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5kb20ob3V0KTtcbn07XG5cbi8qKlxuICogU2VsZWN0IGFsbCB2YWx1ZXMgdGhhdCByZXR1cm4gYSB0cnV0aHkgdmFsdWUgb2YgYGZuKHZhbCwgaSlgLlxuICpcbiAqICAgIGlucHV0cy5zZWxlY3QoZnVuY3Rpb24oaW5wdXQpe1xuICogICAgICByZXR1cm4gaW5wdXQudHlwZSA9PSAncGFzc3dvcmQnXG4gKiAgICB9KVxuICpcbiAqICBXaXRoIGEgcHJvcGVydHk6XG4gKlxuICogICAgaW5wdXRzLnNlbGVjdCgndHlwZSA9PSBwYXNzd29yZCcpXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IGZuXG4gKiBAcmV0dXJuIHtMaXN0fSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuZmlsdGVyID1cbmV4cG9ydHMuc2VsZWN0ID0gZnVuY3Rpb24oZm4pe1xuICBmbiA9IHRvRnVuY3Rpb24oZm4pO1xuICB2YXIgZG9tID0gdGhpcy5kb207XG4gIHZhciBvdXQgPSBbXTtcbiAgdmFyIHZhbDtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHZhbCA9IGZuLmNhbGwoZG9tKHRoaXNbaV0pLCB0aGlzW2ldLCBpKTtcbiAgICBpZiAodmFsKSBvdXQucHVzaCh0aGlzW2ldKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmRvbShvdXQpO1xufTtcblxuLyoqXG4gKiBSZWplY3QgYWxsIHZhbHVlcyB0aGF0IHJldHVybiBhIHRydXRoeSB2YWx1ZSBvZiBgZm4odmFsLCBpKWAuXG4gKlxuICogUmVqZWN0aW5nIHVzaW5nIGEgY2FsbGJhY2s6XG4gKlxuICogICAgaW5wdXQucmVqZWN0KGZ1bmN0aW9uKHVzZXIpe1xuICogICAgICByZXR1cm4gaW5wdXQubGVuZ3RoIDwgMjBcbiAqICAgIH0pXG4gKlxuICogUmVqZWN0aW5nIHdpdGggYSBwcm9wZXJ0eTpcbiAqXG4gKiAgICBpdGVtcy5yZWplY3QoJ3Bhc3N3b3JkJylcbiAqXG4gKiBSZWplY3RpbmcgdmFsdWVzIHZpYSBgPT1gOlxuICpcbiAqICAgIGRhdGEucmVqZWN0KG51bGwpXG4gKiAgICBpbnB1dC5yZWplY3QoZmlsZSlcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ3xNaXhlZH0gZm5cbiAqIEByZXR1cm4ge0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMucmVqZWN0ID0gZnVuY3Rpb24oZm4pe1xuICB2YXIgZG9tID0gdGhpcy5kb207XG4gIHZhciBvdXQgPSBbXTtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xuICB2YXIgdmFsLCBpO1xuXG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgZm4pIGZuID0gdG9GdW5jdGlvbihmbik7XG5cbiAgaWYgKGZuKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YWwgPSBmbi5jYWxsKGRvbSh0aGlzW2ldKSwgdGhpc1tpXSwgaSk7XG4gICAgICBpZiAoIXZhbCkgb3V0LnB1c2godGhpc1tpXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHRoaXNbaV0gIT0gZm4pIG91dC5wdXNoKHRoaXNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLmRvbShvdXQpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBgTGlzdGAgY29udGFpbmluZyB0aGUgZWxlbWVudCBhdCBgaWAuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlcbiAqIEByZXR1cm4ge0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuYXQgPSBmdW5jdGlvbihpKXtcbiAgcmV0dXJuIHRoaXMuZG9tKHRoaXNbaV0pO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBgTGlzdGAgY29udGFpbmluZyB0aGUgZmlyc3QgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaVxuICogQHJldHVybiB7TGlzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5maXJzdCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0aGlzLmRvbSh0aGlzWzBdKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgYExpc3RgIGNvbnRhaW5pbmcgdGhlIGxhc3QgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaVxuICogQHJldHVybiB7TGlzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5sYXN0ID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRoaXMuZG9tKHRoaXNbdGhpcy5sZW5ndGggLSAxXSk7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBhcnJheSBmdW5jdGlvbnNcbiAqL1xuXG5lYWNoKFtcbiAgJ3B1c2gnLFxuICAncG9wJyxcbiAgJ3NoaWZ0JyxcbiAgJ3NwbGljZScsXG4gICd1bnNoaWZ0JyxcbiAgJ3JldmVyc2UnLFxuICAnc29ydCcsXG4gICd0b1N0cmluZycsXG4gICdjb25jYXQnLFxuICAnam9pbicsXG4gICdzbGljZSdcbl0sIGZ1bmN0aW9uKG1ldGhvZCkge1xuICBleHBvcnRzW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcHJvdG9bbWV0aG9kXS5hcHBseSh0aGlzLnRvQXJyYXkoKSwgYXJndW1lbnRzKTtcbiAgfTtcbn0pO1xuIiwiXG4vKipcbiAqIGRlcGVuZGVuY2llc1xuICovXG5cbnZhciBtYXRjaGVzID0gcmVxdWlyZSgnbWF0Y2hlcy1zZWxlY3RvcicpO1xuXG4vKipcbiAqIFRyYXZlcnNlIHdpdGggdGhlIGdpdmVuIGBlbGAsIGBzZWxlY3RvcmAgYW5kIGBsZW5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5cbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHR5cGUsIGVsLCBzZWxlY3RvciwgbGVuKXtcbiAgdmFyIGVsID0gZWxbdHlwZV1cbiAgICAsIG4gPSBsZW4gfHwgMVxuICAgICwgcmV0ID0gW107XG5cbiAgaWYgKCFlbCkgcmV0dXJuIHJldDtcblxuICBkbyB7XG4gICAgaWYgKG4gPT0gcmV0Lmxlbmd0aCkgYnJlYWs7XG4gICAgaWYgKDEgIT0gZWwubm9kZVR5cGUpIGNvbnRpbnVlO1xuICAgIGlmIChtYXRjaGVzKGVsLCBzZWxlY3RvcikpIHJldC5wdXNoKGVsKTtcbiAgICBpZiAoIXNlbGVjdG9yKSByZXQucHVzaChlbCk7XG4gIH0gd2hpbGUgKGVsID0gZWxbdHlwZV0pO1xuXG4gIHJldHVybiByZXQ7XG59XG4iLCJcbi8qKlxuICogTW9kdWxlIERlcGVuZGVuY2llc1xuICovXG5cbnZhciBleHByO1xudHJ5IHtcbiAgZXhwciA9IHJlcXVpcmUoJ3Byb3BzJyk7XG59IGNhdGNoKGUpIHtcbiAgZXhwciA9IHJlcXVpcmUoJ2NvbXBvbmVudC1wcm9wcycpO1xufVxuXG4vKipcbiAqIEV4cG9zZSBgdG9GdW5jdGlvbigpYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvRnVuY3Rpb247XG5cbi8qKlxuICogQ29udmVydCBgb2JqYCB0byBhIGBGdW5jdGlvbmAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gb2JqXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHRvRnVuY3Rpb24ob2JqKSB7XG4gIHN3aXRjaCAoe30udG9TdHJpbmcuY2FsbChvYmopKSB7XG4gICAgY2FzZSAnW29iamVjdCBPYmplY3RdJzpcbiAgICAgIHJldHVybiBvYmplY3RUb0Z1bmN0aW9uKG9iaik7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOlxuICAgICAgcmV0dXJuIG9iajtcbiAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgcmV0dXJuIHN0cmluZ1RvRnVuY3Rpb24ob2JqKTtcbiAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgcmV0dXJuIHJlZ2V4cFRvRnVuY3Rpb24ob2JqKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGRlZmF1bHRUb0Z1bmN0aW9uKG9iaik7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZhdWx0IHRvIHN0cmljdCBlcXVhbGl0eS5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZGVmYXVsdFRvRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmope1xuICAgIHJldHVybiB2YWwgPT09IG9iajtcbiAgfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGByZWAgdG8gYSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1JlZ0V4cH0gcmVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcmVnZXhwVG9GdW5jdGlvbihyZSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqKXtcbiAgICByZXR1cm4gcmUudGVzdChvYmopO1xuICB9O1xufVxuXG4vKipcbiAqIENvbnZlcnQgcHJvcGVydHkgYHN0cmAgdG8gYSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ1RvRnVuY3Rpb24oc3RyKSB7XG4gIC8vIGltbWVkaWF0ZSBzdWNoIGFzIFwiPiAyMFwiXG4gIGlmICgvXiAqXFxXKy8udGVzdChzdHIpKSByZXR1cm4gbmV3IEZ1bmN0aW9uKCdfJywgJ3JldHVybiBfICcgKyBzdHIpO1xuXG4gIC8vIHByb3BlcnRpZXMgc3VjaCBhcyBcIm5hbWUuZmlyc3RcIiBvciBcImFnZSA+IDE4XCIgb3IgXCJhZ2UgPiAxOCAmJiBhZ2UgPCAzNlwiXG4gIHJldHVybiBuZXcgRnVuY3Rpb24oJ18nLCAncmV0dXJuICcgKyBnZXQoc3RyKSk7XG59XG5cbi8qKlxuICogQ29udmVydCBgb2JqZWN0YCB0byBhIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gb2JqZWN0VG9GdW5jdGlvbihvYmopIHtcbiAgdmFyIG1hdGNoID0ge307XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBtYXRjaFtrZXldID0gdHlwZW9mIG9ialtrZXldID09PSAnc3RyaW5nJ1xuICAgICAgPyBkZWZhdWx0VG9GdW5jdGlvbihvYmpba2V5XSlcbiAgICAgIDogdG9GdW5jdGlvbihvYmpba2V5XSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCl7XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yICh2YXIga2V5IGluIG1hdGNoKSB7XG4gICAgICBpZiAoIShrZXkgaW4gdmFsKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFtYXRjaFtrZXldKHZhbFtrZXldKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cblxuLyoqXG4gKiBCdWlsdCB0aGUgZ2V0dGVyIGZ1bmN0aW9uLiBTdXBwb3J0cyBnZXR0ZXIgc3R5bGUgZnVuY3Rpb25zXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZ2V0KHN0cikge1xuICB2YXIgcHJvcHMgPSBleHByKHN0cik7XG4gIGlmICghcHJvcHMubGVuZ3RoKSByZXR1cm4gJ18uJyArIHN0cjtcblxuICB2YXIgdmFsLCBpLCBwcm9wO1xuICBmb3IgKGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICBwcm9wID0gcHJvcHNbaV07XG4gICAgdmFsID0gJ18uJyArIHByb3A7XG4gICAgdmFsID0gXCIoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgXCIgKyB2YWwgKyBcIiA/IFwiICsgdmFsICsgXCIoKSA6IFwiICsgdmFsICsgXCIpXCI7XG5cbiAgICAvLyBtaW1pYyBuZWdhdGl2ZSBsb29rYmVoaW5kIHRvIGF2b2lkIHByb2JsZW1zIHdpdGggbmVzdGVkIHByb3BlcnRpZXNcbiAgICBzdHIgPSBzdHJpcE5lc3RlZChwcm9wLCBzdHIsIHZhbCk7XG4gIH1cblxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIE1pbWljIG5lZ2F0aXZlIGxvb2tiZWhpbmQgdG8gYXZvaWQgcHJvYmxlbXMgd2l0aCBuZXN0ZWQgcHJvcGVydGllcy5cbiAqXG4gKiBTZWU6IGh0dHA6Ly9ibG9nLnN0ZXZlbmxldml0aGFuLmNvbS9hcmNoaXZlcy9taW1pYy1sb29rYmVoaW5kLWphdmFzY3JpcHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc3RyaXBOZXN0ZWQgKHByb3AsIHN0ciwgdmFsKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShuZXcgUmVnRXhwKCcoXFxcXC4pPycgKyBwcm9wLCAnZycpLCBmdW5jdGlvbigkMCwgJDEpIHtcbiAgICByZXR1cm4gJDEgPyAkMCA6IHZhbDtcbiAgfSk7XG59XG4iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIHF1ZXJ5ID0gcmVxdWlyZSgncXVlcnknKTtcblxuLyoqXG4gKiBFbGVtZW50IHByb3RvdHlwZS5cbiAqL1xuXG52YXIgcHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcblxuLyoqXG4gKiBWZW5kb3IgZnVuY3Rpb24uXG4gKi9cblxudmFyIHZlbmRvciA9IHByb3RvLm1hdGNoZXNcbiAgfHwgcHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm1vek1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5tc01hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5vTWF0Y2hlc1NlbGVjdG9yO1xuXG4vKipcbiAqIEV4cG9zZSBgbWF0Y2goKWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaDtcblxuLyoqXG4gKiBNYXRjaCBgZWxgIHRvIGBzZWxlY3RvcmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcbiAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XG4gIHZhciBub2RlcyA9IHF1ZXJ5LmFsbChzZWxlY3RvciwgZWwucGFyZW50Tm9kZSk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiIsIihmdW5jdGlvbigpIHtcbiAgdmFyICRkb2MsICR3aW4sIF90aywgY2lyY3BsdXNUZW1wbGF0ZSwgZ21vZGFsMiwgZ3NuU3csIGdzbmRmcGZhY3RvcnksIGxvYWRTY3JpcHQsIHFzZWwsIHN3Y3NzLCB0cmFrbGVzczI7XG5cbiAgdHJha2xlc3MyID0gcmVxdWlyZSgndHJha2xlc3MnKTtcblxuICBnbW9kYWwyID0gcmVxdWlyZSgnZ21vZGFsJyk7XG5cbiAgbG9hZFNjcmlwdCA9IHJlcXVpcmUoJ2xvYWQtc2NyaXB0Jyk7XG5cbiAgcXNlbCA9IHJlcXVpcmUoJ2RvbScpO1xuXG4gIHN3Y3NzID0gcmVxdWlyZSgnLi9zdy5jc3MnKTtcblxuICBjaXJjcGx1c1RlbXBsYXRlID0gcmVxdWlyZSgnLi9jaXJjcGx1cy5odG1sJyk7XG5cbiAgJHdpbiA9IHdpbmRvdztcblxuICBfdGsgPSAkd2luLl90aztcblxuICAkZG9jID0gJHdpbi5kb2N1bWVudDtcblxuICBnc25TdyA9IG51bGw7XG5cblxuICAvKiogXG4gICAqIGdzbmRmcGZhY3RvcnlcbiAgI1xuICAgKi9cblxuICBnc25kZnBmYWN0b3J5ID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIGdzbmRmcGZhY3RvcnkoKSB7fVxuXG4gICAgZ3NuZGZwZmFjdG9yeS5wcm90b3R5cGUuZGZwSUQgPSAnJztcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLmNvdW50ID0gMDtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLnJlbmRlcmVkID0gMDtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLnNlbCA9ICcuZ3NudW5pdCc7XG5cbiAgICBnc25kZnBmYWN0b3J5LnByb3RvdHlwZS5kb3BzID0ge307XG5cbiAgICBnc25kZnBmYWN0b3J5LnByb3RvdHlwZS5pc0xvYWRlZCA9IGZhbHNlO1xuXG4gICAgZ3NuZGZwZmFjdG9yeS5wcm90b3R5cGUuJGFkcyA9IHZvaWQgMDtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLmFkQmxvY2tlck9uID0gZmFsc2U7XG5cbiAgICBnc25kZnBmYWN0b3J5LnByb3RvdHlwZS5zdG9yZUFzID0gJ2dzbnVuaXQnO1xuXG4gICAgZ3NuZGZwZmFjdG9yeS5wcm90b3R5cGUubGFzdFJlZnJlc2ggPSAwO1xuXG4gICAgZ3NuZGZwZmFjdG9yeS5wcm90b3R5cGUuZGlkT3BlbiA9IGZhbHNlO1xuXG4gICAgZ3NuZGZwZmFjdG9yeS5wcm90b3R5cGUuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICBnc25kZnBmYWN0b3J5LnByb3RvdHlwZS5pZU9sZCA9IGZhbHNlO1xuXG4gICAgZ3NuZGZwZmFjdG9yeS5wcm90b3R5cGUuYm9keVRlbXBsYXRlID0gY2lyY3BsdXNUZW1wbGF0ZTtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi5kZnBMb2FkZXIoKTtcbiAgICAgIHNlbGYuZGZwSUQgPSBnc25kZnAuZ2V0TmV0d29ya0lkKHRydWUpO1xuICAgICAgc2VsZi5zZXRPcHRpb25zKG9wdGlvbnMgfHwge30pO1xuICAgICAgX3RrLnV0aWwucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmRvSXQoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLmRvSXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjcCwgY3VycmVudFRpbWUsIHNlbGYsIHNsb3QxO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLnNlbCA9IHNlbGYuZG9wcy5zZWwgfHwgJy5nc251bml0JztcbiAgICAgIGlmICh0eXBlb2Ygc2VsZi5hZFVuaXRCeUlkICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBzZWxmLmFkVW5pdEJ5SWQgPSB7fTtcbiAgICAgIH1cbiAgICAgIGlmICghKCR3aW4ub3BlcmEgJiYgJHdpbi5vcGVyYS52ZXJzaW9uKSkge1xuICAgICAgICBzZWxmLmllT2xkID0gJGRvYy5hbGwgJiYgISR3aW4uYXRvcDtcbiAgICAgIH1cbiAgICAgIGlmIChzZWxmLmllT2xkKSB7XG4gICAgICAgIHNlbGYuZG9wcy5pblZpZXdPbmx5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoc2VsZi5zZWwgPT09ICcuY2lyY3BsdXMnKSB7XG4gICAgICAgIHNlbGYuc3RvcmVBcyA9ICdjaXJjcGx1cyc7XG4gICAgICAgIGNwID0gcXNlbChzZWxmLnNlbCk7XG4gICAgICAgIHNsb3QxID0gcXNlbCgnLmNwc2xvdDEnKTtcbiAgICAgICAgaWYgKGNwLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoIXNsb3QxWzBdKSB7XG4gICAgICAgICAgICBjcC5odG1sKHNlbGYuZG9wcy5ib2R5VGVtcGxhdGUgfHwgc2VsZi5ib2R5VGVtcGxhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZWxmLiRhZHMgPSBbcXNlbCgnLmNwc2xvdDEnKVswXSwgcXNlbCgnLmNwc2xvdDInKVswXV07XG4gICAgICAgIGlmIChzZWxmLiRhZHNbMF0pIHtcbiAgICAgICAgICBzZWxmLmNyZWF0ZUFkcygpLmRpc3BsYXlBZHMoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzZWxmLnNlbCA9PT0gJy5nc25zdycpIHtcbiAgICAgICAgc2VsZi5kb3BzLmluVmlld09ubHkgPSBmYWxzZTtcbiAgICAgICAgJHdpbi5nbW9kYWwuaW5qZWN0U3R5bGUoJ3N3Y3NzJywgc3djc3MpO1xuICAgICAgICBnc25TdyA9IHNlbGY7XG4gICAgICAgIHNlbGYuZG9wcy5lbmFibGVTaW5nbGVSZXF1ZXN0ID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5kZnBJRCA9IGdzbmRmcC5nZXROZXR3b3JrSWQoKTtcbiAgICAgICAgaWYgKHFzZWwoc2VsZi5kb3BzLmRpc3BsYXlXaGVuRXhpc3RzIHx8ICcuZ3NudW5pdCcpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuc3RvcmVBcyA9ICdnc25zdyc7XG4gICAgICAgIGlmIChzZWxmLmRpZE9wZW4gfHwgKHNlbGYuZ2V0Q29va2llKCdnc25zdzInKSAhPSBudWxsKSkge1xuICAgICAgICAgIHNlbGYub25DbG9zZUNhbGxiYWNrKHtcbiAgICAgICAgICAgIGNhbmNlbDogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJlbnRUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgICAgICAgICBpZiAoKGN1cnJlbnRUaW1lIC0gc2VsZi5sYXN0UmVmcmVzaCkgPCAyMDAwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5sYXN0UmVmcmVzaCA9IGN1cnJlbnRUaW1lO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5nZXRQb3B1cChzZWxmLnNlbCk7XG4gICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuc3RvcmVBcyA9ICdnc251bml0JztcbiAgICAgICAgc2VsZi4kYWRzID0gcXNlbChzZWxmLnNlbCk7XG4gICAgICAgIHNlbGYuY3JlYXRlQWRzKCkuZGlzcGxheUFkcygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHMpIHtcbiAgICAgIHZhciBkb3BzLCBrLCBzZWxmLCB2O1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBkb3BzID0ge1xuICAgICAgICBzZXRUYXJnZXRpbmc6IHt9LFxuICAgICAgICBzZXRDYXRlZ29yeUV4Y2x1c2lvbjogJycsXG4gICAgICAgIHNldExvY2F0aW9uOiAnJyxcbiAgICAgICAgZW5hYmxlU2luZ2xlUmVxdWVzdDogZmFsc2UsXG4gICAgICAgIGNvbGxhcHNlRW1wdHlEaXZzOiB0cnVlLFxuICAgICAgICByZWZyZXNoRXhpc3Rpbmc6IHRydWUsXG4gICAgICAgIGRpc2FibGVQdWJsaXNoZXJDb25zb2xlOiBmYWxzZSxcbiAgICAgICAgZGlzYWJsZUluaXRpYWxMb2FkOiBmYWxzZSxcbiAgICAgICAgaW5WaWV3T25seTogdHJ1ZSxcbiAgICAgICAgbm9GZXRjaDogZmFsc2VcbiAgICAgIH07XG4gICAgICBmb3IgKGsgaW4gb3BzKSB7XG4gICAgICAgIHYgPSBvcHNba107XG4gICAgICAgIGRvcHNba10gPSB2O1xuICAgICAgfVxuICAgICAgc2VsZi5kb3BzID0gZG9wcztcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBnc25kZnBmYWN0b3J5LnByb3RvdHlwZS5vbk9wZW5DYWxsYmFjayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB2YXIgc2VsZjtcbiAgICAgIHNlbGYgPSBnc25TdztcbiAgICAgIGdzbmRmcC5vbignY2xpY2tCcmFuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgJHdpbi5nbW9kYWwuaGlkZSgpO1xuICAgICAgfSk7XG4gICAgICBzZWxmLmRpZE9wZW4gPSB0cnVlO1xuICAgICAgc2VsZi5pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgc2VsZi4kYWRzID0gcXNlbChzZWxmLnNlbCk7XG4gICAgICBzZWxmLmNyZWF0ZUFkcygpLmRpc3BsYXlBZHMoKTtcbiAgICAgIHNldFRpbWVvdXQoKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoc2VsZi5hZEJsb2NrZXJPbikge1xuICAgICAgICAgIHFzZWwoJy5yZW1vdmUnKS5yZW1vdmUoKTtcbiAgICAgICAgICBxc2VsKCcuc3ctbXNnJylbMF0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgcXNlbCgnLnN3LWhlYWRlci1jb3B5JylbMF0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICBxc2VsKCcuc3ctcm93JylbMF0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgICAgfSksIDE1MCk7XG4gICAgfTtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLm9uQ2xvc2VDYWxsYmFjayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB2YXIgc2VsZjtcbiAgICAgIHNlbGYgPSBnc25TdztcbiAgICAgIHNlbGYuaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAkd2luLnNjcm9sbFRvKDAsIDApO1xuICAgICAgaWYgKCFzZWxmLmdldENvb2tpZSgnZ3Nuc3cyJykpIHtcbiAgICAgICAgc2VsZi5zZXRDb29raWUoJ2dzbnN3MicsIGdzbmRmcC5nc25OZXR3b3JrSWQgKyBcIixcIiArIGdzbmRmcC5lbmFibGVDaXJjUGx1cyArIFwiLFwiICsgZ3NuZGZwLmRpc2FibGVTdywgMSk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNlbGYuZG9wcy5vbkNsb3NlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHNlbGYuZG9wcy5vbkNsb3NlKHNlbGYuZGlkT3Blbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLnN3U3VjY2Nlc3MgPSBmdW5jdGlvbihteXJzcCkge1xuICAgICAgdmFyIGRhdGEsIGV2dCwgaGFuZGxlRXZlbnQsIHJzcCwgc2VsZjtcbiAgICAgICR3aW4uZ3Nuc3dDYWxsYmFjayA9IG51bGw7XG4gICAgICByc3AgPSBteXJzcDtcbiAgICAgIGlmICh0eXBlb2YgbXlyc3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJzcCA9IEpTT04ucGFyc2UobXlyc3ApO1xuICAgICAgfVxuICAgICAgc2VsZiA9IGdzblN3O1xuICAgICAgaWYgKHJzcCkge1xuICAgICAgICBpZiAoIWdzbmRmcC5nc25OZXR3b3JrSWQpIHtcbiAgICAgICAgICBnc25kZnAuZ3NuTmV0d29ya0lkID0gcnNwLk5ldHdvcmtJZDtcbiAgICAgICAgfVxuICAgICAgICBnc25kZnAuZW5hYmxlQ2lyY1BsdXMgPSByc3AuRW5hYmxlQ2lyY1BsdXM7XG4gICAgICAgIGdzbmRmcC5kaXNhYmxlU3cgPSByc3AuRGlzYWJsZVN3O1xuICAgICAgICBkYXRhID0gcnNwLlRlbXBsYXRlO1xuICAgICAgfVxuICAgICAgc2VsZi5kZnBJRCA9IGdzbmRmcC5nZXROZXR3b3JrSWQoKTtcbiAgICAgIGV2dCA9IHtcbiAgICAgICAgZGF0YTogcnNwLFxuICAgICAgICBjYW5jZWw6IGZhbHNlXG4gICAgICB9O1xuICAgICAgc2VsZi5kb3BzLm9uRGF0YShldnQpO1xuICAgICAgaWYgKGV2dC5jYW5jZWwpIHtcbiAgICAgICAgZGF0YSA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC8lJUNBQ0hFQlVTVEVSJSUvZywgKG5ldyBEYXRlKS5nZXRUaW1lKCkpLnJlcGxhY2UoLyUlQ0hBSU5JRCUlL2csIGdzbmRmcC5nc25pZCk7XG4gICAgICAgIGlmICghc2VsZi5yZWN0KSB7XG4gICAgICAgICAgc2VsZi5yZWN0ID0ge1xuICAgICAgICAgICAgdzogTWF0aC5tYXgoJGRvYy5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsICR3aW4uaW5uZXJXaWR0aCB8fCAwKSxcbiAgICAgICAgICAgIGg6IE1hdGgubWF4KCRkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgJHdpbi5pbm5lckhlaWdodCB8fCAwKVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlRXZlbnQgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdzdy1jbG9zZScpID49IDApIHtcbiAgICAgICAgICAgICR3aW4uZ21vZGFsLm9mZignY2xpY2snLCBoYW5kbGVFdmVudCk7XG4gICAgICAgICAgICAkd2luLmdtb2RhbC5vZmYoJ3RhcCcsIGhhbmRsZUV2ZW50KTtcbiAgICAgICAgICAgIHJldHVybiAkd2luLmdtb2RhbC5oaWRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAkd2luLmdtb2RhbC5vbignY2xpY2snLCBoYW5kbGVFdmVudCk7XG4gICAgICAgICR3aW4uZ21vZGFsLm9uKCd0YXAnLCBoYW5kbGVFdmVudCk7XG4gICAgICAgIGlmICgkd2luLmdtb2RhbC5zaG93KHtcbiAgICAgICAgICBjb250ZW50OiBcIjxkaXYgaWQ9J3N3Jz5cIiArIGRhdGEgKyBcIjxkaXY+XCIsXG4gICAgICAgICAgY2xvc2VDbHM6ICdzdy1jbG9zZSdcbiAgICAgICAgfSwgc2VsZi5vbkNsb3NlQ2FsbGJhY2spKSB7XG4gICAgICAgICAgc2VsZi5vbk9wZW5DYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLm9uQ2xvc2VDYWxsYmFjayh7XG4gICAgICAgICAgY2FuY2VsOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLmdldFBvcHVwID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGF0YVR5cGUsIHJlcXVlc3QsIHNlbGYsIHVybDtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgdXJsID0gZ3NuZGZwLmFwaVVybCArIFwiL1Nob3BwZXJXZWxjb21lL0dldC9cIiArIGdzbmRmcC5nc25pZDtcbiAgICAgIGRhdGFUeXBlID0gJ2pzb24nO1xuICAgICAgaWYgKHNlbGYuaWVPbGQpIHtcbiAgICAgICAgJHdpbi5nc25zd0NhbGxiYWNrID0gZnVuY3Rpb24ocnNwKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuc3dTdWNjY2Vzcyhyc3ApO1xuICAgICAgICB9O1xuICAgICAgICB1cmwgKz0gJz9jYWxsYmFjaz1nc25zd0NhbGxiYWNrJztcbiAgICAgICAgZGF0YVR5cGUgPSAnanNvbnAnO1xuICAgICAgfVxuICAgICAgaWYgKGRhdGFUeXBlID09PSAnanNvbnAnKSB7XG4gICAgICAgIGxvYWRTY3JpcHQodXJsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciByZXE7XG4gICAgICAgICAgcmVxID0gdGhpcztcbiAgICAgICAgICBpZiAocmVxLnN0YXR1cyA+PSAyMDAgJiYgcmVxLnN0YXR1cyA8IDQwMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuc3dTdWNjY2VzcyhyZXEucmVzcG9uc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuXG4gICAgZ3NuZGZwZmFjdG9yeS5wcm90b3R5cGUuZ2V0Q29va2llID0gZnVuY3Rpb24obmFtZU9mQ29va2llKSB7XG4gICAgICB2YXIgYmVnaW4sIGNkLCBjb29raWVEYXRhLCBlbmQ7XG4gICAgICBpZiAoJGRvYy5jb29raWUubGVuZ3RoID4gMCkge1xuICAgICAgICBiZWdpbiA9ICRkb2MuY29va2llLmluZGV4T2YobmFtZU9mQ29va2llICsgJz0nKTtcbiAgICAgICAgZW5kID0gMDtcbiAgICAgICAgaWYgKGJlZ2luICE9PSAtMSkge1xuICAgICAgICAgIGJlZ2luICs9IG5hbWVPZkNvb2tpZS5sZW5ndGggKyAxO1xuICAgICAgICAgIGVuZCA9ICRkb2MuY29va2llLmluZGV4T2YoJzsnLCBiZWdpbik7XG4gICAgICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgICAgIGVuZCA9ICRkb2MuY29va2llLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29va2llRGF0YSA9IGRlY29kZVVSSSgkZG9jLmNvb2tpZS5zdWJzdHJpbmcoYmVnaW4sIGVuZCkpO1xuICAgICAgICAgIGlmIChjb29raWVEYXRhLmluZGV4T2YoJywnKSA+IDApIHtcbiAgICAgICAgICAgIGNkID0gY29va2llRGF0YS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgZ3NuZGZwLmdzbk5ldHdvcmtJZCA9IGNkWzBdO1xuICAgICAgICAgICAgZ3NuZGZwLmVuYWJsZUNpcmNQbHVzID0gY2RbMV07XG4gICAgICAgICAgICBnc25kZnAuZGlzYWJsZVN3ID0gY2RbMl07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjb29raWVEYXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgZ3NuZGZwZmFjdG9yeS5wcm90b3R5cGUuc2V0Q29va2llID0gZnVuY3Rpb24obmFtZU9mQ29va2llLCB2YWx1ZSwgZXhwaXJlZGF5cykge1xuICAgICAgdmFyIGVkO1xuICAgICAgZWQgPSBuZXcgRGF0ZTtcbiAgICAgIGVkLnNldFRpbWUoZWQuZ2V0VGltZSgpICsgZXhwaXJlZGF5cyAqIDI0ICogMzYwMCAqIDEwMDApO1xuICAgICAgJGRvYy5jb29raWUgPSBuYW1lT2ZDb29raWUgKyAnPScgKyBlbmNvZGVVUkkodmFsdWUpICsgKGV4cGlyZWRheXMgPT09IG51bGwgPyAnJyA6ICc7IGV4cGlyZXM9JyArIGVkLnRvR01UU3RyaW5nKCkpICsgJzsgcGF0aD0vJztcbiAgICB9O1xuXG4gICAgZ3NuZGZwZmFjdG9yeS5wcm90b3R5cGUuc2V0VGFyZ2V0aW5nID0gZnVuY3Rpb24oJGFkVW5pdERhdGEsIGFsbERhdGEpIHtcbiAgICAgIHZhciBleGNsdXNpb25zLCBleGNsdXNpb25zR3JvdXAsIGksIGssIGxlbiwgdGFyZ2V0aW5nLCB2LCB2YWx1ZVRyaW1tZWQ7XG4gICAgICB0YXJnZXRpbmcgPSBhbGxEYXRhWyd0YXJnZXRpbmcnXTtcbiAgICAgIGlmICh0YXJnZXRpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGFyZ2V0aW5nID0gZXZhbCgnKCcgKyB0YXJnZXRpbmcgKyAnKScpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoayBpbiB0YXJnZXRpbmcpIHtcbiAgICAgICAgICB2ID0gdGFyZ2V0aW5nW2tdO1xuICAgICAgICAgIGlmIChrID09PSAnYnJhbmQnKSB7XG4gICAgICAgICAgICBnc25kZnAuc2V0QnJhbmQodik7XG4gICAgICAgICAgfVxuICAgICAgICAgICRhZFVuaXREYXRhLnNldFRhcmdldGluZyhrLCB2KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZXhjbHVzaW9ucyA9IGFsbERhdGFbJ2V4Y2x1c2lvbnMnXTtcbiAgICAgIGlmIChleGNsdXNpb25zKSB7XG4gICAgICAgIGV4Y2x1c2lvbnNHcm91cCA9IGV4Y2x1c2lvbnMuc3BsaXQoJywnKTtcbiAgICAgICAgdmFsdWVUcmltbWVkID0gdm9pZCAwO1xuICAgICAgICBmb3IgKGsgPSBpID0gMCwgbGVuID0gZXhjbHVzaW9uc0dyb3VwLmxlbmd0aDsgaSA8IGxlbjsgayA9ICsraSkge1xuICAgICAgICAgIHYgPSBleGNsdXNpb25zR3JvdXBba107XG4gICAgICAgICAgdmFsdWVUcmltbWVkID0gX3RrLnV0aWwudHJpbSh2KTtcbiAgICAgICAgICBpZiAodmFsdWVUcmltbWVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRhZFVuaXREYXRhLnNldENhdGVnb3J5RXhjbHVzaW9uKHZhbHVlVHJpbW1lZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBnc25kZnBmYWN0b3J5LnByb3RvdHlwZS5jcmVhdGVBZHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkYWRVbml0LCAkZXhpc3RpbmdDb250ZW50LCBhZFVuaXQsIGFkVW5pdElELCBhbGxEYXRhLCBkaW1lbnNpb25zLCBpLCBrLCBsZW4sIHJlZiwgc2VsZjtcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgcmVmID0gc2VsZi4kYWRzO1xuICAgICAgZm9yIChrID0gaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGsgPSArK2kpIHtcbiAgICAgICAgYWRVbml0ID0gcmVmW2tdO1xuICAgICAgICAkYWRVbml0ID0gcXNlbChhZFVuaXQpO1xuICAgICAgICBhbGxEYXRhID0gX3RrLnV0aWwuYWxsRGF0YShhZFVuaXQpO1xuICAgICAgICBhZFVuaXRJRCA9IHNlbGYuZ2V0SUQoJGFkVW5pdCwgc2VsZi5zdG9yZUFzLCBhZFVuaXQpO1xuICAgICAgICBkaW1lbnNpb25zID0gc2VsZi5nZXREaW1lbnNpb25zKCRhZFVuaXQsIGFsbERhdGEpO1xuICAgICAgICAkZXhpc3RpbmdDb250ZW50ID0gYWRVbml0LmlubmVySFRNTDtcbiAgICAgICAgcXNlbChhZFVuaXQpLmh0bWwoJycpO1xuICAgICAgICAkYWRVbml0LmFkZENsYXNzKCdkaXNwbGF5LW5vbmUnKTtcbiAgICAgICAgJHdpbi5nb29nbGV0YWcuY21kLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyICRhZFVuaXREYXRhLCBjb21wYW5pb247XG4gICAgICAgICAgJGFkVW5pdERhdGEgPSBzZWxmLmFkVW5pdEJ5SWRbYWRVbml0SURdO1xuICAgICAgICAgIGlmICgkYWRVbml0RGF0YSkge1xuICAgICAgICAgICAgc2VsZi5zZXRUYXJnZXRpbmcoJGFkVW5pdERhdGEsIGFsbERhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmRmcElEID0gc2VsZi5kZnBJRC5yZXBsYWNlKC8oXFwvXFwvKSsvZ2ksICcvJykucmVwbGFjZSgvXFxzKy9naSwgJycpLnJlcGxhY2UoLyhcXC8pJC8sICcvJyk7XG4gICAgICAgICAgaWYgKHNlbGYuZGZwSUQuaW5kZXhPZignLycpICE9PSAwKSB7XG4gICAgICAgICAgICBzZWxmLmRmcElEID0gJy8nICsgZGZwSUQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhbGxEYXRhWydvdXRvZnBhZ2UnXSkge1xuICAgICAgICAgICAgJGFkVW5pdERhdGEgPSAkd2luLmdvb2dsZXRhZy5kZWZpbmVPdXRPZlBhZ2VTbG90KHNlbGYuZGZwSUQsIGFkVW5pdElEKS5hZGRTZXJ2aWNlKCR3aW4uZ29vZ2xldGFnLnB1YmFkcygpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGFkVW5pdERhdGEgPSAkd2luLmdvb2dsZXRhZy5kZWZpbmVTbG90KHNlbGYuZGZwSUQsIGRpbWVuc2lvbnMsIGFkVW5pdElEKS5hZGRTZXJ2aWNlKCR3aW4uZ29vZ2xldGFnLnB1YmFkcygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29tcGFuaW9uID0gYWxsRGF0YVsnY29tcGFuaW9uJ107XG4gICAgICAgICAgaWYgKGNvbXBhbmlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAkYWRVbml0RGF0YS5hZGRTZXJ2aWNlKCR3aW4uZ29vZ2xldGFnLmNvbXBhbmlvbkFkcygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5zZXRUYXJnZXRpbmcoJGFkVW5pdERhdGEsIGFsbERhdGEpO1xuICAgICAgICAgIHNlbGYuYWRVbml0QnlJZFthZFVuaXRJRF0gPSAkYWRVbml0RGF0YTtcbiAgICAgICAgICAkYWRVbml0RGF0YS5vbGRSZW5kZXJFbmRlZCA9ICRhZFVuaXREYXRhLm9sZFJlbmRlckVuZGVkIHx8ICRhZFVuaXREYXRhLnJlbmRlckVuZGVkO1xuICAgICAgICAgICRhZFVuaXREYXRhLnJlbmRlckVuZGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGlzcGxheTtcbiAgICAgICAgICAgIHNlbGYucmVuZGVyZWQrKztcbiAgICAgICAgICAgIGRpc3BsYXkgPSBhZFVuaXQuc3R5bGUuZGlzcGxheTtcbiAgICAgICAgICAgICRhZFVuaXQucmVtb3ZlQ2xhc3MoJ2Rpc3BsYXktbm9uZScpO1xuICAgICAgICAgICAgJGFkVW5pdC5hZGRDbGFzcygnZGlzcGxheS0nICsgZGlzcGxheSk7XG4gICAgICAgICAgICAkYWRVbml0RGF0YS5leGlzdGluZyA9IHRydWU7XG4gICAgICAgICAgICBpZiAoJGFkVW5pdERhdGEub2xkUmVuZGVyRW5kZWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAkYWRVbml0RGF0YS5vbGRSZW5kZXJFbmRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWxmLmRvcHMuYWZ0ZXJFYWNoQWRMb2FkZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgc2VsZi5kb3BzLmFmdGVyRWFjaEFkTG9hZGVkLmNhbGwoc2VsZiwgJGFkVW5pdCwgJGFkVW5pdERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgJHdpbi5nb29nbGV0YWcuY21kLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBicmFuZCwgZXhjbHVzaW9uc0dyb3VwLCBqLCBsZW4xLCByZWYxLCB2LCB2YWx1ZVRyaW1tZWQ7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZi5kb3BzLnNldFRhcmdldGluZ1snYnJhbmQnXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBicmFuZCA9IGdzbmRmcC5nZXRCcmFuZCgpO1xuICAgICAgICAgIGlmIChicmFuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZWxmLmRvcHMuc2V0VGFyZ2V0aW5nWydicmFuZCddID0gYnJhbmQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmRvcHMuZW5hYmxlU2luZ2xlUmVxdWVzdCkge1xuICAgICAgICAgICR3aW4uZ29vZ2xldGFnLnB1YmFkcygpLmVuYWJsZVNpbmdsZVJlcXVlc3QoKTtcbiAgICAgICAgfVxuICAgICAgICByZWYxID0gc2VsZi5kb3BzLnNldFRhcmdldGluZztcbiAgICAgICAgZm9yIChrIGluIHJlZjEpIHtcbiAgICAgICAgICB2ID0gcmVmMVtrXTtcbiAgICAgICAgICBpZiAoayA9PT0gJ2JyYW5kJykge1xuICAgICAgICAgICAgZ3NuZGZwLnNldEJyYW5kKHYpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkd2luLmdvb2dsZXRhZy5wdWJhZHMoKS5zZXRUYXJnZXRpbmcoaywgdik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzZWxmLmRvcHMuc2V0TG9jYXRpb24gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBzZWxmLmRvcHMuc2V0TG9jYXRpb24ubGF0aXR1ZGUgPT09ICdudW1iZXInICYmIHR5cGVvZiBzZWxmLmRvcHMuc2V0TG9jYXRpb24ubG9uZ2l0dWRlID09PSAnbnVtYmVyJyAmJiB0eXBlb2Ygc2VsZi5kb3BzLnNldExvY2F0aW9uLnByZWNpc2lvbiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICR3aW4uZ29vZ2xldGFnLnB1YmFkcygpLnNldExvY2F0aW9uKHNlbGYuZG9wcy5zZXRMb2NhdGlvbi5sYXRpdHVkZSwgc2VsZi5kb3BzLnNldExvY2F0aW9uLmxvbmdpdHVkZSwgc2VsZi5kb3BzLnNldExvY2F0aW9uLnByZWNpc2lvbik7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZi5kb3BzLnNldExvY2F0aW9uLmxhdGl0dWRlID09PSAnbnVtYmVyJyAmJiB0eXBlb2Ygc2VsZi5kb3BzLnNldExvY2F0aW9uLmxvbmdpdHVkZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICR3aW4uZ29vZ2xldGFnLnB1YmFkcygpLnNldExvY2F0aW9uKHNlbGYuZG9wcy5zZXRMb2NhdGlvbi5sYXRpdHVkZSwgc2VsZi5kb3BzLnNldExvY2F0aW9uLmxvbmdpdHVkZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmRvcHMuc2V0Q2F0ZWdvcnlFeGNsdXNpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGV4Y2x1c2lvbnNHcm91cCA9IHNlbGYuZG9wcy5zZXRDYXRlZ29yeUV4Y2x1c2lvbi5zcGxpdCgnLCcpO1xuICAgICAgICAgIGZvciAoayA9IGogPSAwLCBsZW4xID0gZXhjbHVzaW9uc0dyb3VwLmxlbmd0aDsgaiA8IGxlbjE7IGsgPSArK2opIHtcbiAgICAgICAgICAgIHYgPSBleGNsdXNpb25zR3JvdXBba107XG4gICAgICAgICAgICB2YWx1ZVRyaW1tZWQgPSBfdGsudXRpbC50cmltKHYpO1xuICAgICAgICAgICAgaWYgKHZhbHVlVHJpbW1lZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICR3aW4uZ29vZ2xldGFnLnB1YmFkcygpLnNldENhdGVnb3J5RXhjbHVzaW9uKHZhbHVlVHJpbW1lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmRvcHMuY29sbGFwc2VFbXB0eURpdnMgfHwgc2VsZi5kb3BzLmNvbGxhcHNlRW1wdHlEaXZzID09PSAnb3JpZ2luYWwnKSB7XG4gICAgICAgICAgJHdpbi5nb29nbGV0YWcucHViYWRzKCkuY29sbGFwc2VFbXB0eURpdnMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5kb3BzLmRpc2FibGVQdWJsaXNoZXJDb25zb2xlKSB7XG4gICAgICAgICAgJHdpbi5nb29nbGV0YWcucHViYWRzKCkuZGlzYWJsZVB1Ymxpc2hlckNvbnNvbGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5kb3BzLmRpc2FibGVJbml0aWFsTG9hZCkge1xuICAgICAgICAgICR3aW4uZ29vZ2xldGFnLnB1YmFkcygpLmRpc2FibGVJbml0aWFsTG9hZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmRvcHMubm9GZXRjaCkge1xuICAgICAgICAgICR3aW4uZ29vZ2xldGFnLnB1YmFkcygpLm5vRmV0Y2goKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5zZWwgPT09ICcuY2lyY3BsdXMnKSB7XG4gICAgICAgICAgJHdpbi5nb29nbGV0YWcuY29tcGFuaW9uQWRzKCkuc2V0UmVmcmVzaFVuZmlsbGVkU2xvdHModHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgJHdpbi5nb29nbGV0YWcuZW5hYmxlU2VydmljZXMoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLmlzSGVpZ2h0SW5WaWV3ID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgIHZhciBpc1Zpc2libGUsIG92ZXJoYW5nLCBwZXJjZW50VmlzaWJsZSwgcmVjdDtcbiAgICAgIHBlcmNlbnRWaXNpYmxlID0gMC41MDtcbiAgICAgIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIG92ZXJoYW5nID0gcmVjdC5oZWlnaHQgKiAoMSAtIHBlcmNlbnRWaXNpYmxlKTtcbiAgICAgIGlzVmlzaWJsZSA9IChyZWN0LnRvcCA+PSAtb3ZlcmhhbmcpICYmIChyZWN0LmJvdHRvbSA8PSB3aW5kb3cuaW5uZXJIZWlnaHQgKyBvdmVyaGFuZyk7XG4gICAgICByZXR1cm4gaXNWaXNpYmxlO1xuICAgIH07XG5cbiAgICBnc25kZnBmYWN0b3J5LnByb3RvdHlwZS5kaXNwbGF5QWRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJGFkVW5pdCwgJGFkVW5pdERhdGEsIGFkVW5pdCwgaSwgaWQsIGssIGxlbiwgcmVmLCBzZWxmLCB0b1B1c2g7XG4gICAgICBzZWxmID0gdGhpcztcbiAgICAgIHRvUHVzaCA9IFtdO1xuICAgICAgcmVmID0gc2VsZi4kYWRzO1xuICAgICAgZm9yIChrID0gaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGsgPSArK2kpIHtcbiAgICAgICAgYWRVbml0ID0gcmVmW2tdO1xuICAgICAgICAkYWRVbml0ID0gcXNlbChhZFVuaXQpO1xuICAgICAgICBpZCA9ICRhZFVuaXQuaWQoKTtcbiAgICAgICAgJGFkVW5pdERhdGEgPSBzZWxmLmFkVW5pdEJ5SWRbaWRdO1xuICAgICAgICBpZiAoKCRhZFVuaXREYXRhICE9IG51bGwpKSB7XG4gICAgICAgICAgaWYgKCFzZWxmLmRvcHMuaW5WaWV3T25seSB8fCBzZWxmLmlzSGVpZ2h0SW5WaWV3KGFkVW5pdCkpIHtcbiAgICAgICAgICAgIGlmICgkYWRVbml0RGF0YS5leGlzdGluZykge1xuICAgICAgICAgICAgICB0b1B1c2gucHVzaCgkYWRVbml0RGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkd2luLmdvb2dsZXRhZy5jbWQucHVzaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHdpbi5nb29nbGV0YWcuZGlzcGxheShpZCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkd2luLmdvb2dsZXRhZy5jbWQucHVzaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkd2luLmdvb2dsZXRhZy5kaXNwbGF5KGlkKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRvUHVzaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICR3aW4uZ29vZ2xldGFnLmNtZC5wdXNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAkd2luLmdvb2dsZXRhZy5wdWJhZHMoKS5yZWZyZXNoKHRvUHVzaCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBnc25kZnBmYWN0b3J5LnByb3RvdHlwZS5nZXRJRCA9IGZ1bmN0aW9uKCRhZFVuaXQsIGFkVW5pdE5hbWUsIGFkVW5pdCkge1xuICAgICAgdmFyIGlkLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZCA9ICRhZFVuaXQuaWQoKTtcbiAgICAgIGlmICgoaWQgfHwgJycpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgIGlkID0gYWRVbml0TmFtZSArICckYXV0byRnZW4kaWQkJyArIHNlbGYuY291bnQrKztcbiAgICAgICAgJGFkVW5pdC5pZChpZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfTtcblxuICAgIGdzbmRmcGZhY3RvcnkucHJvdG90eXBlLmdldERpbWVuc2lvbnMgPSBmdW5jdGlvbigkYWRVbml0LCBhbGxEYXRhKSB7XG4gICAgICB2YXIgZGltZW5zaW9uR3JvdXBzLCBkaW1lbnNpb25TZXQsIGRpbWVuc2lvbnMsIGRpbWVuc2lvbnNEYXRhLCBpLCBrLCBsZW4sIHY7XG4gICAgICBkaW1lbnNpb25zID0gW107XG4gICAgICBkaW1lbnNpb25zRGF0YSA9IGFsbERhdGFbJ2RpbWVuc2lvbnMnXTtcbiAgICAgIGlmIChkaW1lbnNpb25zRGF0YSkge1xuICAgICAgICBkaW1lbnNpb25Hcm91cHMgPSBkaW1lbnNpb25zRGF0YS5zcGxpdCgnLCcpO1xuICAgICAgICBmb3IgKGsgPSBpID0gMCwgbGVuID0gZGltZW5zaW9uR3JvdXBzLmxlbmd0aDsgaSA8IGxlbjsgayA9ICsraSkge1xuICAgICAgICAgIHYgPSBkaW1lbnNpb25Hcm91cHNba107XG4gICAgICAgICAgZGltZW5zaW9uU2V0ID0gdi5zcGxpdCgneCcpO1xuICAgICAgICAgIGRpbWVuc2lvbnMucHVzaChbcGFyc2VJbnQoZGltZW5zaW9uU2V0WzBdLCAxMCksIHBhcnNlSW50KGRpbWVuc2lvblNldFsxXSwgMTApXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBkaW1lbnNpb25zO1xuICAgIH07XG5cbiAgICBnc25kZnBmYWN0b3J5LnByb3RvdHlwZS5kZnBMb2FkZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBnYWRzO1xuICAgICAgaWYgKHNlbGYuaXNMb2FkZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgJHdpbi5nb29nbGV0YWcgPSAkd2luLmdvb2dsZXRhZyB8fCB7fTtcbiAgICAgICR3aW4uZ29vZ2xldGFnLmNtZCA9ICR3aW4uZ29vZ2xldGFnLmNtZCB8fCBbXTtcbiAgICAgIGdhZHMgPSAkZG9jLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgZ2Fkcy5hc3luYyA9IHRydWU7XG4gICAgICBnYWRzLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgIGdhZHMub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLmRmcEJsb2NrZWQoKTtcbiAgICAgIH07XG4gICAgICBsb2FkU2NyaXB0KCcvL3d3dy5nb29nbGV0YWdzZXJ2aWNlcy5jb20vdGFnL2pzL2dwdC5qcycpO1xuICAgICAgc2VsZi5pc0xvYWRlZCA9IHRydWU7XG4gICAgICBpZiAoZ2Fkcy5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHtcbiAgICAgICAgc2VsZi5kZnBCbG9ja2VkKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgZ3NuZGZwZmFjdG9yeS5wcm90b3R5cGUuZGZwQmxvY2tlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbW1hbmRzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLmFkQmxvY2tlck9uID0gdHJ1ZTtcbiAgICAgIGNvbW1hbmRzID0gJHdpbi5nb29nbGV0YWcuY21kO1xuICAgICAgc2V0VGltZW91dCgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfZGVmaW5lU2xvdCwgaSwgaywgbGVuLCB2O1xuICAgICAgICBfZGVmaW5lU2xvdCA9IGZ1bmN0aW9uKG5hbWUsIGRpbWVuc2lvbnMsIGlkLCBvb3ApIHtcbiAgICAgICAgICAkd2luLmdvb2dsZXRhZy5hZHMucHVzaChpZCk7XG4gICAgICAgICAgJHdpbi5nb29nbGV0YWcuYWRzW2lkXSA9IHtcbiAgICAgICAgICAgIHJlbmRlckVuZGVkOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICAgICAgYWRkU2VydmljZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuICR3aW4uZ29vZ2xldGFnLmFkc1tpZF07XG4gICAgICAgIH07XG4gICAgICAgICR3aW4uZ29vZ2xldGFnID0ge1xuICAgICAgICAgIGNtZDoge1xuICAgICAgICAgICAgcHVzaDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChzZWxmKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZHM6IFtdLFxuICAgICAgICAgIHB1YmFkczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICB9LFxuICAgICAgICAgIG5vRmV0Y2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkaXNhYmxlSW5pdGlhbExvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkaXNhYmxlUHVibGlzaGVyQ29uc29sZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVuYWJsZVNpbmdsZVJlcXVlc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRUYXJnZXRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb2xsYXBzZUVtcHR5RGl2czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVuYWJsZVNlcnZpY2VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmaW5lU2xvdDogZnVuY3Rpb24obmFtZSwgZGltZW5zaW9ucywgaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBfZGVmaW5lU2xvdChuYW1lLCBkaW1lbnNpb25zLCBpZCwgZmFsc2UpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmaW5lT3V0T2ZQYWdlU2xvdDogZnVuY3Rpb24obmFtZSwgaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBfZGVmaW5lU2xvdChuYW1lLCBbXSwgaWQsIHRydWUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGlzcGxheTogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICR3aW4uZ29vZ2xldGFnLmFkc1tpZF0ucmVuZGVyRW5kZWQuY2FsbChzZWxmKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChrID0gaSA9IDAsIGxlbiA9IGNvbW1hbmRzLmxlbmd0aDsgaSA8IGxlbjsgayA9ICsraSkge1xuICAgICAgICAgIHYgPSBjb21tYW5kc1trXTtcbiAgICAgICAgICAkd2luLmdvb2dsZXRhZy5jbWQucHVzaCh2KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0pLCA1MCk7XG4gICAgfTtcblxuICAgIHJldHVybiBnc25kZnBmYWN0b3J5O1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBnc25kZnBmYWN0b3J5O1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjkuMlxudmFyIEVtaXR0ZXIsIGNoZWNrRXZlbnQsIGNyZWF0ZU1vZGFsLCBkb21pZnksIGdtb2RhbCwgaGlkZU1vZGFsSW50ZXJuYWwsIG1vZGFsLCBtb2RhbHMsIHNob3dNb2RhbEludGVybmFsLCB0cmltLCB3aW47XG5cbkVtaXR0ZXIgPSByZXF1aXJlKCdlbWl0dGVyJyk7XG5cbmRvbWlmeSA9IHJlcXVpcmUoJ2RvbWlmeScpO1xuXG50cmltID0gcmVxdWlyZSgndHJpbScpO1xuXG53aW4gPSB3aW5kb3c7XG5cbm1vZGFscyA9IFtdO1xuXG5jaGVja0V2ZW50ID0gZnVuY3Rpb24oc2VsZiwgbmFtZSwgZXZ0LCBlbCkge1xuICB2YXIgc2NscywgdGc7XG4gIGV2dCA9IGV2dCB8fCB3aW4uZXZlbnQ7XG4gIHRnID0gZXZ0LnRhcmdldCB8fCBldnQuc3JjRWxlbWVudDtcbiAgaWYgKHRnLm5vZGVUeXBlID09PSAzKSB7XG4gICAgdGcgPSB0Zy5wYXJlbnROb2RlO1xuICB9XG4gIGlmIChzZWxmLmhhc0Nscyh0Zy5wYXJlbnROb2RlLCBcIlwiICsgc2VsZi5jbG9zZUNscykpIHtcbiAgICB0ZyA9IHRnLnBhcmVudE5vZGU7XG4gIH1cbiAgc2NscyA9IFwiZ21vZGFsLXdyYXAgXCIgKyBzZWxmLmNsb3NlQ2xzO1xuICBpZiAobmFtZSA9PT0gJ2NsaWNrJykge1xuICAgIGlmIChzZWxmLmhhc0Nscyh0Zywgc2NscykgfHwgdGcgPT09IGVsKSB7XG4gICAgICBzZWxmLmVtaXQoJ2NsaWNrJywgdGcsIGV2dCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5hbWUgPT09ICdrZXlwcmVzcycpIHtcbiAgICBpZiAoc2VsZi5oYXNDbHModGcsIHNjbHMpIHx8IHRnID09PSBlbCB8fCB0ZyA9PT0gc2VsLmRvYyB8fCB0ZyA9PT0gc2VsZi5kb2MuYm9keSkge1xuICAgICAgaWYgKChldnQud2hpY2ggfHwgZXZ0LmtleUNvZGUpID09PSAyNykge1xuICAgICAgICBzZWxmLmVtaXQoJ2VzYycsIHRnLCBldnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChuYW1lID09PSAndGFwJykge1xuICAgIGlmIChzZWxmLmhhc0Nscyh0Zywgc2NscykgfHwgdGcgPT09IGVsKSB7XG4gICAgICBzZWxmLmVtaXQoJ3RhcCcsIHRnLCBldnQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jcmVhdGVNb2RhbCA9IGZ1bmN0aW9uKHNlbGYpIHtcbiAgdmFyIGVsLCBteUtleXByZXNzLCBvbGRrcDtcbiAgZWwgPSBzZWxmLmRvYy5nZXRFbGVtZW50QnlJZChcImdtb2RhbFwiKTtcbiAgaWYgKCFlbCkge1xuICAgIHNlbGYuaW5qZWN0U3R5bGUoJ2dtb2RhbGNzcycsIHNlbGYuY3NzKTtcbiAgICBlbCA9IHNlbGYuZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmlkID0gJ2dtb2RhbCc7XG4gICAgZWwub25jbGljayA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgcmV0dXJuIGNoZWNrRXZlbnQoc2VsZiwgJ2NsaWNrJywgZXZ0LCBlbCk7XG4gICAgfTtcbiAgICBteUtleXByZXNzID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICByZXR1cm4gY2hlY2tFdmVudChzZWxmLCAna2V5cHJlc3MnLCBldnQsIGVsKTtcbiAgICB9O1xuICAgIGVsLm9ua2V5cHJlc3MgPSBteUtleXByZXNzO1xuICAgIGlmICh0eXBlb2Ygc2VsZi5kb2Mub25rZXlwcmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb2xka3AgPSBzZWxmLmRvYy5vbmtleXByZXNzO1xuICAgICAgc2VsZi5kb2Mub25rZXlwcmVzcyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBvbGRrcChldnQpO1xuICAgICAgICByZXR1cm4gbXlLZXlwcmVzcyhldnQpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5kb2Mub25rZXlwcmVzcyA9IG15S2V5cHJlc3M7XG4gICAgfVxuICAgIGVsLm9udGFwID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICByZXR1cm4gY2hlY2tFdmVudChzZWxmLCAndGFwJywgZXZ0LCBlbCk7XG4gICAgfTtcbiAgICBlbC5hcHBlbmRDaGlsZChkb21pZnkoc2VsZi50cGwpKTtcbiAgICBzZWxmLmRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKGVsKTtcbiAgfVxuICByZXR1cm4gZWw7XG59O1xuXG5zaG93TW9kYWxJbnRlcm5hbCA9IGZ1bmN0aW9uKHNlbGYsIG9wdHMpIHtcbiAgdmFyIGVDbHM7XG4gIGlmICgob3B0cyAhPSBudWxsKSkge1xuICAgIHNlbGYub3B0cyA9IG9wdHM7XG4gICAgaWYgKChzZWxmLm9wdHMuY29udGVudCAhPSBudWxsKSkge1xuICAgICAgd2hpbGUgKHNlbGYuZWwuZmlyc3RDaGlsZCkge1xuICAgICAgICBzZWxmLmVsLnJlbW92ZUNoaWxkKHNlbGYuZWwuZmlyc3RDaGlsZCk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNlbGYub3B0cy5jb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICBzZWxmLmVsLmFwcGVuZENoaWxkKGRvbWlmeShzZWxmLm9wdHMuY29udGVudCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5lbC5hcHBlbmRDaGlsZChzZWxmLm9wdHMuY29udGVudCk7XG4gICAgICB9XG4gICAgICBzZWxmLm9wdHMuY29udGVudCA9IG51bGw7XG4gICAgfVxuICB9XG4gIGlmIChzZWxmLm9wdHMuY2xvc2VDbHMpIHtcbiAgICBzZWxmLmNsb3NlQ2xzID0gc2VsZi5vcHRzLmNsb3NlQ2xzO1xuICB9XG4gIHNlbGYuZWxXcmFwcGVyLnN0eWxlLmRpc3BsYXkgPSBzZWxmLmVsV3JhcHBlci5zdHlsZS52aXNpYmlsaXR5ID0gXCJcIjtcbiAgc2VsZi5lbFdyYXBwZXIuY2xhc3NOYW1lID0gdHJpbSgoc2VsZi5iYXNlQ2xzICsgXCIgXCIpICsgKHNlbGYub3B0cy5jbHMgfHwgJycpKTtcbiAgZUNscyA9IHNlbGYuZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NOYW1lO1xuICBzZWxmLmRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTmFtZSA9IHRyaW0oZUNscyArIFwiIGJvZHktZ21vZGFsXCIpO1xuICBzZWxmLmVtaXQoJ3Nob3cnLCBzZWxmKTtcbn07XG5cbmhpZGVNb2RhbEludGVybmFsID0gZnVuY3Rpb24oc2VsZikge1xuICB2YXIgZUNscztcbiAgc2VsZi5lbFdyYXBwZXIuY2xhc3NOYW1lID0gXCJcIiArIHNlbGYuYmFzZUNscztcbiAgZUNscyA9IHNlbGYuZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NOYW1lO1xuICBzZWxmLmRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTmFtZSA9IHRyaW0oZUNscy5yZXBsYWNlKC9ib2R5XFwtZ21vZGFsL2dpLCAnJykpO1xuICBzZWxmLmlzVmlzaWJsZSA9IGZhbHNlO1xuICBzZWxmLmVtaXQoJ2hpZGUnLCBzZWxmKTtcbiAgaWYgKHR5cGVvZiBzZWxmLm9wdHMuaGlkZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgc2VsZi5vcHRzLmhpZGVDYWxsYmFjayhzZWxmKTtcbiAgfVxuICBpZiAobW9kYWxzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gc2VsZi5zaG93KCk7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBtb2RhbFxuICovXG5cbm1vZGFsID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBtb2RhbCgpIHt9XG5cbiAgbW9kYWwucHJvdG90eXBlLmRvYyA9IHdpbi5kb2N1bWVudDtcblxuICBtb2RhbC5wcm90b3R5cGUuZWxXcmFwcGVyID0gbnVsbDtcblxuICBtb2RhbC5wcm90b3R5cGUuZWwgPSBudWxsO1xuXG4gIG1vZGFsLnByb3RvdHlwZS5vcHRzID0ge307XG5cbiAgbW9kYWwucHJvdG90eXBlLmJhc2VDbHMgPSAnZ21vZGFsJztcblxuICBtb2RhbC5wcm90b3R5cGUuY2xvc2VDbHMgPSAnZ21vZGFsLWNsb3NlJztcblxuICBtb2RhbC5wcm90b3R5cGUudHBsID0gJzxkaXYgY2xhc3M9XCJnbW9kYWwtd3JhcCBnbW9kYWwtbGVmdFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJnbW9kYWwtd3JhcCBnbW9kYWwtY29udGVudFwiIGlkPVwiZ21vZGFsQ29udGVudFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJnbW9kYWwtd3JhcCBnbW9kYWwtcmlnaHRcIj48L2Rpdj4nO1xuXG4gIG1vZGFsLnByb3RvdHlwZS5jc3MgPSAnLmdtb2RhbHtkaXNwbGF5Om5vbmU7b3ZlcmZsb3c6aGlkZGVuO291dGxpbmU6MDstd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzp0b3VjaDtwb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7Ym90dG9tOjA7cmlnaHQ6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3otaW5kZXg6OTk5OTk5MH0uYm9keS1nbW9kYWwgLmdtb2RhbHtkaXNwbGF5OnRhYmxlfS5ib2R5LWdtb2RhbHtvdmVyZmxvdzpoaWRkZW59Lmdtb2RhbC1jb250ZW50LC5nbW9kYWwtd3JhcHtkaXNwbGF5OnRhYmxlLWNlbGw7cG9zaXRpb246cmVsYXRpdmU7dmVydGljYWwtYWxpZ246IG1pZGRsZX0uZ21vZGFsLWxlZnQsLmdtb2RhbC1yaWdodHt3aWR0aDo1MCV9JztcblxuICBtb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKG9wdHMsIGhpZGVDYikge1xuICAgIHZhciBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIGlmICghc2VsZi5kb2MgfHwgIXNlbGYuZG9jLmJvZHkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc2VsZi5lbFdyYXBwZXIgPSBjcmVhdGVNb2RhbChzZWxmKTtcbiAgICBpZiAoIXNlbGYuZWwpIHtcbiAgICAgIHNlbGYuZWwgPSBzZWxmLmRvYy5nZXRFbGVtZW50QnlJZChcImdtb2RhbENvbnRlbnRcIik7XG4gICAgfVxuICAgIGlmIChvcHRzKSB7XG4gICAgICBvcHRzLmhpZGVDYWxsYmFjayA9IGhpZGVDYjtcbiAgICAgIG1vZGFscy5wdXNoKG9wdHMpO1xuICAgIH1cbiAgICBpZiAoc2VsZi5pc1Zpc2libGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKG1vZGFscy5sZW5ndGggPiAwKSB7XG4gICAgICBvcHRzID0gbW9kYWxzLnNoaWZ0KCk7XG4gICAgfVxuICAgIGlmICghc2VsZi5vcHRzICYmICFvcHRzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICgoc2VsZi5vcHRzIHx8IG9wdHMpLnRpbWVvdXQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzaG93TW9kYWxJbnRlcm5hbChzZWxmLCBvcHRzKTtcbiAgICAgIH0sIChzZWxmLm9wdHMgfHwgb3B0cykudGltZW91dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dNb2RhbEludGVybmFsKHNlbGYsIG9wdHMpO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5pc1Zpc2libGUgPSB0cnVlO1xuICB9O1xuXG4gIG1vZGFsLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFzZWxmLmVsV3JhcHBlcikge1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfVxuICAgIGlmIChzZWxmLm9wdHMpIHtcbiAgICAgIGlmIChzZWxmLm9wdHMudGltZW91dCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBoaWRlTW9kYWxJbnRlcm5hbChzZWxmKTtcbiAgICAgICAgfSwgc2VsZi5vcHRzLnRpbWVvdXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGlkZU1vZGFsSW50ZXJuYWwoc2VsZik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG4gIG1vZGFsLnByb3RvdHlwZS5pbmplY3RTdHlsZSA9IGZ1bmN0aW9uKGlkLCBjc3MpIHtcbiAgICB2YXIgZWwsIGVseCwgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcbiAgICBlbCA9IHNlbGYuZG9jLmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICBlbCA9IHNlbGYuZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBlbC5pZCA9IGlkO1xuICAgICAgZWwudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICBpZiAoZWwuc3R5bGVTaGVldCkge1xuICAgICAgICBlbC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChzZWxmLmRvYy5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgICAgIH1cbiAgICAgIGVseCA9IHNlbGYuZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaW5rJylbMF07XG4gICAgICBlbHggPSBlbHggfHwgKHNlbGYuZG9jLmhlYWQgfHwgc2VsZi5kb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSkubGFzdENoaWxkO1xuICAgICAgZWx4LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCBlbHgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBtb2RhbC5wcm90b3R5cGUuaGFzQ2xzID0gZnVuY3Rpb24oZWwsIGNscykge1xuICAgIHZhciBpLCBrLCBsZW4sIHJlZiwgdjtcbiAgICByZWYgPSBjbHMuc3BsaXQoJyAnKTtcbiAgICBmb3IgKGsgPSBpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgayA9ICsraSkge1xuICAgICAgdiA9IHJlZltrXTtcbiAgICAgIGlmICgoJyAnICsgZWwuY2xhc3NOYW1lKS5pbmRleE9mKCcgJyArIHYpID49IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZXR1cm4gbW9kYWw7XG5cbn0pKCk7XG5cbkVtaXR0ZXIobW9kYWwucHJvdG90eXBlKTtcblxuZ21vZGFsID0gbmV3IG1vZGFsKCk7XG5cbndpbi5nbW9kYWwgPSBnbW9kYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZ21vZGFsO1xuIiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgdGhpcy5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwiXG4vKipcbiAqIEV4cG9zZSBgcGFyc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2U7XG5cbi8qKlxuICogVGVzdHMgZm9yIGJyb3dzZXIgc3VwcG9ydC5cbiAqL1xuXG52YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4vLyBTZXR1cFxuZGl2LmlubmVySFRNTCA9ICcgIDxsaW5rLz48dGFibGU+PC90YWJsZT48YSBocmVmPVwiL2FcIj5hPC9hPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIi8+Jztcbi8vIE1ha2Ugc3VyZSB0aGF0IGxpbmsgZWxlbWVudHMgZ2V0IHNlcmlhbGl6ZWQgY29ycmVjdGx5IGJ5IGlubmVySFRNTFxuLy8gVGhpcyByZXF1aXJlcyBhIHdyYXBwZXIgZWxlbWVudCBpbiBJRVxudmFyIGlubmVySFRNTEJ1ZyA9ICFkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpbmsnKS5sZW5ndGg7XG5kaXYgPSB1bmRlZmluZWQ7XG5cbi8qKlxuICogV3JhcCBtYXAgZnJvbSBqcXVlcnkuXG4gKi9cblxudmFyIG1hcCA9IHtcbiAgbGVnZW5kOiBbMSwgJzxmaWVsZHNldD4nLCAnPC9maWVsZHNldD4nXSxcbiAgdHI6IFsyLCAnPHRhYmxlPjx0Ym9keT4nLCAnPC90Ym9keT48L3RhYmxlPiddLFxuICBjb2w6IFsyLCAnPHRhYmxlPjx0Ym9keT48L3Rib2R5Pjxjb2xncm91cD4nLCAnPC9jb2xncm91cD48L3RhYmxlPiddLFxuICAvLyBmb3Igc2NyaXB0L2xpbmsvc3R5bGUgdGFncyB0byB3b3JrIGluIElFNi04LCB5b3UgaGF2ZSB0byB3cmFwXG4gIC8vIGluIGEgZGl2IHdpdGggYSBub24td2hpdGVzcGFjZSBjaGFyYWN0ZXIgaW4gZnJvbnQsIGhhIVxuICBfZGVmYXVsdDogaW5uZXJIVE1MQnVnID8gWzEsICdYPGRpdj4nLCAnPC9kaXY+J10gOiBbMCwgJycsICcnXVxufTtcblxubWFwLnRkID1cbm1hcC50aCA9IFszLCAnPHRhYmxlPjx0Ym9keT48dHI+JywgJzwvdHI+PC90Ym9keT48L3RhYmxlPiddO1xuXG5tYXAub3B0aW9uID1cbm1hcC5vcHRncm91cCA9IFsxLCAnPHNlbGVjdCBtdWx0aXBsZT1cIm11bHRpcGxlXCI+JywgJzwvc2VsZWN0PiddO1xuXG5tYXAudGhlYWQgPVxubWFwLnRib2R5ID1cbm1hcC5jb2xncm91cCA9XG5tYXAuY2FwdGlvbiA9XG5tYXAudGZvb3QgPSBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXTtcblxubWFwLnBvbHlsaW5lID1cbm1hcC5lbGxpcHNlID1cbm1hcC5wb2x5Z29uID1cbm1hcC5jaXJjbGUgPVxubWFwLnRleHQgPVxubWFwLmxpbmUgPVxubWFwLnBhdGggPVxubWFwLnJlY3QgPVxubWFwLmcgPSBbMSwgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZlcnNpb249XCIxLjFcIj4nLCc8L3N2Zz4nXTtcblxuLyoqXG4gKiBQYXJzZSBgaHRtbGAgYW5kIHJldHVybiBhIERPTSBOb2RlIGluc3RhbmNlLCB3aGljaCBjb3VsZCBiZSBhIFRleHROb2RlLFxuICogSFRNTCBET00gTm9kZSBvZiBzb21lIGtpbmQgKDxkaXY+IGZvciBleGFtcGxlKSwgb3IgYSBEb2N1bWVudEZyYWdtZW50XG4gKiBpbnN0YW5jZSwgZGVwZW5kaW5nIG9uIHRoZSBjb250ZW50cyBvZiB0aGUgYGh0bWxgIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbCAtIEhUTUwgc3RyaW5nIHRvIFwiZG9taWZ5XCJcbiAqIEBwYXJhbSB7RG9jdW1lbnR9IGRvYyAtIFRoZSBgZG9jdW1lbnRgIGluc3RhbmNlIHRvIGNyZWF0ZSB0aGUgTm9kZSBmb3JcbiAqIEByZXR1cm4ge0RPTU5vZGV9IHRoZSBUZXh0Tm9kZSwgRE9NIE5vZGUsIG9yIERvY3VtZW50RnJhZ21lbnQgaW5zdGFuY2VcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKGh0bWwsIGRvYykge1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIGh0bWwpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N0cmluZyBleHBlY3RlZCcpO1xuXG4gIC8vIGRlZmF1bHQgdG8gdGhlIGdsb2JhbCBgZG9jdW1lbnRgIG9iamVjdFxuICBpZiAoIWRvYykgZG9jID0gZG9jdW1lbnQ7XG5cbiAgLy8gdGFnIG5hbWVcbiAgdmFyIG0gPSAvPChbXFx3Ol0rKS8uZXhlYyhodG1sKTtcbiAgaWYgKCFtKSByZXR1cm4gZG9jLmNyZWF0ZVRleHROb2RlKGh0bWwpO1xuXG4gIGh0bWwgPSBodG1sLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTsgLy8gUmVtb3ZlIGxlYWRpbmcvdHJhaWxpbmcgd2hpdGVzcGFjZVxuXG4gIHZhciB0YWcgPSBtWzFdO1xuXG4gIC8vIGJvZHkgc3VwcG9ydFxuICBpZiAodGFnID09ICdib2R5Jykge1xuICAgIHZhciBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdodG1sJyk7XG4gICAgZWwuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgfVxuXG4gIC8vIHdyYXAgbWFwXG4gIHZhciB3cmFwID0gbWFwW3RhZ10gfHwgbWFwLl9kZWZhdWx0O1xuICB2YXIgZGVwdGggPSB3cmFwWzBdO1xuICB2YXIgcHJlZml4ID0gd3JhcFsxXTtcbiAgdmFyIHN1ZmZpeCA9IHdyYXBbMl07XG4gIHZhciBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZWwuaW5uZXJIVE1MID0gcHJlZml4ICsgaHRtbCArIHN1ZmZpeDtcbiAgd2hpbGUgKGRlcHRoLS0pIGVsID0gZWwubGFzdENoaWxkO1xuXG4gIC8vIG9uZSBlbGVtZW50XG4gIGlmIChlbC5maXJzdENoaWxkID09IGVsLmxhc3RDaGlsZCkge1xuICAgIHJldHVybiBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKTtcbiAgfVxuXG4gIC8vIHNldmVyYWwgZWxlbWVudHNcbiAgdmFyIGZyYWdtZW50ID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIHtcbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKSk7XG4gIH1cblxuICByZXR1cm4gZnJhZ21lbnQ7XG59XG4iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgb25sb2FkID0gcmVxdWlyZSgnc2NyaXB0LW9ubG9hZCcpO1xudmFyIHRpY2sgPSByZXF1aXJlKCduZXh0LXRpY2snKTtcbnZhciB0eXBlID0gcmVxdWlyZSgndHlwZScpO1xuXG4vKipcbiAqIEV4cG9zZSBgbG9hZFNjcmlwdGAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG9hZFNjcmlwdChvcHRpb25zLCBmbil7XG4gIGlmICghb3B0aW9ucykgdGhyb3cgbmV3IEVycm9yKCdDYW50IGxvYWQgbm90aGluZy4uLicpO1xuXG4gIC8vIEFsbG93IGZvciB0aGUgc2ltcGxlc3QgY2FzZSwganVzdCBwYXNzaW5nIGEgYHNyY2Agc3RyaW5nLlxuICBpZiAoJ3N0cmluZycgPT0gdHlwZShvcHRpb25zKSkgb3B0aW9ucyA9IHsgc3JjIDogb3B0aW9ucyB9O1xuXG4gIHZhciBodHRwcyA9IGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cHM6JyB8fFxuICAgICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JztcblxuICAvLyBJZiB5b3UgdXNlIHByb3RvY29sIHJlbGF0aXZlIFVSTHMsIHRoaXJkLXBhcnR5IHNjcmlwdHMgbGlrZSBHb29nbGVcbiAgLy8gQW5hbHl0aWNzIGJyZWFrIHdoZW4gdGVzdGluZyB3aXRoIGBmaWxlOmAgc28gdGhpcyBmaXhlcyB0aGF0LlxuICBpZiAob3B0aW9ucy5zcmMgJiYgb3B0aW9ucy5zcmMuaW5kZXhPZignLy8nKSA9PT0gMCkge1xuICAgIG9wdGlvbnMuc3JjID0gaHR0cHMgPyAnaHR0cHM6JyArIG9wdGlvbnMuc3JjIDogJ2h0dHA6JyArIG9wdGlvbnMuc3JjO1xuICB9XG5cbiAgLy8gQWxsb3cgdGhlbSB0byBwYXNzIGluIGRpZmZlcmVudCBVUkxzIGRlcGVuZGluZyBvbiB0aGUgcHJvdG9jb2wuXG4gIGlmIChodHRwcyAmJiBvcHRpb25zLmh0dHBzKSBvcHRpb25zLnNyYyA9IG9wdGlvbnMuaHR0cHM7XG4gIGVsc2UgaWYgKCFodHRwcyAmJiBvcHRpb25zLmh0dHApIG9wdGlvbnMuc3JjID0gb3B0aW9ucy5odHRwO1xuXG4gIC8vIE1ha2UgdGhlIGA8c2NyaXB0PmAgZWxlbWVudCBhbmQgaW5zZXJ0IGl0IGJlZm9yZSB0aGUgZmlyc3Qgc2NyaXB0IG9uIHRoZVxuICAvLyBwYWdlLCB3aGljaCBpcyBndWFyYW50ZWVkIHRvIGV4aXN0IHNpbmNlIHRoaXMgSmF2YXNjcmlwdCBpcyBydW5uaW5nLlxuICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gIHNjcmlwdC5zcmMgPSBvcHRpb25zLnNyYztcblxuICAvLyBJZiB3ZSBoYXZlIGEgZm4sIGF0dGFjaCBldmVudCBoYW5kbGVycywgZXZlbiBpbiBJRS4gQmFzZWQgb2ZmIG9mXG4gIC8vIHRoZSBUaGlyZC1QYXJ0eSBKYXZhc2NyaXB0IHNjcmlwdCBsb2FkaW5nIGV4YW1wbGU6XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90aGlyZHBhcnR5anMvdGhpcmRwYXJ0eWpzLWNvZGUvYmxvYi9tYXN0ZXIvZXhhbXBsZXMvdGVtcGxhdGVzLzAyL2xvYWRpbmctZmlsZXMvaW5kZXguaHRtbFxuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlKGZuKSkge1xuICAgIG9ubG9hZChzY3JpcHQsIGZuKTtcbiAgfVxuXG4gIHRpY2soZnVuY3Rpb24oKXtcbiAgICAvLyBBcHBlbmQgYWZ0ZXIgZXZlbnQgbGlzdGVuZXJzIGFyZSBhdHRhY2hlZCBmb3IgSUUuXG4gICAgdmFyIGZpcnN0U2NyaXB0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgIGZpcnN0U2NyaXB0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgZmlyc3RTY3JpcHQpO1xuICB9KTtcblxuICAvLyBSZXR1cm4gdGhlIHNjcmlwdCBlbGVtZW50IGluIGNhc2UgdGhleSB3YW50IHRvIGRvIGFueXRoaW5nIHNwZWNpYWwsIGxpa2VcbiAgLy8gZ2l2ZSBpdCBhbiBJRCBvciBhdHRyaWJ1dGVzLlxuICByZXR1cm4gc2NyaXB0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICcuZ3Nuc3cge1xcbiAgXHRmbG9hdDogbGVmdDtcXG59XFxuLmdtb2RhbCB7XFxuXFxuXHQvKiBJRSA4LSAqL1xcblx0ZmlsdGVyOmFscGhhKG9wYWNpdHk9OTApOyBcXG5cdC1tcy1maWx0ZXI6XCJwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuQWxwaGEoT3BhY2l0eT05MClcIjtcXG4gICAgZmlsdGVyOiBwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuQWxwaGEoT3BhY2l0eT0xMDApO1xcblxcblx0Lyogd29ya3MgZm9yIG9sZCBzY2hvb2wgdmVyc2lvbnMgb2YgdGhlIE1vemlsbGEgYnJvd3NlcnMgbGlrZSBOZXRzY2FwZSBOYXZpZ2F0b3IuICovXFxuXHQtbW96LW9wYWNpdHk6IDAuOTsgXFxuXFxuXHQvKiBUaGlzIGlzIGZvciBvbGQgdmVyc2lvbnMgb2YgU2FmYXJpICgxLngpIHdpdGggS0hUTUwgcmVuZGVyaW5nIGVuZ2luZSAqL1xcblx0LWtodG1sLW9wYWNpdHk6IDAuOTsgXFxuXFxuXHQvKiBUaGlzIGlzIHRoZSBcIm1vc3QgaW1wb3J0YW50XCIgb25lIGJlY2F1c2UgaXRcXCdzIHRoZSBjdXJyZW50IHN0YW5kYXJkIGluIENTUy4gVGhpcyB3aWxsIHdvcmsgaW4gbW9zdCB2ZXJzaW9ucyBvZiBGaXJlZm94LCBTYWZhcmksIGFuZCBPcGVyYS4gKi8gIFxcblx0b3BhY2l0eTogMC45OyBcXG4gIFx0YmFja2dyb3VuZDogIzAwMDsgLyogSUU1KyAqL1xcbiAgXHRiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLDAuOTApO1xcbn1cXG4uc3ctcG9wIHtcXG5cdGZpbHRlcjogYWxwaGEob3BhY2l0eT0xMDApO1xcbiAgICAtbXMtZmlsdGVyOiBcInByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5BbHBoYShPcGFjaXR5PTEwMClcIjtcXG4gICAgZmlsdGVyOiBwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuQWxwaGEoT3BhY2l0eT0xMDApO1xcblx0LW1vei1vcGFjaXR5OiAxOyBcXG5cdC1raHRtbC1vcGFjaXR5OiAxOyBcXG5cdG9wYWNpdHk6IDE7IFxcblx0YmFja2dyb3VuZDogIzc3NztcXG5cdGJhY2tncm91bmQ6IHJnYmEoMTE5LCAxMTksIDExOSwgMSk7XFxufVxcblxcbiNnbW9kYWxDb250ZW50IHtcXG4gICAgdmVydGljYWwtYWxpZ246IHRvcDtcXG4gICAgdG9wOiA1MHB4O1xcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNjQwcHgpIGFuZCAobWF4LWhlaWdodDogNjQwcHgpe1xcbiAgICAuZ3Nuc3cge1xcbiAgICAgICAgZmxvYXQ6bm9uZSAhaW1wb3J0YW50O1xcbiAgICB9XFxuXFxuICAgIC5zdy1oZWFkZXItY3RhLCAuc3ctaGVhZGVyLWJyZWFrLCAuc3ctaGVhZGVyLXJpZ2h0LWltZyB7XFxuICAgICAgICBkaXNwbGF5Om5vbmUgIWltcG9ydGFudDtcXG4gICAgfVxcblxcbiAgICAuc3ctaGVhZGVyLWJyZWFre1xcbiAgICAgICAgZGlzcGxheTpub25lICFpbXBvcnRhbnQ7XFxuICAgIH1cXG5cXG4gICAgLnN3LXBvcCB7XFxuICAgICAgICB3aWR0aDogMjgwcHggIWltcG9ydGFudDtcXG4gICAgICAgIGxlZnQ6MCAhaW1wb3J0YW50O1xcbiAgICAgICAgbWFyZ2luLWxlZnQ6MCAhaW1wb3J0YW50O1xcbiAgICB9XFxuXFxuICAgIC5zdy1oZWFkZXItZGlzbWlzcyB7XFxuICAgICAgICBwb3NpdGlvbjogc3RhdGljICFpbXBvcnRhbnQ7XFxuICAgICAgICBsZWZ0OjAgIWltcG9ydGFudDtcXG4gICAgICAgIHRvcDowICFpbXBvcnRhbnQ7XFxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlICFpbXBvcnRhbnQ7XFxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXIgIWltcG9ydGFudDtcXG4gICAgfVxcblxcbiAgICAuc3ctY2xvc2V7XFxuICAgICAgICBwYWRkaW5nOjFweCAhaW1wb3J0YW50O1xcbiAgICB9XFxuXFxuICAgICNnbW9kYWxDb250ZW50IHtcXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxuICAgICAgICBoZWlnaHQ6IDgwdmg7XFxuICAgICAgICB0b3A6IGF1dG87XFxuICAgIH1cXG5cXG4gICAgLnN3LWJvZHkge1xcbiAgICAgICAgbWF4LWhlaWdodDogNjB2aDtcXG4gICAgICAgIG92ZXJmbG93LXk6IHNjcm9sbDtcXG4gICAgfVxcbn0nOyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJnc24tc2xvdC1jb250YWluZXJcIj48ZGl2IGNsYXNzPVwiY3BzbG90IGNwc2xvdDJcIiBkYXRhLWNvbXBhbmlvbj1cInRydWVcIiBkYXRhLWRpbWVuc2lvbnM9XCIzMDB4NTBcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiZ3NuLXNsb3QtY29udGFpbmVyXCI+PGRpdiBjbGFzcz1cImNwc2xvdCBjcHNsb3QxXCIgZGF0YS1kaW1lbnNpb25zPVwiMzAweDEwMCwzMDB4MTIwXCI+PC9kaXY+PC9kaXY+JzsiLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgZXF1YWxzID0gcmVxdWlyZSgnZXF1YWxzJyk7XG52YXIgZm10ID0gcmVxdWlyZSgnZm10Jyk7XG52YXIgc3RhY2sgPSByZXF1aXJlKCdzdGFjaycpO1xuXG4vKipcbiAqIEFzc2VydCBgZXhwcmAgd2l0aCBvcHRpb25hbCBmYWlsdXJlIGBtc2dgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IGV4cHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbbXNnXVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBmdW5jdGlvbiAoZXhwciwgbXNnKSB7XG4gIGlmIChleHByKSByZXR1cm47XG4gIHRocm93IGVycm9yKG1zZyB8fCBtZXNzYWdlKCkpO1xufTtcblxuLyoqXG4gKiBBc3NlcnQgYGFjdHVhbGAgaXMgd2VhayBlcXVhbCB0byBgZXhwZWN0ZWRgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IGFjdHVhbFxuICogQHBhcmFtIHtNaXhlZH0gZXhwZWN0ZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBbbXNnXVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmVxdWFsID0gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIG1zZykge1xuICBpZiAoYWN0dWFsID09IGV4cGVjdGVkKSByZXR1cm47XG4gIHRocm93IGVycm9yKG1zZyB8fCBmbXQoJ0V4cGVjdGVkICVvIHRvIGVxdWFsICVvLicsIGFjdHVhbCwgZXhwZWN0ZWQpLCBhY3R1YWwsIGV4cGVjdGVkKTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IGBhY3R1YWxgIGlzIG5vdCB3ZWFrIGVxdWFsIHRvIGBleHBlY3RlZGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gYWN0dWFsXG4gKiBAcGFyYW0ge01peGVkfSBleHBlY3RlZFxuICogQHBhcmFtIHtTdHJpbmd9IFttc2ddXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMubm90RXF1YWwgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbXNnKSB7XG4gIGlmIChhY3R1YWwgIT0gZXhwZWN0ZWQpIHJldHVybjtcbiAgdGhyb3cgZXJyb3IobXNnIHx8IGZtdCgnRXhwZWN0ZWQgJW8gbm90IHRvIGVxdWFsICVvLicsIGFjdHVhbCwgZXhwZWN0ZWQpKTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IGBhY3R1YWxgIGlzIGRlZXAgZXF1YWwgdG8gYGV4cGVjdGVkYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSBhY3R1YWxcbiAqIEBwYXJhbSB7TWl4ZWR9IGV4cGVjdGVkXG4gKiBAcGFyYW0ge1N0cmluZ30gW21zZ11cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5kZWVwRXF1YWwgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbXNnKSB7XG4gIGlmIChlcXVhbHMoYWN0dWFsLCBleHBlY3RlZCkpIHJldHVybjtcbiAgdGhyb3cgZXJyb3IobXNnIHx8IGZtdCgnRXhwZWN0ZWQgJW8gdG8gZGVlcGx5IGVxdWFsICVvLicsIGFjdHVhbCwgZXhwZWN0ZWQpLCBhY3R1YWwsIGV4cGVjdGVkKTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IGBhY3R1YWxgIGlzIG5vdCBkZWVwIGVxdWFsIHRvIGBleHBlY3RlZGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gYWN0dWFsXG4gKiBAcGFyYW0ge01peGVkfSBleHBlY3RlZFxuICogQHBhcmFtIHtTdHJpbmd9IFttc2ddXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIG1zZykge1xuICBpZiAoIWVxdWFscyhhY3R1YWwsIGV4cGVjdGVkKSkgcmV0dXJuO1xuICB0aHJvdyBlcnJvcihtc2cgfHwgZm10KCdFeHBlY3RlZCAlbyBub3QgdG8gZGVlcGx5IGVxdWFsICVvLicsIGFjdHVhbCwgZXhwZWN0ZWQpKTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IGBhY3R1YWxgIGlzIHN0cmljdCBlcXVhbCB0byBgZXhwZWN0ZWRgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IGFjdHVhbFxuICogQHBhcmFtIHtNaXhlZH0gZXhwZWN0ZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBbbXNnXVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnN0cmljdEVxdWFsID0gZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQsIG1zZykge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkgcmV0dXJuO1xuICB0aHJvdyBlcnJvcihtc2cgfHwgZm10KCdFeHBlY3RlZCAlbyB0byBzdHJpY3RseSBlcXVhbCAlby4nLCBhY3R1YWwsIGV4cGVjdGVkKSwgYWN0dWFsLCBleHBlY3RlZCk7XG59O1xuXG4vKipcbiAqIEFzc2VydCBgYWN0dWFsYCBpcyBub3Qgc3RyaWN0IGVxdWFsIHRvIGBleHBlY3RlZGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gYWN0dWFsXG4gKiBAcGFyYW0ge01peGVkfSBleHBlY3RlZFxuICogQHBhcmFtIHtTdHJpbmd9IFttc2ddXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMubm90U3RyaWN0RXF1YWwgPSBmdW5jdGlvbiAoYWN0dWFsLCBleHBlY3RlZCwgbXNnKSB7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSByZXR1cm47XG4gIHRocm93IGVycm9yKG1zZyB8fCBmbXQoJ0V4cGVjdGVkICVvIG5vdCB0byBzdHJpY3RseSBlcXVhbCAlby4nLCBhY3R1YWwsIGV4cGVjdGVkKSk7XG59O1xuXG4vKipcbiAqIEFzc2VydCBgYmxvY2tgIHRocm93cyBhbiBgZXJyb3JgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGJsb2NrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZXJyb3JdXG4gKiBAcGFyYW0ge1N0cmluZ30gW21zZ11cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy50aHJvd3MgPSBmdW5jdGlvbiAoYmxvY2ssIGVyciwgbXNnKSB7XG4gIHZhciB0aHJldztcbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyZXcgPSBlO1xuICB9XG5cbiAgaWYgKCF0aHJldykgdGhyb3cgZXJyb3IobXNnIHx8IGZtdCgnRXhwZWN0ZWQgJXMgdG8gdGhyb3cgYW4gZXJyb3IuJywgYmxvY2sudG9TdHJpbmcoKSkpO1xuICBpZiAoZXJyICYmICEodGhyZXcgaW5zdGFuY2VvZiBlcnIpKSB7XG4gICAgdGhyb3cgZXJyb3IobXNnIHx8IGZtdCgnRXhwZWN0ZWQgJXMgdG8gdGhyb3cgYW4gJW8uJywgYmxvY2sudG9TdHJpbmcoKSwgZXJyKSk7XG4gIH1cbn07XG5cbi8qKlxuICogQXNzZXJ0IGBibG9ja2AgZG9lc24ndCB0aHJvdyBhbiBgZXJyb3JgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGJsb2NrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZXJyb3JdXG4gKiBAcGFyYW0ge1N0cmluZ30gW21zZ11cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbiAoYmxvY2ssIGVyciwgbXNnKSB7XG4gIHZhciB0aHJldztcbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyZXcgPSBlO1xuICB9XG5cbiAgaWYgKHRocmV3KSB0aHJvdyBlcnJvcihtc2cgfHwgZm10KCdFeHBlY3RlZCAlcyBub3QgdG8gdGhyb3cgYW4gZXJyb3IuJywgYmxvY2sudG9TdHJpbmcoKSkpO1xuICBpZiAoZXJyICYmICh0aHJldyBpbnN0YW5jZW9mIGVycikpIHtcbiAgICB0aHJvdyBlcnJvcihtc2cgfHwgZm10KCdFeHBlY3RlZCAlcyBub3QgdG8gdGhyb3cgYW4gJW8uJywgYmxvY2sudG9TdHJpbmcoKSwgZXJyKSk7XG4gIH1cbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgbWVzc2FnZSBmcm9tIHRoZSBjYWxsIHN0YWNrLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1lc3NhZ2UoKSB7XG4gIGlmICghRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHJldHVybiAnYXNzZXJ0aW9uIGZhaWxlZCc7XG4gIHZhciBjYWxsc2l0ZSA9IHN0YWNrKClbMl07XG4gIHZhciBmbiA9IGNhbGxzaXRlLmdldEZ1bmN0aW9uTmFtZSgpO1xuICB2YXIgZmlsZSA9IGNhbGxzaXRlLmdldEZpbGVOYW1lKCk7XG4gIHZhciBsaW5lID0gY2FsbHNpdGUuZ2V0TGluZU51bWJlcigpIC0gMTtcbiAgdmFyIGNvbCA9IGNhbGxzaXRlLmdldENvbHVtbk51bWJlcigpIC0gMTtcbiAgdmFyIHNyYyA9IGdldChmaWxlKTtcbiAgbGluZSA9IHNyYy5zcGxpdCgnXFxuJylbbGluZV0uc2xpY2UoY29sKTtcbiAgdmFyIG0gPSBsaW5lLm1hdGNoKC9hc3NlcnRcXCgoLiopXFwpLyk7XG4gIHJldHVybiBtICYmIG1bMV0udHJpbSgpO1xufVxuXG4vKipcbiAqIExvYWQgY29udGVudHMgb2YgYHNjcmlwdGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNjcmlwdFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZ2V0KHNjcmlwdCkge1xuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICB4aHIub3BlbignR0VUJywgc2NyaXB0LCBmYWxzZSk7XG4gIHhoci5zZW5kKG51bGwpO1xuICByZXR1cm4geGhyLnJlc3BvbnNlVGV4dDtcbn1cblxuLyoqXG4gKiBFcnJvciB3aXRoIGBtc2dgLCBgYWN0dWFsYCBhbmQgYGV4cGVjdGVkYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbXNnXG4gKiBAcGFyYW0ge01peGVkfSBhY3R1YWxcbiAqIEBwYXJhbSB7TWl4ZWR9IGV4cGVjdGVkXG4gKiBAcmV0dXJuIHtFcnJvcn1cbiAqL1xuXG5mdW5jdGlvbiBlcnJvcihtc2csIGFjdHVhbCwgZXhwZWN0ZWQpe1xuICB2YXIgZXJyID0gbmV3IEVycm9yKG1zZyk7XG4gIGVyci5zaG93RGlmZiA9IDMgPT0gYXJndW1lbnRzLmxlbmd0aDtcbiAgZXJyLmFjdHVhbCA9IGFjdHVhbDtcbiAgZXJyLmV4cGVjdGVkID0gZXhwZWN0ZWQ7XG4gIHJldHVybiBlcnI7XG59XG4iLCJ2YXIgdHlwZSA9IHJlcXVpcmUoJ3R5cGUnKVxuXG4vLyAoYW55LCBhbnksIFthcnJheV0pIC0+IGJvb2xlYW5cbmZ1bmN0aW9uIGVxdWFsKGEsIGIsIG1lbW9zKXtcbiAgLy8gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnRcbiAgaWYgKGEgPT09IGIpIHJldHVybiB0cnVlXG4gIHZhciBmbkEgPSB0eXBlc1t0eXBlKGEpXVxuICB2YXIgZm5CID0gdHlwZXNbdHlwZShiKV1cbiAgcmV0dXJuIGZuQSAmJiBmbkEgPT09IGZuQlxuICAgID8gZm5BKGEsIGIsIG1lbW9zKVxuICAgIDogZmFsc2Vcbn1cblxudmFyIHR5cGVzID0ge31cblxuLy8gKE51bWJlcikgLT4gYm9vbGVhblxudHlwZXMubnVtYmVyID0gZnVuY3Rpb24oYSwgYil7XG4gIHJldHVybiBhICE9PSBhICYmIGIgIT09IGIvKk5hbiBjaGVjayovXG59XG5cbi8vIChmdW5jdGlvbiwgZnVuY3Rpb24sIGFycmF5KSAtPiBib29sZWFuXG50eXBlc1snZnVuY3Rpb24nXSA9IGZ1bmN0aW9uKGEsIGIsIG1lbW9zKXtcbiAgcmV0dXJuIGEudG9TdHJpbmcoKSA9PT0gYi50b1N0cmluZygpXG4gICAgLy8gRnVuY3Rpb25zIGNhbiBhY3QgYXMgb2JqZWN0c1xuICAgICYmIHR5cGVzLm9iamVjdChhLCBiLCBtZW1vcylcbiAgICAmJiBlcXVhbChhLnByb3RvdHlwZSwgYi5wcm90b3R5cGUpXG59XG5cbi8vIChkYXRlLCBkYXRlKSAtPiBib29sZWFuXG50eXBlcy5kYXRlID0gZnVuY3Rpb24oYSwgYil7XG4gIHJldHVybiArYSA9PT0gK2Jcbn1cblxuLy8gKHJlZ2V4cCwgcmVnZXhwKSAtPiBib29sZWFuXG50eXBlcy5yZWdleHAgPSBmdW5jdGlvbihhLCBiKXtcbiAgcmV0dXJuIGEudG9TdHJpbmcoKSA9PT0gYi50b1N0cmluZygpXG59XG5cbi8vIChET01FbGVtZW50LCBET01FbGVtZW50KSAtPiBib29sZWFuXG50eXBlcy5lbGVtZW50ID0gZnVuY3Rpb24oYSwgYil7XG4gIHJldHVybiBhLm91dGVySFRNTCA9PT0gYi5vdXRlckhUTUxcbn1cblxuLy8gKHRleHRub2RlLCB0ZXh0bm9kZSkgLT4gYm9vbGVhblxudHlwZXMudGV4dG5vZGUgPSBmdW5jdGlvbihhLCBiKXtcbiAgcmV0dXJuIGEudGV4dENvbnRlbnQgPT09IGIudGV4dENvbnRlbnRcbn1cblxuLy8gZGVjb3JhdGUgYGZuYCB0byBwcmV2ZW50IGl0IHJlLWNoZWNraW5nIG9iamVjdHNcbi8vIChmdW5jdGlvbikgLT4gZnVuY3Rpb25cbmZ1bmN0aW9uIG1lbW9HYXVyZChmbil7XG4gIHJldHVybiBmdW5jdGlvbihhLCBiLCBtZW1vcyl7XG4gICAgaWYgKCFtZW1vcykgcmV0dXJuIGZuKGEsIGIsIFtdKVxuICAgIHZhciBpID0gbWVtb3MubGVuZ3RoLCBtZW1vXG4gICAgd2hpbGUgKG1lbW8gPSBtZW1vc1stLWldKSB7XG4gICAgICBpZiAobWVtb1swXSA9PT0gYSAmJiBtZW1vWzFdID09PSBiKSByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gZm4oYSwgYiwgbWVtb3MpXG4gIH1cbn1cblxudHlwZXNbJ2FyZ3VtZW50cyddID1cbnR5cGVzLmFycmF5ID0gbWVtb0dhdXJkKGFycmF5RXF1YWwpXG5cbi8vIChhcnJheSwgYXJyYXksIGFycmF5KSAtPiBib29sZWFuXG5mdW5jdGlvbiBhcnJheUVxdWFsKGEsIGIsIG1lbW9zKXtcbiAgdmFyIGkgPSBhLmxlbmd0aFxuICBpZiAoaSAhPT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZVxuICBtZW1vcy5wdXNoKFthLCBiXSlcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmICghZXF1YWwoYVtpXSwgYltpXSwgbWVtb3MpKSByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG50eXBlcy5vYmplY3QgPSBtZW1vR2F1cmQob2JqZWN0RXF1YWwpXG5cbi8vIChvYmplY3QsIG9iamVjdCwgYXJyYXkpIC0+IGJvb2xlYW5cbmZ1bmN0aW9uIG9iamVjdEVxdWFsKGEsIGIsIG1lbW9zKSB7XG4gIGlmICh0eXBlb2YgYS5lcXVhbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgbWVtb3MucHVzaChbYSwgYl0pXG4gICAgcmV0dXJuIGEuZXF1YWwoYiwgbWVtb3MpXG4gIH1cbiAgdmFyIGthID0gZ2V0RW51bWVyYWJsZVByb3BlcnRpZXMoYSlcbiAgdmFyIGtiID0gZ2V0RW51bWVyYWJsZVByb3BlcnRpZXMoYilcbiAgdmFyIGkgPSBrYS5sZW5ndGhcblxuICAvLyBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzXG4gIGlmIChpICE9PSBrYi5sZW5ndGgpIHJldHVybiBmYWxzZVxuXG4gIC8vIGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlclxuICBrYS5zb3J0KClcbiAga2Iuc29ydCgpXG5cbiAgLy8gY2hlYXAga2V5IHRlc3RcbiAgd2hpbGUgKGktLSkgaWYgKGthW2ldICE9PSBrYltpXSkgcmV0dXJuIGZhbHNlXG5cbiAgLy8gcmVtZW1iZXJcbiAgbWVtb3MucHVzaChbYSwgYl0pXG5cbiAgLy8gaXRlcmF0ZSBhZ2FpbiB0aGlzIHRpbWUgZG9pbmcgYSB0aG9yb3VnaCBjaGVja1xuICBpID0ga2EubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIga2V5ID0ga2FbaV1cbiAgICBpZiAoIWVxdWFsKGFba2V5XSwgYltrZXldLCBtZW1vcykpIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuLy8gKG9iamVjdCkgLT4gYXJyYXlcbmZ1bmN0aW9uIGdldEVudW1lcmFibGVQcm9wZXJ0aWVzIChvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdXG4gIGZvciAodmFyIGsgaW4gb2JqZWN0KSBpZiAoayAhPT0gJ2NvbnN0cnVjdG9yJykge1xuICAgIHJlc3VsdC5wdXNoKGspXG4gIH1cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsXG4iLCJcbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nXG52YXIgRG9tTm9kZSA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCdcbiAgPyB3aW5kb3cuTm9kZVxuICA6IEZ1bmN0aW9uXG5cbi8qKlxuICogUmV0dXJuIHRoZSB0eXBlIG9mIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBmdW5jdGlvbih4KXtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgeFxuICBpZiAodHlwZSAhPSAnb2JqZWN0JykgcmV0dXJuIHR5cGVcbiAgdHlwZSA9IHR5cGVzW3RvU3RyaW5nLmNhbGwoeCldXG4gIGlmICh0eXBlKSByZXR1cm4gdHlwZVxuICBpZiAoeCBpbnN0YW5jZW9mIERvbU5vZGUpIHN3aXRjaCAoeC5ub2RlVHlwZSkge1xuICAgIGNhc2UgMTogIHJldHVybiAnZWxlbWVudCdcbiAgICBjYXNlIDM6ICByZXR1cm4gJ3RleHQtbm9kZSdcbiAgICBjYXNlIDk6ICByZXR1cm4gJ2RvY3VtZW50J1xuICAgIGNhc2UgMTE6IHJldHVybiAnZG9jdW1lbnQtZnJhZ21lbnQnXG4gICAgZGVmYXVsdDogcmV0dXJuICdkb20tbm9kZSdcbiAgfVxufVxuXG52YXIgdHlwZXMgPSBleHBvcnRzLnR5cGVzID0ge1xuICAnW29iamVjdCBGdW5jdGlvbl0nOiAnZnVuY3Rpb24nLFxuICAnW29iamVjdCBEYXRlXSc6ICdkYXRlJyxcbiAgJ1tvYmplY3QgUmVnRXhwXSc6ICdyZWdleHAnLFxuICAnW29iamVjdCBBcmd1bWVudHNdJzogJ2FyZ3VtZW50cycsXG4gICdbb2JqZWN0IEFycmF5XSc6ICdhcnJheScsXG4gICdbb2JqZWN0IFN0cmluZ10nOiAnc3RyaW5nJyxcbiAgJ1tvYmplY3QgTnVsbF0nOiAnbnVsbCcsXG4gICdbb2JqZWN0IFVuZGVmaW5lZF0nOiAndW5kZWZpbmVkJyxcbiAgJ1tvYmplY3QgTnVtYmVyXSc6ICdudW1iZXInLFxuICAnW29iamVjdCBCb29sZWFuXSc6ICdib29sZWFuJyxcbiAgJ1tvYmplY3QgT2JqZWN0XSc6ICdvYmplY3QnLFxuICAnW29iamVjdCBUZXh0XSc6ICd0ZXh0LW5vZGUnLFxuICAnW29iamVjdCBVaW50OEFycmF5XSc6ICdiaXQtYXJyYXknLFxuICAnW29iamVjdCBVaW50MTZBcnJheV0nOiAnYml0LWFycmF5JyxcbiAgJ1tvYmplY3QgVWludDMyQXJyYXldJzogJ2JpdC1hcnJheScsXG4gICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XSc6ICdiaXQtYXJyYXknLFxuICAnW29iamVjdCBFcnJvcl0nOiAnZXJyb3InLFxuICAnW29iamVjdCBGb3JtRGF0YV0nOiAnZm9ybS1kYXRhJyxcbiAgJ1tvYmplY3QgRmlsZV0nOiAnZmlsZScsXG4gICdbb2JqZWN0IEJsb2JdJzogJ2Jsb2InXG59XG4iLCJcbi8qKlxuICogRXhwb3J0IGBmbXRgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmbXQ7XG5cbi8qKlxuICogRm9ybWF0dGVyc1xuICovXG5cbmZtdC5vID0gSlNPTi5zdHJpbmdpZnk7XG5mbXQucyA9IFN0cmluZztcbmZtdC5kID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogRm9ybWF0IHRoZSBnaXZlbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0gey4uLn0gYXJnc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmbXQoc3RyKXtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBqID0gMDtcblxuICByZXR1cm4gc3RyLnJlcGxhY2UoLyUoW2Etel0pL2dpLCBmdW5jdGlvbihfLCBmKXtcbiAgICByZXR1cm4gZm10W2ZdXG4gICAgICA/IGZtdFtmXShhcmdzW2orK10pXG4gICAgICA6IF8gKyBmO1xuICB9KTtcbn1cbiIsIlxuLyoqXG4gKiBFeHBvc2UgYHN0YWNrKClgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2s7XG5cbi8qKlxuICogUmV0dXJuIHRoZSBzdGFjay5cbiAqXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gc3RhY2soKSB7XG4gIHZhciBvcmlnID0gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2U7XG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gZnVuY3Rpb24oXywgc3RhY2speyByZXR1cm4gc3RhY2s7IH07XG4gIHZhciBlcnIgPSBuZXcgRXJyb3I7XG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGVyciwgYXJndW1lbnRzLmNhbGxlZSk7XG4gIHZhciBzdGFjayA9IGVyci5zdGFjaztcbiAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBvcmlnO1xuICByZXR1cm4gc3RhY2s7XG59Il19