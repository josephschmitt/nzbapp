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

    NZBAppManager.reqres.setHandler 'downloads:queue:list', ->
        getQueued()
    NZBAppManager.reqres.setHandler 'downloads:history:list', ->
        getHistory()