# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'GUI.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    class List.NoResults extends Marionette.ItemView
        template: '#noresults-template'
        title: 'No Results'
        render: ->
            @$el.append Backbone.Marionette.Renderer.render @template, {title: @title}

    class List.FilterableList extends Marionette.LayoutView
        template: '#filterable-list-template'
        regions:
            filterBarRegion: '#filter-bar-region'
            listRegion: '#list-region'
        listClass: Marionette.CollectionView
        render: ->
            super
            @listRegion.show new @listClass()
        renderBar: =>
            @filterBarRegion.show new List.FilterBar collection: @filtersCollection
            @listenTo @filterBarRegion.currentView, 'search', (term) => @trigger 'filter', term
            NZBAppManager.mainRegion.el.scrollTop = @filterBarRegion.currentView?.$el?.outerHeight()
        setCollection: (collection) ->
            if collection.models.length
                @renderBar()
            else
                @listenTo collection, 'sync', @renderBar

    class List.FilterItem extends Marionette.ItemView
        template: '#filter-bar-item-template'
        events:
            'click a': 'click'
        initialize: ->
            super
            @listenTo @model, 'change', @render
        click: (e) ->
            e.preventDefault()
            @model.collection.findWhere(active: true).set 'active', false
            @model.set 'active', true
            NZBAppManager.trigger @model.get('trigger'), @model.get('name')

    class List.FilterBar extends Marionette.CompositeView
        template: '#filter-bar-template'
        childView: List.FilterItem
        childViewContainer: '.filter-item-container'
        ui:
            search: 'input[type="search"]'
        events:
            'keyup @ui.search': 'keyup'
        keyup: (e) ->
            @search @ui.search.val()
        search: (term) ->
            @trigger 'search', term