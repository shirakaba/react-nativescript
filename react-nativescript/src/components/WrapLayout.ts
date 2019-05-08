import * as React from "react";
import { WrapLayoutProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { WrapLayout as NativeScriptWrapLayout } from "tns-core-modules/ui/layouts/wrap-layout/wrap-layout";
import { LayoutBaseComponentProps, RCTLayoutBase } from "./LayoutBase";

interface Props {
    /* orientation defaults to "horizontal", so is not mandatory.
     * itemWidth and itemHeight default to Number.NaN, so are also optional.
     * Unlike other layouts, constituent views require no properties. */
}

export type WrapLayoutComponentProps<E extends NativeScriptWrapLayout = NativeScriptWrapLayout> = Props /* & typeof RCTWrapLayout.defaultProps */ & Partial<WrapLayoutProps> & LayoutBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript WrapLayout component.
 * See: ui/layouts/wrap-layout
 */
export class _WrapLayout<P extends WrapLayoutComponentProps<E>, S extends {}, E extends NativeScriptWrapLayout> extends RCTLayoutBase<P, S, E> {
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
            'wrapLayout',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<WrapLayoutComponentProps<NativeScriptWrapLayout>>;

export const WrapLayout: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptWrapLayout>> = React.forwardRef<NativeScriptWrapLayout, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptWrapLayout>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _WrapLayout,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)