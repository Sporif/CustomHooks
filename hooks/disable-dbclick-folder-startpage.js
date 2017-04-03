// Stop double-click on the startpage from creating a bookmark folder 
vivaldi.jdhooks.onUIReady(function() { 
	
	// Browser start disable
	var startpage = document.querySelector('.internal-page > div > .startpage-content > div');
	startpage.ondblclick = function(event) {
		event.stopPropagation();
	}
	
	var listener = function (tabId) {
		return function (tabId, changeInfo, tab) {
			if (tab.title == "Start Page") {
				var newStartpage = document.querySelector('.internal-page > div > .startpage-content > div');
				if (newStartpage) { 
					newStartpage.ondblclick = function(event) {
						event.stopPropagation();
					}
				}
			}
		};
		chrome.tabs.onUpdated.removeListener(listener(tab.id));
	};
	
	// New tab disable
	chrome.tabs.onCreated.addListener(function (tab) {
		chrome.tabs.onUpdated.addListener(listener(tab.id));
	}); 
});