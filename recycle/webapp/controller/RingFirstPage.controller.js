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
			
			// gets text from i18n
			var sMessageNumber = this.getView().getModel("i18n").getResourceBundle().getText("failNumber");
			var sMessageColor = this.getView().getModel("i18n").getResourceBundle().getText("failColor");
			// gets values from input
			var sValueCol = this.getView().byId("comboRing").getSelectedKey();
			var sValueNum = this.getView().byId("numberRing").getValue();
			var isColCorrect, isNumCorrect;
			
			
			//get model from data.json file
			var oModel = this.getView().getModel("data");
			// creation of local storage object
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			
			// predefines accepted values
			if (sValueNum.length === 3) { 
				
				if (sValueNum > 0 & sValueNum <= 130) {
					isNumCorrect = true;
				} else {
					isNumCorrect = false;
				}
			}
			// checks if a color is selected
			if (sValueCol) {
				isColCorrect = true;
			} else {
				isColCorrect = false;
			}
			
			//throws a message if any of the values is not entered
			
			if (!isColCorrect) {
				sap.m.MessageToast.show(sMessageColor, {duration: 3500});
			} else if (!isNumCorrect){
				sap.m.MessageToast.show(sMessageNumber, {duration: 3500});
			} else {
				
				oModel.setData({ "item": {"color": sValueCol, "number" : sValueNum }}, true);
				
				console.log(JSON.parse(oModel.getJSON()).item);
				// makes sure values are passed to local storage
				oStorage.put("Color", sValueCol);
				oStorage.put("CodeNumber", sValueNum);
				// navigates to a different page
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("RouteRingSecondPage");
			}
			
		}
			
	});
});