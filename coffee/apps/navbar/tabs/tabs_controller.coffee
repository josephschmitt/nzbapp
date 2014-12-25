# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'NavbarApp.Tabs', (Tabs, NZBAppManager, Backbone, Marionette, $, _) ->
	Tabs.Controller = 
		showTabs: ->
			tabsCollection = NZBAppManager.request 'tabs:entities'
			tabs = new Tabs.TabsView collection: tabsCollection
			NZBAppManager.navbarRegion.show tabs

			tabs.on 'childview:navigate', (childview, model) ->
				NZBAppManager.trigger model.get('trigger')

		setActive: (name) ->
			tabsCollection = NZBAppManager.request 'tabs:entities'
			tabsCollection.findWhere(active: true)?.set 'active', false
			tabsCollection.findWhere(name: name)?.set 'active', true