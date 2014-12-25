(function() {
  (function() {
    var jjs;
    jjs = window.jjs = window.jjs || {};
    return jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
      return NZBAppManager.reqres.setHandler('api:endpoint', function(service, endpoint) {
        var serviceModel;
        serviceModel = NZBAppManager.request('servers:entities:settings:get', service);
        return "" + (serviceModel.get('serverUrl')) + "/api/" + (serviceModel.get('token')) + "/" + (service === 'SickBeard' ? '?cmd=' : '') + endpoint;
      });
    });
  })();

}).call(this);
