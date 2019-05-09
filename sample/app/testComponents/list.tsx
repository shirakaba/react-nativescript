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

export class ListViewTest extends React.Component<
    {},
    {}
> {
    render(){
        return (
            <RCTListView
                items={[
                    /* Enough cells to see how view recycling works/ doesn't work */
                    ...[...Array(7).keys()].map((val) => {
                        return { text: val };
                    })
                ]}
                cellFactory={(item: any, container: ContentView) => {
                    return (
                        <RCTLabel
                            key={container._domId}
                            fontSize={150}
                        >
                            {`${item.text}`}
                        </RCTLabel>
                    )
                }}
            >
            </RCTListView>
        );
    }
}