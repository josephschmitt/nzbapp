# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'Entities', (Entities, NZBAppManager, Backbone, Marionette, $, _) ->
	Entities.Shows = {}

	class Entities.ShowResult extends Backbone.Model
		fetch: (options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback'
                jsonpCallback: options.jsonpCallback or 'jjs.AppConfig.callback_func'
            super options

	class Entities.ShowResults extends Backbone.Collection
		model: Entities.ShowResult
		fetch: (options={}) ->
            options = _.extend options, 
                dataType: 'jsonp'
                jsonp: 'callback'
                jsonpCallback: options.jsonpCallback or 'jjs.AppConfig.callback_func'
            super options

	getShowSearchResults = (term) ->
		defer = $.Deferred()

		shows = new Entities.ShowResults [], url: NZBAppManager.request('api:endpoint', 'SickBeard', 'sb.searchtvdb')
		shows.fetch
			jsonpCallback: 'jjs.NZBAppManager.Entities.Shows.onShowsSearch'
			data: name: term

		Entities.Shows.onShowsSearch = (response) -> 
			defer.resolve shows.set(response.data.results)
		defer.promise()

	getShows = () ->
		defer = $.Deferred()

		shows = new Entities.ShowResults [], url: NZBAppManager.request('api:endpoint', 'SickBeard', 'shows')
		shows.fetch
			jsonpCallback: 'jjs.NZBAppManager.Entities.Shows.onShowsList'

		Entities.Shows.onShowsList = (response) -> 
			defer.resolve shows.set(_.toArray(response.data))
		defer.promise()

	getShow = (tvdbid) ->
		defer = $.Deferred()

		show = new Entities.ShowResult {}, url: NZBAppManager.request('api:endpoint', 'SickBeard', 'show')
		show.fetch
			data: tvdbid: tvdbid
			jsonpCallback: 'jjs.NZBAppManager.Entities.Shows.onShowInfo'

		Entities.Shows.onShowInfo = (response) -> 
			defer.resolve show.set(response.data)
		defer.promise()

	NZBAppManager.reqres.setHandler 'shows:search', (term) ->
		getShowSearchResults(term)

	NZBAppManager.reqres.setHandler 'shows:list', ->
		getShows()

	NZBAppManager.reqres.setHandler 'show:info', (tvdbid) ->
		getShow(tvdbid)