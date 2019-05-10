import * as React from "react";
import { ListViewProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ListView as NativeScriptListView, ItemEventData, knownTemplates, ItemsSource } from "tns-core-modules/ui/list-view/list-view";
import { View, EventData } from "tns-core-modules/ui/core/view/view";
import { updateListener } from "../client/EventHandling";
import { Label } from "tns-core-modules/ui/label/label";
import { ContentView, Observable } from "tns-core-modules/ui/page/page";
import { getInstanceFromNode } from "../client/ComponentTree";
import { ListViewCell } from "./ListViewCell";
import { ViewComponentProps, RCTView, ViewComponentState } from "./View";
import * as ReactNativeScript from "../client/ReactNativeScript"

interface Props {
    items: ListViewProps["items"],
    cellFactory: (item: any, container: CellViewContainer) => React.ReactElement,
    /* For now, we don't support custom onItemLoading event handlers. */
    // onItemLoading?: (args: ItemEventData) => void,
    onItemTap?: (args: ItemEventData) => void,
    onLoadMoreItems?: (args: EventData) => void,
}

type NumberKey = number|string;
type CellViewContainer = ContentView;

interface State {
    isItemsSource: boolean,
    nativeCells: Record<NumberKey, CellViewContainer>;
    /* Native cells may be rotated e.g. what once displayed items[0] may now need to display items[38] */
    nativeCellToItemIndex: Map<CellViewContainer, NumberKey>;
    itemIndexToNativeCell: Map<NumberKey, CellViewContainer>;
}

/**
 * A React wrapper around the NativeScript ListView component.
 * Still under construction; needs to take React components as children.
 * https://docs.nativescript.org/ui/ns-ui-widgets/list-view
 * See: ui/list-view/list-view
 */
export type ListViewComponentProps<E extends NativeScriptListView = NativeScriptListView> = Props /* & typeof ListView.defaultProps */ & Partial<ListViewProps> & ViewComponentProps<E>;

export type ListViewComponentState = State & ViewComponentState;

export class _ListView<P extends ListViewComponentProps<E>, S extends ListViewComponentState, E extends NativeScriptListView> extends RCTView<P, S, E> {
    constructor(props: P){
        super(props);

        this.state = {
            isItemsSource: _ListView.isItemsSource(props.items),
            nativeCells: {},
            nativeCellToItemIndex: new Map(),
            itemIndexToNativeCell: new Map()
        } as Readonly<S>; // No idea why I need to assert as Readonly<S> when using generics with State :(
    }

