import * as console from "../shared/Logger";
import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { ActionBar as NativeScriptActionBar } from "tns-core-modules/ui/action-bar/action-bar";
import { ActionBarProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, RCTView } from "./View";
import { StackLayout } from "../client/ElementRegistry";

interface Props {}

export type ActionBarComponentProps<
    E extends NativeScriptActionBar = NativeScriptActionBar
> = Props /* & typeof _ActionBar.defaultProps */ & Partial<ActionBarProps> & ViewComponentProps<E>;

/**
 * Provides an abstraction over the ActionBar (android) and NavigationBar (iOS).
 */
class _ActionBar<
    P extends ActionBarComponentProps<E>,
    S extends {},
    E extends NativeScriptActionBar = NativeScriptActionBar
> extends RCTView<P, S, E> {
    private titleViewContainer: StackLayout|null = null;
    render() {
        const {
            forwardedRef,

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

            ...rest
        } = this.props;

        let portal: null|React.ReactPortal = null;

        if (children) {
            if(this.titleViewContainer === null){
                this.titleViewContainer = new StackLayout();
            }
            console.log(`[ActionBar] rendering titleView into portal`);
            portal = ReactNativeScript.createPortal(
                children,
                this.titleViewContainer,
                `Portal(ActionBar.titleView${this.titleViewContainer._domId})`
            );
        }

        return React.createElement(
            "actionBar",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            portal, // Any child that's not an ActionItem or NavigationButton will be set to titleView.
            children, // We accept ActionItem and NavigationButton as children.
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ActionBarComponentProps<NativeScriptActionBar>>;

export const ActionBar: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptActionBar>
> = React.forwardRef<NativeScriptActionBar, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptActionBar>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _ActionBar,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
