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
            mode = if @model.get('status') is 'Completed' then 'history' else 'queue'
            if $(e.currentTarget).data('status') then @model.set 'status', $(e.currentTarget).data('status')
            else @model.collection.remove(@model)
            NZBAppManager.execute "downloads:#{mode}:item", @model.id, $(e.currentTarget).data('action')

    class List.NoQueueResults extends NZBAppManager.GUI.List.NoResults
        title: 'No Downloads in Queue'
    
    class List.Downloads extends Marionette.CollectionView
        childView: List.Slot
        className: 'downloads-list'
        emptyView: List.NoQueueResults
        setCollection: (collection) ->
            @collection = collection
            @listenTo @collection, 'change', @render
            @render()