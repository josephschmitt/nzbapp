# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'PopupApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
    class Show.Alert extends Marionette.ItemView
        template: '#alert-template'
        className: 'alert-box success'
        ui:
            close: '.close'
        events:
            'click @ui.close': 'close'
        render: ->
            super
            @$el.attr 'data-alert', true
            setTimeout =>
                @close()
            , 3000
        close: (e) ->
            e?.preventDefault()
            NZBAppManager.dismissModal()

    class Show.Modal extends Marionette.ItemView
        template: '#modal-template'
        className: 'reveal-modal'
        ui:
            close: '.close'
        events:
            'click @ui.close': 'close'
        close: (e) ->
            e.preventDefault()
            @closePromise?.done()