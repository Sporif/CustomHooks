// Fixes the white flash when navigating away from the start page and the white blank page, by setting their color to the current theme's background color.
(function() {
	var bodyStyles, colorBg;
	var observer = new MutationObserver(getBgColor);
	
	observer.observe(document.body, {
		attributes: true,
		attributeFilter: ['style']
	});
	
	function getBgColor() {
		bodyStyles = window.getComputedStyle(document.body);
		colorBg = bodyStyles.getPropertyValue('--colorBg');
		chrome.tabs.query({}, tabs => {
			tabs.forEach(tab => injectScript(tab.url, tab.id));
		});
	}
	
	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => injectScript(tab.url, tab.id));
	
	function injectScript(tabUrl, tabId) {
		if(tabUrl === "about:blank" || tabUrl === "chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/startpage/startpage.html") {
			var css =`
			* {
				background-color: ${colorBg} !important;
			}`;
			var addCss = 
			`if(!cssText){ 
				var cssText = document.createElement('style'); 
				cssText.setAttribute('description', 'Added by white-flash-fix.js'); 
			} 
			cssText.textContent = \`${css}\`;
			document.head.appendChild(cssText);`;
			chrome.tabs.executeScript(tabId, {code: addCss, allFrames: true});
		}
	}
})();