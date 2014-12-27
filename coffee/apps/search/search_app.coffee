# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'SearchApp', (Search, NZBAppManager, Backbone, Marionette, $, _) ->
    class Search.RoutesController
        showEmptySearch: ->
            Search.Show.Controller.showEmptySearch()
            NZBAppManager.execute 'tabs:active:set', 'Search'
        showResultsForSearch: (type, term) ->
            Search.Show.Controller.showResultsForSearch(type, term)

    class Search.Router extends Marionette.AppRouter
        appRoutes:
            'search': 'showEmptySearch'
            'search/:type/:term': 'showResultsForSearch'

    routesController = new Search.RoutesController()

    NZBAppManager.on 'home:show', ->
        NZBAppManager.navigate('search')
        routesController.showEmptySearch()
    NZBAppManager.on 'search:show', ->
        NZBAppManager.navigate('search')
        routesController.showEmptySearch()
    NZBAppManager.on 'search:results:show', (type, term) ->
        NZBAppManager.navigate("search/#{type}/#{term}")
        routesController.showResultsForSearch(type, term)

    NZBAppManager.addInitializer ->
        new Search.Router controller: routesController
            