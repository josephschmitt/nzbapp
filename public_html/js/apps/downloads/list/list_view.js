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

      Slot.prototype.className = 'row';

      Slot.prototype.ui = {
        progress: '.progress',
        meter: '.meter'
      };

      Slot.prototype.initialize = function() {
        return Slot.__super__.initialize.apply(this, arguments);
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
        queueRegion: '#downloads-queue-region',
        historyRegion: '#downloads-history-region'
      };

      DownloadsView.prototype.setCollections = function(queued, history) {
        this.queueCollection = queued;
        this.historyCollection = history;
        this.listenTo(this.queueCollection, 'change', this.renderQueue);
        this.listenTo(this.historyCollection, 'change', this.renderHistory);
        return this.render();
      };

      DownloadsView.prototype.renderQueue = function() {
        return this.queueRegion.show(new List.Downloads({
          collection: this.queueCollection
        }));
      };

      DownloadsView.prototype.renderHistory = function() {
        return this.historyRegion.show(new List.Downloads({
          collection: this.historyCollection
        }));
      };

      DownloadsView.prototype.render = function() {
        DownloadsView.__super__.render.apply(this, arguments);
        this.renderQueue();
        return this.renderHistory();
      };

      return DownloadsView;

    })(Marionette.LayoutView);
  });

}).call(this);
