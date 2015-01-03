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
            if @model.get('name') is 'Downloads'
                @$el.css 'z-index', 1
                NZBAppManager.on 'downloads:queue:ping', (progress, queued, status) => 
                    @model.set 'progress', progress * 100
                    @model.set 'status', status
                    @model.set 'count', queued.length
        render: ->
            super
            @$el
                .attr 'href', "##{@model.get('url')}"
                .toggleClass 'active', !!@model.get('active')

            if @model.get 'serverName'
                @$el.toggleClass 'hide', not NZBAppManager.request('servers:entities:valid', @model.get('serverName'))
        navigate: (e) ->
            e.preventDefault()
            @trigger 'navigate', @model
        destroy: ->
            NZBAppManager.off 'downloads:queue:ping'
            super

    class Tabs.TabsView extends Marionette.CollectionView
        childView: Tabs.TabView
        className: 'icon-bar medium-vertical'
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
            @el.className = "#{@className} #{@tabClasses[@activeTabCount()]}"