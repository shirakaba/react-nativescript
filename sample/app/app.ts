/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as application from "tns-core-modules/application";
import { run } from "tns-core-modules/application";
import * as React from "react";
import { default as ReactNativeScript } from "react-nativescript/dist/index"
import { TextView as ReactTextView } from "react-nativescript/dist/components/TextView";;
import { Frame, ContentView } from "tns-core-modules/ui/frame/frame";
import { ViewBase } from "tns-core-modules/ui/text-base/text-base";
import { Page } from "tns-core-modules/ui/page/page";
import { NestedContentView, FlexboxLayoutTest1 } from "./testComponents/testComponents";
import { View as ReactView } from "react-nativescript/dist/components/View";


run({
    create: () => {
        const frame = new Frame();
        frame.navigate({
            create: () => {
                const page = new Page();
                page.backgroundColor = "green";

                // https://reactjs.org/docs/react-without-jsx.html
                ReactNativeScript.render(
                    React.createElement(
                        ReactTextView,
                        null,
                        "world"
                    ),
                    page,
                    () => {
                        console.log(`Container updated!`);
                    }
                );

                return page;
            }
        });
        return frame;
    }
});

run();

// application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
