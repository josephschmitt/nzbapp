(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ServersApp.Setup', function(ServersSetup, NZBAppManager, Backbone, Marionette, $, _) {
    ServersSetup.Fields = (function(_super) {
      __extends(Fields, _super);

      function Fields() {
        return Fields.__super__.constructor.apply(this, arguments);
      }

      Fields.prototype.template = '#server-setup-fields-template';

      Fields.prototype.tagName = 'fieldset';

      Fields.prototype.ui = {
        'url': '.server-url',
        'token': '.server-token'
      };

      Fields.prototype.saveServerSettings = function() {
        this.model.set('serverUrl', this.$(this.ui.url).val(), {
          silent: true
        });
        this.model.set('token', this.$(this.ui.token).val(), {
          silent: true
        });
        return this.model.save();
      };

      return Fields;

    })(Marionette.ItemView);
    ServersSetup.CollectionView = (function(_super) {
      __extends(CollectionView, _super);

      function CollectionView() {
        return CollectionView.__super__.constructor.apply(this, arguments);
      }

      CollectionView.prototype.childView = ServersSetup.Fields;

      CollectionView.prototype.initialize = function() {
        CollectionView.__super__.initialize.apply(this, arguments);
        return this.listenTo(this.collection, 'change', this.render);
      };

      return CollectionView;

    })(Marionette.CollectionView);
    return ServersSetup.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.tagName = 'form';

      Layout.prototype.template = '#server-setup-template';

      Layout.prototype.regions = {
        collectionRegion: '#server-collection'
      };

      Layout.prototype.ui = {
        'save': '#server-save'
      };

      Layout.prototype.events = {
        'submit': 'saveServerSettings',
        'click @ui.save': 'saveServerSettings'
      };

      Layout.prototype.render = function() {
        Layout.__super__.render.apply(this, arguments);
        return this.collectionRegion.show(new ServersSetup.CollectionView({
          collection: this.collection
        }));
      };

      Layout.prototype.saveServerSettings = function(e) {
        e.preventDefault();
        this.collectionRegion.currentView.children.each(function(child) {
          return child.saveServerSettings();
        });
        return this.collection.trigger('change');
      };

      return Layout;

    })(Marionette.LayoutView);
  });

}).call(this);
