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
        updateInterval: 5 * 60 * 1000, // every 5 minutes
        initialLoadDelay: 0, // 0 seconds delay
        apiBaseUrl: "http://webservice.meteofrance.com/rain",
        showText: true,
        showGraph: true,
        debug: 1
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
        this.scheduleUpdate(this.config.initialLoadDelay);
    },

    /* processWeather(data)
     * Uses the received data to set the various values.
     *
     * argument data object - Weather information received form meteofrance.fr.
     */
    processWeather: function (data) {
        if (this.config.debug === 1) {
            Log.info('RAINFORECAST_FR processWeather data : ');
            Log.info(data);
        }
        
        if (data) {
            this.rainData.hasData = data.forecast != null;

            if (data.forecast && data.forecast.length > 0) {
                // Text data
                this.rainData.rainText = data.forecast[0].desc;

                // Graph data
                this.rainData.rainGraph = data.forecast;
                const dataWithRain = this.rainData.rainGraph.filter(rainGraph => rainGraph.rain >= 2);
                if (this.config.debug === 1) {
                    Log.info(this.name + " getData : ");
                    Log.info(dataWithRain);
                }
                this.rainData.hasRain = dataWithRain.length > 0;
                this.rainData.rainGraphTimes = [];
                data.forecast.forEach(element => this.rainData.rainGraphTimes.push(moment(element.dt, "X").format('H:mm')));
            }
        } else {
            this.rainData.hasData = false;
        }

        this.loaded = true;
        this.updateDom(this.config.animationSpeed);
        this.scheduleUpdate();
    },

    // Request new data from Meteo France with node_helper
    socketNotificationReceived: function (notification, payload) {
        if (notification === "STARTED") {
            this.updateDom(this.config.animationSpeed);
        } else if (notification === "DATA") {
            this.processWeather(payload);
        } else if (notification === "ERROR") {
            Log.error(this.name + ": Do not access to data (" + payload + ").");
        } else if (notification === "DEBUG") {
            Log.log(payload);
        }
    },

    // Schedule next update
    scheduleUpdate: function (delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        clearInterval(this.timerUpdate);

        var self = this;
        this.timerUpdate = setTimeout(function () {
            self.sendSocketNotification('CONFIG', self.config);
        }, nextLoad);
    },

});
