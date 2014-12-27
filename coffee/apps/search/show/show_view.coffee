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
                type: 'input[name="type"]'
            render: ->
                super
                clearTimeout @timeout
                @ui.searchField.on 'keydown', (e) =>
                    @model.set 'value', @ui.searchField.val()

                    clearTimeout @timeout
                    @timeout = setTimeout =>
                        @search e
                    , 300
                @ui.type.on 'change', (e) =>
                    @model.set 'type', @ui.type.filter(':checked').val()
                    if @model.get 'term' then @search(e)
            renderResults: (view) ->
                @resultsRegion.show view
            search: (e) ->
                e.preventDefault()
                NZBAppManager.trigger 'search:results:show', @model.get('type'), @model.get('value')
