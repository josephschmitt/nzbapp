(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var jjs;
    jjs = window.jjs = window.jjs || {};
    return jjs.NZBAppManager.module('SearchApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
      return Show.SearchView = (function(_super) {
        __extends(SearchView, _super);

        function SearchView() {
          return SearchView.__super__.constructor.apply(this, arguments);
        }

        SearchView.prototype.template = '#search-template';

        SearchView.prototype.timeout = 0;

        SearchView.prototype.regions = {
          resultsRegion: '#search-results-region'
        };

        SearchView.prototype.ui = {
          searchField: 'input[type="search"]',
          type: 'input[name="type"]'
        };

        SearchView.prototype.render = function() {
          SearchView.__super__.render.apply(this, arguments);
          clearTimeout(this.timeout);
          this.ui.searchField.on('keydown', (function(_this) {
            return function(e) {
              _this.model.set('value', _this.ui.searchField.val());
              clearTimeout(_this.timeout);
              return _this.timeout = setTimeout(function() {
                return _this.search(e);
              }, 300);
            };
          })(this));
          return this.ui.type.on('change', (function(_this) {
            return function(e) {
              _this.model.set('type', _this.ui.type.filter(':checked').val());
              if (_this.model.get('term')) {
                return _this.search(e);
              }
            };
          })(this));
        };

        SearchView.prototype.renderResults = function(view) {
          return this.resultsRegion.show(view);
        };

        SearchView.prototype.search = function(e) {
          e.preventDefault();
          return NZBAppManager.trigger('search:results:show', this.model.get('type'), this.model.get('value'));
        };

        return SearchView;

      })(Marionette.LayoutView);
    });
  })();

}).call(this);
