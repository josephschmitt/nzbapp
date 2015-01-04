(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ServersApp.Setup', function(ServersSetup, NZBAppManager, Backbone, Marionette, $, _) {
    return ServersSetup.Controller = {
      listServers: function() {
        NZBAppManager.execute('titlebar:show', NZBAppManager.request('titlebar:settings:entities'));
        return $.when(NZBAppManager.request('servers:entities')).done((function(_this) {
          return function(serverSettings) {
            NZBAppManager.mainRegion.show(new ServersSetup.Layout({
              collection: serverSettings
            }));
            return serverSettings.on('change', function() {
              return ServersSetup.Controller.saveSettings();
            });
          };
        })(this));
      },
      saveSettings: function() {
        NZBAppManager.execute('tabs:show');
        return NZBAppManager.checkServerSettings(true);
      }
    };
  });

}).call(this);
