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
			
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local); // declare oStorage object for local storage
			
			if (sValue.length === 4) { // makes sure length of input is 4 as in R124
					sColor = sValue.slice(0, 1).toUpperCase(); //separates letter from numbers
					nNumber =sValue.slice(1, 4); //stores number in a var
				
				if (sColor === 'R' | sColor === 'B' | sColor === 'G') { // predefined letter check
					isColCorrect = true;
				} else {
					isColCorrect = false;
				}
				
				if (nNumber > 0 & nNumber <= 130) { // pre defined number check
					isNumCorrect = true;
				} else {
					isNumCorrect = false;
				}
				
				if (isNumCorrect & isColCorrect) { // if both checks are passed we can push them to local storage
					
					oStorage.put("Color", sColor);
					oStorage.put("CodeNumber", nNumber);
					
					var oRouter = UIComponent.getRouterFor(this); // after pushing the values we renavigate to a defferent page
					oRouter.navTo("RouteLabelSecondPage");
				} else {
				sap.m.MessageToast.show(sMessage, {duration: 3500}); // error message if the users entry is not in the pre defined range
				}
			} else {
				sap.m.MessageToast.show(sMessage, {duration: 3500}); // error message if the users entry is not in the pre defined range
			}
		}

	
	});

});