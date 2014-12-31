# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'DownloadsApp', (Downloads, NZBAppManager, Backbone, Marionette, $, _) ->
	class Downloads.RoutesController
		listQueue: ->
			Downloads.List.Controller.listQueue()
			NZBAppManager.execute 'tabs:active:set', 'Downloads'
		listHistory: ->
			Downloads.List.Controller.listHistory()
			NZBAppManager.execute 'tabs:active:set', 'Downloads'

	class Downloads.Router extends Marionette.AppRouter
		appRoutes:
			'downloads': 'listQueue'
			'downloads/history': 'listHistory'

	routesController = new Downloads.RoutesController()

	NZBAppManager.on 'downloads:list downloads:queue:list', ->
		NZBAppManager.navigate('downloads')
		routesController.listQueue()

	NZBAppManager.on 'downloads:history:list', ->
		NZBAppManager.navigate('downloads/history')
		routesController.listHistory()

	deferredPing = null
	Downloads.on 'start', ->
		deferredPing = NZBAppManager.request('downloads:queue:ping:entities')
		$.when(deferredPing).progress (queued, response) ->
			NZBAppManager.trigger 'downloads:queue:ping', 1 - parseFloat(response.mbleft) / parseFloat(response.mb), queued

	Downloads.on 'stop', ->
		deferredPing.resolve()

	NZBAppManager.addInitializer ->
		new Downloads.Router controller: routesController