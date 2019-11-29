// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { TextBaseProps } from "../shared/NativeScriptComponentTypings";
import { TextBase as NativeScriptTextBase } from "@nativescript/core";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface TextBaseAuxProps {}
export type TextBaseOmittedPropNames = ViewOmittedPropNames;
export type TextBaseComponentProps = TextBaseAuxProps & Partial<TextBaseProps> & ViewComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useTextBaseInheritance<
    P extends TextBaseComponentProps,
    E extends NativeScriptTextBase = NativeScriptTextBase
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, TextBaseOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    // TextBase has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, TextBaseOmittedPropNames>;
}
