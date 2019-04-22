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
import { ContentView, Label } from "react-nativescript/dist/index";
import { ActionBarTest, makeTabView, TabViewTest, GameLoopTest } from "./testComponents/testComponents";
import { Frame } from "tns-core-modules/ui/frame/frame";
import { Page } from "tns-core-modules/ui/page/page";
import { StackLayout } from "react-nativescript/dist/client/ElementRegistry";

// ReactNativeScript.startWithView(
//     React.createElement(
//         TabViewTest,
//         {
            
//         },
//         null
//     ),
//     new StackLayout()
// );        

const frame = new Frame();
const page = new Page();
// page.actionBarHidden = false;
ReactNativeScript.startWithFrame(
    React.createElement(
        GameLoopTest,
        {

        },
        null
    ),
    frame,
    page
);


// application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
