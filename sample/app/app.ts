/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as application from "tns-core-modules/application";
import * as React from "react";
import { on, run, launchEvent, getMainEntry, getRootView } from "tns-core-modules/application";
import { default as ReactNativeScript } from "react-nativescript/dist/index";
import { Frame } from "tns-core-modules/ui/frame/frame";
import { ContentView } from "tns-core-modules/ui/content-view/content-view";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { Page } from "tns-core-modules/ui/page/page";

// const contentView = new ContentView();
// const textBase = new TextBase();
// textBase.text = "Hello, world!";
// contentView._addView(textBase);

on(launchEvent, (data: any) => {
    console.log("[launchEvent 1a] Got launch event. Data:", data);

    // https://github.com/NativeScript/NativeScript/issues/5073#issuecomment-344703902
    const frame = new Frame();
    /* If you don't navigate the frame to a page, a blank UINavigationBar will be inserted. */
    const page = new Page();
    page.backgroundColor = "green";
    frame.navigate({ create: () => page });
    // https://github.com/NativeScript/NativeScript/blob/9d7f0e5315be0da6574ef1febc80ddb1f5deef32/tns-core-modules/ui/frame/frame.android.ts#L926
    // frame.navigate(getMainEntry());

    data.root = frame;

    // application.getRootView() and data._window still undefined at this point.

    const myTextBase = React.createElement(MyTextBase, { toWhat: 'World' }, null);

    console.log("myTextBase as React element:", myTextBase);
    // console.log("myTextBase type:", myTextBase.type);

    // https://reactjs.org/docs/react-without-jsx.html
    ReactNativeScript.render(
        React.createElement(MyContentView, { flaggy: true }, null),
        page, // I think this is more appropriate than passing frame.
        //@ts-ignore
        // React.createElement(MyRootView, {}, null),
        () => {
            console.log(`Container updated!`);
        }
    );
});

class MyContentView extends React.Component<{ flaggy: boolean }, {}> {
    render(){
        return React.createElement('ContentView', { flaggy: this.props.flaggy, style: { backgroundColor: "yellow" } });
    }
}

class MyTextBase extends React.Component<{ toWhat: string }, {}> {
    render(){
        return React.createElement('TextBase', null, `Hello ${this.props.toWhat}`);
        // { type: "TextBase", props: { toWhat: string, children: string } }
    }
}

class MyRootView extends React.Component<{}, {}> {
    render(){
        return React.createElement('Frame', null);
    }
}

run();

// application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
