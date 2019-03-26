/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as application from "tns-core-modules/application";
import * as React from "react";
import { on, run, launchEvent, getMainEntry, getRootView, LaunchEventData } from "tns-core-modules/application";
import { default as ReactNativeScript } from "react-nativescript/dist/index";
import { Frame } from "tns-core-modules/ui/frame/frame";
import { ContentView } from "tns-core-modules/ui/content-view/content-view";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { TextView } from "tns-core-modules/ui/text-view/text-view";
import { Page } from "tns-core-modules/ui/page/page";
import { FlexboxLayout } from "tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout";

class MyFlexboxLayout extends React.Component<{ flaggy: boolean }, {}> {
    render(){
        return React.createElement('FlexboxLayout', { flaggy: this.props.flaggy, style: { backgroundColor: "yellow" } });
    }
}

class NestedContentView extends React.Component<{ flaggy: boolean }, {}> {
    render(){
        return React.createElement(
            'ContentView',
            {
                flaggy: this.props.flaggy,
                style: {
                    backgroundColor: "yellow",
                    width: "75%",
                    height: "75%"
                }
            },
            React.createElement(
                'ContentView',
                {
                    flaggy: !this.props.flaggy,
                    style: {
                        backgroundColor: "orange",
                        width: "50%",
                        height: "50%"
                    }
                }
            )
        );
    }
}

class MyTextField extends React.Component<{ toWhat: string }, {}> {
    render(){
        return React.createElement('TextField', null, `Hello ${this.props.toWhat}`);
        // { type: "TextField", props: { toWhat: string, children: string } }
    }
}

class MyRootView extends React.Component<{}, {}> {
    render(){
        return React.createElement('Frame', null);
    }
}

run({
    create: () => {
        const frame = new Frame();
        frame.navigate({
            create: () => {
                const page = new Page();
                page.backgroundColor = "green";

                // https://reactjs.org/docs/react-without-jsx.html
                ReactNativeScript.render(
                    React.createElement(NestedContentView, { flaggy: true }, null),
                    page, // I think this is more appropriate than passing frame.
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
