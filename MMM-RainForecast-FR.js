/* global Module */
/* Magic Mirror
 * Module: MMM-RainForecast-FR
 *
 * By tttooommm56 https://github.com/tttooommm56
 * MIT Licensed.
 */

// To manage PIR sensor signal and module.hidden at the same time
var userPresence = true; // present by default (no PIR sensor to shutdown)

Module.register("MMM-RainForecast-FR", {

    // Default module config.
    defaults: {
        updateInterval: 5 * 60 * 1000, // every 5 minutes
        apiBaseUrl: "https://rpcache-aa.meteofrance.com/internet2018client/2.0/nowcast/rain",
        showText: true,
        showGraph: true,
    },

    getTemplate: function () {
        return "MMM-RainForecast-FR.njk"
    },

    getTemplateData: function () {
        return {
            config: this.config,
            rainData: this.rainData,
            loaded: this.loaded
        };
    },

    // Define required scripts.
    getScripts: function () {
        return ["moment.js"];
    },

    // Define required scripts.
    getStyles: function () {
        return ["MMM-RainForecast-FR.css"];
    },

    // Define start sequence.
    start: function () {
        Log.info("Starting module: " + this.name);

        // Set locale.
        moment.locale(config.language);

        this.rainData = {
            rainText: "Pas de données",
            rainGraph: [],
            rainGraphTimes: [],
            hasRain: false,
            hasData: false
        }

        this.loaded = false;

        this.intervalID = 0;
        this.moduleHidden = false;

        this.scheduleUpdate(); 
    },

    suspend: function () { //fct core called when module is hidden
		this.moduleHidden = true; // It should be proper to use this.hidden, but random behaviour...
		this.debugger("Fct suspend - ModuleHidden = " + this.moduleHidden);
		this.scheduleUpdate(); 
	},

	resume: function () { //fct core called when module is displayed
		this.moduleHidden = false;
		this.debugger("Fct resume - ModuleHidden = " + this.moduleHidden);
		this.scheduleUpdate();
	},

    /* processWeather(data)
     * Uses the received data to set the various values.
     *
     * argument data object - Weather information received form meteofrance.fr.
     */
    processWeather: function (data) {
        if (this.config.debug === true) {
            Log.info('RAINFORECAST_FR processWeather data : ');
            Log.info(data);
        }
        
        if (data) {
            this.rainData.hasData = data.properties != null && data.properties.forecast != null;

            if (this.rainData.hasData && data.properties.forecast.length > 0) {
                // Text data for current situation
                this.rainData.rainText = data.properties.forecast[0].rain_intensity_description;

                // Graph data
                this.rainData.rainGraph = data.properties.forecast;
                const dataWithRain = this.rainData.rainGraph.filter(rainGraph => rainGraph.rain_intensity >= 2);
                if (this.config.debug === 1) {
                    Log.info(this.name + " dataWithRain : ");
                    Log.info(dataWithRain);
                }
                this.rainData.hasRain = dataWithRain.length > 0;
                this.rainData.rainGraphTimes = [];
                data.properties.forecast.forEach(element => this.rainData.rainGraphTimes.push(moment(element.time).format('H:mm')));
            }
        } else {
            this.rainData.hasData = false;
        }

        this.loaded = true;
        this.updateDom(this.config.animationSpeed);
    },

    // Request new data from Meteo France with node_helper
    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
            case "RAINFORECASTFR_STARTED" : this.updateDom(this.config.animationSpeed); break;
            case "RAINFORECASTFR_DATA" : this.processWeather(payload); break;
            case "RAINFORECASTFR_ERROR" : Log.error(this.name + ": Do not access to data (" + payload + ")."); break;
            case "USER_PRESENCE" : 
                this.debugger("Fct notificationReceived USER_PRESENCE - payload = " + payload);
                userPresence = payload;
                this.scheduleUpdate();
                break;
        }
    },

    scheduleUpdate: function () {
		this.debugger("Call scheduleUpdate : " + userPresence + " / " + this.moduleHidden);

		if (userPresence === true && this.moduleHidden === false) { // on s'assure d'avoir un utilisateur présent devant l'écran (sensor PIR) et que le module soit bien affiché		
			this.debugger(this.name + " is back and user present ! Let's update (intervalID=" + this.intervalID + ")");

            this.sendSocketNotification('RAINFORECASTFR_CONFIG', this.config);

			// if no interval update active, then schedule a new interval update (to avoid multiple instances)
			if (this.intervalID === 0) {
                var self = this;          
                this.intervalID = setInterval(function () {self.sendSocketNotification('RAINFORECASTFR_CONFIG', self.config);}, self.config.updateInterval);
			}

		} else { // (userPresence = false OR ModuleHidden = true)
			this.debugger("Nobody watch : stop update ! ID : " + this.intervalID);
			clearInterval(this.intervalID); // stop current interval update
			this.intervalID = 0; // reset variable
		}
	},

    debugger: function (message) {
		if (this.config.debug === true) {
			Log.log("[MMM-RainForecast-FR] " + message);
		}
	}
});
