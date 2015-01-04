do ->
    # `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
    jjs = window.jjs = (window.jjs or {})

    # Custom renderer implementation
    Backbone.Marionette.Renderer.render = (template, data) ->
      _.template($(template).html(), data, {variable: 'data'})

    class NZBApplication extends Marionette.Application
        initialize: ->
            super
            @addRegions
                titlebarRegion:
                    selector: '#titlebar'
                    regionClass: TransitionRegion
                mainRegion: 
                    selector: '#main'
                    regionClass: TransitionRegion
                navbarRegion: '#navbar'
                modalRegion: 
                    selector: '#modal'
                    regionClass: TransitionRegion

        navigate: (route, options={}) ->
            Backbone.history.navigate(route, options)
        getCurrentRoute: ->
            return Backbone.history.fragment
        showModal: (view) =>
            @modalRegion.$el.show()
            @modalRegion.show view
        dismissModal: =>
            @modalRegion.on 'empty', => @modalRegion.$el.hide()
            @modalRegion.reset()
        checkServerSettings: (redirect) ->
            $.when(@request('servers:entities')).done (serverSettings) =>
                if not @request 'servers:entities:valid:any'
                    @trigger 'servers:show'
                else if not @getCurrentRoute() or redirect or window.navigator.standalone
                    @trigger 'home:show'
        start: ->
            super
            if window.navigator.standalone
                $('body').addClass 'standalone'
            if Backbone.history then Backbone.history.start()
            @checkServerSettings()

    # Init the app
    jjs.NZBAppManager = new NZBApplication()