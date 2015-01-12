# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
	titleData =  null

	getSearchTitlebar = ->
		titleData = new Backbone.Model
			center: title: 'Search'

	getMoviesTitlebar = ->
		titleData = new Backbone.Model 
			center: [
				{title: 'Movies', url: 'movies/wanted', trigger: 'movies:wanted:list'}
				{title: 'Soon', url: 'movies/soon', trigger: 'movies:soon:list'}
			]
			right: [
				{title: 'Refresh', url: 'movies/wanted', trigger: 'movies:wanted:list', icon: 'fi-refresh'}
			]

	getShowsTitlebar = ->
		titleData = new Backbone.Model 
			center: [
				{ title: 'Shows', url: 'shows/wanted', trigger: 'shows:wanted:list'}
	            { title: 'Upcoming', url: 'shows/upcoming', trigger: 'shows:upcoming:list' }
			]

	getDownloadsTitlebar = ->
		titleData = new Backbone.Model 
			center: [
				{title: 'Queue', url: 'downloads/queue', trigger: 'downloads:queue:list'}
				{title: 'History', url: 'downloads/history', trigger: 'downloads:history:list'}
			]

	getSettingsTitlebar = ->
		titleData = new Backbone.Model 
			left: [
				{title: 'Cancel', url: 'settings', trigger: 'home:show', icon: 'fi-x'}
			]
			center: title: 'Settings'
			right: [
				{title: 'Save', url: 'settings', trigger: 'home:show', icon: 'fi-check'}
			]

	NZBAppManager.reqres.setHandler 'titlebar:search:entities', ->
		getSearchTitlebar()

	NZBAppManager.reqres.setHandler 'titlebar:movies:entities', ->
		getMoviesTitlebar()

	NZBAppManager.reqres.setHandler 'titlebar:shows:entities', ->
		getShowsTitlebar()

	NZBAppManager.reqres.setHandler 'titlebar:downloads:entities', ->
		getDownloadsTitlebar()

	NZBAppManager.reqres.setHandler 'titlebar:settings:entities', ->
		getSettingsTitlebar()