IRDApp.prefsManager = new IRDPrefManager();

createObserver = {
	// Components.interfaces.nsIObserver
	observe: function(aMsgFolder, aTopic, aData)
	{
		if (IRDApp.prefsManager.getValue('showInDateColumn', true)) {
			gDBView.addColumnHandler("dateCol", new IRDColumnHandler('dateCol'));
		}

		if (IRDApp.prefsManager.getValue('showInReceivedColumn', true)) {
			gDBView.addColumnHandler("receivedCol", new IRDColumnHandler('receivedCol'));
		}
	}
};

doOnLoad = function() {
	var ObserverService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	ObserverService.addObserver(createObserver, "MsgCreateDBView", false);
};

window.addEventListener("load", doOnLoad, false);
