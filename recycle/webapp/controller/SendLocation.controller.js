sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";
	
	var map;
	
	return Controller.extend("opensap.recycle.controller.SendLocation", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.recycle.view.SendLocation
		 */
		onInit: function () {

		},
		
		onPressSend : function (oEvent) {
			// Ask the user to share its location
			if (navigator.geolocation) {
					// Go to the next screen if user shares its location
					var oRouter = UIComponent.getRouterFor(this);
					oRouter.navTo("ItemBack");
			} else {
				// Throw a warning messagetoast when user doesn't share its location
				sap.m.MessageToast.show("Gelieve uw locatie te delen");
			}
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