# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'PopupApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
	Show.Controller = 
		showAlert: (message) ->
			NZBAppManager.showModal new Show.Alert 
				model: new Backbone.Model(message: message)
		showModal: (model, closePromise) ->
			NZBAppManager.showModal new Show.Alert 
				model: model
				closePromise: closePromise