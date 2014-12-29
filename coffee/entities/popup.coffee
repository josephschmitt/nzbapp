do ->
    # `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
    jjs = window.jjs = (window.jjs or {})

    jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
    	class Entities.Popup extends Backbone.Model
    		defaults:
    			title: 'Popup Title'
    			lead: 'Lead here'
    			body: 'Body text here'