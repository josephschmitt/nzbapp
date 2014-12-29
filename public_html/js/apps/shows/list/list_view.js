(function() {
  var jjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jjs = window.jjs = window.jjs || {};

  jjs.NZBAppManager.module('ShowsApp.List', function(List, NZBAppManager, Backbone, Marionette, $, _) {
    List.Show = (function(_super) {
      __extends(Show, _super);

      function Show() {
        return Show.__super__.constructor.apply(this, arguments);
      }

      Show.prototype.template = '#show-list-template';

      Show.prototype.className = 'row show-list-item';

      Show.prototype.ui = {
        add: '.add-item-button'
      };

      Show.prototype.events = {
        'click @ui.add': 'addShow'
      };

      Show.prototype.addShow = function(e) {
        if (e != null) {
          e.preventDefault();
        }
        return List.Controller.addShow(this.model);
      };

      return Show;

    })(Marionette.ItemView);
    return List.Shows = (function(_super) {
      __extends(Shows, _super);

      function Shows() {
        return Shows.__super__.constructor.apply(this, arguments);
      }

      Shows.prototype.childView = List.Show;

      Shows.prototype.className = 'shows-list';

      Shows.prototype.initialize = function() {
        Shows.__super__.initialize.apply(this, arguments);
        if (this.collection) {
          return this.setCollection(this.collection);
        }
      };

      Shows.prototype.setCollection = function(collection) {
        this.collection = collection;
        this.listenTo(this.collection, 'change', this.render);
        return this.render();
      };

      return Shows;

    })(Marionette.CollectionView);
  });

}).call(this);
