(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('DownloadsApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    List.Slot = (function(_super) {
      __extends(Slot, _super);

      function Slot() {
        return Slot.__super__.constructor.apply(this, arguments);
      }

      Slot.prototype.template = '#download-list-template';

      Slot.prototype.className = 'download-list-item';

      Slot.prototype.ui = {
        progress: '.progress',
        meter: '.meter'
      };

      Slot.prototype.initialize = function() {
        return Slot.__super__.initialize.apply(this, arguments);
      };

      return Slot;

    })(Marionette.ItemView);
    List.TabView = (function(_super) {
      __extends(TabView, _super);

      function TabView() {
        return TabView.__super__.constructor.apply(this, arguments);
      }

      TabView.prototype.template = '#downloads-tab-template';

      TabView.prototype.tagName = 'dd';

      TabView.prototype.events = {
        'click': 'navigate'
      };

      TabView.prototype.initialize = function() {
        TabView.__super__.initialize.apply(this, arguments);
        return this.listenTo(this.model, 'change', this.render);
      };

      TabView.prototype.render = function() {
        TabView.__super__.render.apply(this, arguments);
        return this.$el.toggleClass('active', !!this.model.get('active'));
      };

      TabView.prototype.navigate = function(e) {
        e.preventDefault();
        return NZBAppManager.trigger(this.model.get('trigger'));
      };

      return TabView;

    })(Marionette.ItemView);
    List.TabsView = (function(_super) {
      __extends(TabsView, _super);

      function TabsView() {
        return TabsView.__super__.constructor.apply(this, arguments);
      }

      TabsView.prototype.childView = List.TabView;

      TabsView.prototype.className = 'sub-nav downloads-tabs';

      TabsView.prototype.tagName = 'dl';

      return TabsView;

    })(Marionette.CollectionView);
    List.Downloads = (function(_super) {
      __extends(Downloads, _super);

      function Downloads() {
        return Downloads.__super__.constructor.apply(this, arguments);
      }

      Downloads.prototype.childView = List.Slot;

      Downloads.prototype.className = 'downloads-list';

      return Downloads;

    })(Marionette.CollectionView);
    return List.DownloadsView = (function(_super) {
      __extends(DownloadsView, _super);

      function DownloadsView() {
        return DownloadsView.__super__.constructor.apply(this, arguments);
      }

      DownloadsView.prototype.template = '#downloads-template';

      DownloadsView.prototype.regions = {
        tabsRegion: '#downloads-tabs-region',
        contentRegion: '#downloads-content-region'
      };

      DownloadsView.prototype.render = function() {
        DownloadsView.__super__.render.apply(this, arguments);
        return this.tabsRegion.show(new List.TabsView({
          collection: NZBAppManager.request('downloads:tabs:entities')
        }));
      };

      DownloadsView.prototype.setCollection = function(collection) {
        var view;
        view = new List.Downloads({
          collection: collection
        });
        return this.contentRegion.show(view);
      };

      DownloadsView.prototype.setTab = function(tabUrl) {
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

      return DownloadsView;

    })(Marionette.LayoutView);
  });

}).call(this);
