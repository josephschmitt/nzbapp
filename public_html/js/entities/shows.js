(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var addShow, getShow, getShowSearchResults, getShows;
    Entities.Shows = {};
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
          jsonp: 'callback',
          jsonpCallback: options.jsonpCallback || 'jjs.AppConfig.callback_func'
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

      ShowResults.prototype.fetch = function(options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback',
          jsonpCallback: options.jsonpCallback || 'jjs.AppConfig.callback_func'
        });
        return ShowResults.__super__.fetch.call(this, options);
      };

      return ShowResults;

    })(Backbone.Collection);
    getShowSearchResults = function(term) {
      var defer, shows;
      defer = $.Deferred();
      shows = new Entities.ShowResults([], {
        url: NZBAppManager.request('api:endpoint', 'SickBeard', 'sb.searchtvdb')
      });
      shows.fetch({
        jsonpCallback: 'jjs.NZBAppManager.Entities.Shows.onShowsSearch',
        data: {
          name: term
        }
      });
      Entities.Shows.onShowsSearch = function(response) {
        return defer.resolve(shows.set(response.data.results));
      };
      return defer.promise();
    };
    getShows = function() {
      var defer, shows;
      defer = $.Deferred();
      shows = new Entities.ShowResults([], {
        url: NZBAppManager.request('api:endpoint', 'SickBeard', 'shows')
      });
      shows.fetch({
        jsonpCallback: 'jjs.NZBAppManager.Entities.Shows.onShowsList'
      });
      Entities.Shows.onShowsList = function(response) {
        return defer.resolve(shows.set(_.toArray(response.data)));
      };
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
        jsonpCallback: 'jjs.NZBAppManager.Entities.Shows.onShowInfo'
      });
      Entities.Shows.onShowInfo = function(response) {
        return defer.resolve(show.set(response.data));
      };
      return defer.promise();
    };
    addShow = function(show) {
      var defer;
      defer = $.Deferred();
      $.ajax(NZBAppManager.request('api:endpoint', 'SickBeard', 'show.addnew'), {
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'jjs.NZBAppManager.Entities.Shows.onShowAdded',
        data: {
          tvdbid: show.get('tvdbid')
        }
      });
      Entities.Shows.onShowAdded = function(response) {
        return defer.resolve(response);
      };
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
