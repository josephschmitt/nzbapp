(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var addMovie, getMovieSearchResults, getMovies;
    Entities.Movies = {};
    Entities.MovieResult = (function(_super) {
      __extends(MovieResult, _super);

      function MovieResult() {
        return MovieResult.__super__.constructor.apply(this, arguments);
      }

      MovieResult.prototype.idAttribute = '_id';

      MovieResult.prototype.set = function(attributes, options) {
        if (attributes.info) {
          return MovieResult.__super__.set.call(this, attributes.info, options);
        } else {
          return MovieResult.__super__.set.call(this, attributes, options);
        }
      };

      return MovieResult;

    })(Backbone.Model);
    Entities.MovieResults = (function(_super) {
      __extends(MovieResults, _super);

      function MovieResults() {
        return MovieResults.__super__.constructor.apply(this, arguments);
      }

      MovieResults.prototype.model = Entities.MovieResult;

      MovieResults.prototype.fetch = function(options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback_func',
          jsonpCallback: options.jsonpCallback || 'jjs.AppConfig.callback_func'
        });
        return MovieResults.__super__.fetch.call(this, options);
      };

      return MovieResults;

    })(Backbone.Collection);
    getMovieSearchResults = function(term) {
      var defer, movies;
      defer = $.Deferred();
      movies = new Entities.MovieResults([], {
        url: NZBAppManager.request('api:endpoint', 'CouchPotato', 'search')
      });
      movies.fetch({
        jsonpCallback: 'jjs.NZBAppManager.Entities.Movies.onMoviesSearch',
        data: {
          q: term,
          type: 'movies'
        }
      });
      Entities.Movies.onMoviesSearch = function(response) {
        return defer.resolve(movies.set(response.movies));
      };
      return defer.promise();
    };
    getMovies = function() {
      var defer, movies;
      defer = $.Deferred();
      movies = new Entities.MovieResults([], {
        url: NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.list')
      });
      movies.fetch({
        jsonpCallback: 'jjs.NZBAppManager.Entities.Movies.onMoviesList'
      });
      Entities.Movies.onMoviesList = function(response) {
        return defer.resolve(movies.set(response.movies));
      };
      return defer.promise();
    };
    addMovie = function(movie) {
      var defer;
      defer = $.Deferred();
      $.ajax(NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.add'), {
        dataType: 'jsonp',
        jsonp: 'callback_func',
        jsonpCallback: 'jjs.NZBAppManager.Entities.Movies.onMovieAdded',
        data: {
          title: movie != null ? movie.get('title') : void 0,
          identifier: movie != null ? movie.get('imdb') : void 0
        }
      });
      Entities.Movies.onMovieAdded = function(response) {
        return defer.resolve(new Entities.MovieResult(response.movie));
      };
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
