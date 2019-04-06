import * as React from "react";
import { ListViewProps } from "./NativeScriptComponentTypings";
import { ListView as NativeScriptListView, ItemEventData, knownTemplates } from "tns-core-modules/ui/list-view/list-view";
import { View, EventData } from "tns-core-modules/ui/core/view/view";
import { updateListener } from "../client/EventHandling";
import { Label } from "tns-core-modules/ui/label/label";
import { default as ReactNativeScript } from "../index"
import { ContentView } from "tns-core-modules/ui/page/page";
import { getInstanceFromNode } from "../client/ComponentTree";

interface Props {
    items: ListViewProps["items"],
    onItemLoading?: (args: ItemEventData) => void,
    onItemTap?: (args: ItemEventData) => void,
    onLoadMoreItems?: (args: EventData) => void,
    // TODO: support all the inherited props from the View component, i.e. listeners!
}

type NumberKey = number|string;

interface State {
    nativeCells: Record<NumberKey, ContentView>;
    /* Native cells may be rotated e.g. what once displayed items[0] may now need to display items[38] */
    nativeCellToItemIndex: Map<ContentView, NumberKey>;
    itemIndexToNativeCell: Map<NumberKey, ContentView>;
}

export type ListViewComponentProps = Props & Partial<ListViewProps>;

/**
 * A React wrapper around the NativeScript ListView component.
 * Still under construction; needs to take React components as children.
 * https://docs.nativescript.org/ui/ns-ui-widgets/list-view
 * See: ui/list-view/list-view
 */
export class ListView extends React.Component<ListViewComponentProps, State> {
    private readonly myRef: React.RefObject<NativeScriptListView> = React.createRef<NativeScriptListView>();

