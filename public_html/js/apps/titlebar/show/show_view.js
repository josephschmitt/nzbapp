(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('TitlebarApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
    Show.TextTitlebar = (function(_super) {
      __extends(TextTitlebar, _super);

      function TextTitlebar() {
        return TextTitlebar.__super__.constructor.apply(this, arguments);
      }

      TextTitlebar.prototype.template = '#titlebar-text-template';

      TextTitlebar.prototype.className = "titlebar";

      return TextTitlebar;

    })(NZBAppManager.GUI.Tabs.TabView);
    Show.TitlebarTab = (function(_super) {
      __extends(TitlebarTab, _super);

      function TitlebarTab() {
        return TitlebarTab.__super__.constructor.apply(this, arguments);
      }

      TitlebarTab.prototype.template = '#titlebar-tab-item-template';

      TitlebarTab.prototype.tagName = 'li';

      return TitlebarTab;

    })(NZBAppManager.GUI.Tabs.TabView);
    return Show.TabsTitlebar = (function(_super) {
      __extends(TabsTitlebar, _super);

      function TabsTitlebar() {
        return TabsTitlebar.__super__.constructor.apply(this, arguments);
      }

      TabsTitlebar.prototype.template = '#titlebar-tabs-template';

      TabsTitlebar.prototype.className = "titlebar tabs-titlebar";

      TabsTitlebar.prototype.childView = Show.TitlebarTab;

      TabsTitlebar.prototype.childViewContainer = 'ul.button-group';

      return TabsTitlebar;

    })(Marionette.CompositeView);
  });

}).call(this);
