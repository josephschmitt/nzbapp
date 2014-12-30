(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var ServerSettings, ServersCollection, collection, couchPotatoServer, defer, sabnzbdServer, sickBeardServer;
    ServerSettings = (function(_super) {
      __extends(ServerSettings, _super);

      function ServerSettings() {
        return ServerSettings.__super__.constructor.apply(this, arguments);
      }

      return ServerSettings;

    })(Backbone.Model);
    ServersCollection = (function(_super) {
      __extends(ServersCollection, _super);

      function ServersCollection() {
        return ServersCollection.__super__.constructor.apply(this, arguments);
      }

      ServersCollection.prototype.model = ServerSettings;

      ServersCollection.prototype.local = true;

      ServersCollection.prototype.storeName = 'serverSettingsCollection';

      return ServersCollection;

    })(Backbone.Collection);
    couchPotatoServer = new ServerSettings({
      id: 'couchPotatoServerSettings',
      name: 'CouchPotato'
    });
    sickBeardServer = new ServerSettings({
      id: 'sickBeardServerSettings',
      name: 'SickBeard'
    });
    sabnzbdServer = new ServerSettings({
      id: 'sabnzbdServerSettings',
      name: 'SABnzbd'
    });
    defer = $.Deferred();
    collection = new ServersCollection();
    collection.fetch({
      success: function(collection, models, options) {
        var _ref;
        if (!models.length) {
          if ((_ref = jjs.ServerSettings) != null ? _ref.length : void 0) {
            collection.set(jjs.ServerSettings);
          } else {
            collection.set([couchPotatoServer, sickBeardServer, sabnzbdServer]);
          }
        }
        return defer.resolve(collection);
      }
    });
    NZBAppManager.reqres.setHandler('servers:entities', function() {
      return defer.promise();
    });
    NZBAppManager.reqres.setHandler('servers:entities:valid', function(server) {
      var valuePresent;
      valuePresent = function(value) {
        var _ref;
        return !!((_ref = collection.findWhere({
          name: server
        })) != null ? _ref.get(value) : void 0);
      };
      return valuePresent('token') && valuePresent('serverUrl');
    });
    NZBAppManager.reqres.setHandler('servers:entities:valid:any', function() {
      var valuePresent;
      valuePresent = function(value) {
        return !!collection.find(function(model) {
          return !!(model != null ? model.get(value) : void 0);
        });
      };
      return valuePresent('token') && valuePresent('serverUrl');
    });
    NZBAppManager.reqres.setHandler('servers:entities:settings', function() {
      return collection;
    });
    return NZBAppManager.reqres.setHandler('servers:entities:settings:get', function(server) {
      return collection.findWhere({
        name: server
      });
    });
  });

}).call(this);
