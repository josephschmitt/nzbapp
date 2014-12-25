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
        start: ->
            super
            if Backbone.history then Backbone.history.start()

            $.when(@request('servers:entities')).done (serverSettings) =>
                if not @request 'servers:entities:valid'
                    @trigger 'servers:show'
                else if not @getCurrentRoute()
                    @trigger 'search:show'

    class jjs.CouchPotatoModel extends Backbone.Model
        urlRoot: "#{jjs.AppConfig.CouchPotato.urlRoot}/#{jjs.AppConfig.CouchPotato.apiKey}"
        # localStorage: new Backbone.LocalStorage 'jjs.NZBApplication.Entities.APIToken'
        fetch: (options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback_func'
                jsonpCallback: options.jsonpCallback or 'jjs.AppConfig.callback_func'
            super options

    # Init the app
    jjs.NZBAppManager = new NZBApplication()