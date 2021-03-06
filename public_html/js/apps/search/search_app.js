(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('SearchApp', function(Search, NZBAppManager, Backbone, Marionette, $, _) {
    var routesController;
    Search.RoutesController = (function() {
      function RoutesController() {}

      RoutesController.prototype.showSearch = function() {
        Search.Show.Controller.showSearch();
        return NZBAppManager.execute('tabs:active:set', 'Search');
      };

      RoutesController.prototype.showResultsForSearch = function(type, term) {
        Search.Show.Controller.showResultsForSearch(type, term);
        return NZBAppManager.execute('tabs:active:set', 'Search');
      };

      return RoutesController;

    })();
    Search.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        'search': 'showSearch',
        'search/:type/:term': 'showResultsForSearch'
      };

      return Router;

    })(Marionette.AppRouter);
    routesController = new Search.RoutesController();
    NZBAppManager.on('home:show', function() {
      NZBAppManager.navigate('search');
      return routesController.showSearch();
    });
    NZBAppManager.on('search:show', function() {
      NZBAppManager.navigate('search');
      return routesController.showSearch();
    });
    NZBAppManager.on('search:results:show', function(type, term) {
      NZBAppManager.navigate("search/" + type + "/" + term);
      return routesController.showResultsForSearch(type, term);
    });
    return NZBAppManager.addInitializer(function() {
      return new Search.Router({
        controller: routesController
      });
    });
  });

}).call(this);
