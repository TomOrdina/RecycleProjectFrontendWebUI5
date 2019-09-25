sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
    "jquery.sap.storage"
], function (Controller, UIComponent, MessageToast, storage) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.LabelSecondPage", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.recycle.view.LabelSecondPage
		 */
		onInit: function () {

		},
		/*
			onChange: function () {
				var sValueCheck = this.getView().byId("comboValue").getSelectedKey().toUpperCase();
				if(!sValueCheck === "I" | !sValueCheck === "II" | !sValueCheck === "III"){
					this.getView().byId("comboValue").clearSelection();
				}
			},
		*/
		onPress: function (oEvent) { 
			
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("failCombo"); // gets text from i18n model
			var sValue = this.getView().byId("comboValue").getSelectedKey(); // gets input value from view
			
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local); // creates a local storage object
			
			if(sValue) { // navigates to a different page ONLY if a value is selected
				oStorage.put("Identifier", sValue); //  puts values in local storage
				var oRouter = UIComponent.getRouterFor(this); // gets router
				oRouter.navTo("Succes"); // navigates to a page
			} else {
				sap.m.MessageToast.show(sMessage, {duration: 3500}); // error message if no value is entered
			}
		}
			
	});

});