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

        SearchView.prototype.keycodes = {
          backspace: 8,
          tab: 9,
          enter: 13,
          shift: 16,
          left: 37,
          up: 38,
          right: 39,
          down: 40,
          "delete": 46
        };

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
            return e.stopPropagation();
          },
          'click @ui.switch': 'switchMedia'
        };

        SearchView.prototype.initialize = function() {
          SearchView.__super__.initialize.apply(this, arguments);
          $(window).on('resize', (function(_this) {
            return function() {
              return _this.positionToggle();
            };
          })(this));
          return this.model = new Backbone.Model();
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
          clearTimeout(this.timeout);
          this.ui.searchField.on('keyup', (function(_this) {
            return function(e) {
              var _ref;
              if ((_ref = e.which) !== _this.keycodes.tab && _ref !== _this.keycodes.shift && _ref !== _this.keycodes.left && _ref !== _this.keycodes.up && _ref !== _this.keycodes.right && _ref !== _this.keycodes.down) {
                _this.model.set('value', _this.getTerm());
                clearTimeout(_this.timeout);
                return _this.timeout = setTimeout(function() {
                  return _this.search(e);
                }, 500);
              }
            };
          })(this));
          this.updateState();
          return this.updateToggleSwitch();
        };

        SearchView.prototype.updateState = function(focused) {
          var _ref;
          if (!focused && !((_ref = this.resultsRegion.currentView) != null ? _ref.collection.length : void 0) && !this.model.get('value')) {
            this.ui["switch"].removeClass('small');
            this.positionToggle(true);
            return this.ui.container.removeClass('focus');
          } else {
            this.ui.container.addClass('focus');
            this.ui["switch"].addClass('small');
            if (focused) {
              return _.delay((function(_this) {
                return function() {
                  return _this.ui.searchField.trigger('focus');
                };
              })(this), 100);
            }
          }
        };

        SearchView.prototype.updateToggleSwitch = function() {
          var toggle;
          toggle = !this.ui.type.eq(0).prop('checked');
          this.ui["switch"].toggleClass('flip', toggle);
          return setTimeout((function(_this) {
            return function() {
              return _this.ui["switch"].toggleClass('backface', toggle);
            };
          })(this), 125);
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
          if (this.ui.type.eq(0).prop('checked')) {
            this.ui.type.eq(1).prop('checked', true).trigger('change');
          } else {
            this.ui.type.eq(0).prop('checked', true).trigger('change');
          }
          return this.updateToggleSwitch();
        }, 10);

        SearchView.prototype.focusField = function(e) {
          if (e != null) {
            e.preventDefault();
          }
          return this.updateState(true);
        };

        SearchView.prototype.blurField = function(e) {
          this.doBlur = true;
          return _.delay((function(_this) {
            return function() {
              if (_this.doBlur) {
                return _this.updateState(false);
              } else {
                return _this.ui.searchField.trigger('focus');
              }
            };
          })(this), 250);
        };

        SearchView.prototype.typeChange = function(e) {
          this.model.set('type', this.getType());
          if (this.getTerm()) {
            this.search(e);
          }
          return this.ui.searchField.attr('placeholder', "Search for a " + (this.model.get('type') === 'shows' ? 'TV Show' : 'Movie'));
        };

        SearchView.prototype.getTerm = function() {
          return this.ui.searchField.val();
        };

        SearchView.prototype.getType = function() {
          var checked;
          checked = _.find(this.ui.type, function(el) {
            return $(el).prop('checked');
          });
          if (checked) {
            return $(checked).val();
          } else {
            return this.ui.type.eq(0).val();
          }
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
          return NZBAppManager.trigger('search:results:show', (_ref = this.model) != null ? _ref.get('type') : void 0, (_ref1 = this.model) != null ? _ref1.get('value') : void 0);
        };

        return SearchView;

      })(Marionette.LayoutView);
    });
  })();

}).call(this);
