# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ServersApp.Setup', (ServersSetup, NZBAppManager, Backbone, Marionette, $, _) ->
	ServersSetup.Controller = 
		listServers: ->
			NZBAppManager.execute 'titlebar:show', NZBAppManager.request('titlebar:settings:entities')
			$.when(NZBAppManager.request('servers:entities')).done (serverSettings) =>
				NZBAppManager.mainRegion.show new ServersSetup.Layout
					collection: serverSettings
				serverSettings.on 'change', -> ServersSetup.Controller.saveSettings()
		saveSettings: ->
			NZBAppManager.execute 'tabs:show'
			NZBAppManager.checkServerSettings(true)