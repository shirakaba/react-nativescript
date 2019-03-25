/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as application from "tns-core-modules/application";
import { on, run, launchEvent } from "tns-core-modules/application";
// For now, we'll import straight from the .ts source rather than using a distributed bundle.
// import { default as ReactNativeScript } from "../../dist/index";
import { default as ReactNativeScript } from "react-nativescript/dist/index";
// import { default as ReactNativeScript } from "./lib/react-nativescript/dist/index";
// const ReactNativeScript = require('./react-nativescript');
import { Frame } from "tns-core-modules/ui/frame/frame";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { ContentView } from "tns-core-modules/ui/page/page";

const contentView = new ContentView();
const textBase = new TextBase();
textBase.text = "Hello, world!";
contentView._addView(textBase);
const frame = new Frame();

// on(launchEvent, (data: any) => {
//     console.log("Got launch event. Data:", data);
// });

// ReactNativeScript.render(
//     contentView,
//     frame,
//     () => {
//         console.log(`Component rendered!`);
//     }
// );

// run();

application.run({ moduleName: "app-root" });



/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
