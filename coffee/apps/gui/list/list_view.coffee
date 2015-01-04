# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'GUI.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
	class List.NoResults extends Marionette.ItemView
        template: '#noresults-template'
        title: 'No Results'
        render: ->
        	@$el.append Backbone.Marionette.Renderer.render @template, {title: @title}