(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('MoviesApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    return List.Controller = {
      listMovies: function() {
        var listMovies;
        listMovies = new List.Movies();
        NZBAppManager.mainRegion.show(listMovies);
        return $.when(NZBAppManager.request('movies:list')).done(function(movies) {
          return listMovies.setCollection(movies);
        });
      }
    };
  });

}).call(this);
