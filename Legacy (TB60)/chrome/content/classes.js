function IRDPrefManager() {

    var startPoint="extensions.iraniandate.";

    var pref=Components.classes["@mozilla.org/preferences-service;1"].
        getService(Components.interfaces.nsIPrefService).
        getBranch(startPoint);

    var observers={};

    // whether a preference exists
    this.exists=function(prefName) {
        return pref.getPrefType(prefName) != 0;
    }

    // returns the named preference, or defaultValue if it does not exist
    this.getValue=function(prefName, defaultValue) {
        var prefType=pref.getPrefType(prefName);

        // underlying preferences object throws an exception if pref doesn't exist
        if (prefType==pref.PREF_INVALID) {
            return defaultValue;
        }

        switch (prefType) {
            case pref.PREF_STRING: return pref.getCharPref(prefName);
            case pref.PREF_BOOL: return pref.getBoolPref(prefName);
            case pref.PREF_INT: return pref.getIntPref(prefName);
        }
    }

    // sets the named preference to the specified value. values must be strings,
    // booleans, or integers.
    this.setValue=function(prefName, value) {
        var prefType=typeof(value);

        switch (prefType) {
            case "string":
            case "boolean":
                break;
            case "number":
                if (value % 1 != 0) {
                    throw new Error("Cannot set preference to non integral number");
                }
                break;
            default:
                throw new Error("Cannot set preference with datatype: " + prefType);
        }

        // underlying preferences object throws an exception if new pref has a
        // different type than old one. i think we should not do this, so delete
        // old pref first if this is the case.
        if (this.exists(prefName) && prefType != typeof(this.getValue(prefName))) {
            this.remove(prefName);
        }

        // set new value using correct method
        switch (prefType) {
            case "string": pref.setCharPref(prefName, value); break;
            case "boolean": pref.setBoolPref(prefName, value); break;
            case "number": pref.setIntPref(prefName, Math.floor(value)); break;
        }
    }

    // deletes the named preference or subtree
    this.remove=function(prefName) {
        pref.deleteBranch(prefName);
    }

    // call a function whenever the named preference subtree changes
    this.watch=function(prefName, watcher) {
        // construct an observer
        var observer={
            observe:function(subject, topic, prefName) {
                watcher(prefName);
            }
        };

        // store the observer in case we need to remove it later
        observers[watcher]=observer;

        pref.QueryInterface(Components.interfaces.nsIPrefBranchInternal).
            addObserver(prefName, observer, false);
    }

    // stop watching
    this.unwatch=function(prefName, watcher) {
        if (observers[watcher]) {
            pref.QueryInterface(Components.interfaces.nsIPrefBranchInternal)
                .removeObserver(prefName, observers[watcher]);
        }
    }
}


function IRDColumnHandler(colName){

	this.getCellText=function(row, col){

		var header = gDBView.getMsgHdrAt(row);
		var date = new Date(this._fetchDate(header));

		var yearStyle = IRDApp.prefsManager.getValue("yearStyle", "2-digit");
		var monthStyle = IRDApp.prefsManager.getValue("monthStyle", "numeric");
		var dayStyle = IRDApp.prefsManager.getValue("dayStyle", "numeric");
		var weekDayStyle = IRDApp.prefsManager.getValue("weekDayStyle", "");

		var options = {};
		if(yearStyle){
			options.year = yearStyle;
		}
		if(monthStyle){
			options.month = monthStyle;
		}
		if(dayStyle){
			options.day = dayStyle;
		}
		if(weekDayStyle){
			options.weekday = weekDayStyle;
		}

		var dateString = date.toLocaleDateString('fa-IR', options);

		return dateString;
	}

	this._fetchDate=function(header){
		if(colName == "irDateCol"){
			return header.date / 1000;
		} 
		else if(colName == "irReceivedCol"){
			return header.getUint32Property("dateReceived") * 1000;
		} 
		else{
			return null;
		}
	}

	this.getSortStringForRow=function(hdr){return hdr.date;}

	this.isString=function() {return true;}

	this.getCellProperties=function(row, col, props){}

	this.getRowProperties=function(row, props){}

	this.getImageSrc=function(row, col){return null;}

	thisgetSortLongForRow=function(hdr){return hdr.date;}

}

function log(text){
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	consoleService.logStringMessage(text);
}