(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('SearchApp.Results', function(Results, NZBAppManager, Backbone, Marionette, $, _) {
    return Results.Controller = {
      showEmptySearch: function() {
        return NZBAppManager.mainRegion.show(new Results.SearchView());
      }
    };
  });

}).call(this);
