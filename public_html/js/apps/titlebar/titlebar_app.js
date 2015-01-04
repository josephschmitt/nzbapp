(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('TitlebarApp', function(Titlebar, NZBAppManager, Backbone, Marionette, $, _) {
    NZBAppManager.commands.setHandler('titlebar:show', function(data) {
      return Titlebar.Show.Controller.show(data);
    });
    return NZBAppManager.commands.setHandler('titlebar:activate', function(url) {
      return Titlebar.Show.Controller.activate(url);
    });
  });

}).call(this);
