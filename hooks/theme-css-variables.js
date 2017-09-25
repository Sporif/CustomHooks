// Send current theme's css variables to chrome:// and vivaldi:// urls

(function() {

	// Send when tab loads
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		if(['loading', 'complete'].indexOf(changeInfo.status) > -1){
			send();
		}
	});

	// Send when theme changes
	var observer = new MutationObserver(send);
	observer.observe(document.body, {
		attributes: true,
		attributeFilter: ['style']
	});

	function send() {
		var css = ":root {\n "+document.body.style.cssText.replace(/;/g, ';\n').replace(/:/g, ': ')+" }";
		var addCss = `if(!colors){ 
			var colors = document.createElement('style'); 
			colors.setAttribute("description", "Current theme's css variables, added by theme-css-variables.js"); 
		} 
		colors.textContent = \`${css}\`; 
		document.head.appendChild(colors);`;
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				if(tab.url.startsWith('chrome://') || tab.url.startsWith('vivaldi://')){
					chrome.tabs.executeScript(tab.id, {code: addCss, allFrames: true}, function(){
						if (chrome.runtime.lastError){
							return; // tab was closed, fail silently
						}
					});
				}
			});
		});
	}

})();