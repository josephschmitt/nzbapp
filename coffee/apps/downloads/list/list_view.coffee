# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'DownloadsApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    class List.Slot extends Marionette.ItemView
        template: '#download-list-template'
        className: 'row'
        ui:
            progress: '.progress'
            meter: '.meter'
        initialize: ->
            super
        #     @listenTo @model, 'change', @updateProgress
        # updateProgress: ->
            
    
    class List.Downloads extends Marionette.CollectionView
        childView: List.Slot
        className: 'downloads-list'

    class List.DownloadsView extends Marionette.LayoutView
        template: '#downloads-template'
        regions:
            queueRegion: '#downloads-queue-region'
            historyRegion: '#downloads-history-region'
        setCollections: (queued, history) ->
            @queueCollection = queued
            @historyCollection = history

            @listenTo @queueCollection, 'change', @renderQueue
            @listenTo @historyCollection, 'change', @renderHistory

            @render()
        renderQueue: ->
            @queueRegion.show new List.Downloads collection: @queueCollection
        renderHistory: ->
            @historyRegion.show new List.Downloads collection: @historyCollection
        render: ->
            super
            @renderQueue()
            @renderHistory()