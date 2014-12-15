(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var NZBAppRouter, NZBApplication, NavigationAPI, js;
    js = window.js = window.js || {};
    Backbone.Marionette.Renderer.render = function(template, data) {
      return _.template($(template).html(), data, {
        variable: 'data'
      });
    };
    NavigationAPI = {
      showHome: function() {
        if (!js.NZBAppManager.request('server:url:get') || !js.NZBAppManager.request('server:token:get')) {
          return js.NZBAppManager.trigger('server:setup:show');
        } else {
          return js.NZBAppManager.mainRegion.transitionToView(new Marionette.ItemView({
            template: false
          }));
        }
      },
      showSearch: function() {},
      showServerSetup: function() {
        return js.NZBAppManager.mainRegion.transitionToView(new js.NZBAppManager.Server.Setup({
          collection: js.NZBAppManager.request('server:settings:getAll')
        }));
      }
    };
    NZBAppRouter = (function(_super) {
      __extends(NZBAppRouter, _super);

      function NZBAppRouter() {
        return NZBAppRouter.__super__.constructor.apply(this, arguments);
      }

      NZBAppRouter.prototype.controller = NavigationAPI;

      NZBAppRouter.prototype.appRoutes = {
        '': 'showHome',
        'server/setup': 'showServerSetup'
      };

      return NZBAppRouter;

    })(Marionette.AppRouter);
    NZBApplication = (function(_super) {
      __extends(NZBApplication, _super);

      function NZBApplication() {
        this.dismissModal = __bind(this.dismissModal, this);
        this.showModal = __bind(this.showModal, this);
        return NZBApplication.__super__.constructor.apply(this, arguments);
      }

      NZBApplication.prototype.initialize = function() {
        NZBApplication.__super__.initialize.apply(this, arguments);
        return this.addRegions({
          mainRegion: {
            selector: '#main',
            regionClass: TransitionRegion
          },
          modalRegion: {
            selector: '#modal',
            regionClass: TransitionRegion
          }
        });
      };

      NZBApplication.prototype.initNavigationEvents = function() {
        this.on('home:show', (function(_this) {
          return function() {
            _this.navigate('');
            return NavigationAPI.showHome();
          };
        })(this));
        return this.on('server:setup:show', (function(_this) {
          return function() {
            _this.navigate('server/setup');
            return NavigationAPI.showServerSetup();
          };
        })(this));
      };

      NZBApplication.prototype.navigate = function(route, options) {
        if (options == null) {
          options = {};
        }
        return Backbone.history.navigate(route, options);
      };

      NZBApplication.prototype.getCurrentRoute = function() {
        return Backbone.history.fragment;
      };

      NZBApplication.prototype.showModal = function(options) {
        this.modalRegion.$el.show();
        return this.modalRegion.transitionToView(new js.Modal(options));
      };

      NZBApplication.prototype.dismissModal = function() {
        this.modalRegion.on('empty', (function(_this) {
          return function() {
            return _this.modalRegion.$el.hide();
          };
        })(this));
        return this.modalRegion.transitionToView();
      };

      NZBApplication.prototype.start = function() {
        NZBApplication.__super__.start.apply(this, arguments);
        this.initNavigationEvents();
        return setTimeout((function(_this) {
          return function() {
            _this.router = new NZBAppRouter();
            if (Backbone.history) {
              Backbone.history.start();
            }
            if ((_this.getCurrentRoute() == null) || _this.getCurrentRoute() === 'server/setup') {
              console.log('settings', js.NZBAppManager.request('server:settings:get'));
              if (!js.NZBAppManager.request('server:settings:get')) {
                return _this.trigger('server:setup:show');
              } else {
                return _this.trigger('home:show');
              }
            }
          };
        })(this), 1);
      };

      return NZBApplication;

    })(Marionette.Application);
    js.LocalStorageModel = (function(_super) {
      __extends(LocalStorageModel, _super);

      function LocalStorageModel() {
        return LocalStorageModel.__super__.constructor.apply(this, arguments);
      }

      LocalStorageModel.prototype.set = function(attributes) {
        var saved, _ref;
        if (!_.keys(attributes).length && !attributes.length) {
          return;
        }
        console.log('localStorage', this.localStorage);
        LocalStorageModel.__super__.set.apply(this, arguments);
        saved = (_ref = this.localStorage) != null ? _ref.find(this) : void 0;
        if (saved) {
          return this.localStorage.update(this);
        } else if (this.localStorage != null) {
          return this.localStorage.create(this);
        }
      };

      return LocalStorageModel;

    })(Backbone.Model);
    js.CouchPotatoModel = (function(_super) {
      __extends(CouchPotatoModel, _super);

      function CouchPotatoModel() {
        return CouchPotatoModel.__super__.constructor.apply(this, arguments);
      }

      CouchPotatoModel.prototype.urlRoot = "" + js.AppConfig.CouchPotato.urlRoot + "/" + js.AppConfig.CouchPotato.apiKey;

      CouchPotatoModel.prototype.fetch = function(options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback_func',
          jsonpCallback: options.jsonpCallback || 'js.AppConfig.callback_func'
        });
        return CouchPotatoModel.__super__.fetch.call(this, options);
      };

      return CouchPotatoModel;

    })(Backbone.Model);
    js.NZBAppManager = new NZBApplication();
    return js.NZBAppManager.start();
  })();

}).call(this);
