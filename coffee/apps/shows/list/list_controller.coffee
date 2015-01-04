# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ShowsApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
	List.Controller = 
		listShows: ->
			listShows = new List.Shows()
			NZBAppManager.mainRegion.show listShows
			NZBAppManager.execute 'titlebar:show', NZBAppManager.request('titlebar:shows:entities')
			NZBAppManager.execute 'titlebar:activate', 'shows/wanted'
			$.when(NZBAppManager.request('shows:list:entities')).done (shows) ->
				listShows.setCollection shows, 'wanted'
		listUpcomingShows: ->
			listShows = new List.UpcomingShows()
			NZBAppManager.mainRegion.show listShows
			NZBAppManager.execute 'titlebar:show', NZBAppManager.request('titlebar:shows:entities')
			NZBAppManager.execute 'titlebar:activate', 'shows/upcoming'
			$.when(NZBAppManager.request('shows:upcoming:entities')).done (shows) ->
				listShows.setCollection shows, 'upcoming'
		addShow: (show) ->
			$.when(NZBAppManager.request('show:add', show)).done (added) ->
				message = added.message
				status = if added.result is 'success' then 'success' else 'alert'
				NZBAppManager.execute 'popup:alert:show', message, status