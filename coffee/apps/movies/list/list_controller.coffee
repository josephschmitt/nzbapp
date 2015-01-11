# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'MoviesApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    listMovies = null

    List.Controller = 
        listMovies: ->
            listMovies = new List.MoviesView()
            NZBAppManager.mainRegion.show listMovies
            NZBAppManager.execute 'titlebar:show', NZBAppManager.request('titlebar:movies:entities')
            NZBAppManager.execute 'titlebar:activate', 'movies/wanted'
            $.when(NZBAppManager.request('movies:list')).done (movies) ->
                listMovies.setCollection movies
        sortMovies: (sort_by) ->
            if not listMovies then List.Controller.listMovies()
            listMovies.sort(sort_by)
        listAvailableSoon: ->
            availableSoon = new List.Movies()
            NZBAppManager.mainRegion.show availableSoon
            NZBAppManager.execute 'titlebar:show', NZBAppManager.request('titlebar:movies:entities')
            NZBAppManager.execute 'titlebar:activate', 'movies/soon'
            $.when(NZBAppManager.request('movies:soon')).done (movies) ->
                availableSoon.setCollection movies
        addMovie: (movie) ->
            $.when(NZBAppManager.request('movies:add', movie)).done (added) ->
                message = "Added #{movie.get('title') or movie.get('original_title')} (#{movie.get('year')}) to your list"
                status = if added.success then 'success' else 'alert'
                NZBAppManager.execute 'popup:alert:show', message, status
        removeMovie: (movie) ->
            $.when(NZBAppManager.request('movies:remove', movie)).done (removed) ->
                message = "Removed #{movie.get('title') or movie.get('original_title')} (#{movie.get('year')}) from your list"
                status = if removed.success then 'alert' else 'warning'
                NZBAppManager.execute 'popup:alert:show', message, status