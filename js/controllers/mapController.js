angular.module('esriApp').controller('MapCntl', function($scope){
		$scope.name = "Ken Pierce";

var map, toolbar, symbol
		
require([
	'esri/map',
	"esri/toolbars/draw",
    "esri/graphic",
    "esri/Color",
	'esri/layers/FeatureLayer',
	'esri/tasks/query',
	'esri/tasks/QueryTask',
  "esri/InfoTemplate",
	'esri/symbols/SimpleMarkerSymbol',
   "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    'esri/dijit/editing/Editor',
    "esri/dijit/editing/TemplatePicker",
  'dojo/parser',
	'dijit/registry',
  "dijit/layout/BorderContainer",
	'dijit/layout/ContentPane', 
  'dijit/form/Button',
  'dijit/WidgetSet',
	'dojo/domReady'], function(Map, Draw, Graphic, Color,  FeatureLayer, Query, QueryTask, InfoTemplate, SimpleMarkerSymbol, 
    SimpleLineSymbol, SimpleFillSymbol, Editor, TemplatePicker, parser, registry){

    parser.parse({rootNode: header});

     

		map = new Map('mapDiv', {
			basemap: 'topo',
			center: [-122.8961, 47.0366],
			zoom: 13
		});
 // var testUrl = "http://services.arcgis.com/rcya3vExsaVBGUDp/arcgis/rest/services/test_map/FeatureServer/0"
 //   var testUrl = "http://services.arcgis.com/rcya3vExsaVBGUDp/arcgis/rest/services/GLADTest2/FeatureServer/0"
    var testUrl1 =  "http://services.arcgis.com/rcya3vExsaVBGUDp/arcgis/rest/services/TestOne/FeatureServer/0"


var testTemplate = new InfoTemplate("Polygon attributes", "Species: ${Species}\
      <br>Poly Type: ${PolyType}<br>Creation Date: ${CreationD}\
      <br>WRIA: ${WRIA}");




    var testlayer = new FeatureLayer(testUrl1, {
        mode: FeatureLayer.MODE_ONDEMAND,
        infoTemplate: testTemplate,
        outFields: ['*']
      });

      map.on("load", createToolbar);
      var layers = [];
      layers.push(testlayer);
      map.addLayers(layers);

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

  function addToMap(evt) {
    console.log("the evt is " + evt);
          var symbol;
          this.editing = true;
          toolbar.deactivate();
          map.showZoomSlider();
          switch (evt.geometry.type) {
            case "polyline":
              symbol = new SimpleLineSymbol();
              break;
            default:
              symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
              new Color([0,255,0,1]), 2),new Color([255,255,0,0.25])
                );
              break;
          }
          var attributes = {};
         
          attributes.Id = 1;
          attributes.Species = "Tree";
          var graphic = new Graphic(evt.geometry, symbol, attributes);
          console.log(graphic);
          console.log(testlayer.graphics.count);
          testlayer.applyEdits([graphic]).then(alert("well alerts work"));
          this.editing = false;
          testlayer.refresh();
          //map.graphics.add(graphic);
        }

  
  		function createToolbar(amap) {
        console.log("creating toolbar");
          toolbar = new Draw(map);
          toolbar.on("draw-end", addToMap);
        }

  



  	// Copied from ed_simpletoolbar sandbox, http://developers.arcgis.com/javascript/sandbox/sandbox.html?sample=ed_simpletoolbar
        // map.on("layers-add-result", initEditor);


        //  function initEditor(evt) {
        //   var templateLayers = arrayUtils.map(evt.layers, function(result){
        //     return result.layer;
        //   });
        //   var templatePicker = new TemplatePicker({
        //     featureLayers: templateLayers,
        //     grouping: true,
        //     rows: "auto",
        //     columns: 3
        //   }, "templateDiv");
        //   templatePicker.startup();

        //   var layers = arrayUtils.map(evt.layers, function(result) {
        //     return { featureLayer: result.layer };
        //   });
        //   var settings = {
        //     map: map,
        //     templatePicker: templatePicker,
        //     layerInfos: layers,
        //     toolbarVisible: true,
        //     createOptions: {
        //       polylineDrawTools:[ Editor.CREATE_TOOL_FREEHAND_POLYLINE ],
        //       polygonDrawTools: [ Editor.CREATE_TOOL_FREEHAND_POLYGON,
        //         Editor.CREATE_TOOL_CIRCLE,
        //         Editor.CREATE_TOOL_TRIANGLE,
        //         Editor.CREATE_TOOL_RECTANGLE
        //       ]
        //     },
        //     toolbarOptions: {
        //       reshapeVisible: true
        //     }
        //   };

        //   var params = { settings: settings };
        //   var myEditor = new Editor(params, 'editorDiv');
        //   //define snapping options
        //   var symbol = new SimpleMarkerSymbol(
        //     SimpleMarkerSymbol.STYLE_CROSS, 
        //     15, 
        //     new SimpleLineSymbol(
        //       SimpleLineSymbol.STYLE_SOLID, 
        //       new Color([255, 0, 0, 0.5]), 
        //       5
        //     ), 
        //     null
        //   );
        //   // map.enableSnapping({
        //   //   snapPointSymbol: symbol,
        //   //   tolerance: 20,
        //   //   snapKey: keys.ALT
        //   // });
    
        //   myEditor.startup();
        // }
      
// End copied function

	}); //end require statement


});