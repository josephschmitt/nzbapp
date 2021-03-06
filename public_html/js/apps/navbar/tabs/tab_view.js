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

      TabView.prototype.events = {
        'click': 'navigate'
      };

      TabView.prototype.initialize = function() {
        TabView.__super__.initialize.apply(this, arguments);
        this.listenTo(this.model, 'change', this.render);
        if (this.model.get('name') === 'Downloads') {
          this.$el.css('z-index', 1);
          return NZBAppManager.on('downloads:queue:ping', (function(_this) {
            return function(progress, queued, status) {
              _this.model.set('progress', progress * 100);
              _this.model.set('status', status);
              return _this.model.set('count', queued.length);
            };
          })(this));
        }
      };

      TabView.prototype.render = function() {
        TabView.__super__.render.apply(this, arguments);
        this.$el.attr('href', "#" + (this.model.get('url'))).toggleClass('active', !!this.model.get('active'));
        if (this.model.get('serverName')) {
          return this.$el.toggleClass('hide', !NZBAppManager.request('servers:entities:valid', this.model.get('serverName')));
        }
      };

      TabView.prototype.navigate = function(e) {
        e.preventDefault();
        return this.trigger('navigate', this.model);
      };

      TabView.prototype.destroy = function() {
        NZBAppManager.off('downloads:queue:ping');
        return TabView.__super__.destroy.apply(this, arguments);
      };

      return TabView;

    })(Marionette.ItemView);
    return Tabs.TabsView = (function(_super) {
      __extends(TabsView, _super);

      function TabsView() {
        return TabsView.__super__.constructor.apply(this, arguments);
      }

      TabsView.prototype.childView = Tabs.TabView;

      TabsView.prototype.className = 'icon-bar large-vertical';

      TabsView.prototype.tagName = 'nav';

      TabsView.prototype.tabClasses = ['two-up', 'three-up', 'four-up', 'five-up'];

      TabsView.prototype.activeTabCount = function() {
        var count, models;
        models = this.collection.filter(function(model) {
          return !!(model != null ? model.get('serverName') : void 0);
        });
        return count = models.reduce(function(memo, num) {
          if (memo.get) {
            if (NZBAppManager.request('servers:entities:valid', memo.get('serverName'))) {
              memo = 1;
            } else {
              memo = 0;
            }
          }
          if (num.get) {
            if (NZBAppManager.request('servers:entities:valid', num.get('serverName'))) {
              num = 1;
            } else {
              num = 0;
            }
          }
          return memo + num;
        });
      };

      TabsView.prototype.render = function() {
        TabsView.__super__.render.apply(this, arguments);
        return this.el.className = "" + this.className + " " + this.tabClasses[this.activeTabCount()];
      };

      return TabsView;

    })(Marionette.CollectionView);
  });

}).call(this);
