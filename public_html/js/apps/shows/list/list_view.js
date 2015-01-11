(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ShowsApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    List.Show = (function(_super) {
      __extends(Show, _super);

      function Show() {
        return Show.__super__.constructor.apply(this, arguments);
      }

      Show.prototype.template = '#show-list-template';

      Show.prototype.className = 'show-list-item';

      Show.prototype.ui = {
        add: '.add-item-button',
        remove: '.remove-item-button'
      };

      Show.prototype.events = {
        'click @ui.add': 'addShow',
        'click @ui.remove': 'removeMovie'
      };

      Show.prototype.render = function() {
        var imageLoaded;
        Show.__super__.render.apply(this, arguments);
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

      Show.prototype.addShow = function(e) {
        if (e != null) {
          e.preventDefault();
        }
        return List.Controller.addShow(this.model);
      };

      Show.prototype.emoveMovie = function(e) {
        if (e != null) {
          e.preventDefault();
        }
        return List.Controller.removeShow(this.model);
      };

      return Show;

    })(Marionette.ItemView);
    List.Shows = (function(_super) {
      __extends(Shows, _super);

      function Shows() {
        return Shows.__super__.constructor.apply(this, arguments);
      }

      Shows.prototype.childView = List.Show;

      Shows.prototype.className = 'shows-list';

      Shows.prototype.emptyView = NZBAppManager.GUI.List.NoResults;

      Shows.prototype.initialize = function() {
        Shows.__super__.initialize.apply(this, arguments);
        if (this.collection) {
          return this.setCollection(this.collection);
        }
      };

      Shows.prototype.setCollection = function(collection) {
        this.collection = collection;
        this.listenTo(this.collection, 'change reset sort', this.render);
        return this.render();
      };

      return Shows;

    })(Marionette.CollectionView);
    List.ShowsView = (function(_super) {
      __extends(ShowsView, _super);

      function ShowsView() {
        this.filter = __bind(this.filter, this);
        return ShowsView.__super__.constructor.apply(this, arguments);
      }

      ShowsView.prototype.listClass = List.Shows;

      ShowsView.prototype.initialize = function() {
        this.filtersCollection = NZBAppManager.request('shows:sort_options');
        this.on('filter', this.filter);
        return ShowsView.__super__.initialize.apply(this, arguments);
      };

      ShowsView.prototype.setCollection = function(collection) {
        var _ref;
        if ((_ref = this.listRegion.currentView) != null) {
          _ref.setCollection(new NZBAppManager.Entities.FilteredCollection({
            collection: collection,
            filterFunction: function(criterion) {
              criterion = criterion.toLowerCase();
              return function(model) {
                return model.get('show_name').toLowerCase().indexOf(criterion) >= 0;
              };
            }
          }));
        }
        return ShowsView.__super__.setCollection.apply(this, arguments);
      };

      ShowsView.prototype.filter = function(term) {
        var collection, _ref;
        collection = (_ref = this.listRegion.currentView) != null ? _ref.collection : void 0;
        return collection.filter(term);
      };

      ShowsView.prototype.sort = function(sort_by) {
        var collection, _ref;
        collection = (_ref = this.listRegion.currentView) != null ? _ref.collection : void 0;
        collection.comparator = sort_by;
        collection.sort();
        return this.listRegion.currentView;
      };

      return ShowsView;

    })(NZBAppManager.GUI.List.FilterableList);
    List.UpcomingShow = (function(_super) {
      __extends(UpcomingShow, _super);

      function UpcomingShow() {
        return UpcomingShow.__super__.constructor.apply(this, arguments);
      }

      UpcomingShow.prototype.template = '#show-upcoming-template';

      return UpcomingShow;

    })(List.Show);
    List.UpcomingShows = (function(_super) {
      __extends(UpcomingShows, _super);

      function UpcomingShows() {
        return UpcomingShows.__super__.constructor.apply(this, arguments);
      }

      UpcomingShows.prototype.childView = List.UpcomingShow;

      return UpcomingShows;

    })(List.Shows);
    return List.UpcomingShowsView = (function(_super) {
      __extends(UpcomingShowsView, _super);

      function UpcomingShowsView() {
        return UpcomingShowsView.__super__.constructor.apply(this, arguments);
      }

      return UpcomingShowsView;

    })(List.ShowsView);
  });

}).call(this);
