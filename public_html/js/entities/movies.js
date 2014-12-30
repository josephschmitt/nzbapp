(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var addMovie, getMovieSearchResults, getMovies, movies;
    Entities.MovieResult = (function(_super) {
      __extends(MovieResult, _super);

      function MovieResult() {
        return MovieResult.__super__.constructor.apply(this, arguments);
      }

      MovieResult.prototype.parse = function(response, options) {
        response = _.pick((response.info != null ? response.info : response), ['original_title', 'runtime', 'tagline', 'title', 'tmdb_id', 'year']);
        return MovieResult.__super__.parse.call(this, response, options);
      };

      MovieResult.prototype.sync = function(method, model, options) {
        if (options == null) {
          options = {};
        }
        if (method === 'create' || method === 'update') {
          this.local = true;
        } else {
          this.local = void 0;
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback_func'
        });
        return MovieResult.__super__.sync.call(this, method, model, options);
      };

      return MovieResult;

    })(Backbone.Model);
    Entities.MovieResults = (function(_super) {
      __extends(MovieResults, _super);

      function MovieResults() {
        return MovieResults.__super__.constructor.apply(this, arguments);
      }

      MovieResults.prototype.model = Entities.MovieResult;

      MovieResults.prototype.storeName = 'Entities.MovieResults';

      MovieResults.prototype.parse = function(response) {
        if (response.movies) {
          return response.movies;
        } else {
          return response;
        }
      };

      MovieResults.prototype.sync = function(method, model, options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback_func'
        });
        return MovieResults.__super__.sync.apply(this, arguments);
      };

      return MovieResults;

    })(Backbone.Collection);
    movies = null;
    getMovieSearchResults = function(term) {
      var defer, movieSearchResults;
      defer = $.Deferred();
      movieSearchResults = new Entities.MovieResults([], {
        url: NZBAppManager.request('api:endpoint', 'CouchPotato', 'search')
      });
      movieSearchResults.fetch({
        data: {
          q: term,
          type: 'movies'
        },
        success: function() {
          return defer.resolve(movieSearchResults);
        }
      });
      return defer.promise();
    };
    getMovies = function() {
      var defer;
      defer = $.Deferred();
      if (!movies) {
        movies = new Entities.MovieResults([], {
          url: NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.list')
        });
        movies.fetch({
          success: function() {
            movies.each(function(movie) {
              return movie != null ? movie.save() : void 0;
            });
            return defer.resolve(movies);
          }
        });
      } else {
        _.defer(function() {
          return defer.resolve(movies);
        });
      }
      return defer.promise();
    };
    addMovie = function(movie) {
      var defer;
      defer = $.ajax(NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.add'), {
        dataType: 'jsonp',
        jsonp: 'callback_func',
        data: {
          title: movie != null ? movie.get('title') : void 0,
          identifier: movie != null ? movie.get('imdb') : void 0
        }
      });
      return defer.promise();
    };
    NZBAppManager.reqres.setHandler('movies:search', function(term) {
      return getMovieSearchResults(term);
    });
    NZBAppManager.reqres.setHandler('movies:list', function() {
      return getMovies();
    });
    return NZBAppManager.reqres.setHandler('movies:add', function(movie) {
      return addMovie(movie);
    });
  });

}).call(this);
