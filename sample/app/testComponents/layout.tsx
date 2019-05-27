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

export class DockLayoutTest extends React.Component<{}, {}> {
    render(){
        return (
            <RCTDockLayout
                width={{ value: 100, unit: "%" }}
                height={{ value: 100, unit: "%" }}
                stretchLastChild={true}
            >
                <RCTButton dock={"left"} backgroundColor={"#0099CC"}>Left</RCTButton>
                <RCTButton dock={"top"} backgroundColor={"#AA0078"}>Top</RCTButton>
                <RCTButton dock={"right"} backgroundColor={"#8C489F"}>Right</RCTButton>
                <RCTButton dock={"bottom"} backgroundColor={"#B3B3D7"}>Bottom</RCTButton>
                <RCTButton backgroundColor={"#CCFFFF"} color={new Color("gray")}>THRILLHOUSE</RCTButton>
            </RCTDockLayout>
        );
    }
}

export class AbsoluteLayoutTest extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            RCTAbsoluteLayout,
            {
            },
            React.createElement(
                RCTButton,
                {
                    dock: "left",
                    text: "Left: 10, Top: 5",
                    left: 10,
                    top: 5,
                    backgroundColor: "#0099CC",
                    onTap: () => {}
                },
                null
            ),
            React.createElement(
                RCTButton,
                {
                    dock: "top",
                    text: "Left: 30, Top: 80",
                    left: 30,
                    top: 80,
                    backgroundColor: "#C3C3E5",
                    onTap: () => {}
                },
                null
            ),
            React.createElement(
                RCTButton,
                {
                    dock: "right",
                    text: "Left: 150, Top: 25",
                    left: 150,
                    top: 25,
                    backgroundColor: "#CCFFFF",
                    onTap: () => {}
                },
                null
            ),
            React.createElement(
                RCTButton,
                {
                    dock: "bottom",
                    text: "Left: 70, Top: 150",
                    left: 70,
                    top: 150,
                    backgroundColor: "#8C489F",
                    onTap: () => {}
                },
                null
            ),
        );
    }
}

export class HMRTest extends React.Component<{}, {}> {
    render(){
        // return <DockLayoutTest/>;
        return <FlexboxLayoutTest/>;
        // return <AbsoluteLayoutTest/>;
    }
}

export class FlexboxLayoutTest extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            RCTFlexboxLayout,
            {
                flexDirection: "column-reverse",
                justifyContent: "space-around",
                alignItems: "stretch",
                // height: 300,
                // width: 300,
                width: { value: 100, unit: "%" },
                height: { value: 100, unit: "%" },
                backgroundColor: "lightGray"
            },
            React.createElement(
                RCTLabel,
                {
                    text: "Label 1",
                    width: 60,
                    height: 60,
                    backgroundColor: "red",
                },
                null
            ),
            React.createElement(
                RCTLabel,
                {
                    text: "Label 2",
                    alignSelf: "center",
                    width: 60,
                    height: 60,
                    backgroundColor: "green",
                },
                null
            ),
            React.createElement(
                RCTLabel,
                {
                    text: "Label 3",
                    alignSelf: "flex-end",
                    width: 60,
                    height: 60,
                    backgroundColor: "blue",
                },
                null
            ),
            React.createElement(
                RCTLabel,
                {
                    text: "Label 4",
                    width: 60,
                    height: 60,
                    backgroundColor: "yellow",
                },
                null
            ),
        );
    }
}
