(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var jjs;
    jjs = window.jjs = window.jjs || {};
    return jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
      return Entities.Popup = (function(_super) {
        __extends(Popup, _super);

        function Popup() {
          return Popup.__super__.constructor.apply(this, arguments);
        }

        Popup.prototype.defaults = {
          title: 'Popup Title',
          lead: 'Lead here',
          body: 'Body text here'
        };

        return Popup;

      })(Backbone.Model);
    });
  })();

}).call(this);
