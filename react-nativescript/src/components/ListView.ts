import * as React from "react";
import { ListViewProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ListView as NativeScriptListView, ItemEventData, knownTemplates, ItemsSource } from "tns-core-modules/ui/list-view/list-view";
import { View, EventData } from "tns-core-modules/ui/core/view/view";
import { updateListener } from "../client/EventHandling";
import { ContentView, Observable, Color, KeyedTemplate } from "tns-core-modules/ui/page/page";
import { ViewComponentProps, RCTView, ViewComponentState } from "./View";
import * as ReactNativeScript from "../client/ReactNativeScript"

export type CellViewContainer = ContentView;
type CellFactory = ((item: any, ref: React.RefObject<any>) => React.ReactElement);

interface Props {
    items: ListViewProps["items"],
    /* User may specify cellFactory for single-template or cellFactories for multi-template. */
    cellFactory?: CellFactory,
    cellFactories?: Map<string, { placeholderItem: any, cellFactory: CellFactory }>,
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
type RootKeyAndRef = { rootKey: string, ref: React.RefObject<any> };

interface State {
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
            nativeCells: {},
            nativeCellToItemIndex: new Map(),
            itemIndexToNativeCell: props._debug.logLevel === "debug" ? new Map() : undefined,
        } as Readonly<S>; // No idea why I need to assert as Readonly<S> when using generics with State :(
    }

    private readonly argsViewToRootKeyAndRef: Map<View, RootKeyAndRef> = new Map();
    private roots: Set<string> = new Set();

    /* ListView code-behind:
     *   https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/list-view/code-behind/code-behind-ts-page.ts
     * ListView item templates:
     *   https://medium.com/@alexander.vakrilov/faster-nativescript-listview-with-multiple-item-templates-8f903a32e48f
     * Cell state in ListView:
     *   https://medium.com/@alexander.vakrilov/managing-component-state-in-nativescript-listview-b139e45d899b
     *   https://github.com/NativeScript/nativescript-angular/issues/1245#issuecomment-393465035
     * loadMoreItems:
     *   https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/list-view/events/events-ts-page.ts
     */
    private readonly defaultOnItemLoading: (args: ItemEventData) => void = (args: ItemEventData) => {
        const { logLevel, onCellRecycle, onCellFirstLoad } = this.props._debug;
        const { items, itemTemplateSelector } = this.props; 
        const item: any = _ListView.isItemsSource(items) ? items.getItem(args.index) : items[args.index];
        const template: string|null = itemTemplateSelector ? 
            (
                typeof itemTemplateSelector === "string" ? 
                    itemTemplateSelector : 
                    (itemTemplateSelector as ((item: any, index: number, items: any) => string))(item, args.index, items)
            ) :
            null;
        const cellFactory: CellFactory|undefined = template === null ? 
            this.props.cellFactory : 
           (this.props.cellFactories ? this.props.cellFactories.get(template).cellFactory : this.props.cellFactory);
        
        if(typeof cellFactory === "undefined"){
            console.warn(`ListView: No cell factory found, given template ${template}!`);
            return;
        }
        
        let view: View|undefined = args.view;
        if(!view){
            const rootKeyAndRef: RootKeyAndRef = this.renderNewRoot(item, cellFactory);

            args.view = rootKeyAndRef.ref.current;

            /* Here we're re-using the ref - I assume this is best practice. If not, we can make a new one on each update instead. */
            this.argsViewToRootKeyAndRef.set(args.view, rootKeyAndRef);

            if(onCellFirstLoad) onCellFirstLoad(rootKeyAndRef.ref.current);
        } else {
            console.log(`[ListView] existing view: `, view);
            if(onCellRecycle) onCellRecycle(view as CellViewContainer);

            const { rootKey, ref } = this.argsViewToRootKeyAndRef.get(view);
            if(typeof rootKey === "undefined"){
                console.error(`Unable to find root key that args.view corresponds to!`, view);
                return;
            }
            if(typeof ref === "undefined"){
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
    }

    /**
     * 
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(attach: boolean|null, nextProps?: P): void {
        // console.log(`ListView's updateListeners()`);
        super.updateListeners(attach, nextProps);

        const ref = this.props.forwardedRef || this.myRef;

        const node: E|null = ref.current;
        if(node){
            if(attach === null){
                /* We won't support non-default onItemLoading event handlers. */
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

    private readonly renderNewRoot = (item: any, cellFactory: CellFactory): RootKeyAndRef => {
        console.log(`[ListView] no existing view.`);
        const ref: React.RefObject<any> = React.createRef<any>();
        const rootKey: string = "ListView-" + (this.roots.size).toString();

        ReactNativeScript.render(
            cellFactory(item, ref),
            null,
            () => {
                // console.log(`Rendered into cell! ref:`);
            },
            rootKey
        );
        this.roots.add(rootKey);

        return {
            rootKey,
            ref
        };
    }

    componentDidMount(){
        super.componentDidMount();

        const ref = this.props.forwardedRef || this.myRef;

        const node: E|null = ref.current;
        if(node){
            /* NOTE: does not support updating of this.props.cellFactories upon Props update. */
            if(this.props.cellFactories){
                const itemTemplates: KeyedTemplate[] = [];
                this.props.cellFactories.forEach((info, key: string) => {
                    const { placeholderItem, cellFactory } = info;
                    itemTemplates.push({
                        key,
                        createView: () => {
                            console.log(`[ListView] item template "${key}"`);
                            const rootKeyAndRef: RootKeyAndRef = this.renderNewRoot(placeholderItem, cellFactory);
                            this.argsViewToRootKeyAndRef.set(rootKeyAndRef.ref.current, rootKeyAndRef);

                            return rootKeyAndRef.ref.current;
                        }
                    });
                });
                ref.current.itemTemplates = itemTemplates;
            }
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to set item templates.`);
        }
    }


    componentWillUnmount(){
        super.componentWillUnmount();
        this.roots.forEach(root => ReactNativeScript.unmountComponentAtNode(root));
    }

    public static isItemsSource(arr: any[] | ItemsSource): arr is ItemsSource {
        // Same implementation as: https://github.com/NativeScript/NativeScript/blob/b436ecde3605b695a0ffa1757e38cc094e2fe311/tns-core-modules/ui/list-picker/list-picker-common.ts#L74
        return typeof (arr as ItemsSource).getItem === "function";
    }

    render(){
        console.log(`ListView's render()`);
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

        if(children){
            console.warn("Ignoring 'children' prop on ListView; not yet supported");
        }

        return React.createElement(
            'listView',
            {
                className: "list-group",
                ...rest,
                items,
                ref: forwardedRef || this.myRef
            },
            null
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