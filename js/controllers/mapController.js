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
   "dijit/form/Button",
  "esri/tasks/GeometryService",
	'esri/symbols/SimpleMarkerSymbol',
   "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    'esri/dijit/editing/Editor',
    "esri/dijit/editing/TemplatePicker",
    "esri/dijit/AttributeInspector",
    "dojo/_base/array",
  'dojo/parser',
  "dojo/dom-construct",
	'dijit/registry',
  "dijit/layout/BorderContainer",
	'dijit/layout/ContentPane', 
  'dijit/WidgetSet',
	'dojo/domReady'], function(Map, Draw, Graphic, config, Color,  FeatureLayer, Query, QueryTask, InfoTemplate, Button, GeometryService, SimpleMarkerSymbol, 
    SimpleLineSymbol, SimpleFillSymbol, Editor, TemplatePicker, AttributeInspector, arrayUtils, parser, domConstruct, registry){

    parser.parse({rootNode: header});

  //  esriConfig.defaults.io.proxyUrl = "/proxy/";    

		map = new Map('mapDiv', {
			basemap: 'topo',
			center: [-122.8961, 47.0366],
			zoom: 13
		});

    var testUrl1 =  "http://services.arcgis.com/rcya3vExsaVBGUDp/arcgis/rest/services/TestOne/FeatureServer/0"

    var cityUgaUrl = "https://services.arcgis.com/6lCKYNJLvwTXqrmp/arcgis/rest/services/CityUGA/FeatureServer/0/query?outFields=*&where=1%3D1"
    var wriaUrl = "https://services.arcgis.com/6lCKYNJLvwTXqrmp/arcgis/rest/services/WAECY_WRIA/FeatureServer/0/query?outFields=*&where=1%3D1"

    var testTemplate = new InfoTemplate("Polygon attributes", "Species: ${Species}\
      <br>Poly Type: ${PolyType}<br>Creation Date: ${CreationD}\
      <br>WRIA: ${WRIA}");

    var testlayer = new FeatureLayer(testUrl1, {
        mode: FeatureLayer.MODE_ONDEMAND,
        // infoTemplate: testTemplate,
        outFields: ['Species', 'FID', 'VitalSign', 'WRIA', 'Creator', 'EditDate']
        //outFields: ['*']
      });

     var wrialayer = new FeatureLayer(wriaUrl, {
        mode: FeatureLayer.MODE_ONDEMAND,
        // infoTemplate: testTemplate,
        //outFields: ['Species', 'FID', 'VitalSign', 'WRIA', 'Creator', 'EditDate']
        outFields: ['*']
      });

// STRAT INTERACTION CODE

      map.on("load", createToolbar);
      var layers = [];
      layers.push(wrialayer);
      layers.push(testlayer);

      map.addLayers(layers);


        registry.forEach(function(d) {
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


// Original editing code, adds polygons based on sandbox sample
// 3  //
//Adding new polygons
  function addToMap(evt) {
    console.log("the evt is " + evt.geometry);
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
          testlayer.applyEdits([graphic]).then(alert("Enjoy this fun test popup"));
          this.editing = false;
          testlayer.refresh();
        }

  
      function createToolbar(amap) {
        console.log("creating toolbar");
          toolbar = new Draw(map);
          toolbar.on("draw-end", addToMap);
        }

// Editor code coming from Building Web and Mobile ArcGIS Server Applications with Javascript PACKT 2014



// Copied from ed_simpletoolbar sandbox, http://developers.arcgis.com/javascript/sandbox/sandbox.html?sample=ed_simpletoolbar
// 2  //
// Polygon geometry editing
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

 // 1  //
// Attribute Inspector //
var attrInfos = [{
'featureLayer': testlayer,
'showAttachments': false,
'isEditable': true,
'fieldInfos': [
{'fieldName': 'Species', 'isEditable':true, 'tooltip': 'Species data', 'label':'Species:'},
{'fieldName': 'FID', 'isEditable':true, 'tooltip': 'The autogenerated ID', 'label':'Field Name:'},
{'fieldName': 'VitalSign', 'isEditable':false,'label':'Vital Sign:'},
{'fieldName': 'WRIA', 'isEditable':true,'tooltip': 'Water Resources Inventory Area ID','label':'WRIA:'},
{'fieldName': 'County', 'isEditable':true,'tooltip': 'County','label':'County:'},
{'fieldName': 'Creator', 'isEditable':false,'label':'Polygon Creator:'},
{'fieldName': 'EditDate', 'isEditable':false,'label':'Last date edited:'}
]
}];

var attInspector = new AttributeInspector({
layerInfos:attrInfos
}, domConstruct.create("div"));

  attInspector.on("delete", function(evt) {
    evt.feature.getLayer().applyEdits(null, null, [evt.feature]);
    map.infoWindow.hide();
  });
 

 var saveButton = new Button({ label: "Save", "class": "saveButton"},domConstruct.create("div"));
  
  domConstruct.place(saveButton.domNode, attInspector.deleteBtn.domNode, "after");

  saveButton.on("click", function() {
    updateFeature.getLayer().applyEdits(null, [updateFeature], null);
  });

  attInspector.on("attribute-change", function(evt) {
    //store the updates to apply when the save button is clicked 
    updateFeature.attributes[evt.fieldName] = evt.fieldValue;
  });

  attInspector.on("next", function(evt) {
    updateFeature = evt.feature;
    console.log("Next " + updateFeature.attributes.OBJECTID);
  });




map.infoWindow.setContent(attInspector.domNode);
map.infoWindow.resize(350, 240);


  var settings = {
      map: map,
      geometryService: new GeometryService("https://tasks.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer"),
      layerInfos:attrInfos,
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

 





 




	}); //end require statement


});


