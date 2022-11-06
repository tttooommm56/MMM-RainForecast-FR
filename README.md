# MMM-RainForecast-FR
A <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> module to display forecast rain in France.

If a PIR-sensor using MMM-PIR-Sensor module is used, this information will not be updated during screen off. 

The infos will also not be updated when no instance of the MMM-RainForecast-FR module are displayed on the screen (for example hidden by using MMM-Remote-Control or any carousel like MMM-Pages). This will allow to reduce the number of requests to the Meteo France API. 
As soon as one MMM-RainForecast-FR module will be again displayed on the screen, a request will be called to update data. 


## Installation

Navigate into your MagicMirror's `modules` folder and execute :
```shell
git clone https://github.com/tttooommm56/MMM-RainForecast-FR.git
```

Enter the new `MMM-RainForecast-FR` folder and execute :
```shell
npm install
```

Add the module inside `config.js` placing it where you prefer 


## Update:

In your terminal, go to your `MMM-RainForecast-FR` module folder and execute :
```shell
git pull
```

Install dependencies :
```shell
npm install
```

## Configuration


|Option|Description|
|---|---|
|`lat`|Your latitude.<br>**Type:** `number`
|`lon`|Your longitude.<br>**Type:** `number`
|`showText`|Display rain forecast text.<br>**Type:** `boolean`<br>**Default:** <i>true</i>|
|`showGraph`|Display rain forecast graph.<br>**Type:** `boolean`<br>**Default:** <i>true</i>|

Here is an example of an entry in `config.js`
```
{
	module: 'MMM-RainForecast-FR',
	position: 'bottom_right',
	header: 'Prevision pluie',
	config: {
		lat: 47.369582,
		lon: 1.563980,
		showText: true,
		showGraph: true
	}
}
```

## Screenshot

![Screenshot of rain forecast](screenshotRainForecast.png?raw=true "Rain forecast")



## Notes
Data provided by <a href="http://www.meteofrance.com">Météo France</a> and updated every 5 minutes.
