import * as React from "react";

/* Controls react-nativescript log verbosity. true: all logs; false: only error logs. */
Object.defineProperty(global, '__DEV__', { value: true });

/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as ReactNativeScript from "react-nativescript/dist/index";
import AppContainer from "./testComponents/AppContainer";
import { Trace, TraceErrorHandler } from "@nativescript/core";


const errorHandler: TraceErrorHandler = {
    handlerError(err) {
        // Option 1 (development) - throw the error
        // throw err;
        

        // Option 2 (development) - logging the error via write method provided from trace module
        Trace.write(err, "unhandled-error", Trace.messageType.error);

        // (production) - custom functionality for error handling
        // reportToAnalytics(err)
    }
}

Trace.setErrorHandler(errorHandler)

ReactNativeScript.start(React.createElement(AppContainer, {}, null));

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
