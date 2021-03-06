# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
    class Entities.MovieResult extends Backbone.Model
        parse: (response, options) ->
            resp = _.pick (if response.info? then response.info else response), [
                'images'
                'imdb'
                'in_wanted'
                'original_title'
                'released'
                'runtime'
                'tagline'
                'title'
                'tmdb_id'
                'year'
            ]
            resp._id = resp.id = response._id
            resp.in_wanted = !!resp.in_wanted or response.status == 'active'
            resp
        sync: (method, model, options={}) ->
            # Don't try to save to the server, just to localStorage
            if method in ['create', 'update']
                @local = true
            else
                @local = undefined
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback_func'
            super method, model, options

    class Entities.MovieResults extends Backbone.Collection
        model: Entities.MovieResult
        parse: (response, options) ->
            if response.movies
                super response.movies, options
            else if response.length
                super response, options
            else
                super [], options
        sync: (method, model, options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback_func'
            super

    class Entities.WantedMovies extends Entities.MovieResults
        comparator: 'original_title'
        sync: (method, model, options={}) ->
            options = _.extend options, 
                data: status: 'active'
            super

    movies = null
    soon = null

    getMovieSearchResults = (term) ->
        defer = $.Deferred()
        movieSearchResults = new Entities.MovieResults []
        movieSearchResults.url = NZBAppManager.request('api:endpoint', 'CouchPotato', 'search')
        movieSearchResults.fetch
            data:
                q: term
                type: 'movies'
            success: ->
                defer.resolve movieSearchResults
        defer.promise()

    getMovies = () ->
        defer = $.Deferred()
        if not movies
            movies = new Entities.WantedMovies []
            movies.url = movies.storeName = NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.list')
            movies.fetch
                success: ->
                    # Save results to localStorage
                    movies.each (movie) -> movie?.save()
                    defer.resolve movies
        else
            _.defer -> defer.resolve movies
        defer.promise()

    getComingSoon = () ->
        defer = $.Deferred()
        if not soon
            soon = new Entities.WantedMovies []
            soon.url = soon.storeName = NZBAppManager.request('api:endpoint', 'CouchPotato', 'dashboard.soon')
            soon.comparator = 'released'
            soon.fetch
                data:
                    status: 'active'
                success: ->
                    # Save results to localStorage
                    soon.each (movie) -> 
                        movie.set 'year', moment(movie.get('released')).format('ddd MMM Do, YYYY')
                        movie?.save()
                    defer.resolve soon
        else
            _.defer -> defer.resolve soon
        defer.promise()

    addMovie = (movie) ->
        defer = $.ajax NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.add'),
            dataType: 'jsonp'
            jsonp: 'callback_func'
            data:
                title: movie?.get 'title'
                identifier: movie?.get 'imdb'
            complete: (xhr) ->
                movie.set 'in_wanted', true
                if movies then movies.add new Entities.MovieResult(Entities.MovieResult.prototype.parse(xhr.responseJSON.movie))
        defer.promise()

    removeMovie = (movie) ->
        if movies then movies.remove movie
        defer = $.ajax NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.delete'),
            dataType: 'jsonp'
            jsonp: 'callback_func'
            data:
                id: movie?.get '_id'
        defer.promise()

    getSortOptions = ->
        new Backbone.Collection [
            {title: 'Title', active: true, trigger: 'movies:sort', name: 'original_title'}
            {title: 'Release Date', trigger: 'movies:sort', name: 'released'}
        ]

    NZBAppManager.reqres.setHandler 'movies:search', (term) ->
        getMovieSearchResults(term)

    NZBAppManager.reqres.setHandler 'movies:list', ->
        getMovies()

    NZBAppManager.reqres.setHandler 'movies:soon', ->
        getComingSoon()

    NZBAppManager.reqres.setHandler 'movies:add', (movie) ->
        addMovie(movie)

    NZBAppManager.reqres.setHandler 'movies:remove', (movie) ->
        removeMovie(movie)

    NZBAppManager.reqres.setHandler 'movies:sort_options', ->
        getSortOptions()