(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
        add: '.add-item-button'
      };

      Show.prototype.events = {
        'click @ui.add': 'addShow'
      };

      Show.prototype.addShow = function(e) {
        if (e != null) {
          e.preventDefault();
        }
        return List.Controller.addShow(this.model);
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

      Shows.prototype.initialize = function() {
        Shows.__super__.initialize.apply(this, arguments);
        if (this.collection) {
          return this.setCollection(this.collection);
        }
      };

      Shows.prototype.setCollection = function(collection) {
        this.collection = collection;
        this.listenTo(this.collection, 'change', this.render);
        return this.render();
      };

      return Shows;

    })(Marionette.CollectionView);
    List.ShowsView = (function(_super) {
      __extends(ShowsView, _super);

      function ShowsView() {
        return ShowsView.__super__.constructor.apply(this, arguments);
      }

      ShowsView.prototype.template = '#shows-template';

      ShowsView.prototype.regions = {
        tabsRegion: '#shows-tabs-region',
        contentRegion: '#shows-list-region'
      };

      ShowsView.prototype.render = function() {
        ShowsView.__super__.render.apply(this, arguments);
        return this.tabsRegion.show(new NZBAppManager.GUI.Tabs.TabsView({
          collection: NZBAppManager.request('shows:tabs:entities'),
          className: 'tabs small text-center shows-tabs'
        }));
      };

      ShowsView.prototype.setCollection = function(collection, type) {
        var view;
        view = new List.Shows({
          collection: collection
        });
        this.contentRegion.show(view);
        return this.setTab(type);
      };

      ShowsView.prototype.setTab = function(tabUrl) {
        var collection, _ref, _ref1;
        collection = this.tabsRegion.currentView.collection;
        if ((_ref = collection.findWhere({
          active: true
        })) != null) {
          _ref.set('active', false);
        }
        return (_ref1 = collection.findWhere({
          url: tabUrl
        })) != null ? _ref1.set('active', true) : void 0;
      };

      return ShowsView;

    })(Marionette.LayoutView);
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

      UpcomingShowsView.prototype.setCollection = function(collection, type) {
        var view;
        view = new List.UpcomingShows({
          collection: collection
        });
        this.contentRegion.show(view);
        return this.setTab(type);
      };

      return UpcomingShowsView;

    })(List.ShowsView);
  });

}).call(this);
