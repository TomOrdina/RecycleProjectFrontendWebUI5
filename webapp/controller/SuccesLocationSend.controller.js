sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";
	var oLocations;
	var aLocations = [];
	
	return Controller.extend("opensap.recycle.controller.SuccesLocationSend", {
		
		onInit: function () {
			
		},
		
		onAfterRendering: function() {
			var that = this;
			var map, datareturned, physicalId;
			
			// Get model from data.json file
			var oModel = this.getView().getModel("data");
			var correlationAssetId = JSON.parse(oModel.getJSON()).item.correlationAssetId;

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
					//overlays: [overlay],  // OVERLAY
					view: new ol.View({
						center: ol.proj.fromLonLat([4.357582, 51.198185]),
						zoom: 12
					})
				});
			};
			
			var weburl = "http://localhost:8081/assets"; 
			$.ajax({
				url: weburl,
				type: "GET",
				dataType: "json",
				success: function(dataj){
					datareturned = JSON.stringify(dataj);
					
					dataj.forEach(function (obj) {
						if (obj.correlationAssetId === correlationAssetId) {
							physicalId = obj.physicalId;
							oLocations = obj.locations;
							oLocations.sort(function(a, b) {
								return b.timestamp - a.timestamp;
							});
							
							oLocations.sort(function(a, b) {
								return a.timestamp - b.timestamp;
							});
						}
					});
					
					//var correlationAssetId = datareturned.substring(1,datareturned.length - 1);
					//oModel.setData({ "item": {"correlationAssetId" : correlationAssetId }}, true);
				
				}
				// error: function(){
				// 	// navigates to a page
				// 		oRouter.navTo("Error");
				// 		location.reload();
				// }
			})
			.done (function () {
				oLocations.forEach(function(location) {
					
					// Fill an array with solely the converted longitude and latitude
					aLocations.push(
						ol.proj.fromLonLat([location.longitude, location.latitude])
					);
					
					// Create a marker (= feature) which references to the location of the user
					var marker = new ol.Feature({
						geometry: new ol.geom.Point(
							ol.proj.fromLonLat([location.longitude, location.latitude])
						)
					});
					
					// Change the style of the marker and use a custom icon
					marker.setStyle( new ol.style.Style({
						image: new ol.style.Circle({
							radius: 4,
							fill: new ol.style.Fill({color: '#E6600D'}),
							stroke: new ol.style.Stroke({
								color: [255,0,0], width: 2
							})
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
					
					// Set an extra property named timestamp so we can show the time later on when a users clicks on a marker
					markerVectorLayer.setProperties({'timestamp': location.timestamp})
					
					// Add layer to the map
					map.addLayer(markerVectorLayer);
				});
				
				// Create style for a new layer (will be a line between markers)
				var styleLine = [
					new ol.style.Style({
							stroke: new ol.style.Stroke({
							color: '#E09D00',
							width: 3
						})
					})
				];
				
				// Create the layer (line between markers on the map)
				var line = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: [new ol.Feature({
							geometry: new ol.geom.LineString(aLocations),
							name: 'Line',
						})]
					})
				});
				
				// Set the style of the freshly created layer
				line.setStyle(styleLine);
				
				// Add the layer to the map
				map.addLayer(line);
			});
			
			// Function which will show the info of the layer that has been clicked on
			map.on("singleclick", function(e) {
				map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
					
					// Only show a messagebox when a marker has been clicked on, timestamp is a unique property given by the marker layers
					if (layer.get('timestamp'))
					{
						var lonlat = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
						
						// Show the converted longitude and latitude as well as the timestamp
						sap.m.MessageBox.show(physicalId + ": " + ol.coordinate.toStringHDMS([lonlat[0], lonlat[1]]) + ", Timestamp: " + layer.get('timestamp'));
					}
				});
			});
		}
	});
});