(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('PopupApp', function(Popup, NZBAppManager, Backbone, Marionette, $, _) {
    NZBAppManager.commands.setHandler('popup:alert:show', function(message, status) {
      return Popup.Show.Controller.showAlert(message, status);
    });
    return NZBAppManager.commands.setHandler('popup:modal:show', function(model, closePromise) {
      return Popup.Show.Controller.showModal(model, closePromise);
    });
  });

}).call(this);
