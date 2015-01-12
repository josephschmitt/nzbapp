(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('TitlebarApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
    return Show.Titlebar = (function(_super) {
      __extends(Titlebar, _super);

      function Titlebar() {
        return Titlebar.__super__.constructor.apply(this, arguments);
      }

      Titlebar.prototype.template = '#titlebar-template';

      Titlebar.prototype.className = "titlebar";

      Titlebar.prototype.events = {
        'click a': 'navigate'
      };

      Titlebar.prototype.initialize = function() {
        Titlebar.__super__.initialize.apply(this, arguments);
        return this.listenTo(this.model, 'change', this.render);
      };

      Titlebar.prototype.activate = function(url) {
        this.$('.active').removeClass('active');
        return this.$("[href*='" + url + "']").parent().addClass('active');
      };

      Titlebar.prototype.navigate = function(e) {
        e.preventDefault();
        return NZBAppManager.trigger($(e.target).data('trigger'));
      };

      return Titlebar;

    })(Marionette.ItemView);
  });

}).call(this);
