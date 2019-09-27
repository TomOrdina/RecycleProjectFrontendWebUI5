sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.Home", {
		
		onInit: function () {
		
		},

		onPressRing: function (oEvent) { // navigate to RouteRingFirstPage
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("RouteRingFirstPage");
		},

		onPressLabel: function (oEvent) { // navigate to RouteLabelFirstPage
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("RouteLabelFirstPage");
		}
		//,
		// onAfterRendering: function () {
		// 	if (navigator.geolocation) {
		// 		navigator.geolocation.getCurrentPosition(function (position) {
		// 		var	longitude = position.coords.longitude;
		// 		var	latitude = position.coords.latitude;
		// 		)}
		// 		console.log("working");
		// 	} else {
		// 		console.log("rejected");
		// 	}
		// }                    
	});

});