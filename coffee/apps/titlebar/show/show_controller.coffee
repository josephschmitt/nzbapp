# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'TitlebarApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
    view = null
    Show.Controller =
        show: (data) ->
            view = new Show.Titlebar model: data
            NZBAppManager.titlebarRegion.show view
        activate: (url) ->
            view?.activate url