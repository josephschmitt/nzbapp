(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var deferredPing, downloads, downloadsHistory, downloadsTabs, getHistory, getQueued, getTabs, pingQueue, shouldPing;
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
    downloadsTabs = null;
    deferredPing = null;
    shouldPing = false;
    getQueued = function() {
      var defer;
      defer = $.Deferred();
      if (!downloads) {
        downloads = new Entities.DownloadsQueue([]);
        downloads.url = NZBAppManager.request('api:endpoint', 'SABnzbd', 'queue');
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
    pingQueue = function() {
      var doPing;
      deferredPing = deferredPing || $.Deferred();
      deferredPing.done(function() {
        shouldPing = false;
        return deferredPing = null;
      });
      downloads = new Entities.DownloadsQueue([]);
      downloads.url = NZBAppManager.request('api:endpoint', 'SABnzbd', 'queue');
      doPing = function() {
        return downloads.fetch({
          success: function(collection, response, options) {
            if (deferredPing != null) {
              deferredPing.notify(downloads, response.queue);
            }
            if (shouldPing) {
              return setTimeout(doPing, 1000);
            }
          }
        });
      };
      shouldPing = true;
      doPing();
      return deferredPing;
    };
    getHistory = function() {
      var defer;
      defer = $.Deferred();
      if (!downloadsHistory) {
        downloadsHistory = new Entities.DownloadsQueue([]);
        downloadsHistory.url = NZBAppManager.request('api:endpoint', 'SABnzbd', 'history');
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
    getTabs = function() {
      return downloadsTabs = new Backbone.Collection([
        {
          name: 'Queue',
          url: 'queue',
          trigger: 'downloads:queue:list'
        }, {
          name: 'History',
          url: 'history',
          trigger: 'downloads:history:list'
        }
      ]);
    };
    NZBAppManager.reqres.setHandler('downloads:queue:entities', function() {
      return getQueued();
    });
    NZBAppManager.reqres.setHandler('downloads:queue:ping:entities', function() {
      return pingQueue();
    });
    NZBAppManager.reqres.setHandler('downloads:history:entities', function() {
      return getHistory();
    });
    return NZBAppManager.reqres.setHandler('downloads:tabs:entities', function() {
      if (!downloadsTabs) {
        getTabs();
      }
      return downloadsTabs;
    });
  });

}).call(this);
