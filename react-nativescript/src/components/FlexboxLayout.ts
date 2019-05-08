import * as React from "react";
import { FlexboxLayout as NativeScriptFlexboxLayout } from "tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout";
import { FlexboxLayoutProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { LayoutBaseComponentProps, RCTLayoutBase } from "./LayoutBase";

interface Props {
    // No mandatory props.
}

export type FlexboxLayoutComponentProps<E extends NativeScriptFlexboxLayout = NativeScriptFlexboxLayout> = Props /* & typeof RCTFlexboxLayout.defaultProps */ & Partial<FlexboxLayoutProps> & LayoutBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript FlexboxLayout component.
 * See: ui/layouts/flexbox-layout
 */
export class _FlexboxLayout<P extends FlexboxLayoutComponentProps<E>, S extends {}, E extends NativeScriptFlexboxLayout> extends RCTLayoutBase<P, S, E> {
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
            'flexboxLayout',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<FlexboxLayoutComponentProps<NativeScriptFlexboxLayout>>;

export const FlexboxLayout: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptFlexboxLayout>> = React.forwardRef<NativeScriptFlexboxLayout, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptFlexboxLayout>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _FlexboxLayout,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)