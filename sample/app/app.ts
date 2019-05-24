// <reference path="../node_modules/react-nativescript/dist/index.d.ts" />

/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

if((module as any).hot) {
    // self accept.
    (module as any).hot.accept(
        function() {
            console.log(`Error in accepting self update for app.ts.`);
        }
    );

    // (module as any).hot.addStatusHandler(status => {
    //     console.log(`Change in status for app.ts.`, status);
    // });
}

import * as React from "react";
import * as application from "tns-core-modules/application";
import { run, hasLaunched, getRootView } from "tns-core-modules/application";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { render } from "react-nativescript/dist/index";
import { RCTContentView, RCTLabel } from "react-nativescript/dist/index";
import { FormattedStringLabel } from "./testComponents/testComponents";
import { GestureLoggingTest, PanGestureTest, PageGestureTest, StatefulPageGestureTest, StatefulPageGestureTest2 } from "./testComponents/gestures";
import { GameLoopTest } from "./testComponents/stateful";
import { NestedHub, NestedModalTest, HubTest, SimpleHub, ActionBarTest, TabViewTest } from "./testComponents/navigation";
import { Frame, Page, StackLayout, ProxyViewContainer, ContentView, View, TabView } from "react-nativescript/dist/client/ElementRegistry";
import { SpriteKitGameTest } from "./testComponents/spriteKitGame";
import { ListViewTest, DynamicListViewWithImages } from "./testComponents/list";
import HotApp from "./testComponents/HotApp";
import { topmost } from "tns-core-modules/ui/frame/frame";

global.__onLiveSyncCore = () => {
    console.log(`on liveSync Core YOYO OOY! OH`);

    const frame = topmost();
    if(frame){
        if(frame.currentPage && frame.currentPage.modal){
            frame.currentPage.modal.closeModal();
        }
  
        if(frame.currentPage){
            frame.currentPage.addCssFile(application.getCssFileName())
       }
    }
}

function startWithView(
    app: any,
    providedRootView: View = new ContentView(),
): void
{
    if(
        !(providedRootView instanceof TabView || providedRootView instanceof Frame)
    ){
        console.warn(
            `Support for root view components other than Frame or TabView is limited.`
        );
    }

    console.log(`[app.ts] startWithView(). hasLaunched(): ${hasLaunched()} rootView was: ${getRootView()}`);
    const rootView: View = getRootView() || providedRootView;

    const renderIntoRootView = () => {
        render(
            app,
            rootView,
            () => {
                console.log(`Container updated!`);
            }
        );
    }

    // hasLaunched seems to always be false (don't ask me why) so we take a truthy rootView to mean the same thing.
    if(hasLaunched() || getRootView()){
        console.log(`[renderIntoRootView] without run(). Content of container: ${(rootView as ContentView).content}`);
        renderIntoRootView();
    } else {
        console.log(`[renderIntoRootView] with run()`);
        run({
            create: () => {
                // Due to HMR, there may already be an existing rootView.
    
                renderIntoRootView();
    
                return rootView;
            }
        });
    }
}


startWithView(
    React.createElement(
        HotApp,
        {
            
        },
        null
    ),
    new ContentView()
);

// console.log("BOO HISS OY EY");

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
