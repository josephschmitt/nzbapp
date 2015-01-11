(function() {
  var jjs,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    return Entities.FilteredCollection = (function() {
      function FilteredCollection(options) {
        this.where = __bind(this.where, this);
        this.filter = __bind(this.filter, this);
        this.applyFilter = __bind(this.applyFilter, this);
        this.original = options.collection;
        this.filtered = new this.original.constructor();
        this.filtered.add(this.original.models);
        this.filtered.filterFunction = options.filterFunction;
        this.filtered.filter = this.filter;
        this.filtered.where = this.where;
        this.original.on("reset", function() {
          var items;
          items = this.applyFilter(this.filtered._currentCriterion, this.filtered._currentFilter);
          this.filtered.reset(items);
        });
        this.original.on("add", function(models) {
          var coll, items;
          coll = new this.original.constructor();
          coll.add(models);
          items = this.applyFilter(this.filtered._currentCriterion, this.filtered._currentFilter, coll);
          this.filtered.add(items);
        });
        return this.filtered;
      }

      FilteredCollection.prototype.applyFilter = function(filterCriterion, filterStrategy, collection) {
        var criterion, filterFunction, items;
        collection = collection || this.original;
        criterion = void 0;
        if (filterStrategy === "filter") {
          criterion = filterCriterion != null ? filterCriterion.trim() : void 0;
        } else {
          criterion = filterCriterion;
        }
        items = [];
        if (criterion) {
          if (filterStrategy === "filter") {
            if (!this.filtered.filterFunction) {
              throw "Attempted to use 'filter' function, but none was defined";
            }
            filterFunction = this.filtered.filterFunction(criterion);
            items = collection.filter(filterFunction);
          } else {
            items = collection.where(criterion);
          }
        } else {
          items = collection.models;
        }
        this.filtered._currentCriterion = criterion;
        return items;
      };

      FilteredCollection.prototype.filter = function(filterCriterion) {
        var items;
        this.filtered._currentFilter = "filter";
        items = this.applyFilter(filterCriterion, "filter");
        this.filtered.reset(items);
        return this.filtered;
      };

      FilteredCollection.prototype.where = function(filterCriterion) {
        var items;
        this.filtered._currentFilter = "where";
        items = this.applyFilter(filterCriterion, "where");
        this.filtered.reset(items);
        return this.filtered;
      };

      return FilteredCollection;

    })();
  });

}).call(this);
