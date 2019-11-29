import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { GridLayout as NativeScriptGridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { GridLayoutProps } from "../shared/NativeScriptComponentTypings";
import { LayoutBaseComponentProps, LayoutBaseOmittedPropNames, useLayoutBaseInheritance } from "./LayoutBase";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface GridLayoutAuxProps {
    rows?: ItemSpec[];
    columns?: ItemSpec[];
}
export type GridLayoutOmittedPropNames = LayoutBaseOmittedPropNames;
export type GridLayoutComponentProps = GridLayoutAuxProps & Partial<GridLayoutProps> & LayoutBaseComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useGridLayoutInheritance<
    P extends GridLayoutComponentProps,
    E extends NativeScriptGridLayout = NativeScriptGridLayout
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, GridLayoutOmittedPropNames>
{
    const intrinsicProps = useLayoutBaseInheritance(ref, props);
    // GridLayout has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, GridLayoutOmittedPropNames>;
}

export function _GridLayout(props: React.PropsWithChildren<GridLayoutComponentProps>, ref?: React.RefObject<NativeScriptGridLayout>)
{
    ref = ref || createRef<NativeScriptGridLayout>();
    const { children, ...intrinsicProps } = useGridLayoutInheritance(ref, props);

    return React.createElement(
        "gridLayout",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const GridLayout = React.forwardRef<NativeScriptGridLayout, React.PropsWithChildren<GridLayoutComponentProps>>(_GridLayout);