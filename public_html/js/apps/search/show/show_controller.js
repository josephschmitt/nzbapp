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
        return NZBAppManager.mainRegion.show(searchView);
      },
      showResultsForSearch: function(type, term) {
        if (!searchView) {
          Show.Controller.showSearch();
        }
        searchView.model = new Backbone.Model({
          type: type,
          value: term
        });
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
