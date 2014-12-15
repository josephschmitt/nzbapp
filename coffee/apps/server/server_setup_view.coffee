do ->
    # `js` is our namespace. Everything should be in `js` to avoid name conflicts.
    js = window.js = (window.js or {})

    js.NZBAppManager.module 'Server', (Server, NZBAppManager, Backbone, Marionette, $, _) ->
        class Server.SetupFields extends Marionette.ItemView
            template: '#server-setup-fields-template'
            tagName: 'fieldset'
            ui:
                'url': '.server-url'
                'token': '.server-token'
            saveServerSettings: ->
                if @ui.url.val()
                    NZBAppManager.commands.execute 'server:url:set', @model.get('serverName'), @ui.url.val()
                if @ui.token.val()
                    NZBAppManager.commands.execute 'server:token:set', @model.get('serverName'), @ui.token.val()
        
        class Server.SetupCollectionView extends Marionette.CollectionView
            childView: Server.SetupFields

        class Server.Setup extends Marionette.LayoutView
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
                @collectionRegion.show new Server.SetupCollectionView
                    collection: @collection
            saveServerSettings: (e) ->
                e.preventDefault()
                @collectionRegion.currentView.children.each (child) -> child.saveServerSettings()
                # NZBAppManager.trigger 'home:show'

