# CustomHooks
Just some css/js modifcations for Vivaldi.

Either use [VivaldiHooks](https://github.com/justdanpo/VivaldiHooks) (which only works on 1.12 and below) or add them to browser.html, located at

`YOURVIVALDIDIRECTORY\Application\VERSION\resources\vivaldi`

Open browser.html and inside the body element add the following line:

`<script src="custom.js"></script>`

(obviously replacing `custom.js` with the appropriate file name)

Now add the actual corresponding script to the Vivaldi folder (alongside browser.html)

**combine-header-toolbar**: 
 - [combine-header-toolbar.css](https://github.com/Sporif/CustomHooks/blob/master/hooks/combine-header-toolbar.css) 

 - Combines the header and toolbar into a single bar. Compatible with any tab bar position and the 'Native Window' setting. You may need to change some values to suit your configuration.

**combine-tab-panel**: 
 - [combine-tab-panel.css](https://github.com/Sporif/CustomHooks/blob/master/hooks/combine-tab-panel.css) and [combine-tab-panel.js](https://github.com/Sporif/CustomHooks/blob/master/hooks/combine-tab-panel.js)
 
 - Places the vertical tabs container on top of the panels container when they're on the same side. Also adds splitters to resize them.
 
**chrome-webstore-css**: 
 - [chrome-webstore-css.js](https://github.com/Sporif/CustomHooks/blob/master/hooks/chrome-webstore-css.js)

 - Allows adding css to https://chrome.google.com/webstore. However you can only add css as a variable in the script itself.
 
**theme-css-variables**: 
 - [theme-css-variables.js](https://github.com/Sporif/CustomHooks/blob/master/hooks/theme-css-variables.js)

 - Sends the current theme's css variables to chrome:// and vivaldi:// urls. With an extension like [chromedotfiles](https://github.com/hbt/chromedotfiles), this allows styling those pages based on the currently applied theme.
 
**white-flash-fix**: 
 - [white-flash-fix.js](https://github.com/Sporif/CustomHooks/blob/master/hooks/white-flash-fix.js)

 - Fixes the white flash that occurs when navigating away from the start page or blank page. It sets the color to the current theme's background color.
