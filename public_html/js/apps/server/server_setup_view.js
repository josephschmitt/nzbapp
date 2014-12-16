(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var js;
    js = window.js = window.js || {};
    return js.NZBAppManager.module('Server', function(Server, NZBAppManager, Backbone, Marionette, $, _) {
      Server.SetupFields = (function(_super) {
        __extends(SetupFields, _super);

        function SetupFields() {
          return SetupFields.__super__.constructor.apply(this, arguments);
        }

        SetupFields.prototype.template = '#server-setup-fields-template';

        SetupFields.prototype.tagName = 'fieldset';

        SetupFields.prototype.ui = {
          'url': '.server-url',
          'token': '.server-token'
        };

        SetupFields.prototype.saveServerSettings = function() {
          this.model.set('serverUrl', this.$(this.ui.url).val());
          this.model.set('token', this.$(this.ui.token).val());
          this.model.save();
          return this.trigger('save');
        };

        return SetupFields;

      })(Marionette.ItemView);
      Server.SetupCollectionView = (function(_super) {
        __extends(SetupCollectionView, _super);

        function SetupCollectionView() {
          return SetupCollectionView.__super__.constructor.apply(this, arguments);
        }

        SetupCollectionView.prototype.childView = Server.SetupFields;

        SetupCollectionView.prototype.initialize = function() {
          SetupCollectionView.__super__.initialize.apply(this, arguments);
          this.listenTo(this.collection, 'change', this.render);
          return this.on('childview:save', _.throttle(this.update, 100, {
            leading: false
          }));
        };

        SetupCollectionView.prototype.update = function() {
          return NZBAppManager.commands.execute('server:settings:set');
        };

        return SetupCollectionView;

      })(Marionette.CollectionView);
      return Server.Setup = (function(_super) {
        __extends(Setup, _super);

        function Setup() {
          return Setup.__super__.constructor.apply(this, arguments);
        }

        Setup.prototype.tagName = 'form';

        Setup.prototype.template = '#server-setup-template';

        Setup.prototype.regions = {
          collectionRegion: '#server-collection'
        };

        Setup.prototype.ui = {
          'save': '#server-save'
        };

        Setup.prototype.events = {
          'submit': 'saveServerSettings',
          'click @ui.save': 'saveServerSettings'
        };

        Setup.prototype.render = function() {
          Setup.__super__.render.apply(this, arguments);
          return this.collectionRegion.show(new Server.SetupCollectionView({
            collection: this.collection
          }));
        };

        Setup.prototype.saveServerSettings = function(e) {
          e.preventDefault();
          return this.collectionRegion.currentView.children.each(function(child) {
            return child.saveServerSettings();
          });
        };

        return Setup;

      })(Marionette.LayoutView);
    });
  })();

}).call(this);
