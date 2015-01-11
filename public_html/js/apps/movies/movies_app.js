(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('MoviesApp', function(Movies, NZBAppManager, Backbone, Marionette, $, _) {
    var routesController;
    Movies.RoutesController = (function() {
      function RoutesController() {}

      RoutesController.prototype.listMovies = function() {
        Movies.List.Controller.listMovies();
        return NZBAppManager.execute('tabs:active:set', 'Movies');
      };

      RoutesController.prototype.sortMovies = function(sort_by) {
        Movies.List.Controller.sortMovies(sort_by);
        return NZBAppManager.execute('tabs:active:set', 'Movies');
      };

      RoutesController.prototype.listAvailableSoon = function() {
        Movies.List.Controller.listAvailableSoon();
        return NZBAppManager.execute('tabs:active:set', 'Movies');
      };

      return RoutesController;

    })();
    Movies.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        'movies': 'listMovies',
        'movies/soon': 'listAvailableSoon'
      };

      return Router;

    })(Marionette.AppRouter);
    routesController = new Movies.RoutesController();
    NZBAppManager.on('movies:list movies:wanted:list', function() {
      NZBAppManager.navigate('movies');
      return routesController.listMovies();
    });
    NZBAppManager.on('movies:soon:list', function() {
      NZBAppManager.navigate('movies/soon');
      return routesController.listAvailableSoon();
    });
    NZBAppManager.on('movies:sort', function(sort_by) {
      return routesController.sortMovies(sort_by);
    });
    return NZBAppManager.addInitializer(function() {
      return new Movies.Router({
        controller: routesController
      });
    });
  });

}).call(this);
