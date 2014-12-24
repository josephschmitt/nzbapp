do ->
    # `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
    jjs = window.jjs = (window.jjs or {})

    jjs.NZBAppManager.module 'Search', (Search, NZBAppManager, Backbone, Marionette, $, _) ->
    	class Search.Result extends Marionette.ItemView
    		template: '#search-result-template'
    		className: 'search-result row'
    		tagName: 'li'

    	class Search.SearchResults extends Marionette.CollectionView
    		tagName: 'ul'
    		className: 'search-results'
    		childView: Search.Result

    	class Search.SearchView extends Marionette.LayoutView
    		template: '#search-template'
    		regions:
    			resultsRegion: '#search-results-region'
    		render: ->
    			super
    			@resultsRegion.show new Search.SearchResults
    				collection: new NZBAppManager.Media.CouchPotato()