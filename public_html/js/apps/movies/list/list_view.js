(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('MoviesApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    List.Movie = (function(_super) {
      __extends(Movie, _super);

      function Movie() {
        return Movie.__super__.constructor.apply(this, arguments);
      }

      Movie.prototype.template = '#movie-list-template';

      Movie.prototype.className = 'movie-list-item';

      Movie.prototype.ui = {
        add: '.add-item-button',
        remove: '.remove-item-button'
      };

      Movie.prototype.events = {
        'click @ui.add': 'addMovie',
        'click @ui.remove': 'removeMovie'
      };

      Movie.prototype.render = function() {
        var imageLoaded;
        Movie.__super__.render.apply(this, arguments);
        imageLoaded = function(e) {
          return $(this).parent().show();
        };
        return this.$el.find('img').on('error', function() {
          return $(this).parent().remove();
        }).on('load', imageLoaded).each(function(i, img) {
          if (img.complete || img.naturalWidth) {
            return imageLoaded.call(this);
          }
        });
      };

      Movie.prototype.addMovie = function(e) {
        if (e != null) {
          e.preventDefault();
        }
        return List.Controller.addMovie(this.model);
      };

      Movie.prototype.removeMovie = function(e) {
        if (e != null) {
          e.preventDefault();
        }
        return List.Controller.removeMovie(this.model);
      };

      return Movie;

    })(Marionette.ItemView);
    return List.Movies = (function(_super) {
      __extends(Movies, _super);

      function Movies() {
        return Movies.__super__.constructor.apply(this, arguments);
      }

      Movies.prototype.childView = List.Movie;

      Movies.prototype.className = 'movies-list';

      Movies.prototype.emptyView = NZBAppManager.GUI.List.NoResults;

      Movies.prototype.initialize = function() {
        Movies.__super__.initialize.apply(this, arguments);
        if (this.collection) {
          return this.setCollection(this.collection);
        }
      };

      Movies.prototype.setCollection = function(collection) {
        this.collection = collection;
        this.listenTo(this.collection, 'change', this.render);
        return this.render();
      };

      return Movies;

    })(Marionette.CollectionView);
  });

}).call(this);
