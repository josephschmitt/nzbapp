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
    List.NoQueueResults = (function(_super) {
      __extends(NoQueueResults, _super);

      function NoQueueResults() {
        return NoQueueResults.__super__.constructor.apply(this, arguments);
      }

      NoQueueResults.prototype.title = 'No Downloads in Queue';

      return NoQueueResults;

    })(NZBAppManager.GUI.List.NoResults);
    return List.Downloads = (function(_super) {
      __extends(Downloads, _super);

      function Downloads() {
        return Downloads.__super__.constructor.apply(this, arguments);
      }

      Downloads.prototype.childView = List.Slot;

      Downloads.prototype.className = 'downloads-list';

      Downloads.prototype.emptyView = List.NoQueueResults;

      Downloads.prototype.setCollection = function(collection) {
        if (!this.collection) {
          this.collection = collection;
          this.listenTo(this.collection, 'sync', this.render);
        } else {
          this.collection.reset(collection.models);
        }
        return this.render();
      };

      return Downloads;

    })(Marionette.CollectionView);
  });

}).call(this);
