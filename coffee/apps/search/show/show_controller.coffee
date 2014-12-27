# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'SearchApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
    searchView = undefined
    Show.Controller = 
        showEmptySearch: ->
            searchView = new Show.SearchView()
            NZBAppManager.mainRegion.show searchView
        showResultsForSearch: (type, term) ->
            if not searchView then Show.Controller.showEmptySearch()

            switch type
                when 'movies'
                    $.when(NZBAppManager.request('movies:search', term)).done (results) ->
                        searchView.renderResults new NZBAppManager.MoviesApp.List.Movies collection: results
                when 'shows'
                    $.when(NZBAppManager.request('shows:search', term)).done (results) ->
                        searchView.renderResults new NZBAppManager.ShowsApp.List.Shows collection: results