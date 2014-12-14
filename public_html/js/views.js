(function() {
  Backbone.Marionette.Renderer.render = function(template, data) {
    return _.template($(template).html(), data, {
      variable: 'data'
    });
  };

  (function() {
    var tbs;
    return tbs = window.js = window.tbs || {};
  })();

}).call(this);
