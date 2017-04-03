// Places the tabs container on top of the panels container when they're on the same side
// Script sets height/widths, and adds resizer splitters
vivaldi.jdhooks.onUIReady(function() {
	
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
		addResizers();
    });
	
	// Set tabs & panels flex-basis
	function setTabsPanelsflexBasis(value) { 
		tabspanels_flexBasis.textContent =
		`#panels-container.left:not(.switcher) ~ #tabs-container.left, #panels-container.right:not(.switcher) ~ #tabs-container.right { 
			flex-basis: ` + value + `%;
		}
		
		.tabs-left#browser:not(.fullscreen) #panels-container.left:not(.switcher), .tabs-right#browser:not(.fullscreen) #panels-container.right:not(.switcher) { 
			flex-basis: calc(100% - ` + value + `%);
		}`
		document.head.appendChild(tabspanels_flexBasis);
	}
	
	// Set tabs & panels width
	function setTabsPanelsWidth(value) {
		tabspanels_width.textContent =
		`.tabs-left#browser .left#main #tabs-container, .tabs-right#browser .right#main #tabs-container, .tabs-left#browser .left#main .tab-position, .tabs-right#browser .right#main .tab-position,
		.tabs-left#browser:not(.fullscreen) #panels-container.left:not(.switcher), .tabs-right#browser:not(.fullscreen) #panels-container.right:not(.switcher) {
			width: ` + value + `px !important;
		}`
		document.head.appendChild(tabspanels_width);
	}
	
	// Set webview width based on tab width
	function setWebviewWidth(value) {
		webview_width.textContent =
		`.tabs-left#browser:not(.fullscreen) .left#main #webview-container, .tabs-right#browser:not(.fullscreen) .right#main #webview-container { 
			width: calc(100% - ` + value + `px);
		}`
		document.head.appendChild(webview_width);
	}
	
	// Add resizer splitters
	function addResizers() {
		var resizerX = document.createElement('div');
		var resizerY = document.createElement('div');
		resizerX.id = 'tabspanels-resizerX';
		resizerY.id = 'tabspanels-resizerY';
		document.querySelector('#webview-container').appendChild(resizerX); // webview: height automatically adjusts + never removed
		document.querySelector('#panels-container').appendChild(resizerY); // panels: width automatically adjusts + never removed
		resizerX.addEventListener('mousedown', initResize, false);
		resizerY.addEventListener('mousedown', initResize, false);
	}
	
	// Add window listeners for mousemove & mouseup
	var startedResizeX, startedResizeY;
	function initResize(e) {
		window.addEventListener('mousemove', Resize, false);
		window.addEventListener('mouseup', stopResize, false);
		startedResizeY = !(startedResizeX = e.target.id.slice(-1) == 'X'); // Check for vertical or horizontal resizing
	}
	
	// Resize tab/panels
	var tabsflexBasis;
	function Resize(e) {
		if (startedResizeX) {
			var innerWidth = document.querySelector('.inner').getBoundingClientRect().width;
			var tabsWidth = e.clientX; // Width is mouse X position, unless on right
			if (document.querySelector('#tabs-container.right')) tabsWidth = innerWidth - tabsWidth;
			tabsWidth = tabsWidth < 50 ? 50 : (tabsWidth > 400 ? 400 : tabsWidth); // Limit tabs width
			
			setTabsPanelsWidth(tabsWidth); // Set new width
		}
		else if (startedResizeY) {
			var browserHeight = document.querySelector('#browser').getBoundingClientRect().height;
			var innerHeight = document.querySelector('.inner').getBoundingClientRect().height;
			var footer = document.querySelector('#footer:not(.disabled)');
			
			// Height is mouse Y postion, taking into account elements above and below .inner
			var height = e.clientY  - (browserHeight - innerHeight);
			if (footer) height += footer.getBoundingClientRect().height; 
			tabsflexBasis = (height/innerHeight)*100;
			tabsflexBasis = tabsflexBasis < 5 ? 5 : (tabsflexBasis > 95 ? 95 : tabsflexBasis); // Limit tabs height
			
			setTabsPanelsflexBasis(tabsflexBasis); // Set new flex-basis
		}
	}
	
	function stopResize(e) {
		// Remove windows listeners for mousemove & mouseup 
		window.removeEventListener('mousemove', Resize, false);
		window.removeEventListener('mouseup', stopResize, false);
		
		// Need to resize webview at end (flickering if done continuously)
		if (startedResizeX) setWebviewWidth(document.querySelector('.inner #tabs-container').getBoundingClientRect().width);
		
		// Save width and flex-basis (height)
		if (startedResizeX) { chrome.storage.local.set({'tabsWidth': document.querySelector('#tabs-container').getBoundingClientRect().width}); }
		else if (startedResizeY) { chrome.storage.local.set({'tabsflexBasis': tabsflexBasis}); }
		startedResizeX = startedResizeY = false;
	}
});