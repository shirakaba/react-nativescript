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

Object.defineProperty(global, 'WebSocket', {
    // value: require('ws')
    value: (global as any).WebSocket
});

(global as any).window = global;
Object.defineProperty(global, 'window', {
    value: global
});

// const mySocket = new WebSocket("ws://echo.websocket.org", []);
// const mySocket = new WebSocket("http://localhost:8097", []);
// mySocket.onopen = function(ev: Event) {
//     const socket = ev.target as WebSocket;
//     console.log("[SOCKET] Hey I'm open");
//     socket.send("Hello");
// };
// mySocket.onmessage = function(ev: MessageEvent){
//     console.log("[SOCKET] Got a message", ev.data);
// };
// mySocket.onclose = function(ev: CloseEvent){
//     console.log("[SOCKET] Socket was closed because: ", ev.reason, " code: ", ev.code);
// };
// mySocket.onerror = function(ev: Event){
//     console.error("[SOCKET] Socket had an error", ev);
// };

/* https://github.com/facebook/react-devtools/issues/601#issuecomment-290611996
 * https://github.com/sidorares/react-x11/blob/master/src/DevToolsIntegration.js */
(global as any).__DEV__ = true;

// import * as React from "react";
// Object.defineProperty(window, 'React', {
//     value: React
// });

const {connectToDevTools} = require('react-devtools-core');
const wsInstance = connectToDevTools({
    host: 'localhost',
    port: 8097,
    /* This does NOT work */
    // websocket: (global as any).WebSocket,
    resolveRNStyle: null,
    isAppActive: () => true,
});

console.log(`[app.ts] Got wsInstance:`, wsInstance);
console.log(`[app.ts] wsInstance's onopen was:`, wsInstance.onopen);

(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.on('react-devtools', (agent: any) => {
    console.log(`Got 'react-devtools' callback!`);
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
});

import * as React from "react";
import * as ReactNativeScript from "react-nativescript/dist/index";
import HotApp, { rootRef } from "./testComponents/HotApp";

// ReactNativeScript.startWithAnyView(React.createElement(HotApp, {}, null), rootRef);
ReactNativeScript.startWithView(React.createElement(HotApp, {}, null));

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
