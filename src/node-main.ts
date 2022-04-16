/* eslint @typescript-eslint/no-var-requires: "off" */

/*
*   This module is executed in Node context before the first DOM window is loaded. It will keep running in the background
*   throughout the lifetime of the application. Window reloads will not restart this module!
*/

/* importing node modules */
// tsconfig.node-main.json is set to use the commonjs module format,
// and import/export statements will be transpiled accordingly by tsc:

// import { unlink } from 'fs';
//
// unlink('/tmp/hello', (err) => {
//     if (err) throw err;
//     ...
// });


/* exporting methods */
// Use process.mainModule.exports.saveWindow() in browser context.
// exports.saveWindow = function (arg1: string, arg2: nw.Window) {
//     ...
// }

/* logging */
// Log will appear in the developer console dedicated to the background page.
// Access it with Context Menu > Inspect background page.
console.log('Writing to console from the node main module.');
