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
          return NZBAppManager.on('downloads:queue:ping', function(progress, queued) {
            var _ref, _ref1;
            if (downloadsView && downloadsView.contentRegion) {
              return downloadsView != null ? (_ref = downloadsView.contentRegion) != null ? (_ref1 = _ref.currentView) != null ? _ref1.collection.set(queued.models) : void 0 : void 0 : void 0;
            } else {
              return NZBAppManager.off('downloads:queue:ping');
            }
          });
        });
      },
      listHistory: function() {
        NZBAppManager.off('downloads:queue:ping');
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
