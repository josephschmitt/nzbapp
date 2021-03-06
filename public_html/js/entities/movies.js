(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var addMovie, getComingSoon, getMovieSearchResults, getMovies, getSortOptions, movies, removeMovie, soon;
    Entities.MovieResult = (function(_super) {
      __extends(MovieResult, _super);

      function MovieResult() {
        return MovieResult.__super__.constructor.apply(this, arguments);
      }

      MovieResult.prototype.parse = function(response, options) {
        var resp;
        resp = _.pick((response.info != null ? response.info : response), ['images', 'imdb', 'in_wanted', 'original_title', 'released', 'runtime', 'tagline', 'title', 'tmdb_id', 'year']);
        resp._id = resp.id = response._id;
        resp.in_wanted = !!resp.in_wanted || response.status === 'active';
        return resp;
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

      MovieResults.prototype.parse = function(response, options) {
        if (response.movies) {
          return MovieResults.__super__.parse.call(this, response.movies, options);
        } else if (response.length) {
          return MovieResults.__super__.parse.call(this, response, options);
        } else {
          return MovieResults.__super__.parse.call(this, [], options);
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
    Entities.WantedMovies = (function(_super) {
      __extends(WantedMovies, _super);

      function WantedMovies() {
        return WantedMovies.__super__.constructor.apply(this, arguments);
      }

      WantedMovies.prototype.comparator = 'original_title';

      WantedMovies.prototype.sync = function(method, model, options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          data: {
            status: 'active'
          }
        });
        return WantedMovies.__super__.sync.apply(this, arguments);
      };

      return WantedMovies;

    })(Entities.MovieResults);
    movies = null;
    soon = null;
    getMovieSearchResults = function(term) {
      var defer, movieSearchResults;
      defer = $.Deferred();
      movieSearchResults = new Entities.MovieResults([]);
      movieSearchResults.url = NZBAppManager.request('api:endpoint', 'CouchPotato', 'search');
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
        movies = new Entities.WantedMovies([]);
        movies.url = movies.storeName = NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.list');
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
    getComingSoon = function() {
      var defer;
      defer = $.Deferred();
      if (!soon) {
        soon = new Entities.WantedMovies([]);
        soon.url = soon.storeName = NZBAppManager.request('api:endpoint', 'CouchPotato', 'dashboard.soon');
        soon.comparator = 'released';
        soon.fetch({
          data: {
            status: 'active'
          },
          success: function() {
            soon.each(function(movie) {
              movie.set('year', moment(movie.get('released')).format('ddd MMM Do, YYYY'));
              return movie != null ? movie.save() : void 0;
            });
            return defer.resolve(soon);
          }
        });
      } else {
        _.defer(function() {
          return defer.resolve(soon);
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
        },
        complete: function(xhr) {
          movie.set('in_wanted', true);
          if (movies) {
            return movies.add(new Entities.MovieResult(Entities.MovieResult.prototype.parse(xhr.responseJSON.movie)));
          }
        }
      });
      return defer.promise();
    };
    removeMovie = function(movie) {
      var defer;
      if (movies) {
        movies.remove(movie);
      }
      defer = $.ajax(NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.delete'), {
        dataType: 'jsonp',
        jsonp: 'callback_func',
        data: {
          id: movie != null ? movie.get('_id') : void 0
        }
      });
      return defer.promise();
    };
    getSortOptions = function() {
      return new Backbone.Collection([
        {
          title: 'Title',
          active: true,
          trigger: 'movies:sort',
          name: 'original_title'
        }, {
          title: 'Release Date',
          trigger: 'movies:sort',
          name: 'released'
        }
      ]);
    };
    NZBAppManager.reqres.setHandler('movies:search', function(term) {
      return getMovieSearchResults(term);
    });
    NZBAppManager.reqres.setHandler('movies:list', function() {
      return getMovies();
    });
    NZBAppManager.reqres.setHandler('movies:soon', function() {
      return getComingSoon();
    });
    NZBAppManager.reqres.setHandler('movies:add', function(movie) {
      return addMovie(movie);
    });
    NZBAppManager.reqres.setHandler('movies:remove', function(movie) {
      return removeMovie(movie);
    });
    return NZBAppManager.reqres.setHandler('movies:sort_options', function() {
      return getSortOptions();
    });
  });

}).call(this);
