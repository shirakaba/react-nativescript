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
import { TextView as ReactTextView } from "react-nativescript/dist/components/TextView";;
import { Frame, ContentView } from "tns-core-modules/ui/frame/frame";
import { ViewBase, FormattedString } from "tns-core-modules/ui/text-base/text-base";
import { Page } from "tns-core-modules/ui/page/page";
import { NestedContentView, FlexboxLayoutTest1, Clock, FormattedStringLabel, Marquee, GameLoopProvider } from "./testComponents/testComponents";
import { View as ReactView } from "react-nativescript/dist/components/View";
import { ListView } from "react-nativescript/dist/components/ListView";
import { Label } from "react-nativescript/dist/components/Label";
import { Span } from "tns-core-modules/text/span";

run({
    create: () => {
        const frame = new Frame();
        frame.navigate({
            create: () => {
                const page = new Page();
                page.backgroundColor = "white";

                // https://reactjs.org/docs/react-without-jsx.html
                ReactNativeScript.render(
                    // React.createElement(
                    //     GameLoopProvider,
                    //     {
                    //         frameRateMs: (1000 / 60) / 4
                    //     },
                    //     React.createElement(
                    //         Marquee,
                    //         {
                    //             text: "NativeScript is an AMAZING framework"
                    //         },
                    //         null
                    //     ),
                    // ),


                    React.createElement(
                        ListView,
                        {
                            items: [
                                /* Enough cells to see how view recycling works/ doesn't work */
                                ...[...Array(7).keys()].map((val) => {
                                    return { text: val };
                                })
                            ],
                            cellFactory: (item: any, container: ContentView) => {
                                return React.createElement(
                                    "label",
                                    {
                                        key: container._domId,
                                        text: `${item.text}`,
                                        fontSize: 150,
                                        // textWrap: true,
                                        // class: "title"
                                        
                                    }
                                )
                            }
                        },
                        null
                    ),

                    // React.createElement(
                    //     Clock,
                    //     {},
                    //     null
                    // ),
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
