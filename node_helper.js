/* Magic Mirror
 * Module: MMM-RainForecast-FR
 *
 * Magic Mirror By Michael Teeuw https://magicmirror.builders
 * MIT Licensed.
 * 
 * Module MMM-RainForecast-FR By tttooommm56 https://github.com/tttooommm56
 * MIT Licensed.
 */


var NodeHelper = require('node_helper');
var axios = require('axios');

module.exports = NodeHelper.create({
	fecthMeteoFrance: function () {
		var self = this;
		this.fetcherRunning = true;
		var token = "__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__";
		var meteoUrl = this.config.apiBaseUrl + "?lang=fr&lat=" + this.config.lat + "&lon=" + this.config.lon + "&token=" + token;

		axios({url: meteoUrl, method: 'get'})
		.then((response) => {
			if (response.status == 200 && response.data) {
				self.sendSocketNotification('DATA', response.data);
			} else {
				self.sendSocketNotification("ERROR", 'Meteo France error: ' + response.statusText);
			}

			setTimeout(function () {
				self.fecthMeteoFrance();
			}, self.config.updateInterval);
		})
		.catch((error) => {
			self.sendSocketNotification("ERROR", error.message);
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, payload) {
		var self = this;

		if (notification === "CONFIG") {
			self.config = payload;
			self.sendSocketNotification("STARTED", true);
			self.fecthMeteoFrance();
		}
	}
});
