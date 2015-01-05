(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('SearchApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
    var defer, searchView;
    searchView = null;
    defer = null;
    return Show.Controller = {
      showSearch: function() {
        searchView = new Show.SearchView();
        NZBAppManager.mainRegion.show(searchView);
        return NZBAppManager.execute('titlebar:show', NZBAppManager.request('titlebar:search:entities'));
      },
      showResultsForSearch: function(type, term) {
        if (!searchView) {
          Show.Controller.showSearch();
          searchView.model.set({
            type: type,
            value: term
          });
          searchView.render();
        } else {
          searchView.clearResults();
        }
        if (!type || !term) {
          return;
        }
        if (defer != null) {
          defer.fail();
        }
        switch (type) {
          case 'movies':
            return defer = $.when(NZBAppManager.request('movies:search', term)).done(function(results) {
              defer = null;
              return searchView.renderResults(new NZBAppManager.MoviesApp.List.Movies({
                collection: results
              }));
            });
          case 'shows':
            return defer = $.when(NZBAppManager.request('shows:search', term)).done(function(results) {
              defer = null;
              return searchView.renderResults(new NZBAppManager.ShowsApp.List.Shows({
                collection: results
              }));
            });
        }
      }
    };
  });

}).call(this);
