(function() {
  var TransitionRegion,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TransitionRegion = (function(_super) {
    __extends(TransitionRegion, _super);

    function TransitionRegion() {
      this.onNewViewAdded = __bind(this.onNewViewAdded, this);
      this.addNewView = __bind(this.addNewView, this);
      this.onOldViewRemoved = __bind(this.onOldViewRemoved, this);
      this.removeOldView = __bind(this.removeOldView, this);
      this.onRender = __bind(this.onRender, this);
      return TransitionRegion.__super__.constructor.apply(this, arguments);
    }

    TransitionRegion.prototype.animationInClassName = "an-section--in";

    TransitionRegion.prototype.animationOutClassName = "an-section--out";

    TransitionRegion.prototype.pageClassNamePrefix = "page--";

    TransitionRegion.prototype.previousPageClassNamePrefix = "prev-";

    TransitionRegion.prototype.nextPageClassNamePrefix = "next-";

    TransitionRegion.prototype.transEndEventName = "animationend webkitAnimationEnd";

    TransitionRegion.prototype.transitionToView = function(newView, animName) {
      var nextClass, _ref;
      this.newView = newView;
      nextClass = this.nextPageClassNamePrefix + this.pageClassNamePrefix;
      if (this.newView != null) {
        nextClass += this.newView.pageName;
      }
      this.$el.removeClass(this.$el.attr('data-next'));
      this.$el.addClass(nextClass);
      this.$el.attr('data-next', nextClass);
      Marionette.triggerMethod.call(this, "willTransition", this.currentView);
      this.stopListening(this.newView, "render");
      if (animName != null) {
        this.currentView.$el.addClass(animName);
        if ((_ref = this.newView) != null) {
          _ref.$el.addClass(animName);
        }
      }
      if (this.newView) {
        this.listenTo(this.newView, "render", this.onRender);
        return this.newView.render();
      } else {
        return this.onRender();
      }
    };

    TransitionRegion.prototype.onRender = function() {
      if (!this.currentView || this.currentView.isClosed) {
        return this.addNewView();
      } else {
        return this.removeOldView();
      }
    };

    TransitionRegion.prototype.removeOldView = function() {
      this.currentView.$el.off(this.transEndEventName);
      this.currentView.$el.on(this.transEndEventName, this.onOldViewRemoved);
      return this.currentView.$el.addClass(this.animationOutClassName);
    };

    TransitionRegion.prototype.onOldViewRemoved = function(e) {
      var previousClass;
      if (e.target !== this.currentView.$el.get(0)) {
        return;
      }
      this.$el.removeClass(this.pageClassNamePrefix + this.currentView.pageName);
      previousClass = this.previousPageClassNamePrefix + this.pageClassNamePrefix;
      if (this.currentView.pageName != null) {
        previousClass += this.currentView.pageName;
      }
      this.$el.removeClass(this.$el.attr('data-previous'));
      this.$el.addClass(previousClass);
      this.$el.attr('data-previous', previousClass);
      this.currentView.$el.off(this.transEndEventName);
      this.empty();
      if (this.newView) {
        return this.addNewView();
      }
    };

    TransitionRegion.prototype.addNewView = function() {
      this.$el.append(this.newView.el);
      this.currentView = this.newView;
      this.$el.removeClass(this.$el.attr('data-next'));
      if (this.currentView.pageName != null) {
        this.$el.addClass(this.pageClassNamePrefix + this.currentView.pageName);
      }
      this.currentView.$el.on(this.transEndEventName, this.onNewViewAdded);
      return this.currentView.$el.addClass(this.animationInClassName);
    };

    TransitionRegion.prototype.onNewViewAdded = function(e) {
      if (e.target !== this.currentView.$el.get(0)) {
        return;
      }
      this.currentView.$el.off(this.transEndEventName);
      this.currentView.$el.removeClass(this.animationInClassName);
      this.stopListening(this.newView, "render");
      Marionette.triggerMethod.call(this.currentView, "show");
      return Marionette.triggerMethod.call(this, "show", this.currentView);
    };

    return TransitionRegion;

  })(Marionette.Region);

  window.TransitionRegion = TransitionRegion;

}).call(this);
