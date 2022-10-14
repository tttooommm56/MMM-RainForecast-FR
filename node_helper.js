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
var request = require('request');

module.exports = NodeHelper.create({
	fecthMeteoFrance: function () {
		var self = this;
		this.fetcherRunning = true;
		var token = "__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__";
		var meteoUrl = this.config.apiBaseUrl + "?lang=fr&lat=" + this.config.lat + "&lon=" + this.config.lon + "&token=" + token;

		request({ url: meteoUrl, method: 'GET' }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification('DATA', body);
			} else {
				self.sendSocketNotification("ERROR", 'Meteo France error: ' + response.statusText);
			}

			setTimeout(function () {
				self.fecthMeteoFrance();
			}, self.config.updateInterval);
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
