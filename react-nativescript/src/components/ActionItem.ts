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
    protected readonly container = new StackLayout();

    componentDidMount() {
        super.componentDidMount();

        const node: E | null = this.getCurrentRef();
        if (!node) {
            console.warn(`React ref to NativeScript View lost.`);
            return;
        }
        // if(typeof this.props.iosPosition !== "undefined"){
        //     node.ios.position = this.props.iosPosition;
        // }
        // if(typeof this.props.iosSystemIcon !== "undefined"){
        //     node.ios.systemIcon = this.props.iosSystemIcon;
        // }
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        const node: E | null = this.getCurrentRef();
        if (!node) {
            console.warn(`React ref to NativeScript View lost.`);
            return;
        }
    }

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

        if (Array.isArray(children) || typeof children === "string" || typeof children === "number") {
            throw new Error(
                `'children' property passed into ActionItem must be a single child node, which must not be a number or string`
            );
        }

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
                // TODO: assess whether this is the correct approach; just skim-reading TabViewItem, really.
                actionView: this.container,
                ref: forwardedRef || this.myRef,
            },
            ReactNativeScript.createPortal(children, this.container, `Portal(ActionItem(${this.container._domId}))`)
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
