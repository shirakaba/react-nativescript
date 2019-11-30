// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { PlaceholderProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { Placeholder as NativeScriptPlaceholder, CreateViewEventData } from "@nativescript/core";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface PlaceholderAuxProps {
    onCreatingView?(args: CreateViewEventData): void;
}
export type PlaceholderOmittedPropNames = keyof PlaceholderAuxProps | ViewOmittedPropNames;
export type PlaceholderComponentProps = PlaceholderAuxProps & Partial<PlaceholderProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function usePlaceholderEvents<
    P extends PlaceholderComponentProps,
    E extends NativeScriptPlaceholder = NativeScriptPlaceholder
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "creatingView", props.onCreatingView);
}

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function usePlaceholderInheritance<
    P extends PlaceholderComponentProps,
    E extends NativeScriptPlaceholder = NativeScriptPlaceholder
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, PlaceholderOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);

    const {
        onCreatingView,
        ...rest
    } = intrinsicProps;

    // Placeholder has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest }  as Omit<P, PlaceholderOmittedPropNames>;
}

export function _Placeholder(props: React.PropsWithChildren<PlaceholderComponentProps>, ref?: React.RefObject<NativeScriptPlaceholder>)
{
    ref = ref || createRef<NativeScriptPlaceholder>();
    const { children, ...intrinsicProps } = usePlaceholderInheritance(ref, props);

    return React.createElement(
        "placeholder",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const Placeholder = React.forwardRef<NativeScriptPlaceholder, React.PropsWithChildren<PlaceholderComponentProps>>(_Placeholder);
