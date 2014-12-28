# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'DownloadsApp', (Downloads, NZBAppManager, Backbone, Marionette, $, _) ->
	class Downloads.RoutesController
		listDownloads: ->
			Downloads.List.Controller.listDownloads()
			NZBAppManager.execute 'tabs:active:set', 'Downloads'

	class Downloads.Router extends Marionette.AppRouter
		appRoutes:
			'downloads': 'listDownloads'

	routesController = new Downloads.RoutesController()

	NZBAppManager.on 'downloads:list', ->
		NZBAppManager.navigate('downloads')
		routesController.listDownloads()

	NZBAppManager.addInitializer ->
		new Downloads.Router controller: routesController