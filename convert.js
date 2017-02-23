// data.json source: # https://poloniex.com/public?command=returnChartData&currencyPair=BTC_XMR&start=1405699200&end=9999999999&period=14400
// read data.json and write data.csv

// dependencies:
// npm i --save lodash

// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');
 
// Load method categories.
var array = require('lodash/array');
var object = require('lodash/fp/object');
 
// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');

// print process.argv
//console.log(process.argv);
console.log("\nJSON to CSV converter and normalizer for TensorFlow.")
console.log("Written by Rouan van der Ende")
console.log("https://github.com/bitlabio/cryptensor\n")
console.log("Usage: node convert.js inputfile.json outputfile.csv")
console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - -")
console.log("Running...\n")
if ((process.argv[2] == undefined)||(process.argv[3]==undefined)) {
	console.log("\nERR!!! Please specify input and output. ===\n")
} else {
	main();
}
///////


function main() {
	fs = require('fs')
	console.log('Reading '+process.argv[2])
	fs.readFile(process.argv[2], 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  //console.log(data);
	  var parsed = JSON.parse(data);


	  // get ranges so we can fit data to 0-1 range.
	  var priceArray = []
	  var volumeArray = []
	  for (var d in parsed) {
	  	priceArray.push(parsed[d].weightedAverage)
	  	volumeArray.push(parsed[d].volume)
	  }
	  //sort so we can get min and max
	  priceArray.sort(function(a, b){return a-b});
	  volumeArray.sort(function(a, b){return a-b});

	  var scale = {}
	  scale.priceMin = priceArray[0]
	  scale.priceMax = priceArray[priceArray.length-1]
	  scale.volMin = volumeArray[0]
	  scale.volMax = volumeArray[volumeArray.length-1]

	  console.log(scale)

	  // write data. TODO divide/shift ranges.
	  var csvtext = '';
	  for (var d in parsed) {
	  	csvtext += (normalize(parsed[d].weightedAverage, scale.priceMin, scale.priceMax)/2 + 0.5) +','+(normalize(parsed[d].volume, scale.volMin, scale.volMax)/2+0.5)+'\n';
	  }

	  console.log('Writing '+process.argv[3]+ ' to storage...' )
	  fs.writeFile(process.argv[3], csvtext, (err) => {
	  	if (err) throw err;
	  	console.log('Complete! '+ process.argv[3]+' saved!');
		});

	});	
}




function normalize(val, min, max) {
	//takes a value and normalizes it to a 0-1 range based on input ranges.
	return (val - min) / (max-min);
}