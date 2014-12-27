(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('SearchApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
    var searchView;
    searchView = void 0;
    return Show.Controller = {
      showEmptySearch: function() {
        searchView = new Show.SearchView();
        return NZBAppManager.mainRegion.show(searchView);
      },
      showResultsForSearch: function(type, term) {
        if (!searchView) {
          Show.Controller.showEmptySearch();
        }
        switch (type) {
          case 'movies':
            return $.when(NZBAppManager.request('movies:search', term)).done(function(results) {
              return searchView.renderResults(new NZBAppManager.MoviesApp.List.Movies({
                collection: results
              }));
            });
          case 'shows':
            return $.when(NZBAppManager.request('shows:search', term)).done(function(results) {
              return searchView.renderResults(new NZBAppManager.ShowsApp.List.Shows({
                collection: results
              }));
            });
        }
      }
    };
  });

}).call(this);
