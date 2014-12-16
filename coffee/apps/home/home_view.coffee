do ->
    # `js` is our namespace. Everything should be in `js` to avoid name conflicts.
    js = window.js = (window.js or {})

    js.NZBAppManager.module 'Home', (Home, NZBAppManager, Backbone, Marionette, $, _) ->
    	class Home.HomeView extends Marionette.LayoutView
    		template: '#home-template'
            id: 'home-view'
    		regions:
                navbarRegion: '#navbar-region'
                contentRegion: '#content-region'
            render: ->
                super
                @navbarRegion.show new NZBAppManager.NavBar.NavBarTabs
                	template: '#navbar-template'
                @contentRegion.show new Marionette.ItemView
                	template: '#search-template'