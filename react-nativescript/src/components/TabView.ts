import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { TabViewProps } from "../shared/NativeScriptComponentTypings";
import { TabViewItem } from "./TabViewItem";
import { TabView as NativeScriptTabView, TabViewItem as NativeScriptTabViewItem } from "tns-core-modules/ui/tab-view/tab-view";
import { StackLayout, Color, Label } from "../client/ElementRegistry";

interface Props {
    // items: NativeScriptTabViewItem[],
}

export type TabViewComponentProps = Props & Partial<TabViewProps>;

/**
 * A React wrapper around the NativeScript TabView component.
 * 
 * The Host Config implicitly maps any TabViewItem children of TabView
 * onto the tabView.items property.
 * 
 * So to get access to tabView.items, we'll have to use this.myRef.
 * 
 * See: ui/tab-view/tab-view
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/tab-view/code-behind/code-behind-ts-page.ts
 */
export class TabView extends React.Component<TabViewComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptTabView> = React.createRef<NativeScriptTabView>();
    
    render(){
        const { children, items, ...rest } = this.props;

        return React.createElement(
            'tabView',
            {
                ...rest,
                // items: [],
                ref: this.myRef
            },
            /* For now, any TabViewItem children will be mapped to items by our React renderer. */
            ...children
        );
    }
}