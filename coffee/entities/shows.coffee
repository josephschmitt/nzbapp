# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
    class Entities.ShowResult extends Backbone.Model
        parse: (response, options) ->
            response = _.pick (if response.info? then response.info else response), [
                'name'
                'show_name'
                'network'
                'first_aired'
                'status'
            ]
            super response, options
        sync: (method, model, options={}) ->
            # Don't try to save to the server, just to localStorage
            if method in ['create', 'update']
                @local = true
            else
                @local = undefined
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback'
            super method, model, options

    class Entities.ShowResults extends Backbone.Collection
        model: Entities.ShowResult
        storeName: 'Entities.ShowResults'
        parse: (response) ->
            if response.data
                if response.data?.results
                    return response.data.results
                else 
                    return _.toArray(response.data)
            else
                return response
        sync: (method, model, options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback'
            super

    shows = null

    getShowSearchResults = (term) ->
        defer = $.Deferred()
        showSearchResults = new Entities.ShowResults [], url: NZBAppManager.request('api:endpoint', 'SickBeard', 'sb.searchtvdb')
        showSearchResults.fetch
            data: name: term
            success: ->
                defer.resolve showSearchResults
        defer.promise()

    getShows = () ->
        defer = $.Deferred()
        if not shows
            shows = new Entities.ShowResults [], url: NZBAppManager.request('api:endpoint', 'SickBeard', 'shows')
            shows.fetch
                success: ->
                    # Save results to localStorage
                    shows.each (show) -> show?.save()
                    defer.resolve shows
        else
            _.defer -> defer.resolve shows
        defer.promise()

    getShow = (tvdbid) ->
        defer = $.Deferred()
        show = new Entities.ShowResult {}, url: NZBAppManager.request('api:endpoint', 'SickBeard', 'show')
        show.fetch
            data: tvdbid: tvdbid
            success: ->
                defer.resolve show
        defer.promise()

    addShow = (show) ->
        defer = $.ajax NZBAppManager.request('api:endpoint', 'SickBeard', 'show.addnew'),
            dataType: 'jsonp'
            jsonp: 'callback'
            data:
                tvdbid: show.get 'tvdbid'
        defer.promise()

    NZBAppManager.reqres.setHandler 'shows:search', (term) ->
        getShowSearchResults(term)

    NZBAppManager.reqres.setHandler 'shows:list', ->
        getShows()

    NZBAppManager.reqres.setHandler 'show:info', (tvdbid) ->
        getShow(tvdbid)

    NZBAppManager.reqres.setHandler 'show:add', (show) ->
        addShow(show)