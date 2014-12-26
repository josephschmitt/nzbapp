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

            if @model.get 'serverName'
                @$el.toggle NZBAppManager.request('servers:entities:valid', @model.get('serverName'))

        navigate: (e) ->
            e.preventDefault()
            @trigger 'navigate', @model

    class Tabs.TabsView extends Marionette.CollectionView
        childView: Tabs.TabView
        className: 'icon-bar'
        tagName: 'nav'
        tabClasses: ['two-up', 'three-up', 'four-up', 'five-up']
        activeTabCount: ->
            models = @collection.filter (model) -> !!model?.get 'serverName'
            count = models.reduce (memo, num) ->
                if memo.get
                    if NZBAppManager.request 'servers:entities:valid', memo.get('serverName') then memo = 1
                    else memo = 0
                if num.get
                    if NZBAppManager.request 'servers:entities:valid', num.get('serverName') then num = 1
                    else num = 0
                memo + num
        render: ->
            super
            @el.className = "icon-bar #{@tabClasses[@activeTabCount()]}"