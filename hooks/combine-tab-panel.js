// Places the tabs container on top of the panels container when they're on the same side
// Script sets height/widths, and adds resizer splitters

startCombineTabPanel();

function startCombineTabPanel() {
	
	// Style elements
	var tabspanels_flexBasis = document.createElement('style');
	var tabspanels_width = document.createElement('style');
	var webview_width = document.createElement('style');
	
	tabspanels_flexBasis.setAttribute('description', "Tabs & Panels flex-basis, added by combine-tab-panels.js");
	tabspanels_width.setAttribute('description', "Tabs & Panels width, added by combine-tab-panels.js");
	webview_width.setAttribute('description', 'Webview width, added by combine-tab-panels.js');
	
	// Set saved tabs flex-basis (height)
	chrome.storage.local.get('tabsflexBasis', function (result) {
		setTabsPanelsflexBasis(result.tabsflexBasis ? result.tabsflexBasis : 50);
    });
	
	// Get saved tabs width
	chrome.storage.local.get('tabsWidth', function (result) {
		var tabsWidth = result.tabsWidth ? result.tabsWidth : 240;
		
		// Set tabs, panel & webview widths, add resizer splitters
		setTabsPanelsWidth(tabsWidth);
		setWebviewWidth(tabsWidth); 
		waitForElement(".inner", 500, addResizers); 
    });
	
	// Set tabs & panels flex-basis
	function setTabsPanelsflexBasis(value) { 
		tabspanels_flexBasis.textContent =
		`#browser:not(.fullscreen) #panels-container.left:not(.switcher) ~ #tabs-container.left,
		#browser:not(.fullscreen) #panels-container.right:not(.switcher) ~ #tabs-container.right {
			flex-basis: ` + value + `%;
		}
		
		.tabs-left#browser:not(.fullscreen) #panels-container.left:not(.switcher),
		.tabs-right#browser:not(.fullscreen) #panels-container.right:not(.switcher) {
			flex-basis: calc(100% - ` + value + `%);
		}`;
		document.head.appendChild(tabspanels_flexBasis);
	}
	
	// Set tabs & panels width
	function setTabsPanelsWidth(value) {
		tabspanels_width.textContent =
		`#browser:not(.fullscreen) .left#main #tabs-container.left,
		#browser:not(.fullscreen) .right#main #tabs-container.right,
		.tabs-left#browser:not(.fullscreen) .left#main .tab-position,
		.tabs-right#browser:not(.fullscreen) .right#main .tab-position,
		.tabs-left#browser:not(.fullscreen) #panels-container.left:not(.switcher),
		.tabs-right#browser:not(.fullscreen) #panels-container.right:not(.switcher) {
			width: ` + value + `px !important;
		}`;
		document.head.appendChild(tabspanels_width);
	}
	
	// Set webview width based on tab width
	function setWebviewWidth(value) {
		webview_width.textContent =
		`.tabs-left#browser:not(.fullscreen) .left#main #webview-container,
		.tabs-right#browser:not(.fullscreen) .right#main #webview-container {
			width: calc(100% - ` + value + `px);
		}`;
		document.head.appendChild(webview_width);
	}
	
	// Add resizer splitters
	function addResizers() {
		var resizerX = document.createElement('div');
		var resizerY = document.createElement('div');
		resizerX.id = 'tabspanels-resizerX';
		resizerY.id = 'tabspanels-resizerY';
		document.getElementById('webview-container').appendChild(resizerX); // webview: height automatically adjusts + never removed
		document.getElementById('panels-container').appendChild(resizerY); // panels: width automatically adjusts + never removed
		resizerX.addEventListener('mousedown', initResize, false);
		resizerY.addEventListener('mousedown', initResize, false);
	}
	
	// Add window listeners for mousemove & mouseup
	var inner, innerWidth, innerHeight, 
		tabsRight, browserHeight, 
		footer, footerHeight, 
		startedResizeX, startedResizeY;
	function initResize(e) {
		inner = document.getElementsByClassName('inner')[0];
		innerWidth = inner.getBoundingClientRect().width;
		innerHeight = inner.getBoundingClientRect().height;
		tabsRight = document.querySelector('#tabs-container.right');
		browserHeight = document.getElementById('browser').getBoundingClientRect().height;
		footer = document.querySelector('#footer:not(.disabled)');
		footerHeight = footer ? footer.getBoundingClientRect().height : 0; 
		
		window.addEventListener('mousemove', Resize, false);
		window.addEventListener('mouseup', stopResize, false);
		startedResizeY = !(startedResizeX = e.target.id.slice(-1) == 'X'); // Check for vertical or horizontal resizing
	}
	
	// Resize tab/panels
	var tabsflexBasis;
	function Resize(e) {
		if(startedResizeX) {
			var tabsWidth = e.clientX; // Width is mouse X position, unless on right
			if(tabsRight) tabsWidth = innerWidth - tabsWidth;
			tabsWidth = tabsWidth < 50 ? 50 : (tabsWidth > 400 ? 400 : tabsWidth); // Limit tabs width
			
			setTabsPanelsWidth(tabsWidth); // Set new width
		}
		else if(startedResizeY) { 
			// Height is mouse Y postion, taking into account elements above and below .inner
			var height = e.clientY  - (browserHeight - innerHeight) + footerHeight;
			tabsflexBasis = (height/innerHeight)*100;
			tabsflexBasis = tabsflexBasis < 5 ? 5 : (tabsflexBasis > 95 ? 95 : tabsflexBasis); // Limit tabs height
			
			setTabsPanelsflexBasis(tabsflexBasis); // Set new flex-basis
		}
	}
	
	function stopResize(e) {
		window.removeEventListener('mousemove', Resize, false);
		window.removeEventListener('mouseup', stopResize, false);
		
		var tabContainerWidth = document.getElementById('tabs-container').getBoundingClientRect().width;
		if(startedResizeX) { 
			// Need to resize webview at end (flickering if done continuously)
			setWebviewWidth(tabContainerWidth);
			chrome.storage.local.set({'tabsWidth': tabContainerWidth}); 
		}
		else if(startedResizeY) { 
			chrome.storage.local.set({'tabsflexBasis': tabsflexBasis}); 
		}
		
		startedResizeX = startedResizeY = false;
	}
	
	// Wait for an element to appear
	function waitForElement(selector, time, callback) {
		if(document.querySelector(selector) != null) {
			callback();
		}
		else {
			setTimeout(function() {
				waitForElement(selector, time, callback);
			}, time);
		}
	}
}