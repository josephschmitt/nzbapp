(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var ServerSettings, ServersCollection, collection, couchPotatoServer, defer, sickBeardServer;
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

      ServersCollection.prototype.id = 'serverSettingsCollection';

      ServersCollection.prototype.model = ServerSettings;

      ServersCollection.prototype.localStorage = new Backbone.LocalStorage('serverSettingsCollection');

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
    defer = $.Deferred();
    collection = new ServersCollection([couchPotatoServer, sickBeardServer]);
    collection.sync('read', collection, {
      error: function() {
        return defer.resolve(collection);
      },
      success: function(models) {
        collection.set(models, {
          merge: true,
          add: false,
          remove: false
        });
        return defer.resolve(collection);
      }
    });
    NZBAppManager.reqres.setHandler('servers:entities', function() {
      return defer.promise();
    });
    return NZBAppManager.reqres.setHandler('servers:entities:valid', function() {
      var valuePresent;
      valuePresent = function(value) {
        return !!collection.find(function(model) {
          return !!model.get(value);
        });
      };
      return valuePresent('token') && valuePresent('serverUrl');
    });
  });

}).call(this);
