(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var js;
    js = window.js = window.js || {};
    return js.NZBAppManager.module('Home', function(Home, NZBAppManager, Backbone, Marionette, $, _) {
      var HomeView;
      return HomeView = (function(_super) {
        __extends(HomeView, _super);

        function HomeView() {
          return HomeView.__super__.constructor.apply(this, arguments);
        }

        HomeView.prototype.template = '#home-template';

        HomeView.prototype.regions = {
          navbarRegion: '#content-region',
          contentRegion: '#navbar-region'
        };

        HomeView.prototype.render = function() {
          HomeView.__super__.render.apply(this, arguments);
          this.navbarRegion.show(new Marionette.ItemView({
            template: '#navbar-template'
          }));
          return this.contentRegion.show(new Marionette.ItemView({
            template: '#search-template'
          }));
        };

        return HomeView;

      })(Marionette.LayoutView);
    });
  })();

}).call(this);
