import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { WrapLayout as NativeScriptWrapLayout } from "@nativescript/core";
import { WrapLayoutProps } from "../shared/NativeScriptComponentTypings";
import { LayoutBaseComponentProps, LayoutBaseOmittedPropNames, useLayoutBaseInheritance } from "./LayoutBase";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface WrapLayoutAuxProps {
    /* orientation defaults to "horizontal", so is not mandatory.
     * itemWidth and itemHeight default to Number.NaN, so are also optional.
     * Unlike other layouts, constituent views require no properties. */
}
export type WrapLayoutOmittedPropNames = LayoutBaseOmittedPropNames;
export type WrapLayoutComponentProps = WrapLayoutAuxProps & Partial<WrapLayoutProps> & LayoutBaseComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useWrapLayoutInheritance<
    P extends WrapLayoutComponentProps,
    E extends NativeScriptWrapLayout = NativeScriptWrapLayout
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, WrapLayoutOmittedPropNames>
{
    const intrinsicProps = useLayoutBaseInheritance(ref, props);
    // WrapLayout has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, WrapLayoutOmittedPropNames>;
}

export function _WrapLayout(props: React.PropsWithChildren<WrapLayoutComponentProps>, ref?: React.RefObject<NativeScriptWrapLayout>)
{
    ref = ref || createRef<NativeScriptWrapLayout>();
    const { children, ...intrinsicProps } = useWrapLayoutInheritance(ref, props);

    return React.createElement(
        "wrapLayout",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const WrapLayout = React.forwardRef<NativeScriptWrapLayout, React.PropsWithChildren<WrapLayoutComponentProps>>(_WrapLayout);