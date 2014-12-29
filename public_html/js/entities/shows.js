(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var addShow, getShow, getShowSearchResults, getShows, showSearchResults, shows;
    Entities.ShowResult = (function(_super) {
      __extends(ShowResult, _super);

      function ShowResult() {
        return ShowResult.__super__.constructor.apply(this, arguments);
      }

      ShowResult.prototype.fetch = function(options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback'
        });
        return ShowResult.__super__.fetch.call(this, options);
      };

      return ShowResult;

    })(Backbone.Model);
    Entities.ShowResults = (function(_super) {
      __extends(ShowResults, _super);

      function ShowResults() {
        return ShowResults.__super__.constructor.apply(this, arguments);
      }

      ShowResults.prototype.model = Entities.ShowResult;

      ShowResults.prototype.parse = function(response) {
        var _ref;
        if ((_ref = response.data) != null ? _ref.results : void 0) {
          return response.data.results;
        } else {
          return _.toArray(response.data);
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
    showSearchResults = null;
    getShowSearchResults = function(term) {
      var defer;
      defer = $.Deferred();
      if (!showSearchResults) {
        showSearchResults = new Entities.ShowResults([], {
          url: NZBAppManager.request('api:endpoint', 'SickBeard', 'sb.searchtvdb')
        });
        showSearchResults.fetch({
          data: {
            name: term
          },
          success: function() {
            return defer.resolve(showSearchResults);
          }
        });
      } else {
        defer.resolve(showSearchResults);
      }
      return defer.promise();
    };
    getShows = function() {
      var defer;
      defer = $.Deferred();
      if (!shows) {
        shows = new Entities.ShowResults([], {
          url: NZBAppManager.request('api:endpoint', 'SickBeard', 'shows')
        });
        shows.fetch({
          success: function() {
            return defer.resolve(shows);
          }
        });
      } else {
        defer.resolve(shows);
      }
      return defer.promise();
    };
    getShow = function(tvdbid) {
      var defer, show;
      defer = $.Deferred();
      show = new Entities.ShowResult({}, {
        url: NZBAppManager.request('api:endpoint', 'SickBeard', 'show')
      });
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
