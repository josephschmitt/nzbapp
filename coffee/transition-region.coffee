class TransitionRegion extends Marionette.Region
    animationInClassName: "an-section--in"
    animationOutClassName: "an-section--out"
    pageClassNamePrefix: "page--"
    previousPageClassNamePrefix: "prev-"
    nextPageClassNamePrefix: "next-"
    transEndEventName: "animationend webkitAnimationEnd"
    
    # Very similar to show(), but uses css transition class between views
    transitionToView: (newView, animName) ->
        @newView = newView


        # attach the next page class, helps to decide wich out animation we should play
        nextClass = @nextPageClassNamePrefix + @pageClassNamePrefix
        if @newView? then nextClass += @newView.pageName

        @$el.removeClass @$el.attr 'data-next'

        @$el.addClass nextClass
        @$el.attr 'data-next', nextClass

        Marionette.triggerMethod.call @, "willTransition", @currentView
        @stopListening @newView, "render"

        # Add custom animation class if passed
        if animName?
            @currentView.$el.addClass animName
            @newView?.$el.addClass animName
        
        # Wait for the new view to render, then initialize a transition to
        # show the new view while hiding the old.
        if @newView
            @listenTo @newView, "render", @onRender
            @newView.render()
        else
            @onRender()

    onRender: =>
        if not @currentView or @currentView.isClosed
            @addNewView()
        else
            @removeOldView()

    removeOldView: =>
        # clean up the old listeners, just to ensure we only have 1 active.
        @currentView.$el.off @transEndEventName
        @currentView.$el.on @transEndEventName, @onOldViewRemoved
        @currentView.$el.addClass @animationOutClassName

    onOldViewRemoved: (e) =>

        if e.target != @currentView.$el.get(0) then return

        # clean up the old view
        @$el.removeClass @pageClassNamePrefix + @currentView.pageName

        # add class for reference of what was the previous view
        previousClass = @previousPageClassNamePrefix + @pageClassNamePrefix
        if @currentView.pageName? then previousClass += @currentView.pageName

        # the previous pagename was stored, so we can remove an old class (prevents conflitcs)
        @$el.removeClass @$el.attr 'data-previous'

        @$el.addClass previousClass
        @$el.attr 'data-previous', previousClass

        @currentView.$el.off @transEndEventName
        @empty()

        if @newView then @addNewView()

    addNewView: =>
        # Add the new view to the dom
        @$el.append @newView.el
        @currentView = @newView
        
        @$el.removeClass @$el.attr 'data-next'
        
        # Transition the new view in
        if @currentView.pageName?
            @$el.addClass @pageClassNamePrefix + @currentView.pageName
        
        @currentView.$el.on @transEndEventName, @onNewViewAdded
        @currentView.$el.addClass @animationInClassName

    onNewViewAdded: (e) =>
        if e.target != @currentView.$el.get(0) then return

        @currentView.$el.off @transEndEventName
        @currentView.$el.removeClass @animationInClassName
        @stopListening @newView, "render"
        
        Marionette.triggerMethod.call @currentView, "show"
        
        # do the things show would normally do after showing a new view
        Marionette.triggerMethod.call @, "show", @currentView

window.TransitionRegion = TransitionRegion