sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/UIComponent"
], function (Controller, MessageBox, UIComponent) {
	"use strict";

	var map, markerVectorLayer,glatitude,glongitude;
	
	return Controller.extend("opensap.recycle.controller.AwayLocation", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.recycle.view.AwayLocation
		 */
		onInit: function () {

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf opensap.recycle.view.AwayLocation
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf opensap.recycle.view.AwayLocation
		 */
		 
		 onPressAway: function (){
		 	
		 	
		 // Check if date & time value is only 1 cipher then add 0
		function checkTime(i) {
				  if (i < 10) {
				    i = "0" + i;
				  }
				  return i;
				}
		// initialise local storage	
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oRouter = UIComponent.getRouterFor(this);
		var failedToGetLocation = this.getView().getModel("i18n").getResourceBundle().getText("failLocationAway");
		var AssetId= oStorage.get("correlationId");
		var today = new Date();
		var date = today.getFullYear()+ "-" + checkTime(today.getMonth())+ "-" + checkTime(today.getDate())+"T";
		var time = checkTime(today.getHours())+ ":" + checkTime(today.getMinutes())+ ":" + checkTime(today.getSeconds())+"Z";
		var Timestamp = date+time;
		
		//Create dataObject that contains AssetID , location and timestamp
				var assetObject=  {
							    "correlationAssetId": AssetId,
							    "latitude": glatitude,
							    "longitude": glongitude,
							    "timestamp": Timestamp
				                	  };
				
					var assetObjectString=JSON.stringify(assetObject);
				

		// webLink to backend 
		   var weblink = "http://localhost:8081/assetlocation";

		
		// Ajax post call ( sending Id, location and timestamp)
			$.ajax({
			url: weblink,
			type: "POST",
			dataType: "json",
			contentType: "application/json;charset=utf-8",
	
		// Stringify dataObject
			data:assetObjectString
				
		
			})
			
		    .done(function (){
					sap.m.MessageBox.show(Timestamp);
					oRouter.navTo("SuccesLocationSend");
		    	
		    })
		            
		    
		    
		    .fail(function (){
					sap.m.MessageBox.show(failedToGetLocation);
		    	
		    });
			
		 	
	},

		 
		 
		onAfterRendering: function() {
			var that = this;
			
			if (!this.initialized) {
				this.initialized = true;
				
				// Set OpenLayers map
				map = new ol.Map({
					target: that.getView().byId("map_canvas").getDomRef(),
					layers: [
						new ol.layer.Tile({
							source: new ol.source.OSM()
						})
					],
					view: new ol.View({
						center: ol.proj.fromLonLat([4.357582, 51.198185]),
						zoom: 12
					})
				});
			}
			
			// Create a new marker when the map has been clicked on
			map.on("singleclick", function(evt){
				// Get coordinates from the event
				var coor = evt.coordinate;
				
				var lonlat = ol.proj.transform(coor, 'EPSG:3857', 'EPSG:4326');
				var longitude = lonlat[0];
				var latitude = lonlat[1];
				glatitude= latitude;
				glongitude=longitude;
				// If there is already a maker (= layer), delete it as only one marker is allowed
				map.removeLayer(markerVectorLayer);
				
				// Create a marker (= feature) which references to the location of the user
				var marker = new ol.Feature({
						geometry: new ol.geom.Point(
						ol.proj.fromLonLat([longitude, latitude])
					),
				});
				
				// Change the style of the marker and use a custom icon
				marker.setStyle(new ol.style.Style({
						image: new ol.style.Icon({
							src: 'icon/icon.png'
					})
				}));
				
				// Create a vector based on the marker (= feature)
				var vectorSource = new ol.source.Vector({
					features: [marker]
				});
				
				// Create layer based on a vector		
				markerVectorLayer = new ol.layer.Vector({
					source: vectorSource,
				});
				
				// Add layer to the map
				map.addLayer(markerVectorLayer);
				
				// Update text value of DMS
				if(latitude && longitude) {
					var coor = [longitude,latitude];
					
					// Convert coordinates to DMS
					var dms = ol.coordinate.toStringHDMS(coor);
					
					// Get element where we'll show the coordinates
					var span= that.getView().byId("coordinates");
					
					// Set the text of the element to black as the coordinates are found
					span.addStyleClass("black");
					
					that.getView().byId("coordinates").setText("Coordinaten: " + dms);
				} else {
					that.getView().byId("coordinates").setText("Haal uw locatie op");
				}
			});
		}
	
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf opensap.recycle.view.AwayLocation
		 */
		//	onExit: function() {
		//
		//	}

	});

});