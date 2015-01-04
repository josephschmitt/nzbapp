# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'TitlebarApp', (Titlebar, NZBAppManager, Backbone, Marionette, $, _) ->
	NZBAppManager.commands.setHandler 'titlebar:show', (data) ->
		Titlebar.Show.Controller.show(data)
	NZBAppManager.commands.setHandler 'titlebar:activate', (url) ->
		Titlebar.Show.Controller.activate(url)