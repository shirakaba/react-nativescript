// <reference path="../node_modules/react-nativescript/dist/index.d.ts" />

/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

declare var module: any;
if(module.hot){
    // self accept.
    // module.hot.accept(
    //     function(error) {
    //         console.error(`Error in accepting self update for app.ts.`, error);
    //     }
    // );

    // module.hot.addStatusHandler(status => {
    //     console.log(`Change in status for app.ts.`, status);
    // });
}

import 'nativescript-websockets';
console.log(`BrowserWebSocket was:`, (global as any).WebSocket);

Object.defineProperty(global, 'WebSocket', {
    // value: require('ws')
    value: (global as any).WebSocket
});

(global as any).window = global;
Object.defineProperty(global, 'window', {
    value: global
});

console.log(`window.WebSocket was:`, (window as any).WebSocket);

// [Upon importing react-devtools] JS ERROR ReferenceError: Can't find variable: window

/* https://github.com/facebook/react-devtools/issues/601#issuecomment-290611996
 * https://github.com/sidorares/react-x11/blob/master/src/DevToolsIntegration.js */
(global as any).__DEV__ = true;
const {connectToDevTools} = require('react-devtools-core');
connectToDevTools({
    host: 'localhost',
    // Maybe: /usr/local/lib/node_modules/nativescript/lib/device-sockets/ios/app-debug-socket-proxy-factory.js
    port: 8097,
    websocket: (global as any).WebSocket,
    resolveRNStyle: null,
    isAppActive: () => true,
});

(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.on('react-devtools', (agent: any) => {
    console.log(`Got 'react-devtools' callback! Agent:`, agent);
    // let highlightedNodes: any[] = [];
    // agent.on('highlight', data => {
    //     highlight(data.node, data.name);
    //     highlightedNodes.push(data.node);
    // });
    // agent.on('hideHighlight', () => {
    //     highlightedNodes.forEach(n => {
    //         // hideHighlight(n);
    //     })
    //     highlightedNodes = [];
    // });
})

import * as React from "react";
import * as ReactNativeScript from "react-nativescript/dist/index";
import HotApp, { rootRef } from "./testComponents/HotApp";

// ReactNativeScript.startWithAnyView(React.createElement(HotApp, {}, null), rootRef);
ReactNativeScript.startWithView(React.createElement(HotApp, {}, null));

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
