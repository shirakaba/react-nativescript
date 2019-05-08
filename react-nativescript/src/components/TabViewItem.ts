import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { TabViewItemProps, ViewBaseProps } from "../shared/NativeScriptComponentTypings";
import { View, ViewBase, StackLayout, Color, ContentView, Label } from "../client/ElementRegistry";
import { TabView as NativeScriptTabView, TabViewItem as NativeScriptTabViewItem } from "tns-core-modules/ui/tab-view/tab-view";
import { ViewBaseComponentProps, RCTViewBase } from "./ViewBase";

interface Props {
    identifier: string,

    // view: View
}

export type TabViewItemComponentProps<E extends NativeScriptTabViewItem = NativeScriptTabViewItem> = Props /* & typeof RCTTabViewItem.defaultProps */ & Partial<ViewBaseProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript TabViewItem component.
 * 
 * Renders the child passed into it into a StackLayout, via a React Portal.
 * 
 * See: ui/tab-view/tab-view
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/tab-view/code-behind/code-behind-ts-page.ts
 */
export class _TabViewItem<P extends TabViewItemComponentProps<E>, S extends {}, E extends NativeScriptTabViewItem> extends RCTViewBase<P, S, E> {
// export class TabViewItem extends React.Component<TabViewItemComponentProps, {}> {
    private readonly container = new StackLayout();

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
            forwardedRef,
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
                ref: forwardedRef || this.myRef
            },
            ReactNativeScript.createPortal(
                children,
                this.container,
                identifier
            )
        );
    }   
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type PropsWithoutForwardedRef = Omit<TabViewItemComponentProps<NativeScriptTabViewItem>, "forwardedRef">;

export const TabViewItem: React.ComponentType<PropsWithoutForwardedRef & React.ClassAttributes<NativeScriptTabViewItem>> = React.forwardRef<NativeScriptTabViewItem, PropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<PropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptTabViewItem>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _TabViewItem,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)