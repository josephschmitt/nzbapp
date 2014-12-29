(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ModalApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
    return Show.Movie = (function(_super) {
      __extends(Movie, _super);

      function Movie() {
        return Movie.__super__.constructor.apply(this, arguments);
      }

      Movie.prototype.template = '#media-added-modal-template';

      Movie.prototype.className = 'reveal-modal';

      return Movie;

    })(Marionette.ItemView);
  });

}).call(this);
