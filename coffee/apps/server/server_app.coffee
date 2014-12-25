# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ServersApp', (ServersApp, NZBAppManager, Backbone, Marionette, $, _) ->
	class ServersApp.RoutesController
		listServers: ->
			ServersApp.Setup.Controller.listServers()
			NZBAppManager.execute 'tabs:active:set', 'Settings'

	class ServersApp.Router extends Marionette.AppRouter
		appRoutes:
			'servers': 'listServers'

	routesController = new ServersApp.RoutesController()

	# NZBAppManager.on 'servers:settings:loaded', ->

	NZBAppManager.on 'servers:show', ->
		NZBAppManager.navigate('servers')
		routesController.listServers()

	NZBAppManager.addInitializer ->
		new ServersApp.Router controller: routesController