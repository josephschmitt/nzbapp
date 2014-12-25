(function() {
  (function() {
    var jjs;
    jjs = window.jjs = window.jjs || {};
    return jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
      return NZBAppManager.reqres.setHandler('api:call', function(service, endpoint) {
        var serverSettings, serviceModel;
        console.log('settings', NZBAppManager.request('server:settings:get'));
        serverSettings = NZBAppManager.request('server:settings:get');
        serviceModel = serverSettings.findWhere({
          name: service
        });
        return "" + (serviceModel.get('serverUrl')) + "/api/" + (serviceModel.get('token')) + "/" + (service === 'SickBeard' ? '?cmd=' : '') + endpoint;
      });
    });
  })();

}).call(this);
