# CustomHooks
Just some of my hooks for Vivaldi

You need [VivaldiHooks](https://github.com/justdanpo/VivaldiHooks) to use them as hooks. Alternatively add them to browser.html, as they don't actually need VivaldiHooks to work (it's just way more convenient).

**combine-header-toolbar**: 
 - [combine-header-toolbar.css](https://github.com/Sporif/CustomHooks/blob/master/hooks/combine-header-toolbar.css) 

 - Combines the header and toolbar into a single bar. Compatible with any tab bar position and the 'Native Window' setting. You may need to change some values to suit your configuration.

**combine-tab-panel**: 
 - [combine-tab-panel.css](https://github.com/Sporif/CustomHooks/blob/master/hooks/combine-tab-panel.css) and [combine-tab-panel.js](https://github.com/Sporif/CustomHooks/blob/master/hooks/combine-tab-panel.js)
 
 - Places the vertical tabs container on top of the panels container when they're on the same side. Also adds splitters to resize them.
 
**chrome-webstore-css**: 
 - [chrome-webstore-css.js](https://github.com/Sporif/CustomHooks/blob/master/hooks/chrome-webstore-css.js)

 - Allows adding css to https://chrome.google.com/webstore. However you can only add css as a variable in the hook itself.
 
**theme-color-variables**: 
 - [theme-color-variables.js](https://github.com/Sporif/CustomHooks/blob/master/hooks/theme-color-variables.js)

 - Sends the current theme's css variables to chrome:// and vivaldi:// urls. With an extension like [chromedotfiles](https://github.com/hbt/chromedotfiles), this allows styling those pages based on the currently applied theme.
