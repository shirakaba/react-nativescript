// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { ListViewProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";
import { NavigatedData, ListView as NativeScriptListView, ItemEventData, StackLayout } from "@nativescript/core";

export type CellViewContainer = StackLayout;
type CellFactory = (item: any, ref: React.RefObject<any>) => React.ReactElement;

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface ListViewAuxProps {
    items: ListViewProps["items"];
    /* User may specify cellFactory for single-template or cellFactories for multi-template. */
    cellFactory?: CellFactory;
    cellFactories?: Map<string, { placeholderItem: any; cellFactory: CellFactory }>;
    /* For now, we don't support custom onItemLoading event handlers. */
    // onItemLoading?: (args: ItemEventData) => void,
    onItemTap?: (args: ItemEventData) => void;
    /**
     * The event will be raised when the ListView is scrolled so that the last item is visible.
     * This event is intended to be used to add additional data in the ListView.
     */
    onLoadMoreItems?: (args: ItemEventData) => void;
    _debug?: {
        logLevel: "debug" | "info";
        onCellFirstLoad?: (container: CellViewContainer) => void;
        onCellRecycle?: (container: CellViewContainer) => void;
    };

}
export type ListViewOmittedPropNames = keyof ListViewAuxProps | ViewOmittedPropNames;

export type ListViewNavigationEventHandler = (args: NavigatedData) => void;

export type ListViewComponentProps = ListViewAuxProps & Partial<ListViewProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useListViewEvents<
    P extends ListViewComponentProps,
    E extends NativeScriptListView = NativeScriptListView
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, NativeScriptListView.itemTapEvent, props.onItemTap);
    useEventListener(ref, NativeScriptListView.loadMoreItemsEvent, props.onLoadMoreItems);
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
export function useListViewInheritance<
    P extends ListViewComponentProps,
    E extends NativeScriptListView = NativeScriptListView
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ListViewOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    useListViewEvents(ref, intrinsicProps);

    const {
        onItemTap,
        onLoadMoreItems,
        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, ListViewOmittedPropNames>;
}

/**
 * A React wrapper around the NativeScript ListView component.
 * See: ui/ListView/ListView
 */
export function _ListView(props: React.PropsWithChildren<ListViewComponentProps>, ref?: React.RefObject<NativeScriptListView>)
{
    // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    ref = ref || createRef<NativeScriptListView>();

    const { children, ...intrinsicProps } = useListViewInheritance(ref, props);

    return React.createElement(
        "listView",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const ListView = React.forwardRef<NativeScriptListView, React.PropsWithChildren<ListViewComponentProps>>(_ListView);
