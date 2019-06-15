import * as React from "react";
import { ListViewProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ListView as NativeScriptListView, ItemEventData, knownTemplates, ItemsSource } from "tns-core-modules/ui/list-view/list-view";
import { View, EventData } from "tns-core-modules/ui/core/view/view";
import { updateListener } from "../client/EventHandling";
import { Label } from "tns-core-modules/ui/label/label";
import { ContentView, Observable, Color } from "tns-core-modules/ui/page/page";
import { getInstanceFromNode } from "../client/ComponentTree";
import { ListViewCell } from "./ListViewCell";
import { ViewComponentProps, RCTView, ViewComponentState } from "./View";
import * as ReactNativeScript from "../client/ReactNativeScript"
import { shallowEqual } from "../client/shallowEqual";
import { RCTContentView, RCTLabel } from "../client/ReactNativeScript";

export type CellViewContainer = ContentView;

interface Props {
    items: ListViewProps["items"],
    cellFactory: (item: any, ref: React.RefObject<any>) => React.ReactElement,
    /* For now, we don't support custom onItemLoading event handlers. */
    // onItemLoading?: (args: ItemEventData) => void,
    onItemTap?: (args: ItemEventData) => void,
    /**
      * The event will be raised when the ListView is scrolled so that the last item is visible.
      * This event is intended to be used to add additional data in the ListView.
      */
    onLoadMoreItems?: (args: ItemEventData) => void,
    _debug?: {
        logLevel: "debug"|"info",
        onCellFirstLoad?: (container: CellViewContainer) => void,
        onCellRecycle?: (container: CellViewContainer) => void,
    }
}

type NumberKey = number|string;

interface State {
    isItemsSource: boolean,
    nativeCells: Record<NumberKey, CellViewContainer>;
    /* Native cells may be rotated e.g. what once displayed items[0] may now need to display items[38] */
    nativeCellToItemIndex: Map<CellViewContainer, NumberKey>;
    itemIndexToNativeCell?: Map<NumberKey, CellViewContainer>;
}

/**
 * A React wrapper around the NativeScript ListView component.
 * Still under construction; needs to take React components as children.
 * https://docs.nativescript.org/ui/ns-ui-widgets/list-view
 * See: ui/list-view/list-view
 */
export type ListViewComponentProps<E extends NativeScriptListView = NativeScriptListView> = Props /* & typeof _ListView.defaultProps */ & Partial<ListViewProps> & ViewComponentProps<E>;

export type ListViewComponentState = State & ViewComponentState;

export class _ListView<P extends ListViewComponentProps<E>, S extends ListViewComponentState, E extends NativeScriptListView> extends RCTView<P, S, E> {
    static readonly defaultProps = {
        _debug: {
            logLevel: "info" as "info",
            onCellFirstLoad: undefined,
            onCellRecycle: undefined,
        }
    }

    constructor(props: P){
        super(props);

        this.state = {
            isItemsSource: _ListView.isItemsSource(props.items),
            nativeCells: {},
            nativeCellToItemIndex: new Map(),
            itemIndexToNativeCell: props._debug.logLevel === "debug" ? new Map() : undefined,
        } as Readonly<S>; // No idea why I need to assert as Readonly<S> when using generics with State :(
    }

    private readonly argsViewToRootKey: Map<View, string> = new Map();

    private roots: string[] = [];

    /* TODO: refer to: https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/list-view/code-behind/code-behind-ts-page.ts */
    private readonly defaultOnItemLoading: (args: ItemEventData) => void = (args: ItemEventData) => {
        const { logLevel, onCellRecycle, onCellFirstLoad } = this.props._debug;
        const items: ListViewProps["items"] = this.props.items;
        const item: any = this.state.isItemsSource ? (items as ItemsSource).getItem(args.index) : items[args.index];
        
        let view: View|undefined = args.view;
        if(!view){
            const detachedRootRef: React.RefObject<any> = React.createRef<any>();
            const key: string = "ListView-" + (this.roots.length).toString();

            ReactNativeScript.render(
                this.props.cellFactory(item, detachedRootRef),
                null,
                () => {
                    // console.log(`Rendered into cell! detachedRootRef:`);
                },
                key
            );
            this.roots.push(key);

            args.view = detachedRootRef.current;
            this.argsViewToRootKey.set(args.view, key);

            if(onCellFirstLoad) onCellFirstLoad(detachedRootRef.current);
        } else {
            if(onCellRecycle) onCellRecycle(view as CellViewContainer);

            const key: string|undefined = this.argsViewToRootKey.get(view);
            if(typeof key === "undefined"){
                console.error(`Unable to find root key that args.view corresponds to!`, view);
                return;
            }

            const detachedRootRef: React.RefObject<any> = React.createRef<any>();
            ReactNativeScript.render(
                this.props.cellFactory(item, detachedRootRef),
                null,
                () => {
                    // console.log(`Rendered into cell! detachedRootRef:`);
                },
                key
            );
        }
    }

    /**
     * 
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(attach: boolean|null, nextProps?: P): void {
        // console.log(`ListView's updateListeners()`);
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

    componentWillUnmount(){
        super.componentWillUnmount();
        this.roots.forEach(root => ReactNativeScript.unmountComponentAtNode(root));
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

    // /**
    //  * PureComponent's shouldComponentUpdate() method is ignored and replaced with a shallowEqual()
    //  * comparison of props and state. We'll implement our Component's shouldComponentUpdate() to
    //  * match the way PureComponent is handled.
    //  */
    // shouldComponentUpdate(nextProps: P, nextState: S): boolean {
    //     console.log(`ListView's shouldComponentUpdate`);
    //     const shouldUpdate: boolean = !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    //     // console.log(`[shouldComponentUpdate] shouldUpdate: ${shouldUpdate}.`);

    //     this.updateListeners(null, nextProps);
        
    //     // https://lucybain.com/blog/2018/react-js-pure-component/
    //     return shouldUpdate;
    // }

    render(){
        // console.log(`ListView's render()`);
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
            _debug,

            items,
            ...rest
        } = this.props;

        // console.warn("ListView implementation not yet complete!");

        if(children){
            console.warn("Ignoring 'children' prop on ListView; not yet supported");
        }

        const portals: React.ReactPortal[] = [];

        if(_debug.logLevel === "debug") console.log(`RENDERING nativeCellToItemIndex:`, _ListView.serialiseNativeCellToItemIndex(this.state.nativeCellToItemIndex));

        // this.state.nativeCellToItemIndex.forEach((itemIndex: number, view: CellViewContainer) => {
        //     const item: any = this.state.isItemsSource ? (items as ItemsSource).getItem(itemIndex) : items[itemIndex];
        //     if(_debug.logLevel === "debug") console.log(`Rendering CV(${view._domId})`);

        //     const portal = ReactNativeScript.createPortal(
        //         this.props.cellFactory(item, view),
        //         view,
        //         `Portal(${view._domId})`,
        //     );

        //     // const identifier: string = `Portal(${itemIndex}-${view._domId})`;

        //     // const portal = React.createElement(
        //     //     ListViewCell,
        //     //     {
        //     //         key: identifier,
        //     //         nativeElement: view,
        //     //         identifier: `Portal(${itemIndex}-${view._domId})`,
        //     //     },
        //     //     this.props.cellFactory(item, view)
        //     // )
        //     portals.push(portal as React.ReactPortal);
        // });

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
            // portals,
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