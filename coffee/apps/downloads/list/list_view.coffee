# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'DownloadsApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    class List.Slot extends Marionette.ItemView
        template: '#download-list-template'
        className: 'download-list-item'
        ui:
            button: '.media-meta .button'
        events:
            'click @ui.button': 'queueAction'
        initialize: ->
            super
            @listenTo @model, 'change', @render
        queueAction: (e) ->
            e?.preventDefault()
            if $(e.currentTarget).data('status') then @model.set 'status', $(e.currentTarget).data('status')
            NZBAppManager.request 'downloads:queue:item', @model.id, $(e.currentTarget).data('action')
    
    class List.Downloads extends Marionette.CollectionView
        childView: List.Slot
        className: 'downloads-list'
    
    class List.TabView extends Marionette.ItemView
        template: '#downloads-tab-template'
        tagName: 'dd'
        events:
            'click': 'navigate'
        initialize: ->
            super
            @listenTo @model, 'change', @render
        render: ->
            super
            @$el.toggleClass 'active', !!@model.get('active')
        navigate: (e) ->
            e.preventDefault()
            NZBAppManager.trigger @model.get('trigger')

    class List.TabsView extends Marionette.CollectionView
        childView: List.TabView
        className: 'sub-nav downloads-tabs'
        tagName: 'dl'

    class List.DownloadsView extends Marionette.LayoutView
        template: '#downloads-template'
        regions:
            tabsRegion: '#downloads-tabs-region'
            contentRegion: '#downloads-content-region'
        render: ->
            super
            @tabsRegion.show new List.TabsView collection: NZBAppManager.request 'downloads:tabs:entities'
        setCollection: (collection, type) ->
            view = new List.Downloads collection: collection
            @contentRegion.show view
            @setTab type
        setTab: (tabUrl) ->
            collection = @tabsRegion.currentView.collection
            collection.findWhere(active: true)?.set 'active', false
            collection.findWhere(url: tabUrl)?.set 'active', true