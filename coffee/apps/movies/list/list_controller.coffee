# `jjs` is our namespace. Everything should be in `jjs` to avoid name conflicts.
jjs = window.jjs = (window.jjs or {})

jjs.NZBAppManager.module 'MoviesApp.List', (List, NZBAppManager, Backbone, Marionette, $, _) ->
    List.Controller = 
        listMovies: ->
            listMovies = new List.Movies()
            NZBAppManager.mainRegion.show listMovies
            $.when(NZBAppManager.request('movies:list')).done (movies) ->
                listMovies.setCollection movies
        addMovie: (movie) ->
            $.when(NZBAppManager.request('movies:add', movie)).done (added) ->
                message = "Added #{movie.get('title') or movie.get('original_title')} (#{movie.get('year')}) to your list"
                status = if added.success then 'success' else 'alert'
                movie.set 'in_wanted', true
                NZBAppManager.execute 'popup:alert:show', message, status
        removeMovie: (movie) ->
            $.when(NZBAppManager.request('movies:remove', movie)).done (removed) ->
                message = "Removed #{movie.get('title') or movie.get('original_title')} (#{movie.get('year')}) from your list"
                status = if removed.success then 'alert' else 'warning'
                collection = movie.collection
                collection.remove collection.findWhere(_id: movie.get('_id'))
                collection.trigger 'change'
                NZBAppManager.execute 'popup:alert:show', message, status