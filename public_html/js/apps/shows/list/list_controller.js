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
      },
      addShow: function(show) {
        return $.when(NZBAppManager.request('show:add', show)).done(function(added) {
          var message, status;
          message = added.message;
          status = added.result === 'success' ? 'success' : 'alert';
          return NZBAppManager.execute('popup:alert:show', message, status);
        });
      }
    };
  });

}).call(this);
