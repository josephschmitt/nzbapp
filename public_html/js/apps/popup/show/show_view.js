(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('PopupApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
    Show.Alert = (function(_super) {
      __extends(Alert, _super);

      function Alert() {
        return Alert.__super__.constructor.apply(this, arguments);
      }

      Alert.prototype.template = '#alert-template';

      Alert.prototype.className = 'alert-box success';

      Alert.prototype.ui = {
        close: '.close'
      };

      Alert.prototype.events = {
        'click @ui.close': 'close'
      };

      Alert.prototype.render = function() {
        Alert.__super__.render.apply(this, arguments);
        this.$el.attr('data-alert', true);
        return setTimeout((function(_this) {
          return function() {
            return _this.close();
          };
        })(this), 3000);
      };

      Alert.prototype.close = function(e) {
        if (e != null) {
          e.preventDefault();
        }
        return NZBAppManager.dismissModal();
      };

      return Alert;

    })(Marionette.ItemView);
    return Show.Modal = (function(_super) {
      __extends(Modal, _super);

      function Modal() {
        return Modal.__super__.constructor.apply(this, arguments);
      }

      Modal.prototype.template = '#modal-template';

      Modal.prototype.className = 'reveal-modal';

      Modal.prototype.ui = {
        close: '.close'
      };

      Modal.prototype.events = {
        'click @ui.close': 'close'
      };

      Modal.prototype.close = function(e) {
        var _ref;
        e.preventDefault();
        return (_ref = this.closePromise) != null ? _ref.done() : void 0;
      };

      return Modal;

    })(Marionette.ItemView);
  });

}).call(this);
