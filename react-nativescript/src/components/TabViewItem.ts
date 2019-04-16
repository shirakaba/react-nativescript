import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { TabViewItemProps } from "../shared/NativeScriptComponentTypings";
import { View, ViewBase, StackLayout, Color, ContentView, Label } from "../client/ElementRegistry";
import { TabView as NativeScriptTabView, TabViewItem as NativeScriptTabViewItem } from "tns-core-modules/ui/tab-view/tab-view";

interface Props {
    identifier: string,

    // view: View
}

export type TabViewItemComponentProps = Props & Partial<TabViewItemProps>;

/**
 * A React wrapper around the NativeScript TabViewItem component.
 */
export class TabViewItem extends React.Component<TabViewItemComponentProps, {}> {
    private readonly container = new StackLayout();
    private readonly myRef: React.RefObject<NativeScriptTabViewItem> = React.createRef<NativeScriptTabViewItem>();

    // componentDidMount(){
    //     console.log(`[TabViewItem ${this.props.identifier}] componentDidMount!`);
    // }

    // shouldComponentUpdate(nextProps: Props, nextState: {}): boolean {
    //     console.log(`[TabViewItem ${this.props.identifier}] shouldComponentUpdate!`);
    //     return true;
    // }

    // componentWillUnmount(){
    //     console.log(`[TabViewItem ${this.props.identifier}] componentWillUnmount!`);
    // }

    render(){
        const {
            children,
            identifier,
            // view, /* We disallow this at the typings level. */
            ...rest
        } = this.props;

        if(Array.isArray(children) || typeof children === "string" || typeof children === "number"){
            throw new Error(`'children' property passed into TabViewItem must be a single child node, which must not be a number or string`);
        }

        return React.createElement(
            'tabViewItem',
            {
                ...rest,
                view: this.container,
                ref: this.myRef
            },
            ReactNativeScript.createPortal(
                children,
                this.container,
                identifier
            )
        );
    }
    
}