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

ReactNativeScript.start(
    React.createElement(
        ContentView,
        {
            backgroundColor: "orange"
        },
        React.createElement(
            Label,
            {
                // text: "Hello, world!"
            },
            "Hello, world!"
        )
    )
);


// application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
