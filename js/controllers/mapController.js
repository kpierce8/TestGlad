angular.module('esriApp').controller('MapCntl', function($scope){
		$scope.name = "Ken Pierce";

var map, toolbar, symbol
		
require([
	'esri/map',
	"esri/toolbars/draw",
  "esri/graphic",
  "esri/config",
  "esri/Color",
	'esri/layers/FeatureLayer',
	'esri/tasks/query',
	'esri/tasks/QueryTask',
  "esri/InfoTemplate",
  "esri/tasks/GeometryService",
	'esri/symbols/SimpleMarkerSymbol',
   "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    'esri/dijit/editing/Editor',
    "esri/dijit/editing/TemplatePicker",
    "dojo/_base/array",
  'dojo/parser',
	'dijit/registry',
  "dijit/layout/BorderContainer",
	'dijit/layout/ContentPane', 
  'dijit/form/Button',
  'dijit/WidgetSet',
	'dojo/domReady'], function(Map, Draw, Graphic, config, Color,  FeatureLayer, Query, QueryTask, InfoTemplate, GeometryService, SimpleMarkerSymbol, 
    SimpleLineSymbol, SimpleFillSymbol, Editor, TemplatePicker, arrayUtils, parser, registry){

    parser.parse({rootNode: header});

  //  esriConfig.defaults.io.proxyUrl = "/proxy/";    

		map = new Map('mapDiv', {
			basemap: 'topo',
			center: [-122.8961, 47.0366],
			zoom: 13
		});

    var testUrl1 =  "http://services.arcgis.com/rcya3vExsaVBGUDp/arcgis/rest/services/TestOne/FeatureServer/0"

    var testTemplate = new InfoTemplate("Polygon attributes", "Species: ${Species}\
      <br>Poly Type: ${PolyType}<br>Creation Date: ${CreationD}\
      <br>WRIA: ${WRIA}");

    var testlayer = new FeatureLayer(testUrl1, {
        mode: FeatureLayer.MODE_ONDEMAND,
        infoTemplate: testTemplate,
        outFields: ['*']
      });

// STRAT INTERACTION CODE

 //     map.on("load", createToolbar);
      var layers = [];
      layers.push(testlayer);
      map.addLayers(layers);


        // registry.forEach(function(d) {
        //   if ( d.declaredClass === "dijit.form.Button" ) {
        //     d.on("click", activateTool);
        //   }
        // });

        // function activateTool() {
        //   var tool = this.label.toUpperCase().replace(/ /g, "_");
        //   console.log(tool);
        //   toolbar.activate(Draw[tool]);
        //   map.hideZoomSlider();
        // }

// Editor code coming from Building Web and Mobile ArcGIS Server Applications with Javascript PACKT 2014

// var layerInfos = [{
// 'featureLayer': petroFieldsFL,
// 'showAttachments': false,
// 'isEditable': true,
// 'fieldInfos': [
// {'fieldName': 'activeprod', 'isEditable':true, 'tooltip': 'Current Status', 'label':'Status:'},
// {'fieldName': 'field_name', 'isEditable':true, 'tooltip': 'The name of this oil field', 'label':'Field Name:'},
// {'fieldName': 'approxacre', 'isEditable':false,'label':'Acreage:'},
// {'fieldName': 'avgdepth', 'isEditable':false,
// 'label':'Average Depth:'},
// {'fieldName': 'cumm_oil', 'isEditable':false,
// 'label':'Cummulative Oil:'},
// {'fieldName': 'cumm_gas', 'isEditable':false,
// 'label':'Cummulative Gas:'}
// ]
// }];
// var attInspector = new AttributeInspector({
// layerInfos:layerInfos
// }, domConstruct.create("div"));

 map.on("layers-add-result", initEditing);

 function initEditing(bob){
   var templateLayers = arrayUtils.map(bob.layers, function(result){
     return result.layer;
   });

 var templatePicker = new TemplatePicker({
            featureLayers: templateLayers,
            grouping: true,
            rows: "auto",
            columns: 1
          }, "templateDiv");
          templatePicker.startup();
 

 var eLayers = arrayUtils.map(bob.layers, function(result) {
            return { featureLayer: result.layer };
          });



  var settings = {
      map: map,
      geometryService: new GeometryService("https://tasks.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer"),
      layerInfos:eLayers,
      templatePicker: templatePicker,
      toolbarVisible: true,
            createOptions: {
              polylineDrawTools:[ Editor.CREATE_TOOL_FREEHAND_POLYLINE ],
              polygonDrawTools: [ Editor.CREATE_TOOL_FREEHAND_POLYGON,
                Editor.CREATE_TOOL_CIRCLE,
                Editor.CREATE_TOOL_TRIANGLE,
                Editor.CREATE_TOOL_RECTANGLE
              ]
            },
            toolbarOptions: {
              reshapeVisible: true
            }};

  var params = {settings: settings};
  var editorWidget = new Editor(params, 'editorDiv');
  editorWidget.startup();
}

 




// Original editing code, adds polygons based on sandbox sample
  // function addToMap(evt) {
  //   console.log("the evt is " + evt);
  //         var symbol;
  //         this.editing = true;
  //         toolbar.deactivate();
  //         map.showZoomSlider();
  //         switch (evt.geometry.type) {
  //           case "polyline":
  //             symbol = new SimpleLineSymbol();
  //             break;
  //           default:
  //             symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
  //             new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
  //             new Color([0,255,0,1]), 2),new Color([255,255,0,0.25])
  //               );
  //             break;
  //         }
  //         var attributes = {};
         
  //         attributes.Id = 1;
  //         attributes.Species = "Tree";
  //         var graphic = new Graphic(evt.geometry, symbol, attributes);
  //         console.log(graphic);
  //         console.log(testlayer.graphics.count);
  //         testlayer.applyEdits([graphic]).then(alert("Enjoy this fun test popup"));
  //         this.editing = false;
  //         testlayer.refresh();
  //       }

  
  		// function createToolbar(amap) {
    //     console.log("creating toolbar");
    //       toolbar = new Draw(map);
    //       toolbar.on("draw-end", addToMap);
    //     }

  



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