do ->
    # `js` is our namespace. Everything should be in `js` to avoid name conflicts.
    js = window.js = (window.js or {})

    NZBAppManager.module 'Entities', (Entities, ContactManager, Backbone, Marionette, $, _) ->
