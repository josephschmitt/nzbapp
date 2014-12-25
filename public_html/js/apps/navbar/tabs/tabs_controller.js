(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('NavbarApp.Tabs', function(Tabs, NZBAppManager, Backbone, Marionette, $, _) {
    return Tabs.Controller = {
      showTabs: function() {
        var tabs, tabsCollection;
        tabsCollection = NZBAppManager.request('tabs:entities');
        tabs = new Tabs.TabsView({
          collection: tabsCollection
        });
        NZBAppManager.navbarRegion.show(tabs);
        return tabs.on('childview:navigate', function(childview, model) {
          return NZBAppManager.trigger(model.get('trigger'));
        });
      },
      setActive: function(name) {
        var tabsCollection, _ref, _ref1;
        tabsCollection = NZBAppManager.request('tabs:entities');
        if ((_ref = tabsCollection.findWhere({
          active: true
        })) != null) {
          _ref.set('active', false);
        }
        return (_ref1 = tabsCollection.findWhere({
          name: name
        })) != null ? _ref1.set('active', true) : void 0;
      }
    };
  });

}).call(this);
