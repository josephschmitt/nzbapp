(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('GUI.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    return List.NoResults = (function(_super) {
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
  });

}).call(this);
