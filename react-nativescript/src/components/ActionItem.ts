import * as console from "../shared/Logger";
import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { ActionItemProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { StackLayout } from "../client/ElementRegistry";
import { ActionItem as NativeScriptActionItem } from "tns-core-modules/ui/action-bar/action-bar";
import { ViewBaseComponentProps, RCTViewBase } from "./ViewBase";
import { updateListener } from "../client/EventHandling";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";

interface Props {
    onTap?: (args: GestureEventData) => void;
}

export type ActionItemComponentProps<
    E extends NativeScriptActionItem = NativeScriptActionItem
> = Props /* & typeof RCTActionItem.defaultProps */ & Partial<ActionItemProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript ActionItem component.
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

    /**
     *
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, "tap", this.props.onTap, nextProps.onTap);
        } else {
            const method = (attach ? node.on : node.off).bind(node);
            if (this.props.onTap) method("tap", this.props.onTap);
        }
    }

    render() {
        const {
            forwardedRef,

            onPropertyChange,

            children,
            // actionView, /* We disallow this at the typings level. */
            ...rest
        } = this.props;

        return React.createElement(
            "actionItem",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
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
