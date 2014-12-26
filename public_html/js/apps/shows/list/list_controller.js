(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ShowsApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    return List.Controller = {
      listShows: function() {
        var listShows;
        listShows = new List.Shows();
        NZBAppManager.mainRegion.show(listShows);
        return $.when(NZBAppManager.request('shows:list')).done(function(shows) {
          return listShows.setCollection(shows);
        });
      }
    };
  });

}).call(this);
