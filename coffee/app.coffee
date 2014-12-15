do ->
    # `js` is our namespace. Everything should be in `js` to avoid name conflicts.
    js = window.js = (window.js or {})

    # Custom renderer implementation
    Backbone.Marionette.Renderer.render = (template, data) ->
      _.template($(template).html(), data, {variable: 'data'})

    NavigationAPI =
        showHome: ->
            if not js.NZBAppManager.request('server:url:get') or not js.NZBAppManager.request('server:token:get')
                js.NZBAppManager.trigger('server:setup:show')
            else
                js.NZBAppManager.mainRegion.transitionToView new Marionette.ItemView template: false
        showSearch: ->
        showServerSetup: ->
            js.NZBAppManager.mainRegion.transitionToView new js.NZBAppManager.Server.Setup
                collection: js.NZBAppManager.request('server:settings:getAll')

    class NZBAppRouter extends Marionette.AppRouter
        controller: NavigationAPI
        appRoutes: 
            '': 'showHome'
            'server/setup': 'showServerSetup'

    class NZBApplication extends Marionette.Application
        initialize: ->
            super
            # @addInitializer =>
            #     @router = new NZBAppRouter()
            @addRegions
                mainRegion: 
                    selector: '#main'
                    regionClass: TransitionRegion
                modalRegion: 
                    selector: '#modal'
                    regionClass: TransitionRegion
        initNavigationEvents: ->
            # Init navigation events
            @on 'home:show', =>
                @navigate('')
                NavigationAPI.showHome()
            @on 'server:setup:show', =>
                @navigate('server/setup')
                NavigationAPI.showServerSetup()
        navigate: (route, options={}) ->
            Backbone.history.navigate(route, options)
        getCurrentRoute: ->
            return Backbone.history.fragment
        showModal: (options) =>
            @modalRegion.$el.show()
            @modalRegion.transitionToView new js.Modal options
        dismissModal: =>
            @modalRegion.on 'empty', => @modalRegion.$el.hide()
            @modalRegion.transitionToView()
        start: ->
            super
            @initNavigationEvents()
            setTimeout =>
                @router = new NZBAppRouter()
                if Backbone.history then Backbone.history.start()
                if not @getCurrentRoute()? or @getCurrentRoute() =='server/setup'
                    console.log 'settings', js.NZBAppManager.request('server:settings:get')
                    if not js.NZBAppManager.request('server:settings:get')
                        @trigger('server:setup:show')
                    else
                        @trigger('home:show')
            , 1

    class js.LocalStorageModel extends Backbone.Model
        set: (attributes) ->
            if not _.keys(attributes).length and not attributes.length then return
            console.log 'localStorage', @localStorage
            super
            saved = @localStorage?.find @
            if saved
                @localStorage.update @
            else if @localStorage?
                @localStorage.create @

    class js.CouchPotatoModel extends Backbone.Model
        urlRoot: "#{js.AppConfig.CouchPotato.urlRoot}/#{js.AppConfig.CouchPotato.apiKey}"
        # localStorage: new Backbone.LocalStorage 'js.NZBApplication.Entities.APIToken'
        fetch: (options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback_func'
                jsonpCallback: options.jsonpCallback or 'js.AppConfig.callback_func'
            super options

    # Init the app
    js.NZBAppManager = new NZBApplication()
    js.NZBAppManager.start()