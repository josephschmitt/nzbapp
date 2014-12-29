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
          var message, status;
          message = "Added " + (added.movie.title || added.movie.info.original_title) + " (" + added.movie.info.year + ") to your list";
          status = added.success ? 'success' : 'alert';
          return NZBAppManager.execute('popup:alert:show', message, status);
        });
      }
    };
  });

}).call(this);
