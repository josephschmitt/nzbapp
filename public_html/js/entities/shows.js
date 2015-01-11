(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var addShow, getShow, getShowSearchResults, getShows, getSortOptions, getUpcomingEpisodes, removeShow, shows, showsTabs, upcoming;
    Entities.ShowResult = (function(_super) {
      __extends(ShowResult, _super);

      function ShowResult() {
        return ShowResult.__super__.constructor.apply(this, arguments);
      }

      ShowResult.prototype.parse = function(response, options) {
        response = _.pick((response.info != null ? response.info : response), ['name', 'show_name', 'network', 'first_aired', 'status', 'tvdbid', 'next_ep_airdate']);
        response.first_aired = response.first_aired ? moment(response.first_aired).format('ddd MMM Do, YYYY') : null;
        response.poster = "" + (NZBAppManager.request('api:endpoint', 'SickBeard', 'show.getposter')) + "&tvdbid=" + response.tvdbid;
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

      ShowResults.prototype.comparator = 'show_name';

      ShowResults.prototype.model = Entities.ShowResult;

      ShowResults.prototype.parse = function(response, options) {
        var _ref;
        if (response.data) {
          if ((_ref = response.data) != null ? _ref.results : void 0) {
            return ShowResults.__super__.parse.call(this, response.data.results, options);
          } else {
            return ShowResults.__super__.parse.call(this, _.toArray(response.data), options);
          }
        } else if (response.length) {
          return ShowResults.__super__.parse.call(this, response, options);
        } else {
          return ShowResults.__super__.parse.call(this, [], options);
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
    Entities.ShowSearchResults = (function(_super) {
      __extends(ShowSearchResults, _super);

      function ShowSearchResults() {
        return ShowSearchResults.__super__.constructor.apply(this, arguments);
      }

      ShowSearchResults.prototype.parse = function(response, options) {
        var _ref;
        if ((_ref = response.data) != null ? _ref.results : void 0) {
          return ShowSearchResults.__super__.parse.call(this, response.data.results, options);
        } else {
          return ShowSearchResults.__super__.parse.call(this, response, options);
        }
      };

      return ShowSearchResults;

    })(Entities.ShowResults);
    Entities.UpcomingEpisode = (function(_super) {
      __extends(UpcomingEpisode, _super);

      function UpcomingEpisode() {
        return UpcomingEpisode.__super__.constructor.apply(this, arguments);
      }

      UpcomingEpisode.prototype.parse = function(response, options) {
        response.poster = "" + (NZBAppManager.request('api:endpoint', 'SickBeard', 'show.getposter')) + "&tvdbid=" + response.tvdbid;
        return UpcomingEpisode.__super__.parse.call(this, response, options);
      };

      UpcomingEpisode.prototype.sync = function(method, model, options) {
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
        return UpcomingEpisode.__super__.sync.call(this, method, model, options);
      };

      return UpcomingEpisode;

    })(Backbone.Model);
    Entities.UpcomingEpisodes = (function(_super) {
      __extends(UpcomingEpisodes, _super);

      function UpcomingEpisodes() {
        return UpcomingEpisodes.__super__.constructor.apply(this, arguments);
      }

      UpcomingEpisodes.prototype.model = Entities.UpcomingEpisode;

      UpcomingEpisodes.prototype.parse = function(response, options) {
        var _ref;
        return UpcomingEpisodes.__super__.parse.call(this, (_ref = response.data) != null ? _ref.later : void 0, options);
      };

      UpcomingEpisodes.prototype.sync = function(method, model, options) {
        if (options == null) {
          options = {};
        }
        options = _.extend(options, {
          dataType: 'jsonp',
          jsonp: 'callback'
        });
        return UpcomingEpisodes.__super__.sync.apply(this, arguments);
      };

      return UpcomingEpisodes;

    })(Backbone.Collection);
    shows = null;
    upcoming = null;
    showsTabs = null;
    getShowSearchResults = function(term) {
      var defer, showSearchResults;
      defer = $.Deferred();
      showSearchResults = new Entities.ShowSearchResults([]);
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
        shows.url = shows.storeName = NZBAppManager.request('api:endpoint', 'SickBeard', 'shows');
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
    getUpcomingEpisodes = function() {
      var defer;
      defer = $.Deferred();
      if (!upcoming) {
        upcoming = new Entities.UpcomingEpisodes([]);
        upcoming.url = upcoming.storeName = NZBAppManager.request('api:endpoint', 'SickBeard', 'future');
        upcoming.fetch({
          success: function() {
            upcoming.each(function(show) {
              return show != null ? show.save() : void 0;
            });
            return defer.resolve(upcoming);
          }
        });
      } else {
        _.defer(function() {
          return defer.resolve(upcoming);
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
    removeShow = function(show) {
      var defer;
      defer = $.ajax(NZBAppManager.request('api:endpoint', 'SickBeard', 'show.delete'), {
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {
          tvdbid: show.get('tvdbid')
        }
      });
      return defer.promise();
    };
    getSortOptions = function() {
      return new Backbone.Collection([
        {
          title: 'Name',
          active: true,
          trigger: 'shows:sort',
          name: 'show_name'
        }, {
          title: 'Status',
          trigger: 'shows:sort',
          name: 'status'
        }, {
          title: 'Latest',
          trigger: 'shows:sort',
          name: 'next_ep_airdate'
        }
      ]);
    };
    NZBAppManager.reqres.setHandler('shows:search', function(term) {
      return getShowSearchResults(term);
    });
    NZBAppManager.reqres.setHandler('shows:list:entities', function() {
      return getShows();
    });
    NZBAppManager.reqres.setHandler('shows:upcoming:entities', function() {
      return getUpcomingEpisodes();
    });
    NZBAppManager.reqres.setHandler('show:info', function(tvdbid) {
      return getShow(tvdbid);
    });
    NZBAppManager.reqres.setHandler('show:add', function(show) {
      return addShow(show);
    });
    return NZBAppManager.reqres.setHandler('shows:sort_options', function() {
      return getSortOptions();
    });
  });

}).call(this);
