do ->
    # `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
    jjs = window.jjs = (window.jjs or {})

    jjs.NZBAppManager.module 'SearchApp.Show', (Show, NZBAppManager, Backbone, Marionette, $, _) ->
    	class Show.Result extends Marionette.ItemView
    		template: '#search-result-template'
    		className: 'search-result row'
    		tagName: 'li'

    	class Show.SearchResults extends Marionette.CollectionView
    		tagName: 'ul'
    		className: 'search-results'
    		childView: Show.Result

    	class Show.SearchView extends Marionette.LayoutView
    		template: '#search-template'
    		regions:
    			resultsRegion: '#search-results-region'
    		render: ->
    			super
    			# @resultsRegion.show new Show.SearchResults
    			# 	collection: new NZBAppManager.Media.CouchPotato()