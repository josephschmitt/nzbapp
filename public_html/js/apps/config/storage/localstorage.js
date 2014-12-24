(function() {
  (function() {
    var jjs;
    jjs = window.jjs = window.jjs || {};
    return jjs.NZBAppManager.module('Entities', function(Entities, ContactManager, Backbone, Marionette, $, _) {
      var StorageMixin, findStorageKey;
      findStorageKey = function(entity) {
        if (entity.urlRoot) {
          return _.result(entity, 'urlRoot');
        }
        if (entity.url) {
          return _.result(entity, 'url');
        }
        if (entity.collection && entity.collection.url) {
          return _.result(entity.collection, 'url');
        }
        throw new Error('Unable to determine storage key');
      };
      StorageMixin = (function() {
        function StorageMixin(entityPrototype) {
          ({
            localStorage: new Backbone.LocalStorage(findStorageKey(entityPrototype))
          });
        }

        return StorageMixin;

      })();
      return Entities.configureStorage = function(entity) {
        return _.extend(entity.prototype, new StorageMixin(entity.prototype));
      };
    });
  })();

}).call(this);
