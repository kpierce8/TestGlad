angular.module('esriApp').controller('MapCntl', function($scope){
		$scope.name = "Ken Pierce";

var map, toolbar, symbol
		
require([
	'esri/map',
	"esri/toolbars/draw",
    "esri/graphic",
	'esri/layers/FeatureLayer',
	'esri/tasks/query',
	'esri/tasks/QueryTask',
	'esri/symbols/SimpleMarkerSymbol',
   "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
  'dojo/parser',
	'dijit/registry',
  "dijit/layout/BorderContainer",
	'dijit/layout/ContentPane', 
  'dijit/form/Button',
  'dijit/WidgetSet',
	'dojo/domReady'], function(Map, Draw, Graphic, FeatureLayer, Query, QueryTask, SimpleMarkerSymbol, 
    SimpleLineSymbol, SimpleFillSymbol, parser, registry){

    parser.parse({rootNode: header});

     

		map = new Map('mapDiv', {
			basemap: 'topo',
			center: [-122.8961, 47.0366],
			zoom: 13
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
          console.log(tool);
          toolbar.activate(Draw[tool]);
          map.hideZoomSlider();
        }

  		function createToolbar(themap) {
        console.log("creating toolbar");
          toolbar = new Draw(map);
          toolbar.on("draw-end", addToMap);
        }


  function addToMap(evt) {
          var symbol;
          toolbar.deactivate();
          map.showZoomSlider();
          switch (evt.geometry.type) {
            case "point":
            case "multipoint":
              symbol = new SimpleMarkerSymbol();
              break;
            case "polyline":
              symbol = new SimpleLineSymbol();
              break;
            default:
              symbol = new SimpleFillSymbol();
              break;
          }
          var graphic = new Graphic(evt.geometry, symbol);
          map.graphics.add(graphic);
        }
		//var testlayer = new FeatureLayer()


	}); //end require statement


});