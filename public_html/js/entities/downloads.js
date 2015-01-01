(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var checkPing, doPing, downloads, downloadsHistory, downloadsTabs, getHistory, getQueued, getTabs, pauseQueue, performActionOnItem, resumeQueue, shouldPing;
    Entities.DownloadsSlot = (function(_super) {
      __extends(DownloadsSlot, _super);

      function DownloadsSlot() {
        return DownloadsSlot.__super__.constructor.apply(this, arguments);
      }

      DownloadsSlot.prototype.idAttribute = 'nzo_id';

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
          return DownloadsQueue.__super__.parse.call(this, (_ref1 = response.history) != null ? _ref1.slots : void 0);
        } else {
          return DownloadsQueue.__super__.parse.call(this, (_ref2 = response.queue) != null ? _ref2.slots : void 0);
        }
      };

      DownloadsQueue.prototype.sync = function(method, collection, options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback'
        });
        return DownloadsQueue.__super__.sync.call(this, method, collection, options);
      };

      return DownloadsQueue;

    })(Backbone.Collection);
    downloads = null;
    downloadsHistory = null;
    downloadsTabs = null;
    shouldPing = false;
    doPing = function() {
      return downloads != null ? downloads.fetch({
        success: function(collection, response, options) {
          downloads.response = response;
          return checkPing();
        }
      }) : void 0;
    };
    checkPing = function() {
      if (shouldPing) {
        return setTimeout(doPing, 1000);
      }
    };
    getQueued = function() {
      var defer;
      defer = $.Deferred();
      if (!downloads) {
        downloads = new Entities.DownloadsQueue([]);
        downloads.url = NZBAppManager.request('api:endpoint', 'SABnzbd', 'queue');
        downloads.fetch({
          success: function(collection, response, options) {
            downloads.response = response;
            defer.resolve(downloads);
            shouldPing = true;
            return checkPing();
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
    pauseQueue = function() {
      var defer;
      defer = $.ajax(NZBAppManager.request('api:endpoint', 'SABnzbd', 'pause'), {
        dataType: 'jsonp',
        jsonp: 'callback'
      });
      return defer.promise();
    };
    resumeQueue = function() {
      var defer;
      defer = $.ajax(NZBAppManager.request('api:endpoint', 'SABnzbd', 'resume'), {
        dataType: 'jsonp',
        jsonp: 'callback'
      });
      return defer.promise();
    };
    performActionOnItem = function(id, action, mode) {
      var defer;
      defer = $.ajax(NZBAppManager.request('api:endpoint', 'SABnzbd', mode), {
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {
          name: action,
          value: id
        }
      });
      return defer.promise();
    };
    NZBAppManager.reqres.setHandler('downloads:queue:entities', function() {
      return getQueued();
    });
    NZBAppManager.reqres.setHandler('downloads:history:entities', function() {
      return getHistory();
    });
    NZBAppManager.reqres.setHandler('downloads:tabs:entities', function() {
      if (!downloadsTabs) {
        getTabs();
      }
      return downloadsTabs;
    });
    NZBAppManager.reqres.setHandler('downloads:queue:pause', function() {
      return pauseQueue();
    });
    NZBAppManager.reqres.setHandler('downloads:queue:resume', function() {
      return resumeQueue();
    });
    NZBAppManager.commands.setHandler('downloads:queue:item', function(id, action) {
      return performActionOnItem(id, action, 'queue');
    });
    return NZBAppManager.commands.setHandler('downloads:history:item', function(id, action) {
      return performActionOnItem(id, action, 'history');
    });
  });

}).call(this);
