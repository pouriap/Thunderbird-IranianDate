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
		var currentDate = new Date();

		//fixed options
		var yearStyle = "2-digit";
		var dayStyle = "2-digit";
		var hourStyle = "2-digit";
		var minuteStyle = "2-digit";
		
		//customizeable options
		var monthStyle = IRDApp.prefsManager.getValue("monthStyle", "2-digit");
		var weekDayStyle = IRDApp.prefsManager.getValue("weekDayStyle", "hidden");
		var numbersStyle = IRDApp.prefsManager.getValue("numbersStyle", "arabext");
		
		//sanitising input
		if(monthStyle!="2-digit" && monthStyle!="long"){
			monthStyle = "2-digit";
		}
		if(weekDayStyle!="hidden" && weekDayStyle!="long"){
			weekDayStyle = "hidden";
		}
		if(numbersStyle!="arabext" && numbersStyle!="latn"){
			numbersStyle = "arabext";
		}

		var locale = "fa-IR-u-nu-" + numbersStyle + "-ca-persian";
		
		var year = date.toLocaleString(locale, {year:yearStyle});
		var month = date.toLocaleString(locale, {month:monthStyle});
		var day = date.toLocaleString(locale, {day:dayStyle});
		var weekDay = (weekDayStyle != "hidden")? date.toLocaleString(locale, {weekday:weekDayStyle}) : "";
		var time = date.toLocaleString(locale, {hour:hourStyle, minute:minuteStyle, hour12: false});
		
		//fix for bug that doesn't prepend zero to farsei
		if(time.length != 5){
			var zero = (numbersStyle === "arabext")? "۰" : "0";
			time = zero + time;
		}

		var isCurrentYear;
		if(currentDate.toLocaleString(locale, {year:yearStyle}) == year){
			isCurrentYear = true;
		}
		else{
			isCurrentYear = false;
		}
		var isCurrentDay;
		if(date.toDateString() === currentDate.toDateString()){
			isCurrentDay = true;
		}
		else{
			isCurrentDay = false;
		}
		var isYesterday;
		var yesterdayDate = new Date();
		yesterdayDate.setDate(currentDate.getDate() - 1);
		if(date.toDateString() === yesterdayDate.toDateString()){
			isYesterday = true;
		}
		else{
			isYesterday = false
		}

		var placehodler;
		if(monthStyle === "long"){
			placeholder = "TT ،\u202BWD DD MM YY\u202C";
		}
		else{
			placeholder = "TT ،YY/MM/DD WD";
		}

		//remove year if it's current year
		if(isCurrentYear){
			placeholder = placeholder.replace(/YY./,"");
		}
		//only show time if it's current day or yesterday
		if(isCurrentDay){
			placeholder = "TT امروز";
		}
		else if(isYesterday){
			placeholder = "TT دیروز";
		}

		dateString = placeholder
			.replace("YY", year)
			.replace("MM", month)
			.replace("DD", day)
			.replace("WD", weekDay)
			.replace("TT", time);

		return dateString;

	}

	this._fetchDate=function(header){
		if(colName == "irDateCol"){
			return header.date / 1000;
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