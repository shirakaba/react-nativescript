import * as console from "../shared/Logger";
import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { NavigationButtonProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ActionItem, StackLayout } from "../client/ElementRegistry";
import { NavigationButton as NativeScriptNavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import { ActionItemComponentProps, _ActionItem } from "./ActionItem";

interface Props {}

export type NavigationButtonComponentProps<
    E extends NativeScriptNavigationButton = NativeScriptNavigationButton
> = Props /* & typeof RCTNavigationButton.defaultProps */ &
    Partial<NavigationButtonProps> &
    ActionItemComponentProps<E>;

/**
 * A React wrapper around the NativeScript NavigationButton component.
 *
 * Renders the child passed into it into a StackLayout, via a React Portal.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#navigation-button
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/action-bar/code-behind/code-behind-ts-page.ts
 */
export class _NavigationButton<
    P extends NavigationButtonComponentProps<E>,
    S extends {},
    E extends NativeScriptNavigationButton
> extends _ActionItem<P, S, E> {
    render() {
        const {
            forwardedRef,

            onPropertyChange,

            /* Neither of these are applicable for NavigationButton */
            iosPosition,
            iosSystemIcon,

            children,
            // actionView, /* We disallow this at the typings level. */
            ...rest
        } = this.props;

        // let portal: React.ReactPortal|null = null;
        // if(children){
        //     this.container = this.container || new StackLayout();
        //     portal = ReactNativeScript.createPortal(children, this.container, `Portal(NavigationButton(${this.container._domId}))`);
        // }

        return React.createElement(
            "navigationButton",
            {
                ...rest,
                ios: {},
                // ...(this.container ? { actionView: this.container } : {}),
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<
    NavigationButtonComponentProps<NativeScriptNavigationButton>
>;

export const NavigationButton: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptNavigationButton>
> = React.forwardRef<NativeScriptNavigationButton, OwnPropsWithoutForwardedRef>(
    (
        props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>,
        ref: React.RefObject<NativeScriptNavigationButton>
    ) => {
        const { children, ...rest } = props;

        return React.createElement(
            _NavigationButton,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