    /* TODO: refer to: https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/list-view/code-behind/code-behind-ts-page.ts */
    private readonly defaultOnItemLoading: (args: ItemEventData) => void = (args: ItemEventData) => {
        let view: View|undefined = args.view;
        if(!view){
            const contentView = new ContentView();
            contentView.backgroundColor = "orange";
            args.view = contentView;

            console.log(`'onItemLoading': <empty> -> ${args.index}`);

            if(this.state.itemIndexToNativeCell.has(args.index)){
                console.warn(`WARNING: list index already registered yet args.view was falsy!`);
            }

            this.setState((prev: State) => {
                const nativeCellToItemIndex = new Map(prev.nativeCellToItemIndex);
                nativeCellToItemIndex.set(contentView, args.index);

                const itemIndexToNativeCell = new Map(prev.itemIndexToNativeCell);
                itemIndexToNativeCell.set(args.index, contentView);

                return {
                    ...prev,
                    nativeCells: {
                        ...prev.nativeCells,
                        [args.index]: contentView
                    },
                    nativeCellToItemIndex,
                    itemIndexToNativeCell
                };
            }, () => {
                console.log(`setState() completed for <empty> -> ${args.index}`);
            });
        } else {
            args.view.backgroundColor = "blue";
            // const filledIndices: string[] = Object.keys(this.state.nativeCells);
            // const sparseIndex: number|-1 = filledIndices.findIndex((index: string) => {
            //     return view === this.state.nativeCells[index];
            // });
            // const filledIndex: string|null = sparseIndex === -1 ? null : filledIndices[sparseIndex];
            // if(filledIndex === null){
            //     console.log(`Unable to find 'nativeCell' that args.view corresponds to!`, view);
            //     return;
            // }

            const itemIndexOfArgsView: NumberKey|undefined = this.state.nativeCellToItemIndex.get(view as ContentView);

            if(typeof itemIndexOfArgsView === "undefined"){
                console.warn(`Unable to find 'nativeCell' that args.view corresponds to!`, view);
                return;
            }

            // TODO: find using nativeCellToItemIndex rather than findIndex(); complexity goes from O(N) -> O(1).

            // setState() completed for <empty> -> 37
            // 'onItemLoading': 0 -> 38
            
            console.log(`'onItemLoading'! ${view} ${itemIndexOfArgsView} -> ${args.index}`);

            /* TODO: Not sure whether it's a no-op in truth. Have to re-examine. */
            // if(parseInt(itemIndexOfArgsView) === args.index){
            //     console.log(`Filled index matched args.index, so treating as no-op...`);
            //     return;
            // }

            // nativeCells[0] now needs to display props.items[38]

            this.setState((prev: State) => {
                const nativeCellToItemIndex = new Map(prev.nativeCellToItemIndex);
                const itemIndexToNativeCell = new Map(prev.itemIndexToNativeCell);

                // 'onItemLoading': 6 -> 5 (where 5 is already occupied by an incumbent view) may happen.
                const incumbentView: ContentView|undefined = itemIndexToNativeCell.get(args.index);
                if(incumbentView){
                    /* itemIndexToNativeCell will only show the latest native cell rendering each args.index */
                    itemIndexToNativeCell.delete(args.index);
                    /* nativeCellToItemIndex is permitted to have multiple views rendering the same args.index */
                    // nativeCellToItemIndex.delete(incumbentView as ContentView);
                }
                // nativeCellToItemIndex.delete(view as ContentView); /* redundant */
                nativeCellToItemIndex.set(view as ContentView, args.index);
                console.log(`PREV nativeCellToItemIndex:`, _ListView.serialiseNativeCellToItemIndex(prev.nativeCellToItemIndex));
                console.log(`INCOMING nativeCellToItemIndex:`, _ListView.serialiseNativeCellToItemIndex(nativeCellToItemIndex));

                itemIndexToNativeCell.delete(itemIndexOfArgsView);
                itemIndexToNativeCell.set(args.index, view as ContentView);

                console.log(`PREV itemIndexToNativeCell:`, _ListView.serialiseItemIndexToNativeCell(prev.itemIndexToNativeCell));
                console.log(`INCOMING itemIndexToNativeCell:`, _ListView.serialiseItemIndexToNativeCell(itemIndexToNativeCell));

                const nativeCells: Record<number, ContentView> = {
                    ...prev.nativeCells,
                    [args.index]: view as ContentView
                };

                /* TODO: nativeCells can be replaced with nativeCellToItemIndex... though it gives very nice logs */
                delete nativeCells[itemIndexOfArgsView];
                
                return {
                    nativeCells,
                    nativeCellToItemIndex,
                    itemIndexToNativeCell
                };
            }, () => {
                console.log(`setState() completed for ${itemIndexOfArgsView} -> ${args.index}`);
            });
        }
    }

    /**
     * 
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(attach: boolean|null, nextProps?: P): void {
        super.updateListeners(attach, nextProps);

        const ref = this.props.forwardedRef || this.myRef;
        // console.log(`[updateListeners()] using ${ref === this.myRef ? "default ref" : "forwarded ref"}`);

        const node: E|null = ref.current;
        if(node){
            if(attach === null){
                /* TODO: decide whether to bother supporting non-default onItemLoading event handlers. */
                // updateListener(node, NativeScriptListView.itemLoadingEvent, this.defaultOnItemLoading, nextProps.onLoaded);

