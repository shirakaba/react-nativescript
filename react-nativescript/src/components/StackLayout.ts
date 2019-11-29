import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { StackLayout as NativeScriptStackLayout } from "@nativescript/core";
import { StackLayoutProps } from "../shared/NativeScriptComponentTypings";
import { LayoutBaseComponentProps, LayoutBaseOmittedPropNames, useLayoutBaseInheritance } from "./LayoutBase";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface StackLayoutAuxProps {
}
export type StackLayoutOmittedPropNames = LayoutBaseOmittedPropNames;
export type StackLayoutComponentProps = StackLayoutAuxProps & Partial<StackLayoutProps> & LayoutBaseComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useStackLayoutInheritance<
    P extends StackLayoutComponentProps,
    E extends NativeScriptStackLayout = NativeScriptStackLayout
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, StackLayoutOmittedPropNames>
{
    const intrinsicProps = useLayoutBaseInheritance(ref, props);
    // StackLayout has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, StackLayoutOmittedPropNames>;
}

export function _StackLayout(props: React.PropsWithChildren<StackLayoutComponentProps>, ref?: React.RefObject<NativeScriptStackLayout>)
{
    ref = ref || createRef<NativeScriptStackLayout>();
    const { children, ...intrinsicProps } = useStackLayoutInheritance(ref, props);

    return React.createElement(
        "stackLayout",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const StackLayout = React.forwardRef<NativeScriptStackLayout, React.PropsWithChildren<StackLayoutComponentProps>>(_StackLayout);