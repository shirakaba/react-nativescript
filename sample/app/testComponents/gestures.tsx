import * as React from "react";
import { PercentLength, FormattedString } from "tns-core-modules/ui/text-base/text-base";
import { Color } from "tns-core-modules/color";
import { Span } from "tns-core-modules/text/span";
import { ContentView, TextBase, ViewBase, StackLayout, Label, TabView, Page, ProxyViewContainer } from "react-nativescript/dist/client/ElementRegistry";
import { ViewProps, StylePropContents } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
    RCTButton,
    RCTContentView,
    RCTTextView,
    RCTTextField,
    RCTLabel,
    // StylePropContents,
    RCTDockLayout,
    RCTAbsoluteLayout,
    RCTStackLayout,
    RCTFlexboxLayout,
    RCTListView,
    RCTActionBar,
    RCTTabView,
    RCTTabViewItem,
    RCTPage,
} from "react-nativescript/dist/index";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { TabViewItem } from "tns-core-modules/ui/tab-view/tab-view";
import { PageComponentProps } from "react-nativescript/dist/components/Page";
import { PortalToPageWithActionBar } from "./navigation";
import { GestureEventData, PinchGestureEventData, PanGestureEventData, SwipeGestureEventData, RotationGestureEventData, TouchGestureEventData, GestureStateTypes, SwipeDirection } from "tns-core-modules/ui/gestures/gestures";

export class GestureLoggingTest extends React.Component<{}, {}> {
    render(){
        return (
                <RCTContentView
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
                    <RCTFlexboxLayout justifyContent="center" alignItems="center">
                        <RCTContentView
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
                    </RCTFlexboxLayout>
                </RCTContentView>
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

    onDoubleTap = (args: GestureEventData) => console.log(`[onDoubleTap] orange`);
    onPinch = (args: PinchGestureEventData) => console.log(`[onPinch] orange`);
    onSwipe = (args: SwipeGestureEventData) => console.log(`[onSwipe] orange`);
    onRotation = (args: RotationGestureEventData) => console.log(`[onRotation] orange`);
    onLongPress = (args: GestureEventData) => console.log(`[onLongPress] orange`);
    onPan = (args: PanGestureEventData) => {
        const { x, y, xBeforePan, yBeforePan } = this.state;
        const { deltaX, deltaY, state } = args;
        console.log(`[onPan] state: ${state}, deltaX: ${deltaX}, deltaY ${deltaY}`);

        const pointBeforePan = {
            xBeforePan: state === GestureStateTypes.began ? x : xBeforePan,
            yBeforePan: state === GestureStateTypes.began ? y : yBeforePan,
        };

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
    }

    render(){
        const { x, y } = this.state;

        return (
                <RCTContentView
                    style={{
                        backgroundColor: new Color("yellow"),
                        width: { unit: "%", value: 100 },
                        height: { unit: "%", value: 100 },
                    }}
                >
                    <RCTAbsoluteLayout>
                        <RCTContentView
                            left={{ unit: "px", value: x }}
                            top={{ unit: "px", value: y }}
                            style={{
                                backgroundColor: new Color("orange"),
                                width: { unit: "px", value: 300 },
                                height: { unit: "px", value: 300 },
                            }}

                            // onTap={(args: GestureEventData) => console.log(`[onTap] orange`)}
                            onDoubleTap={this.onDoubleTap}
                            onPinch={this.onPinch}
                            onPan={this.onPan}
                            onSwipe={this.onSwipe}
                            onRotation={this.onRotation}
                            onLongPress={this.onLongPress}
                            // onTouch={(args: TouchGestureEventData) => console.log(`[onTouch] orange`)}
                        />
                    </RCTAbsoluteLayout>
                </RCTContentView>
        );
    }
}

export class PageGestureTest extends React.Component<{ forwardedRef: React.RefObject<Page> } & PageComponentProps<Page>, {}> {
    private readonly yellowPageRef = React.createRef<Page>();
    render(){
        const { forwardedRef, ...rest } = this.props;

        return (
            <RCTPage
                ref={forwardedRef}
                actionBarHidden={false}
                {...rest}
                onSwipe={(args: SwipeGestureEventData) => console.log(`[onSwipe] base Page`)}
            >
                <RCTActionBar title="Navigation Hub" className="action-bar" />
                <RCTStackLayout>
                    <RCTButton
                        text={"Navigate to yellow page"}
                        onPress={() => {
                            const currentPage: Page = forwardedRef.current!;
                            currentPage.frame.navigate({
                                create: () => {
                                    return this.yellowPageRef.current;
                                }
                            });
                        }}
                    />
                </RCTStackLayout>
                
                <PortalToPageWithActionBar
                    forwardedRef={this.yellowPageRef}
                    actionBarTitle={"Yellow page"}
                    backgroundColor={"yellow"}
                    onSwipe={(args: SwipeGestureEventData) => {
                        if(args.direction === SwipeDirection.right){
                            console.log(`[onSwipe] yellow Page, rightwards (so shall go back)`);
                            this.yellowPageRef.current!.frame.goBack();
                        } else {
                            console.log(`[onSwipe] yellow Page, not rightwards (so shan't go back). direction: ${args.direction}`);
                        }
                    }}
                >
                    <RCTLabel>You're viewing the yellow page!</RCTLabel>
                </PortalToPageWithActionBar>
            </RCTPage>
        );
    }
}
