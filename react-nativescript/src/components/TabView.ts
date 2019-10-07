import * as console from "../shared/Logger";
import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { TabViewProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { TabViewItem } from "./TabViewItem";
import {
    TabView as NativeScriptTabView,
    TabViewItem as NativeScriptTabViewItem,
    SelectedIndexChangedEventData,
} from "tns-core-modules/ui/tab-view/tab-view";
import { StackLayout, Color, Label } from "../client/ElementRegistry";
import { ViewComponentProps, RCTView } from "./View";
import { updateListener } from "../client/EventHandling";

interface Props {
    // items: NativeScriptTabViewItem[],
    onSelectedIndexChange?(args: SelectedIndexChangedEventData): void;
}

// export type TabViewComponentProps = Props & Partial<TabViewProps>;
export type TabViewComponentProps<
    E extends NativeScriptTabView = NativeScriptTabView
> = Props /* & typeof TabView.defaultProps */ & Partial<TabViewProps> & ViewComponentProps<E>;

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
export class _TabView<P extends TabViewComponentProps<E>, S extends {}, E extends NativeScriptTabView> extends RCTView<
    P,
    S,
    E
> {
    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(
                node,
                "selectedIndexChange",
                this.props.onSelectedIndexChange,
                nextProps.onSelectedIndexChange
            );
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onSelectedIndexChange) method("selectedIndexChange", this.props.onSelectedIndexChange);
        }
    }

    render() {
        const {
            forwardedRef,
    
            onSelectedIndexChange,

            onLoaded,
            onUnloaded,
            onAndroidBackPressed,
            onShowingModally,
            onShownModally,

            onTap,
            onDoubleTap,
            onPinch,
            onPan,
            onSwipe,
            onRotation,
            onLongPress,
            onTouch,

            onPropertyChange,

            children,

            items,
            ...rest
        } = this.props;

        return React.createElement(
            "tabView",
            {
                ...rest,
                // items: [],
                ref: forwardedRef || this.myRef,
            },
            /* For now, any TabViewItem children will be mapped to items by our React renderer. */
            ...children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<TabViewComponentProps<NativeScriptTabView>>;

export const TabView: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptTabView>
> = React.forwardRef<NativeScriptTabView, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptTabView>) => {
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
);
