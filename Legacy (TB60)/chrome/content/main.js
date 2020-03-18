
IRDApp.prefsManager = new IRDPrefManager();
IRDApp.log = log;

observer = {
	// Components.interfaces.nsIObserver
	observe: function(aMsgFolder, aTopic, aData)
	{
		gDBView.addColumnHandler("irDateCol", new IRDColumnHandler('irDateCol'));
		gDBView.addColumnHandler("irReceivedCol", new IRDColumnHandler('irReceivedCol'));
	}
};

doOnLoad = function() {
	var ObserverService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	ObserverService.addObserver(observer, "MsgCreateDBView", false);
};

window.addEventListener("load", doOnLoad, false);
