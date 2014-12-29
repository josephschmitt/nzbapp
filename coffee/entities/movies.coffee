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
        parse: (response) ->
            response.movies
        sync: (method, model, options) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback_func'
            super

    getMovieSearchResults = (term) ->
        defer = $.Deferred()
        movies = new Entities.MovieResults [], url: NZBAppManager.request('api:endpoint', 'CouchPotato', 'search')
        movies.fetch
            data:
                q: term
                type: 'movies'
            success: ->
                defer.resolve movies
        defer.promise()

    getMovies = () ->
        defer = $.Deferred()
        movies = new Entities.MovieResults [], url: NZBAppManager.request('api:endpoint', 'CouchPotato', 'movie.list')
        movies.fetch
            success: ->
                defer.resolve movies
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