(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('DownloadsApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    var deferredPing, downloadsView;
    downloadsView = null;
    deferredPing = null;
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
        if (deferredPing != null) {
          deferredPing.resolve();
        }
        deferredPing = NZBAppManager.request('downloads:queue:ping:entities');
        return $.when(deferredPing).progress(function(queued) {
          var _ref;
          if (downloadsView && downloadsView.contentRegion) {
            return downloadsView != null ? (_ref = downloadsView.contentRegion.currentView) != null ? _ref.collection.set(queued.models) : void 0 : void 0;
          } else {
            deferredPing.resolve();
            return deferredPing = null;
          }
        });
      },
      listHistory: function() {
        if (deferredPing != null) {
          deferredPing.resolve();
        }
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
