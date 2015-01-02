# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
    class Entities.DownloadsSlot extends Backbone.Model
        idAttribute: 'nzo_id'

    class Entities.DownloadsQueue extends Backbone.Collection
        model: Entities.DownloadsSlot
        parse: (response) ->
            if response?.history?.slots
                super response.history?.slots
            else
                super response.queue?.slots
        sync: (method, collection, options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback'
            super method, collection, options

    downloads = null
    downloadsHistory = null
    downloadsTabs = null
    shouldPing = false
    pingInterval = 5000

    doPing = ->
        downloads?.fetch 
            success: (collection, response, options) ->
                downloads.response = response
                checkPing()

    checkPing = ->
        if shouldPing then setTimeout doPing, pingInterval

    getQueued = ->
        defer = $.Deferred()
        if not downloads
            downloads = new Entities.DownloadsQueue []
            downloads.url = NZBAppManager.request('api:endpoint', 'SABnzbd', 'queue')
            downloads.fetch
                success: (collection, response, options) ->
                    downloads.response = response
                    defer.resolve downloads
                    shouldPing = true
                    if response.queue?.refresh_rate
                        pingInterval = parseInt(response.queue?.refresh_rate) * 1000
                    checkPing()
        else
            _.defer -> defer.resolve downloads
        defer.promise()

    getHistory = () ->
        defer = $.Deferred()
        if not downloadsHistory
            downloadsHistory = new Entities.DownloadsQueue []
            downloadsHistory.url = downloadsHistory.storeName = NZBAppManager.request('api:endpoint', 'SABnzbd', 'history')
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

    pauseQueue = ->
        defer = $.ajax NZBAppManager.request('api:endpoint', 'SABnzbd', 'pause'),
            dataType: 'jsonp'
            jsonp: 'callback'
        defer.promise()

    resumeQueue = ->
        defer = $.ajax NZBAppManager.request('api:endpoint', 'SABnzbd', 'resume'),
            dataType: 'jsonp'
            jsonp: 'callback'
        defer.promise()

    performActionOnItem = (id, action, mode) ->
        defer = $.ajax NZBAppManager.request('api:endpoint', 'SABnzbd', mode),
            dataType: 'jsonp'
            jsonp: 'callback'
            data:
                name: action
                value: id
        defer.promise()

    NZBAppManager.reqres.setHandler 'downloads:queue:entities', ->
        getQueued()
    NZBAppManager.reqres.setHandler 'downloads:history:entities', ->
        getHistory()
    NZBAppManager.reqres.setHandler 'downloads:tabs:entities', ->
        if not downloadsTabs then getTabs()
        downloadsTabs
    NZBAppManager.reqres.setHandler 'downloads:queue:pause', ->
        pauseQueue()
    NZBAppManager.reqres.setHandler 'downloads:queue:resume', ->
        resumeQueue()
    NZBAppManager.commands.setHandler 'downloads:queue:item', (id, action) ->
        performActionOnItem(id, action, 'queue')
    NZBAppManager.commands.setHandler 'downloads:history:item', (id, action) ->
        performActionOnItem(id, action, 'history')