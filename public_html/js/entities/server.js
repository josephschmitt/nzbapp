(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var js;
    js = window.js = window.js || {};
    return js.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
      var ServerSettings, collection, couchPotatoServer, sickBeardServer;
      ServerSettings = (function(_super) {
        __extends(ServerSettings, _super);

        function ServerSettings() {
          return ServerSettings.__super__.constructor.apply(this, arguments);
        }

        ServerSettings.prototype.model = Backbone.Model;

        ServerSettings.prototype.localStorage = new Backbone.LocalStorage('js.NZBApplication.Entities.ServerSettings');

        return ServerSettings;

      })(Backbone.Collection);
      couchPotatoServer = new Backbone.Model({
        id: 'couchPotatoServerSettings',
        serverName: 'CouchPotato'
      });
      sickBeardServer = new Backbone.Model({
        id: 'sickBeardServerSettings',
        serverName: 'SickBeard'
      });
      collection = new ServerSettings([couchPotatoServer, sickBeardServer]);
      collection.sync('read', collection, {
        success: function(models) {
          return collection.set(models, {
            merge: true,
            add: false,
            remove: false
          });
        }
      });
      NZBAppManager.reqres.setHandler('server:settings:has', function() {
        var valuePresent;
        valuePresent = function(value) {
          return !!collection.find(function(model) {
            return !!model.get(value);
          });
        };
        return valuePresent('token') && valuePresent('serverUrl');
      });
      NZBAppManager.reqres.setHandler('server:settings:get', function() {
        return collection;
      });
      NZBAppManager.commands.setHandler('server:settings:set', function(settings) {
        if (settings) {
          collection.reset(settings.models);
        }
        return collection.sync('create', collection);
      });
      NZBAppManager.reqres.setHandler('server:url:get', function(server) {
        switch (server) {
          case 'CouchPotato':
            return couchPotatoServer.get('serverUrl');
          case 'SickBeard':
            return sickBeardServer.get('serverUrl');
        }
      });
      return NZBAppManager.reqres.setHandler('server:token:get', function(server) {
        switch (server) {
          case 'CouchPotato':
            return couchPotatoServer.get('token');
          case 'SickBeard':
            return sickBeardServer.get('token');
        }
      });
    });
  })();

}).call(this);
