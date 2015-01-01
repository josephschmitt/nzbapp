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

	queueCollection = null
	Downloads.on 'start', ->
		$.when(NZBAppManager.request('downloads:queue:entities')).done (queued) ->
			queueCollection = queued
			queueCollection.on 'sync', (collection, response) ->
				progress = if response.queue?.mbleft and response.queue?.mb then 1 - parseFloat(response.queue.mbleft) / parseFloat(response.queue.mb) else 0
				NZBAppManager.trigger 'downloads:queue:ping', progress, queueCollection, response.queue.status

	Downloads.on 'stop', ->
		queueCollection.off 'sync'

	NZBAppManager.addInitializer ->
		new Downloads.Router controller: routesController