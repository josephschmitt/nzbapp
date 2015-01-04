(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('MoviesApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    return List.Controller = {
      listMovies: function() {
        var listMovies;
        listMovies = new List.Movies();
        NZBAppManager.mainRegion.show(listMovies);
        NZBAppManager.execute('titlebar:show', NZBAppManager.request('titlebar:movies:entities'));
        NZBAppManager.execute('titlebar:activate', 'movies/wanted');
        return $.when(NZBAppManager.request('movies:list')).done(function(movies) {
          return listMovies.setCollection(movies);
        });
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
          movie.set('in_wanted', true);
          return NZBAppManager.execute('popup:alert:show', message, status);
        });
      },
      removeMovie: function(movie) {
        return $.when(NZBAppManager.request('movies:remove', movie)).done(function(removed) {
          var collection, message, status;
          message = "Removed " + (movie.get('title') || movie.get('original_title')) + " (" + (movie.get('year')) + ") from your list";
          status = removed.success ? 'alert' : 'warning';
          collection = movie.collection;
          collection.remove(collection.findWhere({
            _id: movie.get('_id')
          }));
          collection.trigger('change');
          return NZBAppManager.execute('popup:alert:show', message, status);
        });
      }
    };
  });

}).call(this);
