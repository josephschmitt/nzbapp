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
            'click @ui.remove': 'removeMovie'
        addShow: (e) ->
            e?.preventDefault()
            List.Controller.addShow @model
        emoveMovie: (e) ->
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
            @listenTo @collection, 'change', @render
            @render()

    class List.UpcomingShow extends List.Show
        template: '#show-upcoming-template'

    class List.UpcomingShows extends List.Shows
        childView: List.UpcomingShow