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
			var sValue = this.getView().byId("comboValue").getSelectedKey().toUpperCase(); // gets input value from view
			
			// Get model from data.json file
			var oModel = this.getView().getModel("data");
			
			if(sValue) { 
				// Navigates to a different page ONLY if a value is selected
				oModel.setData({ "item": {"identifier" : sValue }}, true);
				var oRouter = UIComponent.getRouterFor(this); // gets router
				
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
						// Navigates to the succes page
						oRouter.navTo("Succes");
					},
					error: function(){
						// Navigates to the error page
						oRouter.navTo("Error");
						location.reload();
					}
				});
			
			} else {
				// Error message if no value is entered
				sap.m.MessageToast.show(sMessage, {duration: 3500});
			}
		}
			
	});

});