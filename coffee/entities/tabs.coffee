# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
	class Entities.Tab extends Backbone.Model

	class Entities.TabsCollection extends Backbone.Collection
		model: Entities.Tab

	initTabs = ->
		Entities.tabs = new Entities.TabsCollection [
			{ label: 'Search', name: 'Search', url: 'search', icon: 'fi-magnifying-glass' }
			{ label: 'Movies', name: 'CouchPotato', url: 'couchpotato', icon: 'fi-ticket' }
			{ label: 'TV', name: 'SickBeard', url: 'sickbeard', icon: 'fi-monitor' }
			{ label: 'Queue', name: 'SABnzbd', url: 'downloads', icon: 'fi-download' }
			{ label: 'Settings', name: 'Settings', url: 'servers', icon: 'fi-widget' }
		]

	NZBAppManager.reqres.setHandler 'tabs:entities', ->
		if not Entities.tabs then initTabs()
		Entities.tabs