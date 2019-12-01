// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { TabViewProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";
import { ScrollEventData, NavigatedData, TabView as NativeScriptTabView } from "@nativescript/core";
import { SelectedIndexChangedEventData } from "@nativescript/core/ui/tab-view/tab-view";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface TabViewAuxProps {
    onSelectedIndexChanged?: (args: SelectedIndexChangedEventData) => void;
}
export type TabViewOmittedPropNames = keyof TabViewAuxProps | ViewOmittedPropNames;

export type TabViewNavigationEventHandler = (args: NavigatedData) => void;

export type TabViewComponentProps = TabViewAuxProps & Partial<TabViewProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useTabViewEvents<
    P extends TabViewComponentProps,
    E extends NativeScriptTabView = NativeScriptTabView
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "selectedIndexChanged", props.onSelectedIndexChanged);
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
export function useTabViewInheritance<
    P extends TabViewComponentProps,
    E extends NativeScriptTabView = NativeScriptTabView
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, TabViewOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    useTabViewEvents(ref, intrinsicProps);

    const {
        onSelectedIndexChanged,
        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, TabViewOmittedPropNames>;
}

/**
 * A React wrapper around the NativeScript TabView component.
 * See: ui/TabView/TabView
 */
export function _TabView(props: React.PropsWithChildren<TabViewComponentProps>, ref?: React.RefObject<NativeScriptTabView>)
{
    // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    ref = ref || createRef<NativeScriptTabView>();

    const { children, ...intrinsicProps } = useTabViewInheritance(ref, props);

    return React.createElement(
        "tabView",
        {
            ...intrinsicProps,
            ref,
        },
        /* For now, any TabViewItem children will be mapped to items by our React renderer. */
        children
    );
}

export const TabView = React.forwardRef<NativeScriptTabView, React.PropsWithChildren<TabViewComponentProps>>(_TabView);
