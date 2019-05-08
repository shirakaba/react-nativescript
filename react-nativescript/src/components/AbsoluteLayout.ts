import * as React from "react";
import { AbsoluteLayoutProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { AbsoluteLayout as NativeScriptAbsoluteLayout } from "tns-core-modules/ui/layouts/absolute-layout/absolute-layout";
import { LayoutBaseComponentProps, RCTLayoutBase } from "./LayoutBase";

interface Props {
    /* orientation defaults to "horizontal", so is not mandatory.
     * itemWidth and itemHeight default to Number.NaN, so are also optional.
     * Unlike other layouts, constituent views require no properties. */
}

export type AbsoluteLayoutComponentProps<E extends NativeScriptAbsoluteLayout = NativeScriptAbsoluteLayout> = Props /* & typeof RCTAbsoluteLayout.defaultProps */ & Partial<AbsoluteLayoutProps> & LayoutBaseComponentProps<E>;

/**
 * A React Absoluteper around the NativeScript AbsoluteLayout component.
 * See: ui/layouts/absolute-layout
 */
export class _AbsoluteLayout<P extends AbsoluteLayoutComponentProps<E>, S extends {}, E extends NativeScriptAbsoluteLayout> extends RCTLayoutBase<P, S, E> {
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
            'absoluteLayout',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<AbsoluteLayoutComponentProps<NativeScriptAbsoluteLayout>>;

export const AbsoluteLayout: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptAbsoluteLayout>> = React.forwardRef<NativeScriptAbsoluteLayout, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptAbsoluteLayout>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _AbsoluteLayout,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)