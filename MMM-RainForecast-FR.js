/* global Module */
/* Magic Mirror
 * Module: MMM-RainForecast-FR
 *
 * By tttooommm56 https://github.com/tttooommm56
 * MIT Licensed.
 */
Module.register("MMM-RainForecast-FR", {

    // Default module config.
    defaults: {
        coloricon: false,
        updateInterval: 5 * 60 * 1000, // every 5 minutes
        timeFormat: config.timeFormat,
        lang: config.language,
        fctext: "1",
        alerttime: 5000,
        sysstat: 0,
        scaletxt: 1,
		debug: 0,
		socknot: "GET_RAINFORECAST_FR",
		sockrcv: "RAINFORECAST_FR",
        retryDelay: 2500,
        apiBaseUrl: "http://webservice.meteofrance.com/rain",
        showText: true,
        showGraph: true,
		rainData: {
            rainText: "Pas de données",
            rainGraph: [],
            rainGraphTimes: [],
            hasRain: false,
            hasData: false
		}
    },

	getTemplate: function () {
		return "MMM-RainForecast-FR.njk"
	},

	getTemplateData: function () {
		return this.config;
	},

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    // Define required scripts.
    getStyles: function() {
        return ["MMM-RainForecast-FR.css"];
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        moment.locale(config.language);
        
        this.loaded = false;
        this.error = false;
        this.errorDescription = "";
        this.getRainForecast();
        this.updateTimer = null;
        this.systemp = "";
    },

    getRainForecast: function() {
        if (this.config.debug === 1) {
			Log.info("Meteo France rain forecast : Getting info.");
		}
		this.sendSocketNotification(this.config.socknot, this.config);
    },

    /* processWeather(data)
     * Uses the received data to set the various values.
     *
     * argument data object - Weather information received form meteofrance.fr.
     */
    processWeather: function(data) {   
		if (this.config.debug === 1) {
			Log.info('RAINFORECAST_FR processWeather data : ');
			Log.info(data);
		} 
		
        if (data) {
            this.config.rainData.hasData = data.forecast != null;      
            
            if (data.forecast && data.forecast.length > 0) {
                // Text data
                this.config.rainData.rainText = data.forecast[0].desc;

                // Graph data
                this.config.rainData.rainGraph = data.forecast;
                const dataWithRain = this.config.rainData.rainGraph.filter(rainGraph => rainGraph.rain >= 2);
                if (this.config.debug === 1) {
                    Log.info(this.name + " getData : ");
                    Log.info(dataWithRain);
                }
                this.config.rainData.hasRain = dataWithRain.length > 0;
                this.config.rainData.rainGraphTimes = [];
                data.forecast.forEach(element => this.config.rainData.rainGraphTimes.push(moment(element.dt, "X").format('H:mm')));
            }

            this.updateDom(this.config.animationSpeed);
            
		} else {
            this.config.rainData.hasData = false;
        }
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this;

        if (this.config.debug === 1) {
			Log.info('RAINFORECAST_FR received ' + notification);
		}

        if (notification === this.config.sockrcv) {
            if (this.config.debug === 1) {
				Log.info('received ' + this.config.sockrcv);
				Log.info(payload);
			}
            self.processWeather(JSON.parse(payload));
        }

    }

});
