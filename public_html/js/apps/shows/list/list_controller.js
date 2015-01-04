(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ShowsApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    return List.Controller = {
      listShows: function() {
        var listShows;
        listShows = new List.Shows();
        NZBAppManager.mainRegion.show(listShows);
        NZBAppManager.execute('titlebar:show', NZBAppManager.request('titlebar:shows:entities'));
        NZBAppManager.execute('titlebar:activate', 'shows/wanted');
        return $.when(NZBAppManager.request('shows:list:entities')).done(function(shows) {
          return listShows.setCollection(shows, 'wanted');
        });
      },
      listUpcomingShows: function() {
        var listShows;
        listShows = new List.UpcomingShows();
        NZBAppManager.mainRegion.show(listShows);
        NZBAppManager.execute('titlebar:show', NZBAppManager.request('titlebar:shows:entities'));
        NZBAppManager.execute('titlebar:activate', 'shows/upcoming');
        return $.when(NZBAppManager.request('shows:upcoming:entities')).done(function(shows) {
          return listShows.setCollection(shows, 'upcoming');
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
