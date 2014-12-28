# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'DownloadsApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    class List.Slot extends Marionette.ItemView
        template: '#download-list-template'
        # tagName: 'li'
        className: 'row'
    
    class List.Downloads extends Marionette.CollectionView
        childView: List.Slot
        # tagName: 'ul'
        className: 'downloads-list'
        initialize: ->
            super
            if @collection then @setCollection @collection
        setCollection: (collection) ->
            @collection = collection
            @listenTo @collection, 'change', @render
            @render()

    class List.DownloadsView extends Marionette.LayoutView
        template: '#downloads-template'
        regions:
            queueRegion: '#downloads-queue-region'
            historyRegion: '#downloads-history-region'
        render: ->
            super
            @queueRegion.show new List.Downloads collection: @queueCollection
            @historyRegion.show new List.Downloads collection: @historyCollection