(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var downloads, downloadsHistory, getHistory, getQueued;
    Entities.DownloadsSlot = (function(_super) {
      __extends(DownloadsSlot, _super);

      function DownloadsSlot() {
        return DownloadsSlot.__super__.constructor.apply(this, arguments);
      }

      return DownloadsSlot;

    })(Backbone.Model);
    Entities.DownloadsQueue = (function(_super) {
      __extends(DownloadsQueue, _super);

      function DownloadsQueue() {
        return DownloadsQueue.__super__.constructor.apply(this, arguments);
      }

      DownloadsQueue.prototype.model = Entities.DownloadsSlot;

      DownloadsQueue.prototype.parse = function(response) {
        var _ref, _ref1, _ref2;
        if (response != null ? (_ref = response.history) != null ? _ref.slots : void 0 : void 0) {
          return (_ref1 = response.history) != null ? _ref1.slots : void 0;
        } else {
          return (_ref2 = response.queue) != null ? _ref2.slots : void 0;
        }
      };

      DownloadsQueue.prototype.sync = function(method, model, options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback'
        });
        return DownloadsQueue.__super__.sync.apply(this, arguments);
      };

      return DownloadsQueue;

    })(Backbone.Collection);
    downloads = null;
    downloadsHistory = null;
    getQueued = function() {
      var defer;
      defer = $.Deferred();
      if (!downloads) {
        downloads = new Entities.DownloadsQueue([], {
          url: NZBAppManager.request('api:endpoint', 'SABnzbd', 'queue')
        });
        downloads.fetch({
          success: function() {
            return defer.resolve(downloads);
          }
        });
      } else {
        _.defer(function() {
          return defer.resolve(downloads);
        });
      }
      return defer.promise();
    };
    getHistory = function() {
      var defer;
      defer = $.Deferred();
      if (!downloadsHistory) {
        downloadsHistory = new Entities.DownloadsQueue([], {
          url: NZBAppManager.request('api:endpoint', 'SABnzbd', 'history')
        });
        downloadsHistory.fetch({
          success: function() {
            return defer.resolve(downloadsHistory);
          }
        });
      } else {
        _.defer(function() {
          return defer.resolve(downloadsHistory);
        });
      }
      return defer.promise();
    };
    NZBAppManager.reqres.setHandler('downloads:queue:list', function() {
      return getQueued();
    });
    return NZBAppManager.reqres.setHandler('downloads:history:list', function() {
      return getHistory();
    });
  });

}).call(this);
