// <reference path="../node_modules/react-nativescript/dist/index.d.ts" />

/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as application from "tns-core-modules/application";
import { run } from "tns-core-modules/application";
import * as React from "react";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { RCTContentView, RCTLabel } from "react-nativescript/dist/index";
import { FormattedStringLabel } from "./testComponents/testComponents";
import { GestureLoggingTest, PanGestureTest, PageGestureTest, StatefulPageGestureTest, StatefulPageGestureTest2 } from "./testComponents/gestures";
import { GameLoopTest } from "./testComponents/stateful";
import { NestedHub, NestedModalTest, HubTest, SimpleHub, ActionBarTest, TabViewTest } from "./testComponents/navigation";
import { Frame, Page, StackLayout, ProxyViewContainer } from "react-nativescript/dist/client/ElementRegistry";
import { SpriteKitGameTest } from "./testComponents/spriteKitGame";

ReactNativeScript.startWithView(
    React.createElement(
        TabViewTest,
        {
            
        },
        null
    ),
    new StackLayout()
);

// const frame = new Frame();
// const page = new Page();
// // page.actionBarHidden = false;
// ReactNativeScript.startWithFrameAndPage(
//     React.createElement(
//         HubTest,
//         {
//             forwardedRef: pageRef
//         },
//         null
//     ),
//     frame,
//     page
// );

// const pageRef = React.createRef<Page>();
// const frame = new Frame();
// /* Do any Frame setup here */
// ReactNativeScript.startWithFrame(
//     React.createElement(
//         StatefulPageGestureTest,
//         {
//             forwardedRef: pageRef
//         },
//         null
//     ),
//     frame,
//     pageRef
// );


// application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
