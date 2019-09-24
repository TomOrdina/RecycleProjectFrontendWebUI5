sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.Error", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.recycle.view.Error
		 */
		onInit: function () {

		},

		onPressRing: function (oEvent) {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("RouteRingFirstPage");
		},

		onPressLabel: function (oEvent) {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("RouteLabelFirstPage");
		}

	});

});