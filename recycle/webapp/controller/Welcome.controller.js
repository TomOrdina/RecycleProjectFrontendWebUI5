sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.Welcome", {
		
		onInit: function () {
		
		},

		onPressHome: function (oEvent) { // navigate to Home
		console.log('hello');
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("RouteHome");
		},

	});

});