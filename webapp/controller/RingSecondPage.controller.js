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
			// Gets i18n text and input value
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("failCombo");
			var sValue = this.getView().byId("identifierRing").getSelectedKey().toUpperCase();
			
			// Get model from data.json file
			var oModel = this.getView().getModel("data");
			
			// Checks if anything is entered
			if(sValue) {
				
				oModel.setData({ "item": {"identifier" : sValue }}, true);
				
				var oRouter = UIComponent.getRouterFor(this);
				
				var data = JSON.parse(oModel.getJSON()).item;
				var color = data.color;
				var number = data.number;
				var identifier = data.identifier;
				var dataToSend = "" + color + "-" + number + "-" + identifier; 
				
				var weburl = "https://eks.ordina-jworks.io/zpr-bff/assets?physicalid=" + dataToSend; 
				
				$.ajax({
					url: weburl,
					type: "GET",
					dataType: "json",
					success: function(dataj){
						oModel.setData({ "item": {"correlationAssetId" : dataj.id }}, true);
						// Navigate to the succes page
						oRouter.navTo("Succes");
					},
					error: function(){
						// Navigates to the error page
						oRouter.navTo("Error");
						location.reload();
					}
				});
			} else {
				// Throws an error message if nothing is entered
				sap.m.MessageToast.show(sMessage, {duration: 3500});
			}
		}
	});
});