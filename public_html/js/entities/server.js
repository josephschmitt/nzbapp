(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var js;
    js = window.js = window.js || {};
    return js.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
      var CPSettingsModel, SBSettingsModel, ServerSettingsCollection, collection, couchPotatoServer, sickBeardServer;
      ServerSettingsCollection = (function(_super) {
        __extends(ServerSettingsCollection, _super);

        function ServerSettingsCollection() {
          return ServerSettingsCollection.__super__.constructor.apply(this, arguments);
        }

        return ServerSettingsCollection;

      })(js.LocalStorageModel);
      CPSettingsModel = (function(_super) {
        __extends(CPSettingsModel, _super);

        function CPSettingsModel() {
          return CPSettingsModel.__super__.constructor.apply(this, arguments);
        }

        CPSettingsModel.prototype.defaults = {
          id: 'couchPotatoServerSettings',
          serverName: 'CouchPotato'
        };

        CPSettingsModel.prototype.localStorage = new Backbone.LocalStorage('js.NZBApplication.Entities.ServerSettings');

        return CPSettingsModel;

      })(ServerSettingsCollection);
      SBSettingsModel = (function(_super) {
        __extends(SBSettingsModel, _super);

        function SBSettingsModel() {
          return SBSettingsModel.__super__.constructor.apply(this, arguments);
        }

        SBSettingsModel.prototype.defaults = {
          id: 'sickBeardServerSettings',
          serverName: 'SickBeard'
        };

        SBSettingsModel.prototype.localStorage = new Backbone.LocalStorage('js.NZBApplication.Entities.ServerSettings');

        return SBSettingsModel;

      })(ServerSettingsCollection);
      couchPotatoServer = new CPSettingsModel();
      sickBeardServer = new SBSettingsModel();
      collection = new Backbone.Collection([couchPotatoServer, sickBeardServer]);
      Entities.collection = collection;
      console.log('Entities.collection', collection);
      NZBAppManager.reqres.setHandler('server:settings:get', function() {
        var valuePresent;
        valuePresent = function(value) {
          return !!collection.find(function(model) {
            return !!model.get(value);
          });
        };
        if (valuePresent('token') && valuePresent('url')) {
          return collection.filter(function(model) {
            return !!model.get('token') || !!model.get('url');
          });
        } else {
          return null;
        }
      });
      NZBAppManager.reqres.setHandler('server:settings:getAll', function() {
        return collection;
      });
      NZBAppManager.commands.setHandler('server:url:set', function(server, serverUrl) {
        switch (server) {
          case 'CouchPotato':
            return couchPotatoServer.set('serverUrl', serverUrl);
          case 'SickBeard':
            return sickBeardServer.set('serverUrl', serverUrl);
        }
      });
      NZBAppManager.reqres.setHandler('server:url:get', function(server) {
        switch (server) {
          case 'CouchPotato':
            return couchPotatoServer.get('serverUrl');
          case 'SickBeard':
            return sickBeardServer.get('serverUrl');
        }
      });
      NZBAppManager.commands.setHandler('server:token:set', function(server, token) {
        switch (server) {
          case 'CouchPotato':
            return couchPotatoServer.set('token', token);
          case 'SickBeard':
            return sickBeardServer.set('token', token);
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
