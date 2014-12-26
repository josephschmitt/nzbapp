# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
    Entities.Movies = {}

    class Entities.MovieResult extends Backbone.Model
        idAttribute: '_id'
        set: (attributes, options) ->
            if attributes.info
                super(attributes.info, options) 
            else
                super(attributes, options)

    class Entities.MovieResults extends Backbone.Collection
        model: Entities.MovieResult
        fetch: (options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback_func'
                jsonpCallback: options.jsonpCallback or 'jjs.AppConfig.callback_func'
            super options

    getMovieSearchResults = (term) ->
        defer = $.Deferred()

        movies = new Entities.MovieResults [], url: NZBAppManager.request('api:endpoint', 'CouchPotato', 'search')
        movies.fetch
            jsonpCallback: 'jjs.NZBAppManager.Entities.Movies.onMoviesSearch'
            data:
                q: term
                type: 'movies'

        Entities.Movies.onMoviesSearch = (response) -> 
            defer.resolve movies.set(response.movies)
        defer.promise()

    getMovies = () ->
        defer = $.Deferred()

        movies = new Entities.MovieResults [], url: NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.list')
        movies.fetch
            jsonpCallback: 'jjs.NZBAppManager.Entities.Movies.onMoviesList'

        Entities.Movies.onMoviesList = (response) -> 
            defer.resolve movies.set(response.movies)
        defer.promise()


    NZBAppManager.reqres.setHandler 'movies:search', (term) ->
        getMovieSearchResults(term)

    NZBAppManager.reqres.setHandler 'movies:list', ->
        getMovies()