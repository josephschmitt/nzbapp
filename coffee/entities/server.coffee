do ->
    # `js` is our namespace. Everything should be in `js` to avoid name conflicts.
    js = window.js = (window.js or {})

    js.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
        class ServerSettings extends Backbone.Collection
            model: Backbone.Model
            localStorage: new Backbone.LocalStorage 'js.NZBApplication.Entities.ServerSettings'
            
        couchPotatoServer = new Backbone.Model
            id: 'couchPotatoServerSettings'
            serverName: 'CouchPotato'
        sickBeardServer = new Backbone.Model
            id: 'sickBeardServerSettings'
            serverName: 'SickBeard'

        collection = new ServerSettings([couchPotatoServer, sickBeardServer])
        collection.sync 'read', collection, 
            success: (models) -> 
                collection.set models, merge: true, add: false, remove: false

        NZBAppManager.reqres.setHandler 'server:settings:has', ->
            valuePresent = (value) ->
                !!collection.find (model) -> !!model.get(value)
            return valuePresent('token') and valuePresent('serverUrl')

        NZBAppManager.reqres.setHandler 'server:settings:get', ->
            return collection

        NZBAppManager.commands.setHandler 'server:settings:set', (settings) ->
            if settings then collection.reset settings.models
            collection.sync('create', collection)

        # Server Url
        NZBAppManager.reqres.setHandler 'server:url:get', (server) ->
            switch server
                when 'CouchPotato' then return couchPotatoServer.get 'serverUrl'
                when 'SickBeard' then return sickBeardServer.get 'serverUrl'

        # Token
        NZBAppManager.reqres.setHandler 'server:token:get', (server) ->
            switch server
                when 'CouchPotato' then return couchPotatoServer.get 'token'
                when 'SickBeard' then return sickBeardServer.get 'token'