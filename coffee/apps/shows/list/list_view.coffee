# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'ShowsApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    class List.Show extends Marionette.ItemView
        template: '#show-list-template'
        # tagName: 'li'
        className: 'row'
    
    class List.Shows extends Marionette.CollectionView
        childView: List.Show
        # tagName: 'ul'
        className: 'shows-list'
        initialize: ->
            super
            if @collection then @setCollection @collection
        setCollection: (collection) ->
            @collection = collection
            @listenTo @collection, 'change', @render
            @render()