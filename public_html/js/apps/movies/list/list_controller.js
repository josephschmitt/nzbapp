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
      },
      addMovie: function(movie) {
        return $.when(NZBAppManager.request('movies:add', movie)).done(function(added) {
          return NZBAppManager.execute('popup:alert:show', "Added " + (added.get('original_title')) + " (" + (added.get('year')) + ") to your list");
        });
      }
    };
  });

}).call(this);
