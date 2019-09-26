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
			
			//get model from data.json file
			var oModel = this.getView().getModel("data");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local); // creates a local storage object
			
			if(sValue) { // navigates to a different page ONLY if a value is selected
				oModel.setData({ "item": {"identifier" : sValue }}, true);
				oStorage.put("Identifier", sValue); //  puts values in local storage
				console.log(JSON.parse(oModel.getJSON()).item.identifier + "this is it");
				var oRouter = UIComponent.getRouterFor(this); // gets router
			
				var data = JSON.parse(oModel.getJSON()).item;
				var color = data.color;
				var number = data.number;
				var identifier = data.identifier;
				var dataToSend = "" + color + "-" + number + "-" + identifier; 
				console.log(dataToSend);
				
				// var Color = oStorage.get("Color");
				// var CodeNumber = oStorage.get("CodeNumber");
				// var Identifier = oStorage.get("Identifier");
				// var dataobjectsend = Color+"-"+CodeNumber+"-"+Identifier; 
				var weburl = "http://localhost:8081/asset?referenceId="+dataToSend; 
					$.ajax({
	
						url: weburl,
						type: "GET",
						dataType: "json",
						success: function(dataj){
							var datareturned = JSON.stringify(dataj.correlationAssetId);
							var correlationAssetId = datareturned.substring(1,datareturned.length - 1);
							oModel.setData({ "item": {"correlationAssetId" : correlationAssetId }}, true);
							
							console.log(JSON.parse(oModel.getJSON()).item);
						
	
							oStorage.put("correlationId", correlationAssetId);
					// navigates to a page
						oRouter.navTo("Succes");
						
						},
						error: function(){
							// navigates to a page
								oRouter.navTo("Error");
								location.reload();
						}
					});
			
			$.ajax({
	
						url: weburl,
						type: "GET",
						dataType: "json",
						success: function(dataj){
							var datareturned = JSON.stringify(dataj.correlationAssetId);
							var correlationAssetId = datareturned.substring(1,datareturned.length - 1);
							oModel.setData({ "item": {"correlationAssetId" : correlationAssetId }}, true);
							
							console.log(JSON.parse(oModel.getJSON()).item);
						
	
							oStorage.put("correlationId", correlationAssetId);
					// navigates to a page
						oRouter.navTo("Succes");
						
						},
						error: function(){
							// navigates to a page
								oRouter.navTo("Error");
								location.reload();
						}
					});
			} else {
				sap.m.MessageToast.show(sMessage, {duration: 3500}); // error message if no value is entered
			}
		}
			
	});

});