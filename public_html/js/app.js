(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var NZBApplication, jjs;
    jjs = window.jjs = window.jjs || {};
    Backbone.Marionette.Renderer.render = function(template, data) {
      return _.template($(template).html(), data, {
        variable: 'data'
      });
    };
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
          navbarRegion: '#navbar',
          modalRegion: {
            selector: '#modal',
            regionClass: TransitionRegion
          }
        });
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
        return this.modalRegion.transitionToView(new jjs.Modal(options));
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
        if (Backbone.history) {
          Backbone.history.start();
        }
        return $.when(this.request('servers:entities')).done((function(_this) {
          return function(serverSettings) {
            if (!_this.request('servers:entities:valid')) {
              return _this.trigger('servers:show');
            } else if (!_this.getCurrentRoute()) {
              return _this.trigger('search:show');
            }
          };
        })(this));
      };

      return NZBApplication;

    })(Marionette.Application);
    jjs.CouchPotatoModel = (function(_super) {
      __extends(CouchPotatoModel, _super);

      function CouchPotatoModel() {
        return CouchPotatoModel.__super__.constructor.apply(this, arguments);
      }

      CouchPotatoModel.prototype.urlRoot = "" + jjs.AppConfig.CouchPotato.urlRoot + "/" + jjs.AppConfig.CouchPotato.apiKey;

      CouchPotatoModel.prototype.fetch = function(options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback_func',
          jsonpCallback: options.jsonpCallback || 'jjs.AppConfig.callback_func'
        });
        return CouchPotatoModel.__super__.fetch.call(this, options);
      };

      return CouchPotatoModel;

    })(Backbone.Model);
    return jjs.NZBAppManager = new NZBApplication();
  })();

}).call(this);
