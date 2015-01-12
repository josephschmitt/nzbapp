# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'TitlebarApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
	class Show.Titlebar extends Marionette.ItemView
		template: '#titlebar-template'
		className: "titlebar"
		events:
            'click a': 'navigate'
        initialize: ->
            super
            @listenTo @model, 'change', @render
        activate: (url) ->
        	@$('.active').removeClass 'active'
        	@$("[href*='#{url}']").parent().addClass 'active'
        navigate: (e) ->
            e.preventDefault()
            NZBAppManager.trigger $(e.target).data('trigger')