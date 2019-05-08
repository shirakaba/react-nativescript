import * as React from "react";
import { StackLayoutProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { StackLayout as NativeScriptStackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { LayoutBaseComponentProps, RCTLayoutBase } from "./LayoutBase";

interface Props {
    /* orientation defaults to "vertical", so is not mandatory.
     * Unlike other layouts, constituent views require no properties. */
}

export type StackLayoutComponentProps<E extends NativeScriptStackLayout = NativeScriptStackLayout> = Props /* & typeof RCTStackLayout.defaultProps */ & Partial<StackLayoutProps> & LayoutBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript StackLayout component.
 * See: ui/layouts/grid-layout
 */
export class _StackLayout<P extends StackLayoutComponentProps<E>, S extends {}, E extends NativeScriptStackLayout> extends RCTLayoutBase<P, S, E> {
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
            'stackLayout',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<StackLayoutComponentProps<NativeScriptStackLayout>>;

export const StackLayout: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptStackLayout>> = React.forwardRef<NativeScriptStackLayout, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptStackLayout>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _StackLayout,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)