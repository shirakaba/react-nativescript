import * as React from "react";
import { ListViewProps } from "./NativeScriptComponentTypings";
import { ListView as NativeScriptListView, ItemEventData, knownTemplates } from "tns-core-modules/ui/list-view/list-view";
import { View, EventData } from "tns-core-modules/ui/core/view/view";
import { updateListener } from "./eventHandling";
import { Label } from "tns-core-modules/ui/label/label";
import { default as ReactNativeScript } from "../index"
import { ContentView } from "tns-core-modules/ui/page/page";

interface Props {
    items: ListViewProps["items"],
    onItemLoading?: (args: ItemEventData) => void,
    onItemTap?: (args: ItemEventData) => void,
    onLoadMoreItems?: (args: EventData) => void,
    // TODO: support all the inherited props from the View component, i.e. listeners!
}

export type ListViewComponentProps = Props & Partial<ListViewProps>;

/**
 * A React wrapper around the NativeScript ListView component.
 * Still under construction; needs to take React components as children.
 * https://docs.nativescript.org/ui/ns-ui-widgets/list-view
 * See: ui/list-view/list-view
 */
export class ListView extends React.Component<ListViewComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptListView> = React.createRef<NativeScriptListView>();

    private readonly defaultOnItemLoading: (args: ItemEventData) => void = (args: ItemEventData) => {
        // console.log(`[defaultOnItemLoading] Called! Args: `, args);
        let view: View = args.view;
        if(!view){
            const contentView = new ContentView();
            contentView.backgroundColor = "orange";

            ReactNativeScript.render(
                React.createElement(
                    "Label",
                    {
                        text: `[React] Item: ${this.props.items[args.index]}`
                    },
                    null
                ),
                contentView,
                () => {
                    console.log(`[ListView cell] Container #${args.index} updated!`);
                }
            );
            args.view = contentView;
        } else {
            console.log(`Not sure how to pass props into unreferenced React tree...`);
        }
        // (view as ContentView).text = "Item number: " + args.index;
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

    shouldComponentUpdate(nextProps: ListViewComponentProps, nextState: {}): boolean {
        // TODO: check whether this is the ideal lifecycle function to do this in.
        const node: NativeScriptListView|null = this.myRef.current;
        if(node){
            updateListener(node, NativeScriptListView.itemLoadingEvent, this.props.onItemLoading || this.defaultOnItemLoading, nextProps.onItemLoading);
            updateListener(node, NativeScriptListView.itemTapEvent, this.props.onItemTap, nextProps.onItemTap);
            updateListener(node, NativeScriptListView.loadMoreItemsEvent, this.props.onLoadMoreItems, nextProps.onLoadMoreItems);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
        return true;
    }

    componentWillUnmount(){
        const node: NativeScriptListView|null = this.myRef.current;
        
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

    render(){
        const { children, items, ...rest } = this.props;
        console.warn("ListView implementation not yet complete!");
        if(children){
            console.warn("Ignoring 'children' prop on ListView; not yet supported");
        }
        return React.createElement(
            'ListView',
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
                "StackLayout",
                {
                    className: "list-group-item"
                },
                /* So far, I've only found that these labels are ignored completely. */
                // ...(items as any).map((item: any) => {
                //     return React.createElement(
                //         "Label",
                //         {
                //             text: `Text: ${item.text}`,
                //             textWrap: true,
                //             class: "title"
                //         }
                //     )
                // })
                // React.createElement(
                //     "Label",
                //     {
                //         // text: `Text: ${item.text}`,
                //         text: `Testing`,
                //         textWrap: true,
                //         class: "title"
                //     }
                // )
            )
        );
    }
}