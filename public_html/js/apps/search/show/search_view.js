(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var jjs;
    jjs = window.jjs = window.jjs || {};
    return jjs.NZBAppManager.module('SearchApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
      Show.Result = (function(_super) {
        __extends(Result, _super);

        function Result() {
          return Result.__super__.constructor.apply(this, arguments);
        }

        Result.prototype.template = '#search-result-template';

        Result.prototype.className = 'search-result row';

        Result.prototype.tagName = 'li';

        return Result;

      })(Marionette.ItemView);
      Show.SearchResults = (function(_super) {
        __extends(SearchResults, _super);

        function SearchResults() {
          return SearchResults.__super__.constructor.apply(this, arguments);
        }

        SearchResults.prototype.tagName = 'ul';

        SearchResults.prototype.className = 'search-results';

        SearchResults.prototype.childView = Show.Result;

        return SearchResults;

      })(Marionette.CollectionView);
      return Show.SearchView = (function(_super) {
        __extends(SearchView, _super);

        function SearchView() {
          return SearchView.__super__.constructor.apply(this, arguments);
        }

        SearchView.prototype.template = '#search-template';

        SearchView.prototype.regions = {
          resultsRegion: '#search-results-region'
        };

        SearchView.prototype.render = function() {
          return SearchView.__super__.render.apply(this, arguments);
        };

        return SearchView;

      })(Marionette.LayoutView);
    });
  })();

}).call(this);
