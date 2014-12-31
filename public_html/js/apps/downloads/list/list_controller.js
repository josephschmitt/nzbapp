(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('DownloadsApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    var downloadsView;
    downloadsView = null;
    return List.Controller = {
      listQueue: function() {
        if (!(downloadsView != null ? downloadsView.currentView : void 0)) {
          downloadsView = new List.DownloadsView();
          NZBAppManager.mainRegion.show(downloadsView);
        }
        return $.when(NZBAppManager.request('downloads:queue:entities')).done(function(queued) {
          downloadsView.setCollection(queued, 'queue');
          return List.Controller.pingQueue();
        });
      },
      pingQueue: function() {
        var ping;
        ping = NZBAppManager.request('downloads:queue:ping:entities');
        return $.when(ping).progress(function(queued) {
          var _ref;
          if (downloadsView && downloadsView.contentRegion) {
            return downloadsView != null ? (_ref = downloadsView.contentRegion.currentView) != null ? _ref.collection.set(queued.models) : void 0 : void 0;
          } else {
            return ping.resolve();
          }
        });
      },
      listHistory: function() {
        if (!(downloadsView != null ? downloadsView.currentView : void 0)) {
          downloadsView = new List.DownloadsView();
          NZBAppManager.mainRegion.show(downloadsView);
        }
        return $.when(NZBAppManager.request('downloads:history:entities')).done(function(history) {
          return downloadsView.setCollection(history, 'history');
        });
      }
    };
  });

}).call(this);
