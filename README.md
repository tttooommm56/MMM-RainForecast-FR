# MMM-RainForecast-FR
A <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> module to display forecast rain in France.


## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/tttooommm56/MMM-RainForecast-FR.git`.
2. Add the module inside `config.js` placing it where you prefer 


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
