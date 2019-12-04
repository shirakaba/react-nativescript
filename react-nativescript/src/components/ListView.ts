// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef, useState, useRef, useEffect, useCallback } from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { ListViewProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";
import { NavigatedData, ListView as NativeScriptListView, ItemEventData, StackLayout, View, ItemsSource, KeyedTemplate, ViewBase } from "@nativescript/core";

export type CellViewContainer = View;
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

type NumberKey = number | string;
type RootKeyAndRef = { rootKey: string; ref: React.RefObject<View> };

interface State {
    // nativeCells: Record<NumberKey, CellViewContainer>;
    /* Native cells may be rotated e.g. what once displayed items[0] may now need to display items[38] */
    // nativeCellToItemIndex: Map<CellViewContainer, NumberKey>;
    // itemIndexToNativeCell?: Map<NumberKey, CellViewContainer>;
}

export function isItemsSource(arr: any[] | ItemsSource): arr is ItemsSource {
    // Same implementation as: https://github.com/NativeScript/NativeScript/blob/b436ecde3605b695a0ffa1757e38cc094e2fe311/tns-core-modules/ui/list-picker/list-picker-common.ts#L74
    return typeof (arr as ItemsSource).getItem === "function";
}

function renderNewRoot(
    item: any,
    cellFactory: CellFactory,
    node: NativeScriptListView | null,
    roots: Set<string> | null,
): RootKeyAndRef {
    if (!node) {
        throw new Error("Unable to get ref to ListView");
    }

    if (!roots) {
        throw new Error("Unable to get ref to roots");
    }

    const cellRef: React.RefObject<any> = React.createRef<any>();
    const rootKey: string = `ListView-${node._domId}-${roots.size.toString()}`;

    ReactNativeScript.render(
        cellFactory(item, cellRef),
        null,
        () => {
            // console.log(`Rendered into cell! ref:`);
        },
        rootKey
    );
    roots.add(rootKey);

    return {
        rootKey,
        ref: cellRef,
    };
};

/**
 * A React wrapper around the NativeScript ListView component.
 * See: ui/ListView/ListView
 */
export function _ListView(
    props: React.PropsWithChildren<ListViewComponentProps> = { _debug: { logLevel: "info" }, items: [] },
    ref?: React.RefObject<NativeScriptListView>)
{
    // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
    const argsViewToRootKeyAndRefRef = useRef<Map<View, RootKeyAndRef>>();
    useEffect(() => {
        argsViewToRootKeyAndRefRef.current = new Map();
        return () => {
            if(argsViewToRootKeyAndRefRef.current){
                argsViewToRootKeyAndRefRef.current!.clear();
            }
        };
    }, []);
    const rootsRef = useRef<Set<string>>();
    useEffect(() => {
        rootsRef.current = new Set();
        return () => {
            if(rootsRef.current){
                rootsRef.current.forEach(root => ReactNativeScript.unmountComponentAtNode(root));
            }
        };
    }, []);

    /* Not using these in practice now, but may re-introduce them if ever needing to do library debugging. */
    // const [nativeCells, setNativeCells] = useState({});
    // const [nativeCellToItemIndex, setNativeCellToItemIndex] = useState(new Map());
    // const [itemIndexToNativeCell, setItemIndexToNativeCell] = useState(props._debug && props._debug.logLevel === "debug" ? new Map() : void 0);

    // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    ref = ref || createRef<NativeScriptListView>();

    useEffect(
        () => {
            if (props.cellFactories && ref.current) {
                const itemTemplates: KeyedTemplate[] = [];
                const argsViewToRootKeyAndRef = argsViewToRootKeyAndRefRef.current;
                props.cellFactories.forEach((info, key: string) => {
                    const { placeholderItem, cellFactory } = info;
                    itemTemplates.push({
                        key,
                        createView: () => {
                            console.log(`[ListView] item template "${key}" - creating initial view.`);
                            const rootKeyAndRef: RootKeyAndRef = renderNewRoot(
                                placeholderItem,
                                cellFactory,
                                ref.current,
                                rootsRef.current
                            );
                            console.log(`[ListView] item template "${key}" - created initial view. ${rootKeyAndRef.rootKey} : ${rootKeyAndRef.ref.current}`);
                            argsViewToRootKeyAndRef.set(rootKeyAndRef.ref.current, rootKeyAndRef);

                            return rootKeyAndRef.ref.current;
                        },
                    });
                });
                ref.current.itemTemplates = itemTemplates;
            }
            return () => {
                if(ref.current){
                    ref.current.itemTemplates = [];
                }
            };
        },
        [
            props.cellFactories,
            ref.current,
            argsViewToRootKeyAndRefRef.current,
            rootsRef.current,
        ]
    );

    const onItemLoading: (args: ItemEventData) => void = useCallback(
        (args: ItemEventData) => {
            const { logLevel, onCellRecycle, onCellFirstLoad } = props._debug;
            const { items, itemTemplateSelector } = props;
            const item: any = isItemsSource(items) ? items.getItem(args.index) : items[args.index];
            const template: string | null = itemTemplateSelector
                ? typeof itemTemplateSelector === "string"
                    ? itemTemplateSelector
                    : (itemTemplateSelector as ((item: any, index: number, items: any) => string))(item, args.index, items)
                : null;
            const cellFactory: CellFactory | undefined =
                template === null
                    ? props.cellFactory
                    : props.cellFactories
                    ? props.cellFactories.get(template).cellFactory
                    : props.cellFactory;

            if (typeof cellFactory === "undefined") {
                console.warn(`ListView: No cell factory found, given template ${template}!`);
                return;
            }

            let view: View | undefined = args.view;
            if (!view) {
                console.log(`[ListView] no existing view, so creating initial view.`);
                const rootKeyAndRef: RootKeyAndRef = renderNewRoot(
                    item,
                    cellFactory,
                    ref.current,
                    rootsRef.current
                );

                args.view = rootKeyAndRef.ref.current;

                /* Here we're re-using the ref - I assume this is best practice. If not, we can make a new one on each update instead. */
                argsViewToRootKeyAndRefRef.current!.set(args.view, rootKeyAndRef);

                if (onCellFirstLoad) onCellFirstLoad(rootKeyAndRef.ref.current);
            } else {
                console.log(`[ListView] existing view: `, view);
                if (onCellRecycle) onCellRecycle(view as CellViewContainer);

                const { rootKey, ref } = argsViewToRootKeyAndRefRef.current!.get(view);
                if (typeof rootKey === "undefined") {
                    console.error(`Unable to find root key that args.view corresponds to!`, view);
                    return;
                }
                if (typeof ref === "undefined") {
                    console.error(`Unable to find ref that args.view corresponds to!`, view);
                    return;
                }

                // args.view = null;
                ReactNativeScript.render(
                    cellFactory(item, ref),
                    null,
                    () => {
                        // console.log(`Rendered into cell! detachedRootRef:`);
                    },
                    rootKey
                );
            }
        },
        [
            props._debug.logLevel,
            props._debug.onCellFirstLoad,
            props._debug.onCellRecycle,
            props.items,
            props.itemTemplateSelector,
            props.cellFactory,
            props.cellFactories,
            ref.current,
            rootsRef.current,
            argsViewToRootKeyAndRefRef.current,
        ]
    );

    useEventListener(ref, NativeScriptListView.itemLoadingEvent, onItemLoading);

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
