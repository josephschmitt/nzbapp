(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('NavbarApp.Tabs', function(Tabs, NZBAppManager, Backbone, Marionette, $, _) {
    Tabs.TabView = (function(_super) {
      __extends(TabView, _super);

      function TabView() {
        return TabView.__super__.constructor.apply(this, arguments);
      }

      TabView.prototype.template = '#navbar-template';

      TabView.prototype.tagName = 'a';

      TabView.prototype.className = 'item';

      TabView.prototype.initialize = function() {
        TabView.__super__.initialize.apply(this, arguments);
        return this.listenTo(this.model, 'change', (function(_this) {
          return function() {
            return _this.$el.toggleClass('active', !!_this.model.get('active'));
          };
        })(this));
      };

      TabView.prototype.render = function() {
        TabView.__super__.render.apply(this, arguments);
        return this.$el.attr('href', "#" + (this.model.get('url')));
      };

      return TabView;

    })(Marionette.ItemView);
    return Tabs.TabsView = (function(_super) {
      __extends(TabsView, _super);

      function TabsView() {
        return TabsView.__super__.constructor.apply(this, arguments);
      }

      TabsView.prototype.childView = Tabs.TabView;

      TabsView.prototype.className = 'icon-bar five-up';

      TabsView.prototype.tagName = 'nav';

      return TabsView;

    })(Marionette.CollectionView);
  });

}).call(this);
