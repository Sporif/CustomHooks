// Middle click on the tab bar to re-open the last closed tab (instead of creating a new one)
// Set restoreWindows to true to re-open windows as well.
(function() { 
    const restoreWindows = false;
	waitForElement(".tab-strip", 500, init);
	
	function init() {
		const header = document.getElementById("header"),
			main = document.getElementById("main"),
			inner = document.getElementsByClassName("inner")[0];
		let	resize = document.getElementsByClassName("resize")[0];
		
		replaceMiddleClick();
		
		// When the tabStrip is added back (after exiting fullscreen or moving tab container), replace middle click
		const onTabStripAdded = new MutationObserver(mutations => {
			for(const mutation of mutations) {
				for(const added of mutation.addedNodes) {
					if(added.classList && added.classList.contains("tab-strip"))
                        replaceMiddleClick();
				}
			}
		});
		onTabStripAdded.observe(resize, { childList: true });
		
		// When the tab container is moved, resize element is re-created, so re-obeserve it
		const onTabContMoved = new MutationObserver(mutations => {
			for(const mutation of mutations) {
				for(const added of mutation.addedNodes) {
					if(added.id && added.id === "tabs-container") { 
						resize = added.getElementsByClassName("resize")[0];
						onTabStripAdded.observe(resize, { childList: true });
					}
				}
			}
		});
		onTabContMoved.observe(header, { childList: true }); // top
		onTabContMoved.observe(main,   { childList: true }); // left and right
		onTabContMoved.observe(inner,  { childList: true }); // bottom
	};
	
    function replaceMiddleClick() {
        const tabStrip = document.getElementsByClassName("tab-strip")[0];
        if(tabStrip) {
            tabStrip.onmouseup = e => {
                if(e.button === 1 && e.target === tabStrip) {
                    e.stopPropagation(); // prevent new tab creation
                    chrome.sessions.getRecentlyClosed({ maxResults: 1 }, sessions => {
                        if(sessions.length && sessions[0].tab)
                            chrome.sessions.restore(sessions[0].tab.sessionId);
                        else if(sessions.length && sessions[0].window && restoreWindows) 
                            chrome.sessions.restore(sessions[0].window.sessionId);
                    });
                }
            }
        }
    }
    
	function waitForElement(selector, time, callback) {
		if(document.querySelector(selector) !== null)
            callback();
		else {
			setTimeout(function() {
				waitForElement(selector, time, callback);
			}, time);
		}
	}
})();