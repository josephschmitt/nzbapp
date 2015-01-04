# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'TitlebarApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
	class Show.TextTitlebar extends NZBAppManager.GUI.Tabs.TabView
		template: '#titlebar-text-template'
		className: "titlebar #{if window.navigator.standalone then 'standalone' else ''}"

	class Show.TitlebarTab extends NZBAppManager.GUI.Tabs.TabView
		template: '#titlebar-tab-item-template'
		tagName: 'li'

	class Show.TabsTitlebar extends Marionette.CompositeView
		template: '#titlebar-tabs-template'
		className: "titlebar tabs-titlebar #{if window.navigator.standalone then 'standalone' else ''}"
		childView: Show.TitlebarTab
		childViewContainer: 'ul.button-group'
