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
	'dijit/registry',
	'dijit/layout/ContentPane', 
    'dijit/form/Button',
	'dojo/domReady'], function(Map, Draw, Graphic, FeatureLayer, Query, QueryTask, SimpleMarkerSymbol, registry){

		var map = new Map('mapDiv', {
			basemap: 'gray',
			center: [-122, 47],
			zoom: 12
		});

      	map.on("load", createToolbar);


		// loop through all dijits, connect onClick event
        // listeners for buttons to activate drawing tools
        registry.forEach(function(d) {
          // d is a reference to a dijit
          // could be a layout container or a button
          if ( d.declaredClass === "dijit.form.Button" ) {
            d.on("click", activateTool);
          }
        });

        function activateTool() {
          var tool = this.label.toUpperCase().replace(/ /g, "_");
          toolbar.activate(Draw[tool]);
          map.hideZoomSlider();
        }

  		function createToolbar(themap) {
          toolbar = new Draw(map);
          toolbar.on("draw-end", addToMap);
        }

		//var testlayer = new FeatureLayer()


	}); //end require statement


});