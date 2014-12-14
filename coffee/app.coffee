do ->
    # `js` is our namespace. Everything should be in `js` to avoid name conflicts.
    js = window.js = (window.js or {})

    # Custom renderer implementation
    Backbone.Marionette.Renderer.render = (template, data) ->
      _.template($(template).html(), data, {variable: 'data'})

    js.NavigationAPI =
        showHome: => 

    class js.NZBAppRouter extends Marionette.AppRouter
        appRoutes: '': 'showHome'
        controller: js.NavigationAPI

    class js.NZBAppManager extends Marionette.Application
        initialize: ->
            super
            @addInitializer =>
                new js.NZBAppRouter()
            @addRegions
                mainRegion: 
                    selector: '#main'
                    regionClass: TransitionRegion
                modalRegion: 
                    selector: '#modal'
                    regionClass: TransitionRegion
            @initNavigationEvents()

        initNavigationEvents: ->
            # Init navigation events
            @on 'home:show', =>
                @navigate('')
                js.NavigationAPI.showHome()

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
            if Backbone.history then Backbone.history.start()
            if not @getCurrentRoute()? then @trigger('home:show')

    # Init the app
    js.NZBApp = new js.NZBAppManager()
    js.NZBApp.start()