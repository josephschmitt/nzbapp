# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'MoviesApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    class List.Movie extends Marionette.ItemView
        template: '#movie-list-template'
        className: 'movie-list-item'
        ui:
            add: '.add-item-button'
            remove: '.remove-item-button'
        events:
            'click @ui.add': 'addMovie'
            'click @ui.remove': 'removeMovie'
        render: ->
            super
            @$el.find('img').on 'error', ->
                $(@).parent().remove()
        addMovie: (e) ->
            e?.preventDefault()
            List.Controller.addMovie @model
        removeMovie: (e) ->
            e?.preventDefault()
            List.Controller.removeMovie @model
    
    class List.Movies extends Marionette.CollectionView
        childView: List.Movie
        className: 'movies-list'
        emptyView: NZBAppManager.GUI.List.NoResults
        initialize: ->
            super
            if @collection then @setCollection @collection
        setCollection: (collection) ->
            @collection = collection
            @listenTo @collection, 'change', @render
            @render()