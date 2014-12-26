# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ShowsApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
	List.Controller = 
		listShows: ->
			listShows = new List.Shows()
			NZBAppManager.mainRegion.show listShows
			$.when(NZBAppManager.request('shows:list')).done (shows) ->
				listShows.setCollection shows