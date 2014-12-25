# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
	class Entities.Tab extends Backbone.Model

	class Entities.TabsCollection extends Backbone.Collection
		model: Entities.Tab

	initTabs = ->
		Entities.tabs = new Entities.TabsCollection [
			{ name: 'Search', url: 'search', icon: 'fi-magnifying-glass', trigger: 'search:show' }
			{ name: 'Movies', url: 'movies', icon: 'fi-ticket', trigger: 'movies:show' }
			{ name: 'TV', url: 'tv', icon: 'fi-monitor', trigger: 'tv:show' }
			{ name: 'Queue', url: 'queue', icon: 'fi-download', trigger: 'queue:show' }
			{ name: 'Settings', url: 'settings', icon: 'fi-widget', trigger: 'servers:show' }
		]

	NZBAppManager.reqres.setHandler 'tabs:entities', ->
		if not Entities.tabs then initTabs()
		Entities.tabs