sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";
	
	var map, longitude, latitude, markerVectorLayer;
	
	return Controller.extend("opensap.recycle.controller.SendLocation", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.recycle.view.SendLocation
		 */
		onInit: function () {

		},
		// navigates to a different page
		onPressSend : function (oEvent) {
			// to be implemented
		},
		
		// renews location
		onPressRenew : function (oEvent) {
			// Get user location and show it on the map
			this.getLocation();
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf opensap.recycle.view.SendLocation
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf opensap.recycle.view.SendLocation
		 */
		onAfterRendering: function() {
			var that = this;
			
			// Set OpenLayers map
			map = new ol.Map({
				target: that.getView().byId("map_canvas").getDomRef(),
				layers: [
					new ol.layer.Tile({
						source: new ol.source.OSM()
					})
				],
				view: new ol.View({
					center: ol.proj.fromLonLat([longitude, latitude]),
					zoom: 15
				})
			});
			
			// Get user location and show it on the map
			this.getLocation();
		},

		// Gets the users location via the device its GPS and puts a marker on the map
		getLocation: function() {
			var that = this;
			
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					longitude = position.coords.longitude;
					latitude = position.coords.latitude;
					
					// Zoom the map
					map.getView().setCenter(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'));
					map.getView().setZoom(15);
					
					// If there is already a maker (= layer), delete it as only one marker is allowed
					if (markerVectorLayer)
					{
						map.removeLayer(markerVectorLayer);
					}
					
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
						
						that.getView().byId("coordinates").setText("Coordinaten: " + dms);

						
					} else {
						that.getView().byId("coordinates").setText("Haal uw locatie op");
					}
				});
			} else {
				sap.m.MessageToast.show("Fail");
			}
		}
		
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf opensap.recycle.view.SendLocation
		 */
		//	onExit: function() {
		//
		//	}

	});

});