do ->
    # `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
    jjs = window.jjs = (window.jjs or {})

    jjs.NZBAppManager.module 'SearchApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
        class Show.SearchView extends Marionette.LayoutView
            template: '#search-template'
            className: 'search-view'
            timeout: 0
            doBlur: true
            regions:
                resultsRegion: '#search-results-region'
            ui:
                searchField: 'input[type="search"]'
                capture: '.keyboard-capture'
                container: '.search-field-container'
                type: 'input[name="type"]'
                switch: '.media-switch'
                switchContainer: '.media-switch-container'
            events:
                'click @ui.capture': 'focusField'
                'blur @ui.searchField': 'blurField'
                'change @ui.type': 'typeChange'
                'click @ui.type': (e) -> 
                    e.stopPropagation()
                    $(@).trigger 'change'
                'click @ui.switch': 'switchMedia'
            render: ->
                super
                if not @model
                    @model = new Backbone.Model type: @getType(), value: @getTerm()
                # Position toggle
                _.defer @positionToggle
                $(window).on 'resize', => @positionToggle()
                # Setup search on keyup
                clearTimeout @timeout
                @ui.searchField.on 'keyup', (e) =>
                    @model.set 'value', @getTerm()

                    clearTimeout @timeout
                    @timeout = setTimeout =>
                        @search e
                    , 500
                # Default to first checked item
                @ui.type.eq(0).prop 'checked', true
                # Update type on radio change
                @ui.type.on 'change', (e) =>
                    @model.set 'type', @getType()
                    if @model.get 'value' then @search(e)
            positionToggle: (animate)=>
                if not animate then @ui.switchContainer.removeClass 'animate'
                @ui.switchContainer.css 'transform', "translateX(#{@ui.switchContainer.width()/2 - @ui.switchContainer.parent().width()/2}px)"
                @ui.switchContainer.addClass 'animate'
            switchMedia: _.throttle (e) ->
                @doBlur = false
                @ui.switch.toggleClass 'flip'
                setTimeout =>
                    @ui.switch.toggleClass 'backface',
                , 125

                if @ui.switch.hasClass 'flip'
                    @ui.type.eq(1)
                        .prop 'checked', true
                        .trigger 'change'
                else 
                    @ui.type.eq(0)
                        .prop 'checked', true
                        .trigger 'change'
            , 10
            focusField: (e)->
                e.preventDefault()
                if not @ui.container.hasClass 'focus'
                    @ui.container.addClass 'focus'
                    @ui.switch.addClass 'small'

                    _.delay =>
                        @ui.searchField.trigger 'focus'
                    , 100
            blurField: (e) ->
                @doBlur = true
                _.delay =>
                    if @doBlur and not @model.get 'value'
                        @ui.switch.removeClass 'small'
                        @positionToggle(true)
                        @ui.container.removeClass 'focus'
                        @doBlur = true
                    else
                        @ui.searchField.trigger 'focus'
                , 250
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
                if @model.get 'value'
                    NZBAppManager.trigger 'search:results:show', @model?.get('type'), @model?.get('value')
