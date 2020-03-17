JalaliDateFormat.ColumnHandler = function(colName) {
	this.colName = colName;
};

JalaliDateFormat.ColumnHandler.prototype = {
	
	getCellText: function(row, col) {
		//get the message's header so that we can extract the date field
		var hdr = gDBView.getMsgHdrAt(row);

		var date = new Date(this._fetchDate(hdr));
		var options = {
			"year": "2-digit",
			"month": "numeric",
			"day": "numeric"
		};
		var dateString = date.toLocaleDateString('fa-IR', options);
		return dateString;
	},
	_fetchDate: function(hdr) {
		if (this.colName == "dateCol") {
			return hdr.date / 1000;
		} else if (this.colName == "receivedCol") {
			return hdr.getUint32Property("dateReceived") * 1000;
		} else {
			return null;
		}
	},
	getSortStringForRow: function(hdr) {return hdr.date;},
	isString:function() {return true;},

	getCellProperties: function(row, col, props){},
	getRowProperties:function(row, props){},
	getImageSrc: function(row, col) {return null;},
	getSortLongForRow: function(hdr) {return hdr.date;}
	
};

JalaliDateFormat.CreateDbObserver = {
	// Components.interfaces.nsIObserver
	observe: function(aMsgFolder, aTopic, aData)
	{
		if (JalaliDateFormat.prefs.getValue('sortDateCol', true)) {
			gDBView.addColumnHandler("dateCol", new JalaliDateFormat.ColumnHandler('dateCol'));
		}

		if (JalaliDateFormat.prefs.getValue('sortReceivedCol', true)) {
			gDBView.addColumnHandler("receivedCol", new JalaliDateFormat.ColumnHandler('receivedCol'));
		}
	}
};

JalaliDateFormat.doOnceLoaded = function() {
	var ObserverService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	ObserverService.addObserver(JalaliDateFormat.CreateDbObserver, "MsgCreateDBView", false);
};

window.addEventListener("load", JalaliDateFormat.doOnceLoaded, false);
