(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ShowsApp', function(Shows, NZBAppManager, Backbone, Marionette, $, _) {
    var routesController;
    Shows.RoutesController = (function() {
      function RoutesController() {}

      RoutesController.prototype.listShows = function() {
        Shows.List.Controller.listShows();
        return NZBAppManager.execute('tabs:active:set', 'Shows');
      };

      RoutesController.prototype.sortShows = function(sort_by) {
        Shows.List.Controller.sortShows(sort_by);
        return NZBAppManager.execute('tabs:active:set', 'Shows');
      };

      RoutesController.prototype.listUpcomingShows = function() {
        Shows.List.Controller.listUpcomingShows();
        return NZBAppManager.execute('tabs:active:set', 'Shows');
      };

      return RoutesController;

    })();
    Shows.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        'shows': 'listShows',
        'shows/upcoming': 'listUpcomingShows'
      };

      return Router;

    })(Marionette.AppRouter);
    routesController = new Shows.RoutesController();
    NZBAppManager.on('shows:list shows:wanted:list', function() {
      NZBAppManager.navigate('shows');
      return routesController.listShows();
    });
    NZBAppManager.on('shows:upcoming:list', function() {
      NZBAppManager.navigate('shows/upcoming');
      return routesController.listUpcomingShows();
    });
    NZBAppManager.on('shows:sort', function(sort_by) {
      return routesController.sortShows(sort_by);
    });
    return NZBAppManager.addInitializer(function() {
      return new Shows.Router({
        controller: routesController
      });
    });
  });

}).call(this);
