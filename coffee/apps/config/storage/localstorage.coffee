do ->
    # `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
    jjs = window.jjs = (window.jjs or {})
    
    jjs.NZBAppManager.module 'Entities', (Entities, ContactManager, Backbone, Marionette, $, _) ->
        findStorageKey = (entity) ->
            # use a model's urlRoot value
            if entity.urlRoot
                return _.result entity, 'urlRoot'

            # use a collection's url value
            if entity.url
                return _.result entity, 'url'

            # fallback to obtaining a model's storage key from
            # the collection it belongs to
            if entity.collection and entity.collection.url
                return _.result entity.collection, 'url'

            throw new Error 'Unable to determine storage key'

        class StorageMixin
            constructor: (entityPrototype) ->
                localStorage: new Backbone.LocalStorage findStorageKey(entityPrototype)

        Entities.configureStorage = (entity) ->
            _.extend entity.prototype, new StorageMixin entity.prototype
