sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	
	var map, longitude, latitude;
	
	return Controller.extend("opensap.recycle.controller.ItemBack", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.recycle.view.ItemBack
		 */
		onInit: function () {

		},
		
		// Logic needs to be implemented

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf opensap.recycle.view.ItemBack
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf opensap.recycle.view.ItemBack
		 */
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
						center: ol.proj.fromLonLat([74.006, 40.7127]),
						zoom: 10
					})
				});
			
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						longitude = position.coords.longitude;
						latitude = position.coords.latitude;
						
						// Zoom the map
						map.getView().setCenter(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'));
						map.getView().setZoom(15);
						
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
						var markerVectorLayer = new ol.layer.Vector({
							source: vectorSource,
						});
						
						// Add layer to the map
						map.addLayer(markerVectorLayer);
						
						// Update text value of longitude & latitude
						if(latitude && longitude) {
							var coor = [longitude,latitude];
							
							// Convert coordinates to DMS
							var dms = ol.coordinate.toStringHDMS(coor);
							
							// Get north & east
							var index = dms.indexOf("N");
							var north = dms.substr(0, index + 1);
							var east = dms.substr(index -1);
							
							that.getView().byId("north").setText(north);
							that.getView().byId("east").setText(east);
						} else {
							that.getView().byId("north").setText("North hasn't been set");
							that.getView().byId("east").setText("East hasn't been set");
						}
					});
				} else {
					sap.m.MessageToast.show("Fail");
				}
			}
		}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf opensap.recycle.view.ItemBack
		 */
		//	onExit: function() {
		//
		//	}

	});

});