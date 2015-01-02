# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ShowsApp', (Shows, NZBAppManager, Backbone, Marionette, $, _) ->
	class Shows.RoutesController
		listShows: ->
			Shows.List.Controller.listShows()
			NZBAppManager.execute 'tabs:active:set', 'Shows'
		listUpcomingShows: ->
			Shows.List.Controller.listUpcomingShows()
			NZBAppManager.execute 'tabs:active:set', 'Shows'

	class Shows.Router extends Marionette.AppRouter
		appRoutes:
			'shows': 'listShows'
			'shows/upcoming': 'listUpcomingShows'

	routesController = new Shows.RoutesController()

	NZBAppManager.on 'shows:list shows:wanted:list', ->
		NZBAppManager.navigate('shows')
		routesController.listShows()

	NZBAppManager.on 'shows:upcoming:list', ->
		NZBAppManager.navigate('shows/upcoming')
		routesController.listUpcomingShows()

	NZBAppManager.addInitializer ->
		new Shows.Router controller: routesController