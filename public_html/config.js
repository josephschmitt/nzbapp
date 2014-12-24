(function() {
	var jjs = window.jjs = window.jjs || {};

	jjs.AppConfig = {
        CouchPotato: {
            urlRoot: 'http://jbox.no-ip.biz:5050',
            apiKey: 'ab4d4591a05b4ab0809124974c7c6050'
        },
        
        SickBeard: {
            urlRoot: 'http://jbox.no-ip.biz:9090',
            apiKey: '0df35b76f3b232a84543c941b1394ed6'
        },

        callback_func: function () {
        }
	};
})();