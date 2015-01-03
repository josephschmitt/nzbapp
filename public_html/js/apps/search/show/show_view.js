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

        SearchView.prototype.events = {
          'change @ui.type': 'typeChange'
        };

        SearchView.prototype.render = function() {
          SearchView.__super__.render.apply(this, arguments);
          if (!this.model) {
            this.model = new Backbone.Model({
              type: this.getType(),
              value: this.getTerm()
            });
          }
          clearTimeout(this.timeout);
          this.ui.searchField.on('keyup', (function(_this) {
            return function(e) {
              _this.model.set('value', _this.getTerm());
              clearTimeout(_this.timeout);
              return _this.timeout = setTimeout(function() {
                return _this.search(e);
              }, 500);
            };
          })(this));
          return this.ui.type.on('change', (function(_this) {
            return function(e) {
              _this.model.set('type', _this.getType());
              if (_this.model.get('value')) {
                return _this.search(e);
              }
            };
          })(this));
        };

        SearchView.prototype.typeChange = function(e) {
          return this.ui.searchField.attr('placeholder', "Search for a " + (this.model.get('type') === 'shows' ? 'TV Show' : 'Movie'));
        };

        SearchView.prototype.getTerm = function() {
          return this.ui.searchField.val();
        };

        SearchView.prototype.getType = function() {
          return this.ui.type.filter(':checked').val();
        };

        SearchView.prototype.renderResults = function(view) {
          return this.resultsRegion.show(view);
        };

        SearchView.prototype.clearResults = function() {
          return this.resultsRegion.reset();
        };

        SearchView.prototype.search = function(e) {
          var _ref, _ref1;
          e.preventDefault();
          return NZBAppManager.trigger('search:results:show', (_ref = this.model) != null ? _ref.get('type') : void 0, (_ref1 = this.model) != null ? _ref1.get('value') : void 0);
        };

        return SearchView;

      })(Marionette.LayoutView);
    });
  })();

}).call(this);
