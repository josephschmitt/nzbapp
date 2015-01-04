(function() {
  var jjs;

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('Entities', function(Entities, NZBAppManager, Backbone, Marionette, $, _) {
    var getDownloadsTitlebar, getMoviesTitlebar, getSearchTitlebar, getSettingsTitlebar, getShowsTitlebar, titleData;
    titleData = null;
    getSearchTitlebar = function() {
      return titleData = new Backbone.Model({
        title: 'Search'
      });
    };
    getMoviesTitlebar = function() {
      return titleData = new Backbone.Collection([
        {
          title: 'Movies',
          url: 'movies/wanted',
          trigger: 'movies:wanted:list'
        }, {
          title: 'Soon',
          url: 'movies/soon',
          trigger: 'movies:soon:list'
        }
      ]);
    };
    getShowsTitlebar = function() {
      return titleData = new Backbone.Collection([
        {
          title: 'Shows',
          url: 'shows/wanted',
          trigger: 'shows:wanted:list'
        }, {
          title: 'Upcoming',
          url: 'shows/upcoming',
          trigger: 'shows:upcoming:list'
        }
      ]);
    };
    getDownloadsTitlebar = function() {
      return titleData = new Backbone.Collection([
        {
          title: 'Queue',
          url: 'downloads/queue',
          trigger: 'downloads:queue:list'
        }, {
          title: 'History',
          url: 'downloads/history',
          trigger: 'downloads:history:list'
        }
      ]);
    };
    getSettingsTitlebar = function() {
      return titleData = new Backbone.Model({
        title: 'Settings'
      });
    };
    NZBAppManager.reqres.setHandler('titlebar:search:entities', function() {
      return getSearchTitlebar();
    });
    NZBAppManager.reqres.setHandler('titlebar:movies:entities', function() {
      return getMoviesTitlebar();
    });
    NZBAppManager.reqres.setHandler('titlebar:shows:entities', function() {
      return getShowsTitlebar();
    });
    NZBAppManager.reqres.setHandler('titlebar:downloads:entities', function() {
      return getDownloadsTitlebar();
    });
    return NZBAppManager.reqres.setHandler('titlebar:settings:entities', function() {
      return getSettingsTitlebar();
    });
  });

}).call(this);
