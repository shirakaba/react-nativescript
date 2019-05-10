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
import { CellViewContainer } from "react-nativescript/dist/components/ListView";


export class ListViewTest extends React.Component<
    {},
    {}
> {
    render(){
        type Item = number;
        const items: Item[] = [...Array(200).keys()];

        /* There may be an argument for nesting the ListView within a LayoutBase once
         * dealing with the Safe Area (shall have to find out and see!). */
        return (
            <RCTListView
                _debug={{
                    logLevel: "info",
                    onCellFirstLoad: (container: CellViewContainer) => {
                        container.backgroundColor = "orange";
                    },
                    onCellRecycle: (container: CellViewContainer) => {
                        container.backgroundColor = "blue";
                    },
                }}
                height={{ unit: "%", value: 100 }}
                items={[
                    /* Enough cells to see how view recycling works/ doesn't work */
                    ...items.map((val: Item) => {
                        return val;
                    })
                ]}
                // TODO: consider usng the same API name as React Native here.
                cellFactory={(item: Item, container: CellViewContainer) => {
                    return (
                        <RCTLabel
                            key={container._domId}
                            fontSize={24}
                        >
                            {`#${item}`}
                        </RCTLabel>
                    );
                }}
            >
            </RCTListView>
        );
    }
}