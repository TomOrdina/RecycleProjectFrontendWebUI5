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
			//var oRouter = UIComponent.getRouterFor(this);
			//oRouter.navTo("RouteRingSecondPage");
			
			
			var sMessageNumber = this.getView().getModel("i18n").getResourceBundle().getText("failNumber");
			var sMessageColor = this.getView().getModel("i18n").getResourceBundle().getText("failColor");
			var sValueCol = this.getView().byId("comboRing").getSelectedKey();
			var sValueNum = this.getView().byId("numberRing").getValue();
			var isColCorrect, isNumCorrect;
			
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			
			if (sValueNum.length === 3) {
				
				if (sValueNum > 0 & sValueNum <= 130) {
					isNumCorrect = true;
				} else {
					isNumCorrect = false;
				}
			}
			
			if (sValueCol) {
				isColCorrect = true;
			} else {
				isColCorrect = false;
			}
			
			if (!isColCorrect) {
				sap.m.MessageToast.show(sMessageColor, {duration: 3500});
			} else if (!isNumCorrect){
				sap.m.MessageToast.show(sMessageNumber, {duration: 3500});
			} else {
				oStorage.put("Color", sValueCol);
				oStorage.put("CodeNumber", sValueNum);
				
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("RouteLabelSecondPage");
			}
			
		}
			
	});
});