do ->
    # `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
    jjs = window.jjs = (window.jjs or {})

    jjs.NZBAppManager.module 'SearchApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
        class Show.SearchView extends Marionette.LayoutView
            template: '#search-template'
            timeout: 0
            regions:
                resultsRegion: '#search-results-region'
            ui:
                searchField: 'input[type="search"]'
            render: ->
                super
                @ui.searchField.on 'keydown', (e) =>
                    clearTimeout @timeout
                    @timeout = setTimeout =>
                        clearTimeout @timeout
                        @search e
                    , 300
            renderResults: (view) ->
                @resultsRegion.show view
            search: (e) ->
                e.preventDefault()
                NZBAppManager.trigger 'search:results:show', 'movies', $(e.currentTarget).val()