                updateListener(node, NativeScriptListView.itemTapEvent, this.props.onItemTap, nextProps.onItemTap);
                updateListener(node, NativeScriptListView.loadMoreItemsEvent, this.props.onLoadMoreItems, nextProps.onLoadMoreItems);
            } else {
                const method = (attach ? node.on : node.off).bind(node);
                /* if(this.props.onItemLoadingEvent) */ method(NativeScriptListView.itemLoadingEvent, this.defaultOnItemLoading);

                if(this.props.onItemTap) method(NativeScriptListView.itemTapEvent, this.props.onItemTap);
                if(this.props.onLoadMoreItems) method(NativeScriptListView.loadMoreItemsEvent, this.props.onLoadMoreItems);
            }
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    static mapToKV<K, V>(map: Map<K, V>): [K, V][] {
        const arr: [K, V][] = [];
        map.forEach((value: V, key: K) => {
            arr.push([key, value]);
        });
        return arr;
    }

    static serialiseNativeCellToItemIndex<ContentView, NumberKey>(map: Map<ContentView, NumberKey>): Record<string, string> {
        return _ListView.mapToKV(map).reduce((acc: Record<string, string>, [view, index], iterand: number) => {
            acc[`CV(${(view as any)._domId})`] = `args_${index}`;
            return acc;
        }, {});
    }

    static serialiseItemIndexToNativeCell<NumberKey, ContentView>(map: Map<NumberKey, ContentView>): Record<string, string> {
        return _ListView.mapToKV(map).reduce((acc: Record<string, string>, [index, view]) => {
            // acc[`args[${index}]`] = `ContentView(${(view as any)._domId})`;
            acc[`args_${index}`] = `CV(${(view as any)._domId})`;
            return acc;
        }, {});
    }

    public static isItemsSource(arr: any[] | ItemsSource): arr is ItemsSource {
        // Same implementation as: https://github.com/NativeScript/NativeScript/blob/b436ecde3605b695a0ffa1757e38cc094e2fe311/tns-core-modules/ui/list-picker/list-picker-common.ts#L74
        return typeof (arr as ItemsSource).getItem === "function";
    }

    render(){
        const {
            forwardedRef,

            onLoaded,
            onUnloaded,
            onAndroidBackPressed,
            onShowingModally,
            onShownModally,
            
            onTap,
            onDoubleTap,
            onPinch,
            onPan,
            onSwipe,
            onRotation,
            onLongPress,
            onTouch,

            onPropertyChange,

            children,

            items,
            ...rest
        } = this.props;

        console.warn("ListView implementation not yet complete!");
        if(children){
            console.warn("Ignoring 'children' prop on ListView; not yet supported");
        }

        const portals: React.ReactPortal[] = [];

        console.log(`RENDERING nativeCellToItemIndex:`, _ListView.serialiseNativeCellToItemIndex(this.state.nativeCellToItemIndex));
        this.state.nativeCellToItemIndex.forEach((itemIndex: number, view: CellViewContainer) => {
            const item: any = this.state.isItemsSource ? (items as ItemsSource).getItem(itemIndex) : items[itemIndex];
            console.log(`CV(${view._domId}): ${item.text}`);

            const portal = ReactNativeScript.createPortal(
                this.props.cellFactory(item, view),
                view,
                `Portal(${view._domId})`,
            );
            portals.push(portal as React.ReactPortal);
        });

        return React.createElement(
            'listView',
            {
                className: "list-group",
                /* Maybe we need to supply a template to map each item to a NativeScript View? */
                // itemTemplate: knownTemplates.itemTemplate,

                /* This seems to make the initial template; not too useful as it receives no args with which to customise it */
                // _itemTemplatesInternal: [{
                //     key: 'default',
                //     createView: (args: undefined) => {
                //         const label = new Label();
                //         label.text = "test";
                //         return label;
                //     }
                // }],

                ...rest,
                items,
                ref: forwardedRef || this.myRef
            },
            portals,
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ListViewComponentProps<NativeScriptListView>>;

export const ListView: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptListView>> = React.forwardRef<NativeScriptListView, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptListView>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _ListView,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)