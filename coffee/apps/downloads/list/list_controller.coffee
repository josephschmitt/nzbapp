# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'DownloadsApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
	List.Controller = 
		listDownloads: ->
			listDownloads = new List.DownloadsView()
			NZBAppManager.mainRegion.show listDownloads
			$.when(NZBAppManager.request('downloads:queue:list'), NZBAppManager.request('downloads:history:list')).done (queued, history) ->
				listDownloads.setCollections queued, history