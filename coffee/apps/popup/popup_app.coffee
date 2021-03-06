# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'PopupApp', (Popup, NZBAppManager, Backbone, Marionette, $, _) ->

	NZBAppManager.commands.setHandler 'popup:alert:show', (message, status) ->
		Popup.Show.Controller.showAlert(message, status)

	NZBAppManager.commands.setHandler 'popup:modal:show', (model, closePromise) ->
		Popup.Show.Controller.showModal(model, closePromise)