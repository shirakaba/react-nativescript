import * as React from "react";
import { GridLayout as NativeScriptGridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { GridLayoutProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { LayoutBaseComponentProps, RCTLayoutBase } from "./LayoutBase";

interface Props {
    /* Each constituent view passed in must bear "row" and "col" Props. */
    /* rows and columns will be added in order specified. */
    rows: ItemSpec[],
    columns: ItemSpec[],
    // TODO: Should we enforce that children must only be Views?
}

export type GridLayoutComponentProps<E extends NativeScriptGridLayout = NativeScriptGridLayout> = Props /* & typeof RCTGridLayout.defaultProps */ & Partial<GridLayoutProps> & LayoutBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript GridLayout component.
 * See: ui/layouts/grid-layout
 */
export class _GridLayout<P extends GridLayoutComponentProps<E>, S extends {}, E extends NativeScriptGridLayout> extends RCTLayoutBase<P, S, E> {
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
            'gridLayout',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<GridLayoutComponentProps<NativeScriptGridLayout>>;

export const GridLayout: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptGridLayout>> = React.forwardRef<NativeScriptGridLayout, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptGridLayout>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _GridLayout,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)