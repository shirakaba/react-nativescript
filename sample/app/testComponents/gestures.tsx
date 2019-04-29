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
import { GestureEventData, PinchGestureEventData, PanGestureEventData, SwipeGestureEventData, RotationGestureEventData, TouchGestureEventData, GestureStateTypes } from "tns-core-modules/ui/gestures/gestures";

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
                    onPinch={(args: PinchGestureEventData) => console.log(`[onPinch] yellow`)}
                    onPan={(args: PanGestureEventData) => console.log(`[onPan] yellow`)}
                    onSwipe={(args: SwipeGestureEventData) => console.log(`[onSwipe] yellow`)}
                    onRotation={(args: RotationGestureEventData) => console.log(`[onRotation] yellow`)}
                    onLongPress={(args: GestureEventData) => console.log(`[onLongPress] yellow`)}
                    onTouch={(args: TouchGestureEventData) => console.log(`[onTouch] yellow`)}
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
                            onPinch={(args: PinchGestureEventData) => console.log(`[onPinch] orange`)}
                            onPan={(args: PanGestureEventData) => console.log(`[onPan] orange`)}
                            onSwipe={(args: SwipeGestureEventData) => console.log(`[onSwipe] orange`)}
                            onRotation={(args: RotationGestureEventData) => console.log(`[onRotation] orange`)}
                            onLongPress={(args: GestureEventData) => console.log(`[onLongPress] orange`)}
                            onTouch={(args: TouchGestureEventData) => console.log(`[onTouch] orange`)}
                        />
                    </ReactFlexboxLayout>
                </ReactContentView>
        );
    }
}

export class PanGestureTest extends React.Component<
    {},
    {
        xBeforePan: number,
        yBeforePan: number,
        x: number,
        y: number,
    }
> {
    constructor(props){
        super(props);

        this.state = {
            x: 0,
            y: 0,
            xBeforePan: 0,
            yBeforePan: 0,
        }
    }

    render(){
        const { x, y } = this.state;

        return (
                <ReactContentView
                    style={{
                        backgroundColor: new Color("yellow"),
                        width: { unit: "%", value: 100 },
                        height: { unit: "%", value: 100 },
                    }}
                >
                    <ReactAbsoluteLayout>
                        <ReactContentView
                            left={{ unit: "px", value: x }}
                            top={{ unit: "px", value: y }}
                            style={{
                                backgroundColor: new Color("orange"),
                                width: { unit: "px", value: 300 },
                                height: { unit: "px", value: 300 },
                            }}

                            // onTap={(args: GestureEventData) => console.log(`[onTap] orange`)}
                            onDoubleTap={(args: GestureEventData) => console.log(`[onDoubleTap] orange`)}
                            onPinch={(args: PinchGestureEventData) => console.log(`[onPinch] orange`)}
                            onPan={(args: PanGestureEventData) => {
                                const { deltaX, deltaY, state } = args;
                                console.log(`[onPan] state: ${state}, deltaX: ${deltaX}, deltaY ${deltaY}`);

                                const pointBeforePan = {
                                    xBeforePan: state === GestureStateTypes.began ? x : this.state.xBeforePan,
                                    yBeforePan: state === GestureStateTypes.began ? y : this.state.yBeforePan,
                                }

                                /* If the screen is 370 px wide and you move your mouse from one side to another,
                                 * the deltaX will become ~370 px and we set 'left' to ~370.
                                 *
                                 * However, it seems that visually the orange box only moves half the screen distance.
                                 * For some reason, the x2 factor is necessary. Maybe it's pixel density? */
                                this.setState({
                                    ...pointBeforePan,
                                    x: pointBeforePan.xBeforePan + deltaX * 2,
                                    y: pointBeforePan.yBeforePan + deltaY * 2,
                                });
                            }}
                            onSwipe={(args: SwipeGestureEventData) => console.log(`[onSwipe] orange`)}
                            onRotation={(args: RotationGestureEventData) => console.log(`[onRotation] orange`)}
                            onLongPress={(args: GestureEventData) => console.log(`[onLongPress] orange`)}
                            // onTouch={(args: TouchGestureEventData) => console.log(`[onTouch] orange`)}
                        />
                    </ReactAbsoluteLayout>
                </ReactContentView>
        );
    }
}