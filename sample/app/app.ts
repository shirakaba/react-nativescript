// <reference path="../node_modules/react-nativescript/dist/index.d.ts" />

/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

declare var module: any;
if(module.hot){
    // self accept.
    module.hot.accept(
        function(error) {
            console.error(`Error in accepting self update for app.ts.`, error);
        }
    );

    // module.hot.addStatusHandler(status => {
    //     console.log(`Change in status for app.ts.`, status);
    // });
}

import * as React from "react";
import * as ReactNativeScript from "react-nativescript/dist/index";
import HotApp, { rootRef } from "./testComponents/HotApp";

ReactNativeScript.startWithAnyView(React.createElement(HotApp, {}, null), rootRef);

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
