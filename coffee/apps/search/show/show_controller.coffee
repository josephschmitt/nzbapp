# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'SearchApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
    searchView = null
    defer = null
    Show.Controller = 
        showSearch: ->
            searchView = new Show.SearchView()
            NZBAppManager.mainRegion.show searchView
            NZBAppManager.execute 'titlebar:show', NZBAppManager.request('titlebar:search:entities')
        showResultsForSearch: (type, term) ->
            if not searchView then Show.Controller.showSearch()
            else searchView.clearResults()
            searchView.model = new Backbone.Model type: type, value: term

            defer?.fail()

            switch type
                when 'movies'
                    defer = $.when(NZBAppManager.request('movies:search', term)).done (results) ->
                        defer = null
                        searchView.renderResults new NZBAppManager.MoviesApp.List.Movies collection: results
                when 'shows'
                    defer = $.when(NZBAppManager.request('shows:search', term)).done (results) ->
                        defer = null
                        searchView.renderResults new NZBAppManager.ShowsApp.List.Shows collection: results