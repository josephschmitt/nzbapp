# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
    class Entities.MovieResult extends Backbone.Model
        parse: (response, options) ->
            response = _.pick (if response.info? then response.info else response), [
                'original_title'
                'runtime'
                'tagline'
                'title'
                'tmdb_id'
                'year'
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
                jsonp: 'callback_func'
            super method, model, options

    class Entities.MovieResults extends Backbone.Collection
        model: Entities.MovieResult
        storeName: 'Entities.MovieResults'
        parse: (response) ->
            if response.movies
                response.movies
            else
                response
        sync: (method, model, options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback_func'
            super

    movies = null

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
            movies = new Entities.MovieResults []
            movies.url = NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.list')
            movies.fetch
                success: ->
                    # Save results to localStorage
                    movies.each (movie) -> movie?.save()
                    defer.resolve movies
        else
            _.defer -> defer.resolve movies
        defer.promise()

    addMovie = (movie) ->
        defer = $.ajax NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.add'),
            dataType: 'jsonp'
            jsonp: 'callback_func'
            data:
                title: movie?.get 'title'
                identifier: movie?.get 'imdb'
        defer.promise()

    NZBAppManager.reqres.setHandler 'movies:search', (term) ->
        getMovieSearchResults(term)

    NZBAppManager.reqres.setHandler 'movies:list', ->
        getMovies()

    NZBAppManager.reqres.setHandler 'movies:add', (movie) ->
        addMovie(movie)