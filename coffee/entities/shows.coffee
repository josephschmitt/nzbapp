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
                'tvdbid'
                'next_ep_airdate'
            ]
            response.first_aired = if response.first_aired then moment(response.first_aired).format('ddd MMM Do, YYYY') else null
            response.poster = "#{NZBAppManager.request('api:endpoint', 'SickBeard', 'show.getposter')}&tvdbid=#{response.tvdbid}"
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
        comparator: 'show_name'
        model: Entities.ShowResult
        parse: (response, options) ->
            if response.data
                if response.data?.results
                    super response.data.results, options
                else 
                    super _.toArray(response.data), options
            else if response.length
                super response, options
            else
                super [], options
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
        parse: (response, options) ->
            response.poster = "#{NZBAppManager.request('api:endpoint', 'SickBeard', 'show.getposter')}&tvdbid=#{response.tvdbid}"
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

    removeShow = (show) ->
        if shows then shows.remove show
        
        defer = $.ajax NZBAppManager.request('api:endpoint', 'SickBeard', 'show.delete'),
            dataType: 'jsonp'
            jsonp: 'callback'
            data:
                tvdbid: show.get 'tvdbid'
        # defer = $.Deferred()
        defer.promise()

    getSortOptions = ->
        new Backbone.Collection [
            {title: 'Name', active: true, trigger: 'shows:sort', name: 'show_name'}
            {title: 'Status', trigger: 'shows:sort', name: 'status'}
            {title: 'Latest', trigger: 'shows:sort', name: 'next_ep_airdate'}
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

    NZBAppManager.reqres.setHandler 'show:remove', (show) ->
        removeShow(show)

    NZBAppManager.reqres.setHandler 'shows:sort_options', ->
        getSortOptions()