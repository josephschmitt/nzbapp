do ->
    # `js` is our namespace. Everything should be in `js` to avoid name conflicts.
    js = window.js = (window.js or {})

    js.NZBAppManager.module 'NavBar', (NavBar, NZBAppManager, Backbone, Marionette, $, _) ->
    	class NavBarTabs extends Marionette.ItemView
    		template: '#navbar-template'