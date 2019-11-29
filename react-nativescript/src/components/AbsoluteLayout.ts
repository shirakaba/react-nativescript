import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { AbsoluteLayout as NativeScriptAbsoluteLayout } from "@nativescript/core";
import { AbsoluteLayoutProps } from "../shared/NativeScriptComponentTypings";
import { LayoutBaseComponentProps, LayoutBaseOmittedPropNames, useLayoutBaseInheritance } from "./LayoutBase";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface AbsoluteLayoutAuxProps {
}
export type AbsoluteLayoutOmittedPropNames = LayoutBaseOmittedPropNames;
export type AbsoluteLayoutComponentProps = AbsoluteLayoutAuxProps & Partial<AbsoluteLayoutProps> & LayoutBaseComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useAbsoluteLayoutInheritance<
    P extends AbsoluteLayoutComponentProps,
    E extends NativeScriptAbsoluteLayout = NativeScriptAbsoluteLayout
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, AbsoluteLayoutOmittedPropNames>
{
    const intrinsicProps = useLayoutBaseInheritance(ref, props);
    // AbsoluteLayout has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, AbsoluteLayoutOmittedPropNames>;
}

export function _AbsoluteLayout(props: React.PropsWithChildren<AbsoluteLayoutComponentProps>, ref?: React.RefObject<NativeScriptAbsoluteLayout>)
{
    ref = ref || createRef<NativeScriptAbsoluteLayout>();
    const { children, ...intrinsicProps } = useAbsoluteLayoutInheritance(ref, props);

    return React.createElement(
        "AbsoluteLayout",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const AbsoluteLayout = React.forwardRef<NativeScriptAbsoluteLayout, React.PropsWithChildren<AbsoluteLayoutComponentProps>>(_AbsoluteLayout);