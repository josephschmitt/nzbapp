(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('GUI.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    List.NoResults = (function(_super) {
      __extends(NoResults, _super);

      function NoResults() {
        return NoResults.__super__.constructor.apply(this, arguments);
      }

      NoResults.prototype.template = '#noresults-template';

      NoResults.prototype.title = 'No Results';

      NoResults.prototype.render = function() {
        return this.$el.append(Backbone.Marionette.Renderer.render(this.template, {
          title: this.title
        }));
      };

      return NoResults;

    })(Marionette.ItemView);
    List.FilterableList = (function(_super) {
      __extends(FilterableList, _super);

      function FilterableList() {
        this.renderBar = __bind(this.renderBar, this);
        return FilterableList.__super__.constructor.apply(this, arguments);
      }

      FilterableList.prototype.template = '#filterable-list-template';

      FilterableList.prototype.regions = {
        filterBarRegion: '#filter-bar-region',
        listRegion: '#list-region'
      };

      FilterableList.prototype.listClass = Marionette.CollectionView;

      FilterableList.prototype.render = function() {
        FilterableList.__super__.render.apply(this, arguments);
        return this.listRegion.show(new this.listClass());
      };

      FilterableList.prototype.renderBar = function() {
        var _ref, _ref1;
        this.filterBarRegion.show(new List.FilterBar({
          collection: this.filtersCollection
        }));
        this.listenTo(this.filterBarRegion.currentView, 'search', (function(_this) {
          return function(term) {
            return _this.trigger('filter', term);
          };
        })(this));
        return NZBAppManager.mainRegion.el.scrollTop = (_ref = this.filterBarRegion.currentView) != null ? (_ref1 = _ref.$el) != null ? _ref1.outerHeight() : void 0 : void 0;
      };

      FilterableList.prototype.setCollection = function(collection) {
        if (collection.models.length) {
          return this.renderBar();
        } else {
          return this.listenTo(collection, 'sync', this.renderBar);
        }
      };

      return FilterableList;

    })(Marionette.LayoutView);
    List.FilterItem = (function(_super) {
      __extends(FilterItem, _super);

      function FilterItem() {
        return FilterItem.__super__.constructor.apply(this, arguments);
      }

      FilterItem.prototype.template = '#filter-bar-item-template';

      FilterItem.prototype.events = {
        'click a': 'click'
      };

      FilterItem.prototype.initialize = function() {
        FilterItem.__super__.initialize.apply(this, arguments);
        return this.listenTo(this.model, 'change', this.render);
      };

      FilterItem.prototype.click = function(e) {
        e.preventDefault();
        this.model.collection.findWhere({
          active: true
        }).set('active', false);
        this.model.set('active', true);
        return NZBAppManager.trigger(this.model.get('trigger'), this.model.get('name'));
      };

      return FilterItem;

    })(Marionette.ItemView);
    return List.FilterBar = (function(_super) {
      __extends(FilterBar, _super);

      function FilterBar() {
        return FilterBar.__super__.constructor.apply(this, arguments);
      }

      FilterBar.prototype.template = '#filter-bar-template';

      FilterBar.prototype.childView = List.FilterItem;

      FilterBar.prototype.childViewContainer = '.filter-item-container';

      FilterBar.prototype.ui = {
        search: 'input[type="search"]'
      };

      FilterBar.prototype.events = {
        'keyup @ui.search': 'keyup'
      };

      FilterBar.prototype.keyup = function(e) {
        return this.search(this.ui.search.val());
      };

      FilterBar.prototype.search = function(term) {
        return this.trigger('search', term);
      };

      return FilterBar;

    })(Marionette.CompositeView);
  });

}).call(this);
