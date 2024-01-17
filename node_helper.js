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
		const token = "__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__";
		const authorization = "Bearer ".concat(token); 
		var meteoUrl = this.config.apiBaseUrl + "?lat=" + this.config.lat + "&lon=" + this.config.lon;

		axios({url: meteoUrl, method: 'get', headers: { Authorization: authorization }})
		.then((response) => {
			if (response.status == 200 && response.data) {
				self.sendSocketNotification('RAINFORECASTFR_DATA', response.data);
			} else {
				self.sendSocketNotification("RAINFORECASTFR_ERROR", 'Meteo France error: ' + response.statusText);
			}
		})
		.catch((error) => {
			self.sendSocketNotification("RAINFORECASTFR_ERROR", error.message);
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, payload) {
		var self = this;
		if (notification === "RAINFORECASTFR_CONFIG") {
			self.config = payload;
			self.sendSocketNotification("RAINFORECASTFR_STARTED", true);
			self.fecthMeteoFrance();
		}
	}
});
