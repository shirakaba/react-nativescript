import * as React from "react";
import { ActionBar as NativeScriptActionBar } from "tns-core-modules/ui/action-bar/action-bar";
import { ActionBarProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, RCTView } from "./View";

interface Props {
}

export type ActionBarComponentProps<E extends NativeScriptActionBar = NativeScriptActionBar> = Props /* & typeof _ActionBar.defaultProps */ & Partial<ActionBarProps> & ViewComponentProps<E>;

/**
 * Provides an abstraction over the ActionBar (android) and NavigationBar (iOS).
 */
class _ActionBar<P extends ActionBarComponentProps<E>, S extends {}, E extends NativeScriptActionBar = NativeScriptActionBar> extends RCTView<P, S, E> {
    render(){
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

        if(children){
            console.warn("Ignoring 'children' prop on ActionBar; not permitted");
        }

        return React.createElement(
            'actionBar',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            null
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ActionBarComponentProps<NativeScriptActionBar>>;

export const ActionBar: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptActionBar>> = React.forwardRef<NativeScriptActionBar, OwnPropsWithoutForwardedRef>(
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