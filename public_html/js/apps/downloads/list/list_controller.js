(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('DownloadsApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    var downloadsView;
    downloadsView = null;
    return List.Controller = {
      listQueue: function() {
        if (!(downloadsView != null ? downloadsView.currentView : void 0)) {
          downloadsView = new List.Downloads();
          NZBAppManager.mainRegion.show(downloadsView);
        }
        NZBAppManager.execute('titlebar:show', NZBAppManager.request('titlebar:downloads:entities'));
        NZBAppManager.execute('titlebar:activate', 'downloads/queue');
        return $.when(NZBAppManager.request('downloads:queue:entities')).done(function(queued) {
          return downloadsView.setCollection(queued, 'queue');
        });
      },
      listHistory: function() {
        if (!(downloadsView != null ? downloadsView.currentView : void 0)) {
          downloadsView = new List.Downloads();
          NZBAppManager.mainRegion.show(downloadsView);
        }
        NZBAppManager.execute('titlebar:show', NZBAppManager.request('titlebar:downloads:entities'));
        NZBAppManager.execute('titlebar:activate', 'downloads/history');
        return $.when(NZBAppManager.request('downloads:history:entities')).done(function(history) {
          return downloadsView.setCollection(history, 'history');
        });
      }
    };
  });

}).call(this);
