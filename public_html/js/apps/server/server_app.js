(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ServersApp', function(ServersApp, NZBAppManager, Backbone, Marionette, $, _) {
    var routesController;
    ServersApp.RoutesController = (function() {
      function RoutesController() {}

      RoutesController.prototype.listServers = function() {
        return ServersApp.Setup.Controller.listServers();
      };

      return RoutesController;

    })();
    ServersApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        'servers': 'listServers'
      };

      return Router;

    })(Marionette.AppRouter);
    routesController = new ServersApp.RoutesController();
    NZBAppManager.on('servers:settings:loaded', function() {});
    NZBAppManager.on('servers:show', function() {
      NZBAppManager.navigate('servers');
      return routesController.listServers();
    });
    return NZBAppManager.addInitializer(function() {
      return new ServersApp.Router({
        controller: routesController
      });
    });
  });

}).call(this);
