# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'NavbarApp', (Navbar, NZBAppManager, Backbone, Marionette, $, _) ->

	NZBAppManager.commands.setHandler 'tabs:active:set', (name) ->
		Navbar.Tabs.Controller.setActive(name)

	Navbar.on 'start', ->
		Navbar.Tabs.Controller.showTabs()