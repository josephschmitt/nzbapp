(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('DownloadsApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    var downloadsView, queueTimeout;
    downloadsView = null;
    queueTimeout = 0;
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
        return $.when(NZBAppManager.request('downloads:queue:ping:entities')).done(function(queued) {
          var _ref;
          if (downloadsView && downloadsView.contentRegion) {
            if (downloadsView != null) {
              if ((_ref = downloadsView.contentRegion.currentView) != null) {
                _ref.collection.set(queued.models);
              }
            }
            return queueTimeout = setTimeout(List.Controller.pingQueue, 5000);
          } else {
            return clearTimeout(queueTimeout);
          }
        });
      },
      listHistory: function() {
        clearTimeout(queueTimeout);
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
