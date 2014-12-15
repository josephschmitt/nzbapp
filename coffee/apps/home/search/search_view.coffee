do ->
    # `js` is our namespace. Everything should be in `js` to avoid name conflicts.
    js = window.js = (window.js or {})

    js.NZBAppManager.module 'Home.Search', (Search, NZBAppManager, Backbone, Marionette, $, _) ->