(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var initTabs;
    Entities.Tab = (function(_super) {
      __extends(Tab, _super);

      function Tab() {
        return Tab.__super__.constructor.apply(this, arguments);
      }

      return Tab;

    })(Backbone.Model);
    Entities.TabsCollection = (function(_super) {
      __extends(TabsCollection, _super);

      function TabsCollection() {
        return TabsCollection.__super__.constructor.apply(this, arguments);
      }

      TabsCollection.prototype.model = Entities.Tab;

      return TabsCollection;

    })(Backbone.Collection);
    initTabs = function() {
      return Entities.tabs = new Entities.TabsCollection([
        {
          label: 'Search',
          name: 'Search',
          url: 'search',
          icon: 'fi-magnifying-glass'
        }, {
          label: 'Movies',
          name: 'CouchPotato',
          url: 'couchpotato',
          icon: 'fi-ticket'
        }, {
          label: 'TV',
          name: 'SickBeard',
          url: 'sickbeard',
          icon: 'fi-monitor'
        }, {
          label: 'Queue',
          name: 'SABnzbd',
          url: 'downloads',
          icon: 'fi-download'
        }, {
          label: 'Settings',
          name: 'Settings',
          url: 'servers',
          icon: 'fi-widget'
        }
      ]);
    };
    return NZBAppManager.reqres.setHandler('tabs:entities', function() {
      if (!Entities.tabs) {
        initTabs();
      }
      return Entities.tabs;
    });
  });

}).call(this);
