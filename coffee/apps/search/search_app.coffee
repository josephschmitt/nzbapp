# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'SearchApp', (Search, NZBAppManager, Backbone, Marionette, $, _) ->
	class Search.RoutesController
		showEmptySearch: ->
			Search.Show.Controller.showEmptySearch()
		listSearchResults: ->

	class Search.Router extends Marionette.AppRouter
		appRoutes:
			'search': 'showEmptySearch'
			'search/results': 'listSearchResults'

	routesController = new Search.RoutesController()

	NZBAppManager.on 'search:show', ->
		NZBAppManager.navigate('search')
		routesController.showEmptySearch()
	NZBAppManager.on 'search:results:show', ->
		NZBAppManager.navigate('search/results')
		routesController.listSearchResults()

	NZBAppManager.addInitializer ->
		new Search.Router controller: routesController
			