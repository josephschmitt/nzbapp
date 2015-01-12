(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('TitlebarApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
    var view;
    view = null;
    return Show.Controller = {
      show: function(data) {
        view = new Show.Titlebar({
          model: data
        });
        return NZBAppManager.titlebarRegion.show(view);
      },
      activate: function(url) {
        return view != null ? view.activate(url) : void 0;
      }
    };
  });

}).call(this);
