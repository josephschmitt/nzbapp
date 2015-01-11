(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    List.Movies = (function(_super) {
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
        this.listenTo(this.collection, 'change reset sort', this.render);
        return this.render();
      };

      return Movies;

    })(Marionette.CollectionView);
    return List.MoviesView = (function(_super) {
      __extends(MoviesView, _super);

      function MoviesView() {
        this.filter = __bind(this.filter, this);
        return MoviesView.__super__.constructor.apply(this, arguments);
      }

      MoviesView.prototype.listClass = List.Movies;

      MoviesView.prototype.initialize = function() {
        this.filtersCollection = NZBAppManager.request('movies:sort_options');
        this.on('filter', this.filter);
        return MoviesView.__super__.initialize.apply(this, arguments);
      };

      MoviesView.prototype.setCollection = function(collection) {
        var _ref;
        if ((_ref = this.listRegion.currentView) != null) {
          _ref.setCollection(new NZBAppManager.Entities.FilteredCollection({
            collection: collection,
            filterFunction: function(criterion) {
              criterion = criterion.toLowerCase();
              return function(model) {
                return model.get('original_title').toLowerCase().indexOf(criterion) >= 0;
              };
            }
          }));
        }
        return MoviesView.__super__.setCollection.call(this, collection);
      };

      MoviesView.prototype.filter = function(term) {
        var collection, _ref;
        collection = (_ref = this.listRegion.currentView) != null ? _ref.collection : void 0;
        return collection.filter(term);
      };

      MoviesView.prototype.sort = function(sort_by) {
        var collection, _ref;
        collection = (_ref = this.listRegion.currentView) != null ? _ref.collection : void 0;
        collection.comparator = sort_by;
        collection.sort();
        return this.listRegion.currentView;
      };

      return MoviesView;

    })(NZBAppManager.GUI.List.FilterableList);
  });

}).call(this);
