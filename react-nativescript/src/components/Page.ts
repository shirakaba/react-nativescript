import * as React from "react";
import { PageProps } from "../shared/NativeScriptComponentTypings";
import { Page as NativeScriptPage, NavigatedData } from "tns-core-modules/ui/page/page";

interface Props {
    onNavigatingTo?: PageNavigationEventHandler,
    onNavigatedTo?: PageNavigationEventHandler,
    onNavigatingFrom?: PageNavigationEventHandler,
    onNavigatedFrom?: PageNavigationEventHandler,
}

export type PageNavigationEventHandler = (args: NavigatedData) => void;

export type PageComponentProps = Props & Partial<PageProps>;

/**
 * A React wrapper around the NativeScript Page component.
 * TODO: inherit from a View component
 * See: ui/page/page
 */
export class Page extends React.Component<PageComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptPage> = React.createRef<NativeScriptPage>();

    private readonly _onNavigatingTo: PageNavigationEventHandler = (args: NavigatedData) => {
        if(this.props.onNavigatingTo){
            this.props.onNavigatingTo(args);
        }
    };
    private readonly _onNavigatedTo: PageNavigationEventHandler = (args: NavigatedData) => {
        if(this.props.onNavigatedTo){
            this.props.onNavigatedTo(args);
        }
    };
    private readonly _onNavigatingFrom: PageNavigationEventHandler = (args: NavigatedData) => {
        if(this.props.onNavigatingFrom){
            this.props.onNavigatingFrom(args);
        }
    };
    private readonly _onNavigatedFrom: PageNavigationEventHandler = (args: NavigatedData) => {
        if(this.props.onNavigatedFrom){
            this.props.onNavigatedFrom(args);
        }
    };

    componentDidMount() {
        const node: NativeScriptPage|null = this.myRef.current;
        if(node){
            node.on("navigatedFrom", this._onNavigatedFrom);
            node.on("navigatedTo", this._onNavigatedTo);
            node.on("navigatingFrom", this._onNavigatingFrom);
            node.on("navigatingTo", this._onNavigatingTo);
        }
    }
  
    componentWillUnmount() {
        const node: NativeScriptPage|null = this.myRef.current;
        if(node){
            node.off("navigatedFrom", this._onNavigatedFrom);
            node.off("navigatedTo", this._onNavigatedTo);
            node.off("navigatingFrom", this._onNavigatingFrom);
            node.off("navigatingTo", this._onNavigatingTo);
        } else {
            console.warn(`React ref to NativeScript Page lost, so unable to clean up event listeners.`);
        }
    }

    render(){
        const { children, ...rest } = this.props;

        return React.createElement(
            'page',
            {
                ...rest,
                ref: this.myRef
            },
            children
        );
    }
}