// Fields:
// FID (type: esriFieldTypeInteger, alias: FID, SQL Type: sqlTypeInteger, nullable: false, editable: false)
// Id (type: esriFieldTypeInteger, alias: Id, SQL Type: sqlTypeInteger, nullable: true, editable: true)
// GUID (type: esriFieldTypeInteger, alias: GUID, SQL Type: sqlTypeInteger, nullable: true, editable: true)
// PolyType (type: esriFieldTypeString, alias: PolyType, SQL Type: sqlTypeNVarchar, length: 50, nullable: true, editable: true)
// Species (type: esriFieldTypeString, alias: Species, SQL Type: sqlTypeNVarchar, length: 50, nullable: true, editable: true)
// CreationD (type: esriFieldTypeDate, alias: CreationD, SQL Type: sqlTypeTimestamp2, length: 8, nullable: true, editable: true)
// EditD (type: esriFieldTypeDate, alias: EditD, SQL Type: sqlTypeTimestamp2, length: 8, nullable: true, editable: true)
// WRIA (type: esriFieldTypeInteger, alias: WRIA, SQL Type: sqlTypeInteger, nullable: true, editable: true)
// County (type: esriFieldTypeString, alias: County, SQL Type: sqlTypeNVarchar, length: 50, nullable: true, editable: true)
// CreationDa (type: esriFieldTypeDate, alias: CreationDa, SQL Type: sqlTypeTimestamp2, length: 8, nullable: true, editable: true)
// Creator (type: esriFieldTypeString, alias: Creator, SQL Type: sqlTypeNVarchar, length: 50, nullable: true, editable: true)
// EditDate (type: esriFieldTypeDate, alias: EditDate, SQL Type: sqlTypeTimestamp2, length: 8, nullable: true, editable: true)
// Editor (type: esriFieldTypeString, alias: Editor, SQL Type: sqlTypeNVarchar, length: 50, nullable: true, editable: true)
// VitalSign (type: esriFieldTypeString, alias: VitalSign, SQL Type: sqlTypeNVarchar, length: 25, nullable: true, editable: true)