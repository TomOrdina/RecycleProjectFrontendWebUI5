sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast"
], function (Controller, UIComponent, MessageToast) {
	"use strict";
	
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
			var oModel = this.getView().getModel("data");
			var latitude = JSON.parse(oModel.getJSON()).item.location.latitude;
			var longitude = JSON.parse(oModel.getJSON()).item.location.longitude;
			
			var that = this;
			
			if (!this.initialized) {
				this.initialized = true;
				
				// Set OpenLayers map
				var map = new ol.Map({
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
				var markerVectorLayer = new ol.layer.Vector({
					source: vectorSource
				});
				
				// Add layer to the map
				map.addLayer(markerVectorLayer);
				
				var coor = [longitude,latitude];
				
				// Convert coordinates to DMS
				var dms = ol.coordinate.toStringHDMS(coor);

				var n = dms.indexOf('″');
				n = n  + 3;

				var coordinateOne = dms.slice(0,n);
				var coordinateTwo = dms.slice(n + 1, dms.lenght);
				
				that.getView().byId("coordinatesOne").setText(coordinateOne);
				that.getView().byId("coordinatesTwo").setText(coordinateTwo);
			}
		},

		onPress: function () {
			
			var oRouter = UIComponent.getRouterFor(this);
			var oModel = this.getView().getModel("data");
			var AssetId = JSON.parse(oModel.getJSON()).item.correlationAssetId;
			
			var weblink = "https://eks.ordina-jworks.io/zpr-bff/assets/" + AssetId + "/state";
			
			var assetObject = { active : true };
			
			$.ajax({
				url: weblink,
				type: "POST",
				dataType: "json",
				contentType: "application/json;charset=utf-8",
				data : JSON.stringify(assetObject) // Stringify dataObject
				//data: { "active" : true }
			})
			
			.done(function (){
				oRouter.navTo("SuccesLocationSend");
			})
			
			.fail(function (err){
				if (err.status == 201) /* jQuery thinks, Status 201 means error, but it doesnt so we have to work around it here */
				{
					// handle success
					oRouter.navTo("SuccesLocationSend");
					return;
				}
				
				oRouter.navTo("RouteHome");
			});
		}
	});
});