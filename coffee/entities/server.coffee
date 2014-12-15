do ->
    # `js` is our namespace. Everything should be in `js` to avoid name conflicts.
    js = window.js = (window.js or {})

    js.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
        class ServerSettingsCollection extends js.LocalStorageModel
            
        class CPSettingsModel extends ServerSettingsCollection
            defaults:
                id: 'couchPotatoServerSettings'
                serverName: 'CouchPotato'
            localStorage: new Backbone.LocalStorage 'js.NZBApplication.Entities.ServerSettings'
        class SBSettingsModel extends ServerSettingsCollection
            defaults:
                id: 'sickBeardServerSettings'
                serverName: 'SickBeard'
            localStorage: new Backbone.LocalStorage 'js.NZBApplication.Entities.ServerSettings'
            
        couchPotatoServer = new CPSettingsModel()
        sickBeardServer = new SBSettingsModel()

        collection = new Backbone.Collection [couchPotatoServer, sickBeardServer]
        Entities.collection = collection
        console.log 'Entities.collection', collection

        NZBAppManager.reqres.setHandler 'server:settings:get', ->
            valuePresent = (value) ->
                !!collection.find (model) -> !!model.get(value)
            if valuePresent('token') and valuePresent('url')
                return collection.filter (model) -> !!model.get('token') or !!model.get('url')
            else 
                null

        NZBAppManager.reqres.setHandler 'server:settings:getAll', ->
            return collection

        # Server Url
        NZBAppManager.commands.setHandler 'server:url:set', (server, serverUrl) ->
            switch server
                when 'CouchPotato' then couchPotatoServer.set 'serverUrl', serverUrl
                when 'SickBeard' then sickBeardServer.set 'serverUrl', serverUrl
        NZBAppManager.reqres.setHandler 'server:url:get', (server) ->
            switch server
                when 'CouchPotato' then return couchPotatoServer.get 'serverUrl'
                when 'SickBeard' then return sickBeardServer.get 'serverUrl'

        # Token
        NZBAppManager.commands.setHandler 'server:token:set', (server, token) ->
            switch server
                when 'CouchPotato' then couchPotatoServer.set 'token', token
                when 'SickBeard' then sickBeardServer.set 'token', token
        NZBAppManager.reqres.setHandler 'server:token:get', (server) ->
            switch server
                when 'CouchPotato' then return couchPotatoServer.get 'token'
                when 'SickBeard' then return sickBeardServer.get 'token'