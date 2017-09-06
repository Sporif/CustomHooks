// Add theme color variables to chrome:// and vivaldi:// urls

function sendColors() {
	var css = ":root {\n "+document.body.style.cssText.replace(/;/g, ';\n').replace(/:/g, ': ')+" }";
	var colorCode = `if(!colors){ 
		var colors = document.createElement('style'); 
		colors.setAttribute('description', 'color variables added by color-variables.js'); 
	} 
	colors.textContent = \`${css}\`; 
	document.head.appendChild(colors);`
	chrome.tabs.query({}, function(tabs){
		tabs.forEach(function(tab){
			if(tab.url.startsWith('chrome://') || tab.url.startsWith('vivaldi://')){
				chrome.tabs.executeScript(tab.id, {code: colorCode, allFrames: true}, function(){
					if (chrome.runtime.lastError){
						return; // tab was closed, fail silently
					}
				});
			}
		});
	});
}

// Add when tab loads
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(['loading', 'complete'].indexOf(changeInfo.status) > -1){
		sendColors();
	}
});

// Add when theme changes
var observer = new MutationObserver(sendColors);
observer.observe(document.body, {
	attributes: true,
	attributeFilter: ['style'],
});
