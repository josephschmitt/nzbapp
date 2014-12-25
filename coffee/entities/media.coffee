do ->
    # `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
    jjs = window.jjs = (window.jjs or {})

    jjs.NZBAppManager.module 'Media', (Media, NZBAppManager, Backbone, Marionette, $, _) ->
    	# class Media.CPMediaItem extends Backbone.Model
    	# class Media.CouchPotato extends Backbone.Collection
    	# 	url: NZBAppManager.request('api:call', 'CouchPotato', 'media.list')
    	# 	model: Backbone.Model