sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.SuccesView", {

		onInit: function () {

		},
		// navigates to a different page
		sendLocation: function (oEvent) {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("SendLocation");
		},
		
		awayLocation: function (oEvent) {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("AwayLocation");
		}

	});

});