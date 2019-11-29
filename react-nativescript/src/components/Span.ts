import * as console from "../shared/Logger";
import * as React from "react";
import { SpanProps } from "../shared/NativeScriptComponentTypings";
import { Span as NativeScriptSpan } from "tns-core-modules/text/span";
import { ViewBaseComponentProps, useViewBaseInheritance, ViewBaseComponentState, ViewBaseOmittedPropNames } from "./ViewBase";
import { createRef } from "react";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface SpanAuxProps {
}
export type SpanOmittedPropNames = keyof SpanAuxProps | ViewBaseOmittedPropNames;

export type SpanComponentProps = SpanAuxProps & Partial<SpanProps> & ViewBaseComponentProps;

export type SpanComponentState = {} & ViewBaseComponentState;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useSpanInheritance<
    P extends SpanComponentProps,
    E extends NativeScriptSpan = NativeScriptSpan
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, SpanOmittedPropNames>
{
    const intrinsicProps = useViewBaseInheritance(ref, props);

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, SpanOmittedPropNames>;
}

export function _Span(props: React.PropsWithChildren<SpanComponentProps>, ref?: React.RefObject<NativeScriptSpan>)
{
    ref = ref || createRef<NativeScriptSpan>();
    const { children, ...intrinsicProps } = useSpanInheritance(ref, props);

    return React.createElement(
        "span",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const Span = React.forwardRef<NativeScriptSpan, React.PropsWithChildren<SpanComponentProps>>(_Span);
