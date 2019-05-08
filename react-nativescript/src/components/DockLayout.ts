import * as React from "react";
import { DockLayoutProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { DockLayout as NativeScriptDockLayout } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { LayoutBaseComponentProps, RCTLayoutBase } from "./LayoutBase";

interface Props {
    // No mandatory props.
    /* Each constituent view passed in must bear a "dock" Prop. */
}

export type DockLayoutComponentProps<E extends NativeScriptDockLayout = NativeScriptDockLayout> = Props /* & typeof RCTDockLayout.defaultProps */ & Partial<DockLayoutProps> & LayoutBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript DockLayout component.
 * See: ui/layouts/dock-layout
 */
export class _DockLayout<P extends DockLayoutComponentProps<E>, S extends {}, E extends NativeScriptDockLayout> extends RCTLayoutBase<P, S, E> {
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

        return React.createElement(
            'dockLayout',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<DockLayoutComponentProps<NativeScriptDockLayout>>;

export const DockLayout: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptDockLayout>> = React.forwardRef<NativeScriptDockLayout, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptDockLayout>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _DockLayout,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)