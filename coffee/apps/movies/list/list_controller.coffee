# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'MoviesApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
	List.Controller = 
		listMovies: ->
			listMovies = new List.Movies()
			NZBAppManager.mainRegion.show listMovies
			$.when(NZBAppManager.request('movies:list')).done (movies) ->
				listMovies.setCollection movies
		addMovie: (movie) ->
			$.when(NZBAppManager.request('movies:add', movie)).done (added) ->
				message = "Added #{added.movie.title or added.movie.info.original_title} (#{added.movie.info.year}) to your list"
				status = if added.success then 'success' else 'alert'
				NZBAppManager.execute 'popup:alert:show', message, status