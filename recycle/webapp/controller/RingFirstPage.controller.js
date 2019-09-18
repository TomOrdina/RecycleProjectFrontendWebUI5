sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.RingFirstPage", {

		onInit: function () {

		},

		onPress: function (oEvent) {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("RouteRingSecondPage");
		}

	});

});