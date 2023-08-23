import * as console from "../shared/Logger";
import * as React from "react";
import { View, KeyedTemplate, ItemsSource, ItemEventData, ListView as NativeScriptListView } from "@nativescript/core";
import { render as RNSRender, unmountComponentAtNode, NSVRoot } from "../index";
import { NSVElement } from "../nativescript-vue-next/runtime/nodes";
import { ListViewAttributes } from "../lib/react-nativescript-jsx";

export type CellViewContainer = View;
type CellFactory = (item: any) => React.ReactElement;

type OwnProps = {
    items: ItemsSource|any[];
    /** User may specify cellFactory for single-template or cellFactories for multi-template. */
    cellFactory?: CellFactory;
    cellFactories?: Map<string, { placeholderItem: any; cellFactory: CellFactory }>;
    /** For now, we don't support custom onItemLoading event handlers. */
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
} & Omit<ListViewAttributes, "onItemLoading">;
type Props = React.PropsWithChildren<OwnProps & { forwardedRef?: React.RefObject<NSVElement<NativeScriptListView>> }>;

type NumberKey = number | string;
type RootKeyAndTNSView = { rootKey: string; nativeView: View };

interface State {
    nativeCells: Record<NumberKey, CellViewContainer>;
    /* Native cells may be rotated e.g. what once displayed items[0] may now need to display items[38] */
    nativeCellToItemIndex: Map<CellViewContainer, NumberKey>;
    itemIndexToNativeCell?: Map<NumberKey, CellViewContainer>;
}

/**
 * A React wrapper around the NativeScript ListView component.
 * @see https://docs.nativescript.org/ui/ns-ui-widgets/list-view
 * @module ui/list-view/list-view
 */
