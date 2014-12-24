(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ServersApp.Setup', function(ServersSetup, NZBAppManager, Backbone, Marionette, $, _) {
    return ServersSetup.Controller = {
      listServers: function() {
        return $.when(NZBAppManager.request('servers:entities')).done((function(_this) {
          return function(serverSettings) {
            NZBAppManager.mainRegion.transitionToView(new ServersSetup.Layout({
              collection: serverSettings
            }));
            return serverSettings.on('change', function() {
              return serverSettings.sync('update', serverSettings, {
                success: function() {
                  return NZBAppManager.trigger('home:show');
                }
              });
            });
          };
        })(this));
      }
    };
  });

}).call(this);
