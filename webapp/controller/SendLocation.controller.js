sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox"
], function (Controller, UIComponent, MessageBox) {
	"use strict";
	
	
	var map, longitude, latitude, markerVectorLayer;
	//var shortExit = true;
	return Controller.extend("opensap.recycle.controller.SendLocation", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.recycle.view.SendLocation
		 */
		onInit: function () {

		},

		// Gets the users location via the device its GPS and puts a marker on the map
		getLocation: function() {
			var that = this;
			
			if (navigator.geolocation) {
				// Set OpenLayers map
				if(map) {
					map.view = new ol.View({
						center: ol.proj.fromLonLat([longitude, latitude]),
						zoom: 15
					});
				} else {
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
				}
				
				var options = {
				  enableHighAccuracy: true,
				  timeout: 5000,
				  maximumAge: 0
				};
				
				function success (position) {
					longitude = position.coords.longitude;
					latitude = position.coords.latitude;
					
					//shortExit = false;
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
						)
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
						source: vectorSource
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
				}
				
				function error(err) {
					var oRouter = UIComponent.getRouterFor(that);
					oRouter.navTo("AwayLocation");
				}
				navigator.geolocation.getCurrentPosition(success, error, options);
				
			} else {
				sap.m.MessageToast.show("Fail");
			}
		},
		
		// navigates to a different page
		onPressSend : function (oEvent) {
			function checkTime(i) {
				var k = i;
				if (i < 10) {
				  k = "0" + k;
				}
				return k;
			}
			
			// get model from data.json file
			var oModel = this.getView().getModel("data");
			var oRouter = UIComponent.getRouterFor(this);
			var AssetId = JSON.parse(oModel.getJSON()).item.correlationAssetId;
			var today = new Date();
			var date = today.getFullYear()+ "-" + checkTime(today.getMonth())+ "-" + checkTime(today.getDate())+"T";
			var time = checkTime(today.getHours())+ ":" + checkTime(today.getMinutes())+ ":" + checkTime(today.getSeconds())+"Z";
			var Timestamp = date+time;
			
			//Create dataObject that contains AssetID , location and timestamp
			var assetObject=  {
				"latitude": latitude,
				"longitude": longitude,
				"timestamp": Timestamp
			};
			
			oModel.setData({ "item": {"location" : assetObject }}, true);
	
			// webLink to backend 
			var weblink = "https://eks.ordina-jworks.io/zpr-bff/assets/" + AssetId +"/location";
			   
			// Ajax post call ( sending Id, location and timestamp)
			$.ajax({
			url: weblink,
			type: "POST",
			dataType: "json",
			contentType: "application/json;charset=utf-8",
		
			// Stringify dataObject
			data:assetObject
				
			})
			
			.done(function (){
				oRouter.navTo("ItemBack");
			})
			
			.fail(function (err){
				oRouter.navTo("AwayLocation");
			});
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
			// Get user location and show it on the map
			this.getLocation();
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