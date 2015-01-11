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
            imageLoaded = (e) -> $(@).parent().show()
            @$el.find('img')
                .on 'error', -> $(@).parent().remove()
                .on 'load', imageLoaded
                .each (i, img) -> if img.complete or img.naturalWidth then imageLoaded.call(@)
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
            @listenTo @collection, 'change reset sort', @render
            @render()

    class List.MoviesView extends NZBAppManager.GUI.List.FilterableList
        listClass: List.Movies
        initialize: ->
            @filtersCollection = NZBAppManager.request 'movies:sort_options'
            @on 'filter', @filter
            super
        setCollection: (collection) ->
            @listRegion.currentView?.setCollection new NZBAppManager.Entities.FilteredCollection
                collection: collection
                filterFunction: (criterion) ->
                    criterion = criterion.toLowerCase()
                    (model) ->
                        model.get('original_title').toLowerCase().indexOf(criterion) >= 0
            super collection
        filter: (term) =>
            collection = @listRegion.currentView?.collection
            collection.filter(term)
        sort: (sort_by) ->
            collection = @listRegion.currentView?.collection
            collection.comparator = sort_by
            collection.sort()
            @listRegion.currentView