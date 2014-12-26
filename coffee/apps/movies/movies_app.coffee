# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'MoviesApp', (Movies, NZBAppManager, Backbone, Marionette, $, _) ->
	class Movies.RoutesController
		listMovies: ->
			Movies.List.Controller.listMovies()
			NZBAppManager.execute 'tabs:active:set', 'Movies'

	class Movies.Router extends Marionette.AppRouter
		appRoutes:
			'movies': 'listMovies'

	routesController = new Movies.RoutesController()

	NZBAppManager.on 'movies:list', ->
		NZBAppManager.navigate('movies')
		routesController.listMovies()

	NZBAppManager.addInitializer ->
		new Movies.Router controller: routesController