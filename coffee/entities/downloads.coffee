# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
    class Entities.DownloadsSlot extends Backbone.Model

    class Entities.DownloadsQueue extends Backbone.Collection
        model: Entities.DownloadsSlot
        parse: (response) ->
            if response?.history?.slots
                return response.history?.slots
            else
                return response.queue?.slots
        sync: (method, model, options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback'
            super

    downloads = null
    downloadsHistory = null
    downloadsTabs = null
    deferredPing = null
    shouldPing = false

    getQueued = () ->
        defer = $.Deferred()
        if not downloads
            downloads = new Entities.DownloadsQueue []
            downloads.url = NZBAppManager.request('api:endpoint', 'SABnzbd', 'queue')
            downloads.fetch
                success: ->
                    defer.resolve downloads
        else
            _.defer -> defer.resolve downloads
        defer.promise()

    pingQueue = () ->
        deferredPing = deferredPing or $.Deferred()
        deferredPing.done ->
            shouldPing = false
            deferredPing = null

        downloads = new Entities.DownloadsQueue []
        downloads.url = NZBAppManager.request('api:endpoint', 'SABnzbd', 'queue')

        doPing = ->
            downloads.fetch
                success: (collection, response, options) ->
                    deferredPing.notify downloads, response.queue
                    if shouldPing then setTimeout doPing, 1000

        shouldPing = true
        doPing()
        deferredPing

    getHistory = () ->
        defer = $.Deferred()
        if not downloadsHistory
            downloadsHistory = new Entities.DownloadsQueue []
            downloadsHistory.url = NZBAppManager.request('api:endpoint', 'SABnzbd', 'history')
            downloadsHistory.fetch
                success: ->
                    defer.resolve downloadsHistory
        else
            _.defer -> defer.resolve downloadsHistory
        defer.promise()

    getTabs = ->
        downloadsTabs = new Backbone.Collection [
            { name: 'Queue', url: 'queue', trigger: 'downloads:queue:list' }
            { name: 'History', url: 'history', trigger: 'downloads:history:list' }
        ]

    NZBAppManager.reqres.setHandler 'downloads:queue:entities', ->
        getQueued()
    NZBAppManager.reqres.setHandler 'downloads:queue:ping:entities', ->
        pingQueue()
    NZBAppManager.reqres.setHandler 'downloads:history:entities', ->
        getHistory()
    NZBAppManager.reqres.setHandler 'downloads:tabs:entities', ->
        if not downloadsTabs then getTabs()
        downloadsTabs