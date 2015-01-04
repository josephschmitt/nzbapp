# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'TitlebarApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
    Show.Controller =
        show: (data) ->
            if Backbone.Collection.prototype.isPrototypeOf data
                view = new Show.TabsTitlebar collection: data
            else
                view = new Show.TextTitlebar model: data
            NZBAppManager.titlebarRegion.show view
        activate: (url) ->
            collection = NZBAppManager.titlebarRegion.currentView?.collection
            collection?.findWhere(active: true)?.set 'active', false
            collection?.findWhere(url: url)?.set 'active', true