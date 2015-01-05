do ->
    # `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
    jjs = window.jjs = (window.jjs or {})

    jjs.NZBAppManager.module 'SearchApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
        class Show.SearchView extends Marionette.LayoutView
            template: '#search-template'
            className: 'search-view'
            timeout: 0
            doBlur: true
            keycodes:
                backspace: 8
                tab: 9
                enter: 13
                shift: 16
                left: 37
                up: 38
                right: 39
                down: 40
                delete: 46
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
                'click @ui.type': (e) -> e.stopPropagation()
                'click @ui.switch': 'switchMedia'
            initialize: ->
                super
                $(window).on 'resize', => @positionToggle()
                @model = new Backbone.Model()
            render: ->
                super
                if not @model
                    @model = new Backbone.Model type: @getType(), value: @getTerm()

                # Position toggle
                _.defer @positionToggle

                # Setup search on keyup
                clearTimeout @timeout
                @ui.searchField.on 'keyup', (e) =>
                    if e.which not in [@keycodes.tab, @keycodes.shift, @keycodes.left, @keycodes.up, @keycodes.right, @keycodes.down]
                        @model.set 'value', @getTerm()

                        clearTimeout @timeout
                        @timeout = setTimeout =>
                            @search e
                        , 500

                @updateState()
                @updateToggleSwitch()
            updateState: (focused) ->
                if !focused and !@resultsRegion.currentView?.collection.length and !@model.get 'value'
                    @ui.switch.removeClass 'small'
                    @positionToggle(true)
                    @ui.container.removeClass 'focus'
                else
                    @ui.container.addClass 'focus'
                    @ui.switch.addClass 'small'

                    if focused
                        _.delay =>
                            @ui.searchField.trigger 'focus'
                        , 250
            updateToggleSwitch: ->
                toggle = not @ui.type.eq(0).prop 'checked'
                @ui.switch.toggleClass 'flip', toggle
                setTimeout =>
                    @ui.switch.toggleClass 'backface', toggle
                , 125
            positionToggle: (animate)=>
                if not animate then @ui.switchContainer.removeClass 'animate'
                @ui.switchContainer.css 'transform', "translateX(#{@ui.switchContainer.width()/2 - @ui.switchContainer.parent().width()/2}px)"
                @ui.switchContainer.addClass 'animate'
            switchMedia: _.throttle (e) ->
                @doBlur = false
                
                if @ui.type.eq(0).prop 'checked'
                    @ui.type.eq(1)
                        .prop 'checked', true
                        .trigger 'change'
                else 
                    @ui.type.eq(0)
                        .prop 'checked', true
                        .trigger 'change'

                @updateToggleSwitch()
            , 10
            focusField: (e)->
                e?.preventDefault()
                @updateState(true)
            blurField: (e) ->
                @doBlur = true
                _.delay =>
                    if @doBlur
                        @updateState(false)
                    else
                        @ui.searchField.trigger 'focus'
                , 100
            typeChange: (e) ->
                @model.set 'type', @getType()
                if @getTerm() then @search(e)
                @ui.searchField.attr 'placeholder', "Search for a #{if @model.get('type') is 'shows' then 'TV Show' else 'Movie'}"
            getTerm: ->
                @ui.searchField.val()
            getType: ->
                checked = _.find @ui.type, (el) -> $(el).prop 'checked'
                if checked then $(checked).val() else @ui.type.eq(0).val()
            renderResults: (view) ->
                @resultsRegion.show view
            clearResults: ->
                @resultsRegion.reset()
            search: (e) ->
                e.preventDefault()
                NZBAppManager.trigger 'search:results:show', @model?.get('type'), @model?.get('value')
