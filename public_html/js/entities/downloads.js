(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var getHistory, getQueued;
    Entities.Downloads = {};
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

      DownloadsQueue.prototype.fetch = function(options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback',
          jsonpCallback: options.jsonpCallback || 'jjs.AppConfig.callback_func'
        });
        return DownloadsQueue.__super__.fetch.call(this, options);
      };

      return DownloadsQueue;

    })(Backbone.Collection);
    getQueued = function() {
      var defer, downloads;
      defer = $.Deferred();
      downloads = new Entities.DownloadsQueue([], {
        url: NZBAppManager.request('api:endpoint', 'SABnzbd', 'queue')
      });
      downloads.fetch({
        jsonpCallback: 'jjs.NZBAppManager.Entities.Downloads.onDownloadsList'
      });
      Entities.Downloads.onDownloadsList = function(response) {
        return defer.resolve(downloads.set(response.queue.slots));
      };
      return defer.promise();
    };
    getHistory = function() {
      var defer, downloads;
      defer = $.Deferred();
      downloads = new Entities.DownloadsQueue([], {
        url: NZBAppManager.request('api:endpoint', 'SABnzbd', 'history')
      });
      downloads.fetch({
        jsonpCallback: 'jjs.NZBAppManager.Entities.Downloads.onDownloadsHistory'
      });
      Entities.Downloads.onDownloadsHistory = function(response) {
        return defer.resolve(downloads.set(response.history.slots));
      };
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
