(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('TitlebarApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
    return Show.Controller = {
      show: function(data) {
        var view;
        if (Backbone.Collection.prototype.isPrototypeOf(data)) {
          view = new Show.TabsTitlebar({
            collection: data
          });
        } else {
          view = new Show.TextTitlebar({
            model: data
          });
        }
        return NZBAppManager.titlebarRegion.show(view);
      },
      activate: function(url) {
        var collection, _ref, _ref1, _ref2;
        collection = (_ref = NZBAppManager.titlebarRegion.currentView) != null ? _ref.collection : void 0;
        if (collection != null) {
          if ((_ref1 = collection.findWhere({
            active: true
          })) != null) {
            _ref1.set('active', false);
          }
        }
        return collection != null ? (_ref2 = collection.findWhere({
          url: url
        })) != null ? _ref2.set('active', true) : void 0 : void 0;
      }
    };
  });

}).call(this);
