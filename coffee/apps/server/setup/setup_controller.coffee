# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ServersApp.Setup', (ServersSetup, NZBAppManager, Backbone, Marionette, $, _) ->
	ServersSetup.Controller = 
		listServers: ->
			$.when(NZBAppManager.request('servers:entities')).done (serverSettings) =>
				NZBAppManager.mainRegion.transitionToView new ServersSetup.Layout
					collection: serverSettings
				serverSettings.on 'change', -> 
		            serverSettings.sync 'update', serverSettings,
		                success: -> NZBAppManager.trigger 'home:show'