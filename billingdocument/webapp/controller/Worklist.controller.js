var html2pdf; // Used this to exporting the pdf
sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/PDFViewer"
    
], function (BaseController, JSONModel, formatter, Filter, FilterOperator,PDFViewer) {
    "use strict";

    return BaseController.extend("com.chappota.billingdocument.billongdocument.controller.Worklist", {

        formatter: formatter,
        

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
        onInit : function(){
            // var bilmodel = this.getOwnerComponent().getModel();
            // var bildoctypefilter = new Filter("BillingDocumentType",FilterOperator.EQ,"CI01");
            // bilmodel.read("/A_BillingDocument",{
            //     filters : [bildoctypefilter],
            //     success : (odata) => {
            //         var bildocjson = new JSONModel();
            //         bildocjson.setSizeLimit(1000);
            //         bildocjson.setData(odata.results);
            //         this.getView().byId("bdsmartTableinner").setModel(bildocjson,"bd");
            //         // this.getView().byId("bdsmartTable").setModel(bildocjson);
            //         // this.getView().byId("smartFilterBar").setModel(bildocjson);
            //     },
            //     error : (msg) => { 

            //     }
            // });
            // this._pdfViewer = new PDFViewer();
			// this.getView().addDependent(this._pdfViewer);
            // var oSample1Model = new JSONModel({
			// 	Source: sap.ui.require.toUrl("com/chappota/billingdocument/billongdocument/PDF/sample1.pdf")
			// 	//Preview: sap.ui.require.toUrl("sap/m/sample/PDFViewerPopup/sample1.jpg")
			// });
            // this.byId('id1').setModel(oSample1Model);
        },

        onBeforeRebindTable : function(oEvent){
            var oBindingParams = oEvent.getParameter("bindingParams");
            oBindingParams.filters.push(new Filter("BillingDocumentType", "EQ", "CI01"));
            
        },
        onOpenDialog : function (oEvent) {

			// create dialog lazily
			// if (!this.pDialog) {
			// 	this.pDialog = this.loadFragment({
			// 		name: "com.chappota.billingdocument.billongdocument.fragments.Template"
			// 	});
			// } 
			// this.pDialog.then(function(oDialog) {
			// 	oDialog.open();
			// });
       
            var data = oEvent.getSource().getBindingContext();
            this.bildoc = {
                "BillingDocument" : data.getProperty("BillingDocument"),
                "CreationDate" : this.formatter.dateTime(data.getProperty("CreationDate")),
                "SalesOrganization" : data.getProperty("SalesOrganization"),
                "BillingDocumentDate" : this.formatter.dateTime(data.getProperty("BillingDocumentDate")),
                "TotalNetAmount" : data.getProperty("TotalNetAmount"),
                "SoldToParty" : data.getProperty("SoldToParty")        
               
            };

            if (!this.template1) {
                this.template1 = this.loadFragment({
                    name: "com.chappota.billingdocument.billongdocument.fragments.BillingDocTemplate1"
                });
            } 
            this.template1.then((temp1) => {
                temp1.open();
           
            this.byId("temp1id").setTitle(this.bildoc.BillingDocument);
            var template1model = new JSONModel();
            template1model.setData(this.bildoc);
            this.getView().byId("temp1id").setModel(template1model,"t1");
        });
        

		},
        _selectTemplate : function(oEvent){
            var tkey = oEvent.getSource().getSelectedKey();
            if(tkey === 't1'){
                //open Template1
                if (!this.template1) {
                    this.template1 = this.loadFragment({
                        name: "com.chappota.billingdocument.billongdocument.fragments.BillingDocTemplate1"
                    });
                } 
                this.template1.then((temp1) => {
                    temp1.open();
               
                this.byId("temp1id").setTitle(this.bildoc.BillingDocument);
                var template1model = new JSONModel();
                template1model.setData(this.bildoc);
                this.getView().byId("temp1id").setModel(template1model,"t1");
            });
            }
            if(tkey === 't2'){
                //open Template2
                if (!this.template2) {
                    this.template2 = this.loadFragment({
                        name: "com.chappota.billingdocument.billongdocument.fragments.BillingDocTemplate2"
                    });
                } 
                this.template2.then((temp2) => {
                    temp2.open();
                });
            }
            if(tkey === 't3'){
                //open Template3
                if (!this.template3) {
                    this.template3 = this.loadFragment({
                        name: "com.chappota.billingdocument.billongdocument.fragments.BillingDocTemplate3"
                    });
                } 
                this.template3.then((temp3) => {
                    temp3.open();
                });
            }
        },
        _cancelTemplate1 : function(){
            this.template1.then((temp1) => {
                temp1.close();
            });
        },
        _cancelTemplate2 : function(){
            this.template2.then((temp2) => {
                temp2.close();
            });
        },
        _cancelTemplate3 : function(){
            this.template3.then((temp3) => {
                temp3.close();
            });
        },


        _openpdf : function(oEvent){
            debugger;
        
           var oModel = [];
           oModel = this.bildoc;
           var str = "This Billing Document: " +oModel.BillingDocument +" was Created on " + oModel.CreationDate + " with Sales Organization " + 
                            oModel.SalesOrganization + " and Billing Document Date of " + oModel.BillingDocumentDate + " with Sold to Party " + oModel.SoldToParty + 
                            " and Total Net Amount of " + oModel.TotalNetAmount;

            var optDE = {
                margin: [100, 15],
                filename: 'BillingDocument_'+ this.bildoc.BillingDocument +'.pdf',
                jsPDF: {
                    unit: 'pt',
                    format: 'a4',
                    orientation: 'portrait'
                },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy']
                }
            };

            html2pdf(str, optDE);





        },
        
        _cancelpdf : function(){
            this.pDialog.then(function(oDialog) {
				oDialog.close();
			});
        },

   

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        _onInit : function () {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress : function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("AccountingDocument", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh : function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject : function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/A_BillingDocument".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        }

    });
});
