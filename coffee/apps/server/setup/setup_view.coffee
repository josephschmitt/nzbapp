# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ServersApp.Setup', (ServersSetup, NZBAppManager, Backbone, Marionette, $, _) ->
    class ServersSetup.Fields extends Marionette.ItemView
        template: '#server-setup-fields-template'
        tagName: 'fieldset'
        ui:
            'url': '.server-url'
            'token': '.server-token'
        saveServerSettings: ->
            @model.set 'serverUrl', @$(@ui.url).val(), silent: true
            @model.set 'token', @$(@ui.token).val(), silent: true
            @model.save()
    
    class ServersSetup.CollectionView extends Marionette.CollectionView
        childView: ServersSetup.Fields
        initialize: ->
            super
            @listenTo @collection, 'change', @render

    class ServersSetup.Layout extends Marionette.LayoutView
        tagName: 'form'
        template: '#server-setup-template'
        regions:
            collectionRegion: '#server-collection'
        ui:
            'save': '#server-save'
        events:
            'submit': 'saveServerSettings'
            'click @ui.save': 'saveServerSettings'
        render: ->
            super
            @collectionRegion.show new ServersSetup.CollectionView
                collection: @collection
        saveServerSettings: (e) ->
            e.preventDefault()
            @collectionRegion.currentView.children.each (child) -> child.saveServerSettings()
            @collection.trigger 'change'

