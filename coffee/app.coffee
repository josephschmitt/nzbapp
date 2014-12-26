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
        showModal: (options) =>
            @modalRegion.$el.show()
            @modalRegion.transitionToView new jjs.Modal options
        dismissModal: =>
            @modalRegion.on 'empty', => @modalRegion.$el.hide()
            @modalRegion.transitionToView()
        checkServerSettings: ->
            $.when(@request('servers:entities')).done (serverSettings) =>
                if not @request 'servers:entities:valid:any'
                    @trigger 'servers:show'
                else if not @getCurrentRoute()
                    if not serverSettings.filter((setting)->!!@request('servers:entities:valid', setting.get('serverName'))).length
                        @trigger 'servers:show'
                    else
                        @trigger 'search:show'
        start: ->
            super
            if Backbone.history then Backbone.history.start()
            @checkServerSettings()

    # Init the app
    jjs.NZBAppManager = new NZBApplication()