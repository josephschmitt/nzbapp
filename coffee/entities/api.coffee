do ->
    # `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
    jjs = window.jjs = (window.jjs or {})

    jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
        NZBAppManager.reqres.setHandler 'api:call', (service, endpoint) ->
            console.log 'settings', NZBAppManager.request('server:settings:get')
            
            serverSettings = NZBAppManager.request('server:settings:get')
            serviceModel = serverSettings.findWhere(name: service)

            return "#{serviceModel.get('serverUrl')}/api/#{serviceModel.get('token')}/#{if service is 'SickBeard' then '?cmd=' else ''}#{endpoint}"