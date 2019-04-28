import * as React from "react";
import { PercentLength, FormattedString } from "tns-core-modules/ui/text-base/text-base";
import { Color } from "tns-core-modules/color";
import { Span } from "tns-core-modules/text/span";
import { ContentView, TextBase, ViewBase, StackLayout, Label, TabView, Page, ProxyViewContainer } from "react-nativescript/dist/client/ElementRegistry";
import { ViewProps, StylePropContents } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
    Button as ReactButton,
    ContentView as ReactContentView,
    TextView as ReactTextView,
    TextField as ReactTextField,
    Label as ReactLabel,
    // StylePropContents,
    DockLayout as ReactDockLayout,
    AbsoluteLayout as ReactAbsoluteLayout,
    StackLayout as ReactStackLayout,
    FlexboxLayout as ReactFlexboxLayout,
    ListView as ReactListView,
    ActionBar as ReactActionBar,
    TabView as ReactTabView,
    TabViewItem as ReactTabViewItem,
    Page as ReactPage,
} from "react-nativescript/dist/index";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { TabViewItem } from "tns-core-modules/ui/tab-view/tab-view";
import { PageComponentProps } from "react-nativescript/dist/components/Page";
import { PortalToPageWithActionBar } from "./navigation";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";

export class GestureLoggingTest extends React.Component<{}, {}> {
    render(){
        return (
                <ReactContentView
                    style={{
                        backgroundColor: new Color("yellow"),
                        width: { unit: "%", value: 100 },
                        height: { unit: "%", value: 100 },
                    }}

                    onTap={(args: GestureEventData) => console.log(`[onTap] yellow`)}
                    onDoubleTap={(args: GestureEventData) => console.log(`[onDoubleTap] yellow`)}
                    onPinch={(args: GestureEventData) => console.log(`[onPinch] yellow`)}
                    onPan={(args: GestureEventData) => console.log(`[onPan] yellow`)}
                    onSwipe={(args: GestureEventData) => console.log(`[onSwipe] yellow`)}
                    onRotation={(args: GestureEventData) => console.log(`[onRotation] yellow`)}
                    onLongPress={(args: GestureEventData) => console.log(`[onLongPress] yellow`)}
                    onTouch={(args: GestureEventData) => console.log(`[onTouch] yellow`)}
                >
                    <ReactFlexboxLayout justifyContent="center" alignItems="center">
                        <ReactContentView
                            style={{
                                backgroundColor: new Color("orange"),
                                width: { unit: "px", value: 300 },
                                height: { unit: "px", value: 300 },
                            }}

                            onTap={(args: GestureEventData) => console.log(`[onTap] orange`)}
                            onDoubleTap={(args: GestureEventData) => console.log(`[onDoubleTap] orange`)}
                            onPinch={(args: GestureEventData) => console.log(`[onPinch] orange`)}
                            onPan={(args: GestureEventData) => console.log(`[onPan] orange`)}
                            onSwipe={(args: GestureEventData) => console.log(`[onSwipe] orange`)}
                            onRotation={(args: GestureEventData) => console.log(`[onRotation] orange`)}
                            onLongPress={(args: GestureEventData) => console.log(`[onLongPress] orange`)}
                            onTouch={(args: GestureEventData) => console.log(`[onTouch] orange`)}
                        />
                    </ReactFlexboxLayout>
                </ReactContentView>
        );
    }
}
