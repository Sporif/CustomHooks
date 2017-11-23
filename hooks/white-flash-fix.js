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
	}
	
	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if(tab.url === "about:blank" || tab.url === "chrome-extension://mpognobbkildjkofajifpdfhcoklimli/components/startpage/startpage.html") {
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
			chrome.tabs.executeScript(tab.id, {code: addCss, allFrames: true});
		}
	});
})();
