(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('DownloadsApp', function(Downloads, NZBAppManager, Backbone, Marionette, $, _) {
    var routesController;
    Downloads.RoutesController = (function() {
      function RoutesController() {}

      RoutesController.prototype.listQueue = function() {
        Downloads.List.Controller.listQueue();
        return NZBAppManager.execute('tabs:active:set', 'Downloads');
      };

      RoutesController.prototype.listHistory = function() {
        Downloads.List.Controller.listHistory();
        return NZBAppManager.execute('tabs:active:set', 'Downloads');
      };

      return RoutesController;

    })();
    Downloads.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        'downloads': 'listQueue',
        'downloads/history': 'listHistory'
      };

      return Router;

    })(Marionette.AppRouter);
    routesController = new Downloads.RoutesController();
    NZBAppManager.on('downloads:list downloads:queue:list', function() {
      NZBAppManager.navigate('downloads');
      return routesController.listQueue();
    });
    NZBAppManager.on('downloads:history:list', function() {
      NZBAppManager.navigate('downloads/history');
      return routesController.listHistory();
    });
    return NZBAppManager.addInitializer(function() {
      return new Downloads.Router({
        controller: routesController
      });
    });
  });

}).call(this);
