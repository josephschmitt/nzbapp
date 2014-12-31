# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'DownloadsApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
	downloadsView = null
	List.Controller = 
		listQueue: ->
			if not downloadsView?.currentView
				downloadsView = new List.DownloadsView()
				NZBAppManager.mainRegion.show downloadsView

			$.when(NZBAppManager.request('downloads:queue:entities')).done (queued) ->
				downloadsView.setCollection queued, 'queue'
				List.Controller.pingQueue()
		pingQueue: ->
			ping = NZBAppManager.request('downloads:queue:ping:entities')
			$.when(ping).progress (queued) ->
				if downloadsView and downloadsView.contentRegion
					downloadsView?.contentRegion.currentView?.collection.set queued.models
				else
					ping.resolve()
		listHistory: ->
			if not downloadsView?.currentView
				downloadsView = new List.DownloadsView()
				NZBAppManager.mainRegion.show downloadsView

			$.when(NZBAppManager.request('downloads:history:entities')).done (history) ->
				downloadsView.setCollection history, 'history'