// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { ScrollViewProps } from "../shared/NativeScriptComponentTypings";
import { _ContentView, ContentViewComponentProps, useContentViewInheritance, ContentViewOmittedPropNames } from "./ContentView";
import { useEventListener } from "../client/EventHandling";
import { ScrollEventData, NavigatedData, ScrollView as NativeScriptScrollView } from "@nativescript/core";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface ScrollViewAuxProps {
    onScroll?: (args: ScrollEventData) => void;
}
export type ScrollViewOmittedPropNames = keyof ScrollViewAuxProps | ContentViewOmittedPropNames;

export type ScrollViewNavigationEventHandler = (args: NavigatedData) => void;

export type ScrollViewComponentProps = ScrollViewAuxProps & Partial<ScrollViewProps> & ContentViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useScrollViewEvents<
    P extends ScrollViewComponentProps,
    E extends NativeScriptScrollView = NativeScriptScrollView
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "scroll", props.onScroll);
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
export function useScrollViewInheritance<
    P extends ScrollViewComponentProps,
    E extends NativeScriptScrollView = NativeScriptScrollView
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ScrollViewOmittedPropNames>
{
    const intrinsicProps = useContentViewInheritance(ref, props);
    useScrollViewEvents(ref, intrinsicProps);

    const {
        onScroll,
        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, ScrollViewOmittedPropNames>;
}

/**
 * A React wrapper around the NativeScript ScrollView component.
 * See: ui/ScrollView/ScrollView
 */
export function _ScrollView(props: React.PropsWithChildren<ScrollViewComponentProps>, ref?: React.RefObject<NativeScriptScrollView>)
{
    // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    ref = ref || createRef<NativeScriptScrollView>();

    const { children, ...intrinsicProps } = useScrollViewInheritance(ref, props);

    return React.createElement(
        "scrollView",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const ScrollView = React.forwardRef<NativeScriptScrollView, React.PropsWithChildren<ScrollViewComponentProps>>(_ScrollView);
