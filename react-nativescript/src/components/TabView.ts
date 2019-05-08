import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { TabViewProps } from "../shared/NativeScriptComponentTypings";
import { TabViewItem } from "./TabViewItem";
import { TabView as NativeScriptTabView, TabViewItem as NativeScriptTabViewItem } from "tns-core-modules/ui/tab-view/tab-view";
import { StackLayout, Color, Label } from "../client/ElementRegistry";
import { ViewComponentProps, RCTView } from "./View";

interface Props {
    // items: NativeScriptTabViewItem[],
}

// export type TabViewComponentProps = Props & Partial<TabViewProps>;
export type TabViewComponentProps<E extends NativeScriptTabView = NativeScriptTabView> = Props /* & typeof TabView.defaultProps */ & Partial<TabViewProps> & ViewComponentProps<E>;

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
export class _TabView<P extends TabViewComponentProps<E>, S extends {}, E extends NativeScriptTabView> extends RCTView<P, S, E> {
    render(){
        const { children, forwardedRef, items, ...rest } = this.props;

        return React.createElement(
            'tabView',
            {
                ...rest,
                // items: [],
                ref: forwardedRef || this.myRef
            },
            /* For now, any TabViewItem children will be mapped to items by our React renderer. */
            ...children
        );
    }
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type PropsWithoutForwardedRef = Omit<TabViewComponentProps<NativeScriptTabView>, "forwardedRef">;

export const TabView: React.ComponentType<PropsWithoutForwardedRef & React.ClassAttributes<NativeScriptTabView>> = React.forwardRef<NativeScriptTabView, PropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<PropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptTabView>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _TabView,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)