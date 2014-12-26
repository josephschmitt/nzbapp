# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ShowsApp', (Shows, NZBAppManager, Backbone, Marionette, $, _) ->
	class Shows.RoutesController
		listShows: ->
			Shows.List.Controller.listShows()
			NZBAppManager.execute 'tabs:active:set', 'Shows'

	class Shows.Router extends Marionette.AppRouter
		appRoutes:
			'shows': 'listShows'

	routesController = new Shows.RoutesController()

	NZBAppManager.on 'shows:list', ->
		NZBAppManager.navigate('shows')
		routesController.listShows()

	NZBAppManager.addInitializer ->
		new Shows.Router controller: routesController