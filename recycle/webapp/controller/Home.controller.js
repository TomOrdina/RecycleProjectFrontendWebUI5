sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("opensap.recycle.controller.Home", {
		onInit: function () {
						this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			//this.getRouter().attachBypassed(this.onBypassed, this);
		},
			onNavBack : function() {
			// eslint-disable-next-line sap-no-history-manipulation
			history.go(-1);
		},
		onPress: function ButtonLabel1 (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Label1");
		}
	});
});