export class _ListView extends React.Component<Props, State> {
    static readonly defaultProps = {
        _debug: {
            logLevel: "info" as "info",
            onCellFirstLoad: undefined,
            onCellRecycle: undefined,
        },
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            nativeCells: {},
            nativeCellToItemIndex: new Map(),
            itemIndexToNativeCell: props._debug.logLevel === "debug" ? new Map() : undefined,
        };
    }

    private readonly myRef = React.createRef<NSVElement<NativeScriptListView>>();
    private readonly argsViewToRootKeyAndRef: Map<View, RootKeyAndTNSView> = new Map();
    private roots: Set<string> = new Set();

    /**
     * ListView code-behind:
     * @see https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/list-view/code-behind/code-behind-ts-page.ts
     * ListView item templates:
     * @see https://medium.com/@alexander.vakrilov/faster-nativescript-listview-with-multiple-item-templates-8f903a32e48f
     * Cell state in ListView:
     * @see https://medium.com/@alexander.vakrilov/managing-component-state-in-nativescript-listview-b139e45d899b
     * @see https://github.com/NativeScript/nativescript-angular/issues/1245#issuecomment-393465035
     * loadMoreItems:
     * @see https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/list-view/events/events-ts-page.ts
     */
    private readonly defaultOnItemLoading: (args: ItemEventData) => void = (args: ItemEventData) => {
        const { logLevel, onCellRecycle, onCellFirstLoad } = this.props._debug;
        const { items, itemTemplateSelector } = this.props;
        const item: any = _ListView.isItemsSource(items) ? items.getItem(args.index) : items[args.index];
        const template: string | null = itemTemplateSelector
            ? typeof itemTemplateSelector === "string"
                ? itemTemplateSelector
                : (itemTemplateSelector as ((item: any, index: number, items: any) => string))(item, args.index, items)
            : null;
        const cellFactory: CellFactory | undefined =
            template === null
                ? this.props.cellFactory
                : this.props.cellFactories
                ? this.props.cellFactories.get(template).cellFactory
                : this.props.cellFactory;

        if (typeof cellFactory === "undefined") {
            console.warn(`ListView: No cell factory found, given template ${template}!`);
            return;
        }

        let view: View | undefined = args.view;
        if (!view) {
            const rootKeyAndRef: RootKeyAndTNSView = this.renderNewRoot(item, cellFactory);

            args.view = rootKeyAndRef.nativeView;

            /* Here we're re-using the ref - I assume this is best practice. If not, we can make a new one on each update instead. */
            this.argsViewToRootKeyAndRef.set(args.view, rootKeyAndRef);

            if (onCellFirstLoad) onCellFirstLoad(rootKeyAndRef.nativeView);
        } else {
            console.log(`[ListView] existing view: `, view);
            if (onCellRecycle) onCellRecycle(view as CellViewContainer);

            const { rootKey, nativeView } = this.argsViewToRootKeyAndRef.get(view);
            if (typeof rootKey === "undefined") {
                console.error(`Unable to find root key that args.view corresponds to!`, view);
                return;
            }
            if (!nativeView) {
                console.error(`Unable to find ref that args.view corresponds to!`, view);
                return;
            }

            // args.view = null;
            RNSRender(
                cellFactory(item),
                null,
                () => {
                    // console.log(`Rendered into cell! detachedRootRef:`);
                },
                rootKey
            );
        }
    };

    protected getNativeView(): NativeScriptListView | null {
        const ref = (this.props.forwardedRef || this.myRef);
        return ref.current ? ref.current.nativeView : null;
    }

    private readonly renderNewRoot = (item: any, cellFactory: CellFactory): RootKeyAndTNSView => {
        const node: NativeScriptListView | null = this.getNativeView();
        if (!node) {
            throw new Error("Unable to get ref to ListView");
        }

        console.log(`[ListView] no existing view.`);
        const rootKey: string = `ListView-${node._domId}-${this.roots.size.toString()}`;

        const root = new NSVRoot<View>();
        RNSRender(
            cellFactory(item),
            root, () => {
                // console.log(`Rendered into cell! ref:`);
            },
            rootKey
        );

        this.roots.add(rootKey);

        return {
            rootKey,
            nativeView: root.baseRef.nativeView
        };
    };

    componentDidMount() {
        const node: NativeScriptListView | null = this.getNativeView();
        if (!node) {
            console.warn(`React ref to NativeScript View lost, so unable to set item templates.`);
            return;
        }

        /* NOTE: does not support updating of this.props.cellFactories upon Props update. */
        if (this.props.cellFactories) {
            const itemTemplates: KeyedTemplate[] = [];
            this.props.cellFactories.forEach((info, key: string) => {
                const { placeholderItem, cellFactory } = info;
                itemTemplates.push({
                    key,
                    createView: () => {
                        console.log(`[ListView] item template "${key}"`);
                        const rootKeyAndRef: RootKeyAndTNSView = this.renderNewRoot(placeholderItem, cellFactory);
                        this.argsViewToRootKeyAndRef.set(rootKeyAndRef.nativeView, rootKeyAndRef);

                        return rootKeyAndRef.nativeView;
                    },
                });
            });
            node.itemTemplates = itemTemplates;
        }
    }

    componentWillUnmount() {
        this.roots.forEach(root => unmountComponentAtNode(root));
    }

    public static isItemsSource(arr: any[] | ItemsSource): arr is ItemsSource {
        /**
         * Same implementation as used in official ListPicker component:
         * @see https://github.com/NativeScript/NativeScript/blob/b436ecde3605b695a0ffa1757e38cc094e2fe311/tns-core-modules/ui/list-picker/list-picker-common.ts#L74
         */
        return typeof (arr as ItemsSource).getItem === "function";
    }

    render() {
        console.log(`ListView's render()`);
        const {
            // Only used by the class component; not the JSX element.
            forwardedRef,
            children,
            _debug,
            cellFactories,
            cellFactory,

            ...rest
        } = this.props;

        if (children) {
            console.warn("Ignoring 'children' prop on ListView; not supported.");
        }

        return (
            <listView
                {...rest}
                onItemLoading={this.defaultOnItemLoading}
                ref={forwardedRef || this.myRef}
            />
        );
    }
}

export const ListView = React.forwardRef<NSVElement<NativeScriptListView>, OwnProps>(
    (props: OwnProps, ref: React.RefObject<NSVElement<NativeScriptListView>>) => {
        return <_ListView {...props} forwardedRef={ref}/>;
    }
);
