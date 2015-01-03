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
            events:
                'change @ui.type': 'typeChange'
            render: ->
                super
                if not @model
                    @model = new Backbone.Model type: @getType(), value: @getTerm()

                clearTimeout @timeout
                @ui.searchField.on 'keyup', (e) =>
                    @model.set 'value', @getTerm()

                    clearTimeout @timeout
                    @timeout = setTimeout =>
                        @search e
                    , 500

                @ui.type.on 'change', (e) =>
                    @model.set 'type', @getType()
                    if @model.get 'value' then @search(e)
            typeChange: (e) ->
                @ui.searchField.attr 'placeholder', "Search for a #{if @model.get('type') is 'shows' then 'TV Show' else 'Movie'}"
            getTerm: ->
                @ui.searchField.val()
            getType: ->
                @ui.type.filter(':checked').val()
            renderResults: (view) ->
                @resultsRegion.show view
            clearResults: ->
                @resultsRegion.reset()
            search: (e) ->
                e.preventDefault()
                NZBAppManager.trigger 'search:results:show', @model?.get('type'), @model?.get('value')
