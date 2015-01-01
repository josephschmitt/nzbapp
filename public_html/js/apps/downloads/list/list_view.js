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
        button: '.media-meta .button'
      };

      Slot.prototype.events = {
        'click @ui.button': 'queueAction'
      };

      Slot.prototype.initialize = function() {
        Slot.__super__.initialize.apply(this, arguments);
        return this.listenTo(this.model, 'change', this.render);
      };

      Slot.prototype.queueAction = function(e) {
        var mode;
        if (e != null) {
          e.preventDefault();
        }
        mode = this.model.get('status') === 'Completed' ? 'history' : 'queue';
        if ($(e.currentTarget).data('status')) {
          this.model.set('status', $(e.currentTarget).data('status'));
        } else {
          this.model.collection.remove(this.model);
        }
        return NZBAppManager.execute("downloads:" + mode + ":item", this.model.id, $(e.currentTarget).data('action'));
      };

      return Slot;

    })(Marionette.ItemView);
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
        return this.tabsRegion.show(new NZBAppManager.GUI.Tabs.TabsView({
          collection: NZBAppManager.request('downloads:tabs:entities'),
          className: 'tabs small text-center downloads-tabs'
        }));
      };

      DownloadsView.prototype.setCollection = function(collection, type) {
        var view;
        view = new List.Downloads({
          collection: collection
        });
        this.contentRegion.show(view);
        return this.setTab(type);
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
