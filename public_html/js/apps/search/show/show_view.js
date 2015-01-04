(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function() {
    var jjs;
    jjs = window.jjs = window.jjs || {};
    return jjs.NZBAppManager.module('SearchApp.Show', function(Show, NZBAppManager, Backbone, Marionette, $, _) {
      return Show.SearchView = (function(_super) {
        __extends(SearchView, _super);

        function SearchView() {
          this.positionToggle = __bind(this.positionToggle, this);
          return SearchView.__super__.constructor.apply(this, arguments);
        }

        SearchView.prototype.template = '#search-template';

        SearchView.prototype.className = 'search-view';

        SearchView.prototype.timeout = 0;

        SearchView.prototype.doBlur = true;

        SearchView.prototype.regions = {
          resultsRegion: '#search-results-region'
        };

        SearchView.prototype.ui = {
          searchField: 'input[type="search"]',
          capture: '.keyboard-capture',
          container: '.search-field-container',
          type: 'input[name="type"]',
          "switch": '.media-switch',
          switchContainer: '.media-switch-container'
        };

        SearchView.prototype.events = {
          'click @ui.capture': 'focusField',
          'blur @ui.searchField': 'blurField',
          'change @ui.type': 'typeChange',
          'click @ui.type': function(e) {
            e.stopPropagation();
            return $(this).trigger('change');
          },
          'click @ui.switch': 'switchMedia'
        };

        SearchView.prototype.render = function() {
          SearchView.__super__.render.apply(this, arguments);
          if (!this.model) {
            this.model = new Backbone.Model({
              type: this.getType(),
              value: this.getTerm()
            });
          }
          _.defer(this.positionToggle);
          $(window).on('resize', (function(_this) {
            return function() {
              return _this.positionToggle();
            };
          })(this));
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
          this.ui.type.eq(0).prop('checked', true);
          return this.ui.type.on('change', (function(_this) {
            return function(e) {
              _this.model.set('type', _this.getType());
              if (_this.model.get('value')) {
                return _this.search(e);
              }
            };
          })(this));
        };

        SearchView.prototype.positionToggle = function(animate) {
          if (!animate) {
            this.ui.switchContainer.removeClass('animate');
          }
          this.ui.switchContainer.css('transform', "translateX(" + (this.ui.switchContainer.width() / 2 - this.ui.switchContainer.parent().width() / 2) + "px)");
          return this.ui.switchContainer.addClass('animate');
        };

        SearchView.prototype.switchMedia = _.throttle(function(e) {
          this.doBlur = false;
          this.ui["switch"].toggleClass('flip');
          setTimeout((function(_this) {
            return function() {
              return _this.ui["switch"].toggleClass('backface');
            };
          })(this), 125);
          if (this.ui["switch"].hasClass('flip')) {
            return this.ui.type.eq(1).prop('checked', true).trigger('change');
          } else {
            return this.ui.type.eq(0).prop('checked', true).trigger('change');
          }
        }, 10);

        SearchView.prototype.focusField = function(e) {
          e.preventDefault();
          if (!this.ui.container.hasClass('focus')) {
            this.ui.container.addClass('focus');
            this.ui["switch"].addClass('small');
            return _.delay((function(_this) {
              return function() {
                return _this.ui.searchField.trigger('focus');
              };
            })(this), 300);
          }
        };

        SearchView.prototype.blurField = function(e) {
          this.doBlur = true;
          return _.delay((function(_this) {
            return function() {
              if (_this.doBlur && !_this.model.get('value')) {
                _this.ui["switch"].removeClass('small');
                _this.positionToggle(true);
                _this.ui.container.removeClass('focus');
                return _this.doBlur = true;
              } else {
                return _this.ui.searchField.trigger('focus');
              }
            };
          })(this), 250);
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
          if (this.model.get('value')) {
            return NZBAppManager.trigger('search:results:show', (_ref = this.model) != null ? _ref.get('type') : void 0, (_ref1 = this.model) != null ? _ref1.get('value') : void 0);
          }
        };

        return SearchView;

      })(Marionette.LayoutView);
    });
  })();

}).call(this);
