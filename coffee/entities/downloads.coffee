# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
    Entities.Downloads = {}

    class Entities.DownloadsSlot extends Backbone.Model

    class Entities.DownloadsQueue extends Backbone.Collection
        model: Entities.DownloadsSlot
        fetch: (options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback'
                jsonpCallback: options.jsonpCallback or 'jjs.AppConfig.callback_func'
            super options

    getQueued = () ->
        defer = $.Deferred()

        downloads = new Entities.DownloadsQueue [], url: NZBAppManager.request('api:endpoint', 'SABnzbd', 'queue')
        downloads.fetch
            jsonpCallback: 'jjs.NZBAppManager.Entities.Downloads.onDownloadsList'

        Entities.Downloads.onDownloadsList = (response) -> 
            defer.resolve downloads.set(response.queue.slots)
        defer.promise()

    getHistory = () ->
        defer = $.Deferred()

        downloads = new Entities.DownloadsQueue [], url: NZBAppManager.request('api:endpoint', 'SABnzbd', 'history')
        downloads.fetch
            jsonpCallback: 'jjs.NZBAppManager.Entities.Downloads.onDownloadsHistory'

        Entities.Downloads.onDownloadsHistory = (response) -> 
            defer.resolve downloads.set(response.history.slots)
        defer.promise()

    NZBAppManager.reqres.setHandler 'downloads:queue:list', ->
        getQueued()
    NZBAppManager.reqres.setHandler 'downloads:history:list', ->
        getHistory()