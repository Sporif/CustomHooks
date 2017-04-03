// Combines header and toolbar (when tabs not on top). Script sets the toolbar size
vivaldi.jdhooks.onUIReady(function() {
	
	var toolbarsize = document.createElement('style')
	toolbarsize.setAttribute('description', 'Toolbar size for combined toolbar/header, added by combine-header-toolbar.js');
	
	function setToolbarSize() {
		
		var menu = document.querySelector('.menu');
		var vivaldibutton = document.querySelector('.vivaldi'); 
		var windowbuttons = document.querySelector('.window-buttongroup');
		
		if (menu) {
			var menuwidth = menu.offsetWidth - 5; 
			var toolbarwidth = menuwidth + windowbuttons.offsetWidth;
			toolbarsize.textContent = 
			`.maximized#browser:not(.tabs-top) .toolbar.toolbar-addressbar {
				max-width: calc(100% - ` + toolbarwidth + `px); 
				left: ` + menuwidth + `px;
			}`
		}
		else if (vivaldibutton) { 
			var vivaldibuttonwidth = vivaldibutton.offsetWidth - 10; 
			var toolbarwidth = vivaldibuttonwidth + windowbuttons.offsetWidth;
			
			toolbarsize.textContent = 
			`.maximized#browser:not(.tabs-top) .toolbar.toolbar-addressbar {
				max-width: calc(100% - ` + toolbarwidth + `px); 
				left: ` + vivaldibuttonwidth + `px;
			}`
		}
		document.head.appendChild(toolbarsize);
	}
	
	setToolbarSize();
	
    var toolbarObs = new MutationObserver(function(mutations, observer) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(itm) {
                if (itm.className === "vivaldi") {              
					setToolbarSize();
				}
            });
			mutation.removedNodes.forEach(function(itm) {
                if (itm.className === "vivaldi") {                 
					setToolbarSize();
				}
            });
        });
    });

	toolbarObs.observe(document.querySelector('#header'), {
		childList: true,
		subtree: true
	});
	
});