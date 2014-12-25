# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'SearchApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
	Show.Controller = 
		showEmptySearch: ->
			NZBAppManager.mainRegion.transitionToView new Show.SearchView