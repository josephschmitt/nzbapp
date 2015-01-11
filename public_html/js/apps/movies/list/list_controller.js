(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('MoviesApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    var listMovies;
    listMovies = null;
    return List.Controller = {
      listMovies: function() {
        listMovies = new List.MoviesView();
        NZBAppManager.mainRegion.show(listMovies);
        NZBAppManager.execute('titlebar:show', NZBAppManager.request('titlebar:movies:entities'));
        NZBAppManager.execute('titlebar:activate', 'movies/wanted');
        return $.when(NZBAppManager.request('movies:list')).done(function(movies) {
          return listMovies.setCollection(movies);
        });
      },
      sortMovies: function(sort_by) {
        if (!listMovies) {
          List.Controller.listMovies();
        }
        return listMovies.sort(sort_by);
      },
      listAvailableSoon: function() {
        var availableSoon;
        availableSoon = new List.Movies();
        NZBAppManager.mainRegion.show(availableSoon);
        NZBAppManager.execute('titlebar:show', NZBAppManager.request('titlebar:movies:entities'));
        NZBAppManager.execute('titlebar:activate', 'movies/soon');
        return $.when(NZBAppManager.request('movies:soon')).done(function(movies) {
          return availableSoon.setCollection(movies);
        });
      },
      addMovie: function(movie) {
        return $.when(NZBAppManager.request('movies:add', movie)).done(function(added) {
          var message, status;
          message = "Added " + (movie.get('title') || movie.get('original_title')) + " (" + (movie.get('year')) + ") to your list";
          status = added.success ? 'success' : 'alert';
          return NZBAppManager.execute('popup:alert:show', message, status);
        });
      },
      removeMovie: function(movie) {
        return $.when(NZBAppManager.request('movies:remove', movie)).done(function(removed) {
          var message, status;
          message = "Removed " + (movie.get('title') || movie.get('original_title')) + " (" + (movie.get('year')) + ") from your list";
          status = removed.success ? 'alert' : 'warning';
          return NZBAppManager.execute('popup:alert:show', message, status);
        });
      }
    };
  });

}).call(this);
