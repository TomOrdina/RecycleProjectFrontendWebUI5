sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.ServerError", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.recycle.view.ServerError
		 */
		onInit: function () {

		},

		onPress: function () {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("RouteHome");
		}

	});

});