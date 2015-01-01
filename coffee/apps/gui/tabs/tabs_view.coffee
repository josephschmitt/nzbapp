# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'GUI.Tabs', (Tabs, NZBAppManager, Backbone, Marionette, $, _) ->
    class Tabs.TabView extends Marionette.ItemView
        template: '#tab-template'
        tagName: 'dd'
        events:
            'click': 'navigate'
        initialize: ->
            super
            @listenTo @model, 'change', @render
        render: ->
            super
            @$el.toggleClass 'active', !!@model.get('active')
        navigate: (e) ->
            e.preventDefault()
            NZBAppManager.trigger @model.get('trigger')

    class Tabs.TabsView extends Marionette.CollectionView
        childView: Tabs.TabView
        className: 'tabs small'
        tagName: 'dl'