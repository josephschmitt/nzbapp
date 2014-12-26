# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
    class ServerSettings extends Backbone.Model

    class ServersCollection extends Backbone.Collection
        model: ServerSettings
        local: true
        storeName: 'serverSettingsCollection'

    couchPotatoServer = new ServerSettings
        id: 'couchPotatoServerSettings'
        name: 'CouchPotato'
    sickBeardServer = new ServerSettings
        id: 'sickBeardServerSettings'
        name: 'SickBeard'
    sabnzbdServer = new ServerSettings
        id: 'sabnzbdServerSettings'
        name: 'SABnzbd'

    defer = $.Deferred()
    
    collection = new ServersCollection()
    collection.fetch
        success: (collection, models, options) ->
            if not models.length
                collection.set [couchPotatoServer, sickBeardServer, sabnzbdServer]
            defer.resolve collection

    NZBAppManager.reqres.setHandler 'servers:entities', ->
        defer.promise()

    NZBAppManager.reqres.setHandler 'servers:entities:valid', (server) ->
        valuePresent = (value) -> 
            !!collection.findWhere(name: server)?.get(value)
        valuePresent('token') and valuePresent('serverUrl')

    NZBAppManager.reqres.setHandler 'servers:entities:valid:any', ->
        valuePresent = (value) ->
            !!collection.find (model) -> !!model?.get(value)
        valuePresent('token') and valuePresent('serverUrl')

    NZBAppManager.reqres.setHandler 'servers:entities:settings', ->
        collection

    NZBAppManager.reqres.setHandler 'servers:entities:settings:get', (server) ->
        collection.findWhere name: server