(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var js;
    js = window.js = window.js || {};
    return js.NZBAppManager.module('NavBar', function(NavBar, NZBAppManager, Backbone, Marionette, $, _) {
      var NavBarTabs;
      return NavBarTabs = (function(_super) {
        __extends(NavBarTabs, _super);

        function NavBarTabs() {
          return NavBarTabs.__super__.constructor.apply(this, arguments);
        }

        NavBarTabs.prototype.template = '#navbar-template';

        return NavBarTabs;

      })(Marionette.ItemView);
    });
  })();

}).call(this);
