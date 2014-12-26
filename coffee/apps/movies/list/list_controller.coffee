# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'MoviesApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
	List.Controller = 
		listMovies: ->
			listMovies = new List.Movies()
			NZBAppManager.mainRegion.show listMovies
			$.when(NZBAppManager.request('movies:list')).done (movies) ->
				listMovies.setCollection movies