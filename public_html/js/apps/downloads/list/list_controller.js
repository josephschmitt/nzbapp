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
          downloadsView.setCollection(queued);
          return downloadsView.setTab('queue');
        });
      },
      listHistory: function() {
        if (!(downloadsView != null ? downloadsView.currentView : void 0)) {
          downloadsView = new List.DownloadsView();
          NZBAppManager.mainRegion.show(downloadsView);
        }
        return $.when(NZBAppManager.request('downloads:history:entities')).done(function(history) {
          downloadsView.setCollection(history);
          return downloadsView.setTab('history');
        });
      }
    };
  });

}).call(this);
