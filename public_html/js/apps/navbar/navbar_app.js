(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('NavbarApp', function(Navbar, NZBAppManager, Backbone, Marionette, $, _) {
    NZBAppManager.commands.setHandler('tabs:active:set', function(name) {
      return Navbar.Tabs.Controller.setActive(name);
    });
    return Navbar.on('start', function() {
      return Navbar.Tabs.Controller.showTabs();
    });
  });

}).call(this);
