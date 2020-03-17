JalaliDateFormat.preferencesInit = function(e) {
    if (window.isJalaliDateFormatTab)
        return;

    // Get Jalali Date Format tabs
    var tabs = new Array(document.getElementById('jalaliDateFormatPreferencesTabPreferences'));
    // Get Jalali Date Format panels
    var panels = new Array(document.getElementById('jalaliDateFormatTabPanelPreferences'));
    // Get Jalali Date Format preferences
    var preferences = document.getElementById('paneJalaliDateFormat').preferences;
    // Get Thunderbird Display Preferences tab box
    var displayTabBox = document.getElementById('displayPrefs');

    if (!displayTabBox) { 
        setTimeout(function() { JalaliDateFormat.preferencesInit(); }, 500); 
        return; 
    }

    var displayTabs = displayTabBox.firstChild; // Get Thunderbird Display Preferences tabs
    var displayPanels = displayTabBox.firstChild.nextSibling; // Get Thunderbird Display Preferences panels
    var displayPreferences = document.getElementById('displayPreferences'); // Get Thunderbird Display Preferences preferences

    // Set the Date Format preferences tab as being the last tab
    tabs[ tabs.length - 1 ].setAttribute('last-tab', true);

    // Add tabs to the Display Preferences pane
    for (tab in tabs) {
        tabs[tab].setAttribute('first-tab', false);
        tabs[tab].setAttribute('selected', false);
        displayTabs.appendChild(tabs[tab]);
    }

    // Add panels to the Display Preferences pane
    for (panel in panels) {
        displayPanels.appendChild(panels[panel]);
    }

    // Add preferences to the Display Preferences pane
    for (preference in preferences) {
        displayPreferences.appendChild(preferences[preference]);
    }

    // Mark that we have moved the Jalali Date Format pane
    window.isJalaliDateFormatTab = true;
};

window.addEventListener("load", function(e) { JalaliDateFormat.preferencesInit(e); }, false);
