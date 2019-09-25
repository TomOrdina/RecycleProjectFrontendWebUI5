sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
    "jquery.sap.storage"
], function (Controller, UIComponent, MessageToast, storage) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.RingSecondPage", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.recycle.view.RingFirstPage
		 */
		onInit: function () {

		},

		onPress: function (oEvent) {
			// gets i18n text and input value
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("failCombo");
			var sValue = this.getView().byId("identifierRing").getSelectedKey().toUpperCase();
			// creation of local storage object
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			
			// checks if anything is entered
			if(sValue) {
				oStorage.put("Identifier", sValue);
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("Succes");
			} else {
				// throws an error message if nothing is entered
				sap.m.MessageToast.show(sMessage, {duration: 3500});
			}
		}

	});

});