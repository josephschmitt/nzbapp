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
            if not searchView
                Show.Controller.showSearch()
                searchView.model.set type: type, value: term
                searchView.render()
            else searchView.clearResults()

            if not type or not term then return

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