// Add css to Chrome Webstore

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(['loading', 'complete'].indexOf(changeInfo.status) > -1 && tab.url.startsWith('https://chrome.google.com/webstore')){
		var css =`
		body {
			background-color: #282828 !important;
		}
		
		.F-ia-k {
			background-color: #282828 !important;
		}
		
		.F-n-J {
			background-color: #282828 !important;
		}
		
		.n-j {
			background-color: #282828 !important;
		}
		
		.F-x {
			background-color: #282828 !important;
		}`;
		var addCss = 
		`if(!cssText){ 
			var cssText = document.createElement('style'); 
			cssText.setAttribute('description', 'Added by chrome-webstore-css.js'); 
		} 
		cssText.textContent = \`${css}\`;
		document.head.appendChild(cssText);`;
		chrome.tabs.executeScript(tab.id, {code: addCss, allFrames: true});
	}
});