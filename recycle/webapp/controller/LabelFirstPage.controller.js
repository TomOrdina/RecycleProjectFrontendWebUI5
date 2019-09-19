sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
    "jquery.sap.storage"
], function (Controller, UIComponent, MessageToast, storage) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.LabelFirstPage", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.recycle.view.LabelFirstPage
		 */
		onInit: function () {

		},

		onPress: function (oEvent) {
			
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("fail");
			var sValue = this.getView().byId("name").getValue();
			var isColCorrect, isNumCorrect,sColor, nNumber;
			
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			
			if (sValue.length === 4) {
					sColor = sValue.slice(0, 1).toUpperCase();
					nNumber =sValue.slice(1, 4);
				
				if (sColor === 'R' | sColor === 'B' | sColor === 'G') {
					isColCorrect = true;
				} else {
					isColCorrect = false;
				}
				
				if (nNumber > 0 & nNumber <= 130) {
					isNumCorrect = true;
				} else {
					isNumCorrect = false;
				}
				
				if (isNumCorrect & isColCorrect) {
					
					oStorage.put("Color", sColor);
					oStorage.put("CodeNumber", nNumber);
					
				//	var oRouter = UIComponent.getRouterFor(this);
				//	oRouter.navTo("RouteLabelSecondPage");
				} else {
				sap.m.MessageToast.show(sMessage);
				}
			} else {
				sap.m.MessageToast.show(sMessage);
			}
		}

	
	});

});