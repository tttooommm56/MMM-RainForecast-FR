# MMM-RainForecast-FR
A <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> module to display forecast rain in France.


## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/tttooommm56/MMM-RainForecast-FR.git`.
2. Add the module inside `config.js` placing it where you prefer 


## Configuration


|Option|Description|
|---|---|
|`codeInsee`|The INSEE code for your city.<br>**Type:** `string`<br>**Default:** <i></i>|
|`showText`|Display rain forecast text.<br>**Type:** `boolean`<br>**Default:** <i>true</i>|
|`showGraph`|Display rain forecast graph.<br>**Type:** `boolean`<br>**Default:** <i>true</i>|

Here is an example of an entry in `config.js`
```
{
	module: 'MMM-RainForecast-FR',
	position: 'bottom_right',
	header: 'Prevision pluie',
	config: {
		codeInsee: '35238',
		showText: true,
		showGraph: true
	}
}
```

## Screenshots

![Screenshot of rain forecast](screenshotRainForecast.png?raw=true "Rain forecast")



## Notes
Data provided by <a href="http://www.meteofrance.com/previsions-meteo-france/previsions-pluie">Météo France</a>.
- Updated every 5 minutes.


The MIT License (MIT)
=====================

Copyright © 2018 tttooommm56 

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability,
whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
