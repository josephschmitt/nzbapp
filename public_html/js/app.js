(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var js;
    js = window.js = window.js || {};
    Backbone.Marionette.Renderer.render = function(template, data) {
      return _.template($(template).html(), data, {
        variable: 'data'
      });
    };
    js.NavigationAPI = {
      showHome: (function(_this) {
        return function() {};
      })(this)
    };
    js.NZBAppRouter = (function(_super) {
      __extends(NZBAppRouter, _super);

      function NZBAppRouter() {
        return NZBAppRouter.__super__.constructor.apply(this, arguments);
      }

      NZBAppRouter.prototype.appRoutes = {
        '': 'showHome'
      };

      NZBAppRouter.prototype.controller = js.NavigationAPI;

      return NZBAppRouter;

    })(Marionette.AppRouter);
    js.NZBAppManager = (function(_super) {
      __extends(NZBAppManager, _super);

      function NZBAppManager() {
        this.dismissModal = __bind(this.dismissModal, this);
        this.showModal = __bind(this.showModal, this);
        return NZBAppManager.__super__.constructor.apply(this, arguments);
      }

      NZBAppManager.prototype.initialize = function() {
        NZBAppManager.__super__.initialize.apply(this, arguments);
        this.addInitializer((function(_this) {
          return function() {
            return new js.NZBAppRouter();
          };
        })(this));
        this.addRegions({
          mainRegion: {
            selector: '#main',
            regionClass: TransitionRegion
          },
          modalRegion: {
            selector: '#modal',
            regionClass: TransitionRegion
          }
        });
        return this.initNavigationEvents();
      };

      NZBAppManager.prototype.initNavigationEvents = function() {
        return this.on('home:show', (function(_this) {
          return function() {
            _this.navigate('');
            return js.NavigationAPI.showHome();
          };
        })(this));
      };

      NZBAppManager.prototype.navigate = function(route, options) {
        if (options == null) {
          options = {};
        }
        return Backbone.history.navigate(route, options);
      };

      NZBAppManager.prototype.getCurrentRoute = function() {
        return Backbone.history.fragment;
      };

      NZBAppManager.prototype.showModal = function(options) {
        this.modalRegion.$el.show();
        return this.modalRegion.transitionToView(new js.Modal(options));
      };

      NZBAppManager.prototype.dismissModal = function() {
        this.modalRegion.on('empty', (function(_this) {
          return function() {
            return _this.modalRegion.$el.hide();
          };
        })(this));
        return this.modalRegion.transitionToView();
      };

      NZBAppManager.prototype.start = function() {
        NZBAppManager.__super__.start.apply(this, arguments);
        if (Backbone.history) {
          Backbone.history.start();
        }
        if (this.getCurrentRoute() == null) {
          return this.trigger('home:show');
        }
      };

      return NZBAppManager;

    })(Marionette.Application);
    js.NZBApp = new js.NZBAppManager();
    return js.NZBApp.start();
  })();

}).call(this);
