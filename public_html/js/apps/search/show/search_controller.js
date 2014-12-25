(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('SearchApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
    return Show.Controller = {
      showEmptySearch: function() {
        return NZBAppManager.mainRegion.show(new Show.SearchView);
      }
    };
  });

}).call(this);
