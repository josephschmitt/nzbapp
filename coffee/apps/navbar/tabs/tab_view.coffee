# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'NavbarApp.Tabs', (Tabs, NZBAppManager, Backbone, Marionette, $, _) ->
	class Tabs.TabView extends Marionette.ItemView
		template: '#navbar-template'
		tagName: 'a'
		className: 'item'
		events:
			'click': 'navigate'
		initialize: ->
			super
			@listenTo @model, 'change', @render
		render: ->
			super
			@$el
				.attr 'href', "##{@model.get('url')}"
				.toggleClass 'active', !!@model.get('active')
		navigate: (e) ->
			e.preventDefault()
			@trigger 'navigate', @model

	class Tabs.TabsView extends Marionette.CollectionView
		childView: Tabs.TabView
		className: 'icon-bar five-up'
		tagName: 'nav'