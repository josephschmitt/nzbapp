# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
    parseUTCDate = (dateString) ->
        if dateString
            dateParts = dateString.split '-'
            return new Date(+dateParts[0], --dateParts[1], +dateParts[2])
        else
            return ''

    class Entities.ShowResult extends Backbone.Model
        parse: (response, options) ->
            console.log 'parse response', response
            response = _.pick (if response.info? then response.info else response), [
                'name'
                'show_name'
                'network'
                'first_aired'
                'status'
            ]
            response.first_aired = parseUTCDate(response.first_aired)
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
        parse: (response, options) ->
            if response.data
                if response.data?.results
                    super response.data.results, options
                else 
                    super _.toArray(response.data), options
            else
                super response, options
        sync: (method, model, options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback'
            super

    class Entities.ShowSearchResults extends Entities.ShowResults
        parse: (response, options) ->
            if response.data?.results
                super response.data.results, options
            else
                super response, options

    class Entities.UpcomingEpisode extends Backbone.Model
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

    class Entities.UpcomingEpisodes extends Backbone.Collection
        model: Entities.UpcomingEpisode
        parse: (response, options) ->
            super response.data?.later, options
        sync: (method, model, options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback'
            super

    shows = null
    upcoming = null
    showsTabs = null

    getShowSearchResults = (term) ->
        defer = $.Deferred()
        showSearchResults = new Entities.ShowSearchResults []
        showSearchResults.url = NZBAppManager.request('api:endpoint', 'SickBeard', 'sb.searchtvdb')
        showSearchResults.fetch
            data: name: term
            success: ->
                defer.resolve showSearchResults
        defer.promise()

    getShows = () ->
        defer = $.Deferred()
        if not shows
            shows = new Entities.ShowResults []
            shows.url = shows.storeName = NZBAppManager.request('api:endpoint', 'SickBeard', 'shows')
            shows.fetch
                success: ->
                    # Save results to localStorage
                    shows.each (show) -> show?.save()
                    defer.resolve shows
        else
            _.defer -> defer.resolve shows
        defer.promise()

    getUpcomingEpisodes = () ->
        defer = $.Deferred()
        if not upcoming
            upcoming = new Entities.UpcomingEpisodes []
            upcoming.url = upcoming.storeName = NZBAppManager.request('api:endpoint', 'SickBeard', 'future')
            upcoming.fetch
                success: ->
                    # Save results to localStorage
                    upcoming.each (show) -> show?.save()
                    defer.resolve upcoming
        else
            _.defer -> defer.resolve upcoming
        defer.promise()

    getShow = (tvdbid) ->
        defer = $.Deferred()
        show = new Entities.ShowResult {}
        show.url = NZBAppManager.request('api:endpoint', 'SickBeard', 'show')
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

    getTabs = ->
        showsTabs = new Backbone.Collection [
            { name: 'Shows', url: 'wanted', trigger: 'shows:wanted:list' }
            { name: 'Upcoming', url: 'upcoming', trigger: 'shows:upcoming:list' }
        ]

    NZBAppManager.reqres.setHandler 'shows:search', (term) ->
        getShowSearchResults(term)

    NZBAppManager.reqres.setHandler 'shows:list:entities', ->
        getShows()

    NZBAppManager.reqres.setHandler 'shows:upcoming:entities', ->
        getUpcomingEpisodes()

    NZBAppManager.reqres.setHandler 'show:info', (tvdbid) ->
        getShow(tvdbid)

    NZBAppManager.reqres.setHandler 'show:add', (show) ->
        addShow(show)

    NZBAppManager.reqres.setHandler 'shows:tabs:entities', ->
        if not showsTabs then getTabs()
        showsTabs