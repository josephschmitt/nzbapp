# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ShowsApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    class List.Show extends Marionette.ItemView
        template: '#show-list-template'
        className: 'show-list-item'
        ui:
            add: '.add-item-button'
            remove: '.remove-item-button'
        events:
            'click @ui.add': 'addShow'
            'click @ui.remove': 'removeShow'
        render: ->
            super
            imageLoaded = (e) -> $(@).parent().show()
            @$el.find('img')
                .on 'error', -> $(@).parent().remove()
                .on 'load', imageLoaded
                .each (i, img) -> if img.complete or img.naturalWidth then imageLoaded.call(@)
        addShow: (e) ->
            e?.preventDefault()
            List.Controller.addShow @model
        removeShow: (e) ->
            e?.preventDefault()
            List.Controller.removeShow @model
    
    class List.Shows extends Marionette.CollectionView
        childView: List.Show
        className: 'shows-list'
        emptyView: NZBAppManager.GUI.List.NoResults
        initialize: ->
            super
            if @collection then @setCollection @collection
        setCollection: (collection) ->
            @collection = collection
            @listenTo @collection, 'change reset sort', @render
            @render()

    class List.ShowsView extends NZBAppManager.GUI.List.FilterableList
        listClass: List.Shows
        initialize: ->
            @filtersCollection = NZBAppManager.request 'shows:sort_options'
            @on 'filter', @filter
            super
        setCollection: (collection) ->
            @listRegion.currentView?.setCollection new NZBAppManager.Entities.FilteredCollection
                collection: collection
                filterFunction: (criterion) ->
                    criterion = criterion.toLowerCase()
                    (model) ->
                        model.get('show_name').toLowerCase().indexOf(criterion) >= 0
            super
        filter: (term) =>
            collection = @listRegion.currentView?.collection
            collection.filter(term)
        sort: (sort_by) ->
            collection = @listRegion.currentView?.collection
            collection.comparator = sort_by
            collection.sort()
            @listRegion.currentView

    class List.UpcomingShow extends List.Show
        template: '#show-upcoming-template'

    class List.UpcomingShows extends List.Shows
        childView: List.UpcomingShow

    class List.UpcomingShowsView extends List.ShowsView