# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'MoviesApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    class List.Movie extends Marionette.ItemView
        template: '#movie-list-template'
        # tagName: 'li'
        className: 'row'
    
    class List.Movies extends Marionette.CollectionView
        childView: List.Movie
        # tagName: 'ul'
        className: 'movies-list'
        initialize: ->
            super
            if @collection then @setCollection @collection
        setCollection: (collection) ->
            @collection = collection
            @listenTo @collection, 'change', @render
            @render()
