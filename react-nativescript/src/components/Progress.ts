// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { ProgressProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { Progress as NativeScriptProgress, ItemsSource } from "@nativescript/core";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface ProgressAuxProps {
}
export type ProgressOmittedPropNames = ViewOmittedPropNames;
export type ProgressComponentProps = ProgressAuxProps & Partial<ProgressProps> & ViewComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useProgressInheritance<
    P extends ProgressComponentProps,
    E extends NativeScriptProgress = NativeScriptProgress
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ProgressOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    // no events

    return intrinsicProps as Omit<P, ProgressOmittedPropNames>;
}

export function _Progress(props: React.PropsWithChildren<ProgressComponentProps>, ref?: React.RefObject<NativeScriptProgress>)
{
    ref = ref || createRef<NativeScriptProgress>();
    const { children, ...intrinsicProps } = useProgressInheritance(ref, props);

    return React.createElement(
        "progress",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const Progress = React.forwardRef<NativeScriptProgress, React.PropsWithChildren<ProgressComponentProps>>(_Progress);
