// Smooth tab switching when scrolling the tab bar. Also adds Shift+Scroll to scroll the tab bar
// Set wrap to false to disable switching to the first tab from the bottom and vice versa
(function() {
    let wrap = true,
        tabStrip;
	document.addEventListener("wheel", replaceTabScroll, true);
	
	function replaceTabScroll(e) {
		tabStrip = e.target.closest(".tab-strip");
		if(tabStrip){
			// Prevent default scroll
			e.preventDefault();
			e.stopImmediatePropagation();
			
			if(e.wheelDelta < 0) {
				e.shiftKey
                ? tabStrip.scrollTop += 100
                : switchActiveTab();
			}
			else if(e.wheelDelta > 0) {
                e.shiftKey
                ? tabStrip.scrollTop -= 100
                : switchActiveTab("previous");
			}
		}
	}
	
	function switchActiveTab(direction) {
		const activeTab = tabStrip.getElementsByClassName("tab active")[0], 
            newTabButton = tabStrip.getElementsByClassName("newtab")[0];
		let	switchTabSpan = activeTab.parentNode.parentNode;
        
		do {
			// Get next or previous tab
			switchTabSpan = (direction == "previous") 
            ? switchTabSpan.previousSibling 
            : switchTabSpan.nextSibling;
            
			// If there is no next/prev sibling, wrap to top/bottom tab
			if(!switchTabSpan && wrap) {
                switchTabSpan = (direction == "previous") 
                ? tabStrip.lastChild 
                : tabStrip.firstChild;
            }
            
            if(!switchTabSpan)
                return;
		}
		// Skip newtab button
		while(switchTabSpan === newTabButton); 
		
		// Remove any active classes
		activeTab.classList.remove("active");
		const stillActiveTab = tabStrip.getElementsByClassName("tab active")[0];
		if(stillActiveTab) 
            stillActiveTab.classList.remove("active");
		
		// Give switch tab active class
		const switchTab = switchTabSpan.getElementsByClassName("tab")[0];
		switchTab.classList.add("active");
		
		// Scroll the tab into view
		if(switchTabSpan.nextSibling === newTabButton || switchTabSpan === tabStrip.firstChild)
			switchTabSpan.scrollIntoView({block: "center"});
		else
			switchTabSpan.scrollIntoView({block: "nearest"});
		
		// Activate tab
		const switchTabId = switchTab.id.match(/\d{1,}/)[0];
		chrome.tabs.update(parseInt(switchTabId), {active: true});
	}
})();