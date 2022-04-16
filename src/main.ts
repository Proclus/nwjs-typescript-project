
// Fonts & styles.
// Assets will be bundled by webpack.
import "@fontsource/source-sans-pro";
import "./styles.css";

import {runFoo} from 'nwp-gateway.node';

/* Get main window */
const mainWindow:NWJS_Helpers.win = nw.Window.get();


/* Logging */
console.log("main.ts entry point.");

/* Programmatically open dev console.  */
// mainWindow.showDevTools();

/* Show background module console. node-main.js logs will be directed here. */
// chrome['developerPrivate'].openDevTools({
//     renderViewId: -1,
//     renderProcessId: -1,
//     extensionId: chrome.runtime.id
// });

/* Load the gateway addon module */
const promise = runFoo({foo: 99});
promise.then((res) => {
    console.log('runFoo result:', res);
    const mainElm = document.getElementById('main');
    mainElm.style.color = 'green';
});
