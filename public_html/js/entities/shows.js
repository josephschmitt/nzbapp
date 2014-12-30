(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var addShow, getShow, getShowSearchResults, getShows, shows;
    Entities.ShowResult = (function(_super) {
      __extends(ShowResult, _super);

      function ShowResult() {
        return ShowResult.__super__.constructor.apply(this, arguments);
      }

      ShowResult.prototype.parse = function(response, options) {
        response = _.pick((response.info != null ? response.info : response), ['name', 'show_name', 'network', 'first_aired', 'status']);
        return ShowResult.__super__.parse.call(this, response, options);
      };

      ShowResult.prototype.sync = function(method, model, options) {
        if (options == null) {
          options = {};
        }
        if (method === 'create' || method === 'update') {
          this.local = true;
        } else {
          this.local = void 0;
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback'
        });
        return ShowResult.__super__.sync.call(this, method, model, options);
      };

      return ShowResult;

    })(Backbone.Model);
    Entities.ShowResults = (function(_super) {
      __extends(ShowResults, _super);

      function ShowResults() {
        return ShowResults.__super__.constructor.apply(this, arguments);
      }

      ShowResults.prototype.model = Entities.ShowResult;

      ShowResults.prototype.storeName = 'Entities.ShowResults';

      ShowResults.prototype.parse = function(response) {
        var _ref;
        if (response.data) {
          if ((_ref = response.data) != null ? _ref.results : void 0) {
            return response.data.results;
          } else {
            return _.toArray(response.data);
          }
        } else {
          return response;
        }
      };

      ShowResults.prototype.sync = function(method, model, options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback'
        });
        return ShowResults.__super__.sync.apply(this, arguments);
      };

      return ShowResults;

    })(Backbone.Collection);
    shows = null;
    getShowSearchResults = function(term) {
      var defer, showSearchResults;
      defer = $.Deferred();
      showSearchResults = new Entities.ShowResults([]);
      showSearchResults.url = NZBAppManager.request('api:endpoint', 'SickBeard', 'sb.searchtvdb');
      showSearchResults.fetch({
        data: {
          name: term
        },
        success: function() {
          return defer.resolve(showSearchResults);
        }
      });
      return defer.promise();
    };
    getShows = function() {
      var defer;
      defer = $.Deferred();
      if (!shows) {
        shows = new Entities.ShowResults([]);
        shows.url = NZBAppManager.request('api:endpoint', 'SickBeard', 'shows');
        shows.fetch({
          success: function() {
            shows.each(function(show) {
              return show != null ? show.save() : void 0;
            });
            return defer.resolve(shows);
          }
        });
      } else {
        _.defer(function() {
          return defer.resolve(shows);
        });
      }
      return defer.promise();
    };
    getShow = function(tvdbid) {
      var defer, show;
      defer = $.Deferred();
      show = new Entities.ShowResult({});
      show.url = NZBAppManager.request('api:endpoint', 'SickBeard', 'show');
      show.fetch({
        data: {
          tvdbid: tvdbid
        },
        success: function() {
          return defer.resolve(show);
        }
      });
      return defer.promise();
    };
    addShow = function(show) {
      var defer;
      defer = $.ajax(NZBAppManager.request('api:endpoint', 'SickBeard', 'show.addnew'), {
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {
          tvdbid: show.get('tvdbid')
        }
      });
      return defer.promise();
    };
    NZBAppManager.reqres.setHandler('shows:search', function(term) {
      return getShowSearchResults(term);
    });
    NZBAppManager.reqres.setHandler('shows:list', function() {
      return getShows();
    });
    NZBAppManager.reqres.setHandler('show:info', function(tvdbid) {
      return getShow(tvdbid);
    });
    return NZBAppManager.reqres.setHandler('show:add', function(show) {
      return addShow(show);
    });
  });

}).call(this);
