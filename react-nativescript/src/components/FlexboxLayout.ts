import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { FlexboxLayout as NativeScriptFlexboxLayout } from "@nativescript/core";
import { FlexboxLayoutProps } from "../shared/NativeScriptComponentTypings";
import { LayoutBaseComponentProps, LayoutBaseOmittedPropNames, useLayoutBaseInheritance } from "./LayoutBase";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface FlexboxLayoutAuxProps {
}
export type FlexboxLayoutOmittedPropNames = LayoutBaseOmittedPropNames;
export type FlexboxLayoutComponentProps = FlexboxLayoutAuxProps & Partial<FlexboxLayoutProps> & LayoutBaseComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useFlexboxLayoutInheritance<
    P extends FlexboxLayoutComponentProps,
    E extends NativeScriptFlexboxLayout = NativeScriptFlexboxLayout
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, FlexboxLayoutOmittedPropNames>
{
    const intrinsicProps = useLayoutBaseInheritance(ref, props);
    // FlexboxLayout has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, FlexboxLayoutOmittedPropNames>;
}

export function _FlexboxLayout(props: React.PropsWithChildren<FlexboxLayoutComponentProps>, ref?: React.RefObject<NativeScriptFlexboxLayout>)
{
    ref = ref || createRef<NativeScriptFlexboxLayout>();
    const { children, ...intrinsicProps } = useFlexboxLayoutInheritance(ref, props);

    return React.createElement(
        "flexboxLayout",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const FlexboxLayout = React.forwardRef<NativeScriptFlexboxLayout, React.PropsWithChildren<FlexboxLayoutComponentProps>>(_FlexboxLayout);