sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
    "jquery.sap.storage"
], function (Controller, UIComponent, MessageToast, storage) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.RingFirstPage", {

		onInit: function () {

		},

		onPress: function (oEvent) {
			
			// Gets text from i18n
			var sMessageNumber = this.getView().getModel("i18n").getResourceBundle().getText("failNumber");
			var sMessageColor = this.getView().getModel("i18n").getResourceBundle().getText("failColor");
			// gets values from input
			var sValueCol = this.getView().byId("comboRing").getSelectedKey();
			var sValueNum = this.getView().byId("numberRing").getValue();
			var isColCorrect, isNumCorrect;
			
			
			// Get model from data.json file
			var oModel = this.getView().getModel("data");
			
			// Predefines accepted values
			if (sValueNum.length === 3) { 
				
				if (sValueNum > 0 & sValueNum <= 130) {
					isNumCorrect = true;
				} else {
					isNumCorrect = false;
				}
			}
			// Checks if a color is selected
			if (sValueCol) {
				isColCorrect = true;
			} else {
				isColCorrect = false;
			}
			
			// Throws a message if any of the values is not entered
			
			if (!isColCorrect) {
				sap.m.MessageToast.show(sMessageColor, {duration: 3500});
			} else if (!isNumCorrect){
				sap.m.MessageToast.show(sMessageNumber, {duration: 3500});
			} else {
				// Puts data into local model
				oModel.setData({ "item": {"color": sValueCol, "number" : sValueNum }}, true);
				
				// Navigates to a different page
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("RouteRingSecondPage");
			}
		}
	});
});