    constructor(props: ListViewComponentProps){
        super(props);

        this.state = {
            nativeCells: {},
            nativeCellToItemIndex: new Map(),
            itemIndexToNativeCell: new Map()
        };
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
            // const filledIndices: string[] = Object.keys(this.state.nativeCells);
            // const sparseIndex: number|-1 = filledIndices.findIndex((index: string) => {
            //     return view === this.state.nativeCells[index];
            // });
            // const filledIndex: string|null = sparseIndex === -1 ? null : filledIndices[sparseIndex];
            // if(filledIndex === null){
            //     console.log(`Unable to find 'nativeCell' that args.view corresponds to!`, view);
            //     return;
            // }

            const currentIndex: NumberKey|undefined = this.state.nativeCellToItemIndex.get(view as ContentView);

            if(typeof currentIndex === "undefined"){
                console.warn(`Unable to find 'nativeCell' that args.view corresponds to!`, view);
                return;
            }

            // TODO: find using nativeCellToItemIndex rather than findIndex(); complexity goes from O(N) -> O(1).

            // setState() completed for <empty> -> 37
            // 'onItemLoading': 0 -> 38
            console.log(`'onItemLoading': ${currentIndex} -> ${args.index}`);

            /* TODO: Not sure whether it's a no-op in truth. Have to re-examine. */
            // if(parseInt(currentIndex) === args.index){
            //     console.log(`Filled index matched args.index, so treating as no-op...`);
            //     return;
            // }

            // nativeCells[0] now needs to display props.items[38]

            this.setState((prev: State) => {
                const nativeCellToItemIndex = new Map(prev.nativeCellToItemIndex);
                nativeCellToItemIndex.set(view as ContentView, args.index);
                // console.log(`old map:`, prev.nativeCellToItemIndex);
                // console.log(`new map:`, nativeCellToItemIndex);

                const itemIndexToNativeCell = new Map(prev.itemIndexToNativeCell);
                itemIndexToNativeCell.delete(currentIndex);
                itemIndexToNativeCell.set(args.index, view as ContentView);

                const nativeCells: Record<number, ContentView> = {
                    ...prev.nativeCells,
                    [args.index]: view as ContentView
                };

                /* TODO: nativeCells can be replaced with nativeCellToItemIndex... though it gives very nice logs */
                delete nativeCells[currentIndex];
                
                return {
                    nativeCells,
                    nativeCellToItemIndex,
                    itemIndexToNativeCell
                };
            }, () => {
                console.log(`setState() completed for ${currentIndex} -> ${args.index}`);
            });
        }
    }

    componentDidMount(){
        const node: NativeScriptListView|null = this.myRef.current;
        if(node){
            const { onItemLoading, onItemTap, onLoadMoreItems } = this.props;
            
            node.on(NativeScriptListView.itemLoadingEvent, onItemLoading || this.defaultOnItemLoading);

            if(onItemTap){
                node.on(NativeScriptListView.itemTapEvent, onItemTap);
            }
            if(onLoadMoreItems){
                node.on(NativeScriptListView.loadMoreItemsEvent, onLoadMoreItems);
            }
        }
    }

    shouldComponentUpdate(nextProps: ListViewComponentProps, nextState: State): boolean {
        console.log(`[ListView] shouldComponentUpdate! nextState:`, Object.keys(nextState.nativeCells));
        ListView.logItemIndexToNativeCell(nextState.itemIndexToNativeCell);
        // TODO: check whether this is the ideal lifecycle function to do this in.
        const node: NativeScriptListView|null = this.myRef.current;
        if(node){
            /* FIXME: evidently updateListener() isn't working as intended - it removes onItemTap even when it's no different to this.defaultOnItemLoading. */
            // updateListener(node, NativeScriptListView.itemLoadingEvent, this.props.onItemLoading || this.defaultOnItemLoading, nextProps.onItemLoading);
            updateListener(node, NativeScriptListView.itemTapEvent, this.props.onItemTap, nextProps.onItemTap);
            updateListener(node, NativeScriptListView.loadMoreItemsEvent, this.props.onLoadMoreItems, nextProps.onLoadMoreItems);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
        return true;
    }

    componentWillUnmount(){
        const node: NativeScriptListView|null = this.myRef.current;

        console.log(`[ListView] componentWillUnmount!`);
        
        if(node){
            const { onItemLoading, onItemTap, onLoadMoreItems } = this.props;
            if(onItemLoading){
                node.off(NativeScriptListView.itemLoadingEvent, onItemLoading || this.defaultOnItemLoading);
            }
            if(onItemTap){
                node.off(NativeScriptListView.itemTapEvent, onItemTap);
            }
            if(onLoadMoreItems){
                node.off(NativeScriptListView.loadMoreItemsEvent, onLoadMoreItems);
            }
        }
    }

    static mapToKV<K, V>(map: Map<K, V>): [K, V][] {
        const arr: [K, V][] = [];
        map.forEach((value: V, key: K) => {
            arr.push([key, value]);
        });
        return arr;
    }

    static logNativeCellToItemIndex<ContentView, NumberKey>(map: Map<ContentView, NumberKey>): void {
        console.log(
            ListView.mapToKV(map).reduce((acc: Record<string, string>, [view, index]) => {
                acc[`ContentView(${(view as any)._domId})`] = `args[${index}]`;
                return acc;
            }, {})
        );
    }

    static logItemIndexToNativeCell<NumberKey, ContentView>(map: Map<NumberKey, ContentView>): void {
        console.log(
            ListView.mapToKV(map).reduce((acc: Record<string, string>, [index, view]) => {
                // acc[`args[${index}]`] = `ContentView(${(view as any)._domId})`;
                acc[`${index}`] = `CV(${(view as any)._domId})`;
                return acc;
            }, {})
        );
    }

    render(){
        const { children, items, ...rest } = this.props;
        // console.warn("ListView implementation not yet complete!");
        if(children){
            console.warn("Ignoring 'children' prop on ListView; not yet supported");
        }

        const portals: React.ReactPortal[] = [];
        this.state.itemIndexToNativeCell.forEach((view: ContentView, itemIndex: number) => {
            // console.log(`key: ${view._domId}`);
            const portal = ReactNativeScript.createPortal(
                React.createElement(
                    "label",
                    {
                        key: view._domId,
                        text: `Text: ${(items as any[])[itemIndex].text}`,
                        // textWrap: true,
                        // class: "title"
                    }
                ),
                view
            );
            portals.push(portal);
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
                /* By passing 'items' into ListView, ListView automatically creates a list of labels where each text is simply a stringification of each item.
                 * Will have to figure out  */
                items,
                ref: this.myRef
            },
            React.createElement(
                "stackLayout",
                {
                    className: "list-group-item"
                },
                ...portals
                // ...Object.keys(this.state.nativeCells).map((index: string) => {
                //     const nativeCell: ContentView = this.state.nativeCells[index];
                //     return ReactNativeScript.createPortal(
                //         React.createElement(
                //             "label",
                //             {
                //                 key: `KEY-${(items as any[])[index]}`,
                //                 text: `Text: ${(items as any[])[index].text}`,
                //                 textWrap: true,
                //                 class: "title"
                //             }
                //         ),
                //         nativeCell
                //     );
                // })
            )
        );
    }
}
