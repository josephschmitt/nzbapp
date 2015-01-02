# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ShowsApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    class List.Show extends Marionette.ItemView
        template: '#show-list-template'
        className: 'show-list-item'
        ui:
            add: '.add-item-button'
        events:
            'click @ui.add': 'addShow'
        addShow: (e) ->
            e?.preventDefault()
            List.Controller.addShow @model
    
    class List.Shows extends Marionette.CollectionView
        childView: List.Show
        className: 'shows-list'
        initialize: ->
            super
            if @collection then @setCollection @collection
        setCollection: (collection) ->
            @collection = collection
            @listenTo @collection, 'change', @render
            @render()
    

    class List.ShowsView extends Marionette.LayoutView
        template: '#shows-template'
        regions:
            tabsRegion: '#shows-tabs-region'
            contentRegion: '#shows-list-region'
        render: ->
            super
            @tabsRegion.show new NZBAppManager.GUI.Tabs.TabsView 
                collection: NZBAppManager.request 'shows:tabs:entities'
                className: 'tabs small text-center shows-tabs'
        setCollection: (collection, type) ->
            view = new List.Shows collection: collection
            @contentRegion.show view
            @setTab type
        setTab: (tabUrl) ->
            collection = @tabsRegion.currentView.collection
            collection.findWhere(active: true)?.set 'active', false
            collection.findWhere(url: tabUrl)?.set 'active', true

    class List.UpcomingShow extends List.Show
        template: '#show-upcoming-template'

    class List.UpcomingShows extends List.Shows
        childView: List.UpcomingShow

    class List.UpcomingShowsView extends List.ShowsView
        setCollection: (collection, type) ->
            view = new List.UpcomingShows collection: collection
            @contentRegion.show view
            @setTab type