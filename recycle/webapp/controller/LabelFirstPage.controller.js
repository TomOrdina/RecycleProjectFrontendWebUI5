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
			
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("fail"); // get text from i18n model
			var sValue = this.getView().byId("name").getValue(); //get input value
			var isColCorrect, isNumCorrect, sColor, nNumber;
			
			//get model from data.json file
			var oModel = this.getView().getModel("data");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local); // declare oStorage object for local storage
			
			// makes sure length of input is 4 as in R124
			if (sValue.length === 4) {
				 //separates letter from numbers and puts both in vars
					sColor = sValue.slice(0, 1).toUpperCase();
					nNumber =sValue.slice(1, 4);
				
				// predefined letter check
				if (sColor === 'R' | sColor === 'B' | sColor === 'G') {
					isColCorrect = true;
				} else {
					isColCorrect = false;
				}
				
				// pre defined number check
				if (nNumber > 0 & nNumber <= 130) {
					isNumCorrect = true;
				} else {
					isNumCorrect = false;
				}
				
				// if both checks are passed we can push them to local storage
				if (isNumCorrect & isColCorrect) {
					
					oModel.setData({ "item": {"color": sColor, "number" : nNumber }}, true);
					oStorage.put("Color", sColor);
					oStorage.put("CodeNumber", nNumber);
					
					console.log(JSON.parse(oModel.getJSON()).item);
					// after pushing the values we renavigate to a defferent page
					var oRouter = UIComponent.getRouterFor(this);
					oRouter.navTo("RouteLabelSecondPage");
				} else {
				// error message if the users entry is not in the pre defined range
				sap.m.MessageToast.show(sMessage, {duration: 3500});
				}
			} else {
				// error message if the users entry is not in the pre defined range
				sap.m.MessageToast.show(sMessage, {duration: 3500});
			}
		}

	
	});

});