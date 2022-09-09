sap.ui.define(["sap/ui/core/format/DateFormat"], function (DateFormat) {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit : function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },	dateTimebackendwithtime: function(date) {
			//2021-03-02:T00:00:00
			if (date !== undefined) {

				var oDateFormat = DateFormat.getDateInstance({
					scale: "medium",

					pattern: "yyyy-MM-dd"
				});
				var subFromDate = oDateFormat.format(new Date(date));

				return subFromDate + "T00:00:00";
			} else {
				return "";
			}

		},
		dateTime: function(date) {
		//Dec 01, 2021
        
			if (date !== undefined && date !== null) {

				var oDateFormat = DateFormat.getDateInstance({
					scale: "medium",

					pattern: "MMM dd, yyyy"
				});
				var subFromDate = oDateFormat.format(new Date(date));

				return subFromDate;
			} else {
            
				return "";
            }

		},

    };

});