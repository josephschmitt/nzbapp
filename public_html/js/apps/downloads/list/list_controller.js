(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('DownloadsApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    return List.Controller = {
      listDownloads: function() {
        var listDownloads;
        listDownloads = new List.DownloadsView();
        NZBAppManager.mainRegion.show(listDownloads);
        return $.when(NZBAppManager.request('downloads:queue:list'), NZBAppManager.request('downloads:history:list')).done(function(queued, history) {
          listDownloads.queueCollection = queued;
          listDownloads.historyCollection = history;
          return listDownloads.render();
        });
      }
    };
  });

}).call(this);
