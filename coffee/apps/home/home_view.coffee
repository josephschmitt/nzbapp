do ->
    # `js` is our namespace. Everything should be in `js` to avoid name conflicts.
    js = window.js = (window.js or {})

    js.NZBAppManager.module 'Home', (Home, NZBAppManager, Backbone, Marionette, $, _) ->
    	class HomeView extends Marionette.LayoutView
    		template: '#home-template'
    		regions:
                navbarRegion: '#content-region'
                contentRegion: '#navbar-region'
            render: ->
                super
                @navbarRegion.show new Marionette.ItemView
                	template: '#navbar-template'
                @contentRegion.show new Marionette.ItemView
                	template: '#search-template'