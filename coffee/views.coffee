# Custom renderer implementation
Backbone.Marionette.Renderer.render = (template, data) ->
  _.template($(template).html(), data, {variable: 'data'})

do ->
    # `tbs` is our namespace. Everything should be in `tbs` to avoid name conflicts.
    tbs = window.js = (window.tbs or {})