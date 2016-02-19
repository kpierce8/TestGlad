angular.module('esriApp').controller('MapCntl', function($scope){
		$scope.name = "Ken Pierce";

		
require([
	'esri/map',
	"esri/toolbars/draw",
    "esri/graphic",
	'esri/layers/FeatureLayer',
	'esri/tasks/query',
	'esri/tasks/QueryTask',
	'esri/symbols/SimpleMarkerSymbol',
	'dijit/layout/ContentPane', 
    'dijit/form/Button',
	'dojo/domReady'], function(Map, Draw, Graphic, FeatureLayer, Query, QueryTask, SimpleMarkerSymbol){

		var map = new Map('mapDiv', {
			basemap: 'gray',
			center: [-122, 47],
			zoom: 12
		});


		//var testlayer = new FeatureLayer()


	}); //end require statement


});