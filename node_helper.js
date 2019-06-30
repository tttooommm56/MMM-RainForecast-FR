/* Magic Mirror
 * Module: MMM-RainForecast-FR
 *
 * By tttooommm56 https://github.com/tttooommm56
 * MIT Licensed.
 */
 

var NodeHelper = require('node_helper');
var request = require('request');
var moment = require('moment');
const exec = require('child_process').exec; 

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-RainForecast-FR helper started ...');
	this.fetcherRunning = false;
  },

  
  fecthMeteoFrance: function() {
        var self = this;
        this.fetcherRunning = true; 
               
        var meteoUrl = this.config.apiBase + this.config.codeInsee + 0;
		if ( this.config.debug === 1 ) {
			console.log(moment().format() + " 4 " + this.name  + ": " + meteoUrl);
		}
        request({url: meteoUrl, method: 'GET'}, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                self.sendSocketNotification('RAINFORECAST_FR', body);
            } else {
                console.log(moment().format() + " 6 " + self.name + ": " + error);
            }
                
            setTimeout(function() {
                self.fecthMeteoFrance();
            }, self.config.updateInterval);
        });
  },
  
  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    var self = this;
    
    if (notification === "GET_RAINFORECAST_FR") {          
        this.config = payload;
        if (this.config.debug === 1) {
			console.log('Lets get Meteo France rain forecast');
		}

        if (!this.fetcherRunning) {
            this.fecthMeteoFrance();
        } 			
    }
  }
});
