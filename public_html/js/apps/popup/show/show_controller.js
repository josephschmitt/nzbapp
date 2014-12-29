(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('PopupApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
    return Show.Controller = {
      showAlert: function(message) {
        return NZBAppManager.showModal(new Show.Alert({
          model: new Backbone.Model({
            message: message
          })
        }));
      },
      showModal: function(model, closePromise) {
        return NZBAppManager.showModal(new Show.Alert({
          model: model,
          closePromise: closePromise
        }));
      }
    };
  });

}).call(this);
