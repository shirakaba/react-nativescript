import * as console from "../shared/Logger";
import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { ActionItemProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { StackLayout } from "../client/ElementRegistry";
import { ActionItem as NativeScriptActionItem } from "tns-core-modules/ui/action-bar/action-bar";
import { ViewBaseComponentProps, RCTViewBase } from "./ViewBase";

interface Props {
    iosPosition?: "left"|"right",
    iosSystemIcon?: number,
}

export type ActionItemComponentProps<
    E extends NativeScriptActionItem = NativeScriptActionItem
> = Props /* & typeof RCTActionItem.defaultProps */ & Partial<ActionItemProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript ActionItem component.
 *
 * Renders the child passed into it into a StackLayout, via a React Portal.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _ActionItem<
    P extends ActionItemComponentProps<E>,
    S extends {},
    E extends NativeScriptActionItem
> extends RCTViewBase<P, S, E> {
    render() {
        const {
            forwardedRef,

            onPropertyChange,

            iosPosition,
            iosSystemIcon,

            children,
            // actionView, /* We disallow this at the typings level. */
            ...rest
        } = this.props;

        // let portal: React.ReactPortal|null = null;
        // if(children){
        //     this.container = this.container || new StackLayout();
        //     portal = ReactNativeScript.createPortal(children, this.container, `Portal(ActionItem(${this.container._domId}))`);
        // }

        const ios: any = {};
        if(iosPosition){
            ios.position = iosPosition;
        }
        if(iosSystemIcon){
            ios.systemIcon = iosSystemIcon;
        }

        return React.createElement(
            "actionItem",
            {
                ...rest,
                ios,
                // ...(this.container ? { actionView: this.container } : {}),
                ref: forwardedRef || this.myRef,
            },
            // portal,
            children,
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ActionItemComponentProps<NativeScriptActionItem>>;

export const ActionItem: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptActionItem>
> = React.forwardRef<NativeScriptActionItem, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptActionItem>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _ActionItem,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
