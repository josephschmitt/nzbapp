(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ModalApp', function(Modal, NZBAppManager, Backbone, Marionette, $, _) {
    return NZBAppManager.commands.setHandler('modal:show', function(model) {
      return Modal.Show.Controller.showModal(model);
    });
  });

}).call(this);
