// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { ActivityIndicatorProps } from "../shared/NativeScriptComponentTypings";
import { ActivityIndicator as NativeScriptActivityIndicator } from "tns-core-modules/ui/activity-indicator/activity-indicator";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface ActivityIndicatorAuxProps {}
export type ActivityIndicatorOmittedPropNames = ViewOmittedPropNames;
export type ActivityIndicatorComponentProps = ActivityIndicatorAuxProps & Partial<ActivityIndicatorProps> & ViewComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useActivityIndicatorInheritance<
    P extends ActivityIndicatorComponentProps,
    E extends NativeScriptActivityIndicator = NativeScriptActivityIndicator
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ActivityIndicatorOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    // ActivityIndicator has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, ActivityIndicatorOmittedPropNames>;
}

export function _ActivityIndicator(props: React.PropsWithChildren<ActivityIndicatorComponentProps>, ref?: React.RefObject<NativeScriptActivityIndicator>)
{
    ref = ref || createRef<NativeScriptActivityIndicator>();
    const { children, ...intrinsicProps } = useActivityIndicatorInheritance(ref, props);

    return React.createElement(
        "activityIndicator",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const ActivityIndicator = React.forwardRef<NativeScriptActivityIndicator, React.PropsWithChildren<ActivityIndicatorComponentProps>>(_ActivityIndicator);
