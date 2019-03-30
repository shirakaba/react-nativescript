import * as React from "react";
import { ViewProps, TextBaseProps } from "./NativeScriptComponentTypings";
import { View as NativeScriptView, ShownModallyData } from "tns-core-modules/ui/core/view/view";
import { EventData } from "tns-core-modules/data/observable/observable";
import { isAndroid, isIOS } from "tns-core-modules/platform/platform";
import { Color } from "tns-core-modules/color/color";
import { updateListeners, detachListeners, attachListeners, ListenerEventsMap } from "./eventHandling";

/**
 * From React Native's 'ViewProps' interface.
 */
interface Props {
    onLayout?: (...args: any[]) => void;
    onShowingModally?: (args: ShownModallyData) => void;
    onShownModally?: (args: ShownModallyData) => void;
}

export type ViewComponentProps = Props & Partial<ViewProps>;

/**
 * A React wrapper around the NativeScript View component.
 * https://facebook.github.io/react-native/docs/View#color
 */
// export class View extends React.Component<Props & ViewBaseProp<NativeScriptView>, {}> {
export class View extends React.Component<ViewComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptView> = React.createRef<NativeScriptView>();
    private eventsMap: ListenerEventsMap;

    constructor(props: ViewComponentProps){
        super(props);

        const { onLayout, onShowingModally, onShownModally } = this.props;

        this.eventsMap = {
            [NativeScriptView.layoutChangedEvent]: onLayout,
            [NativeScriptView.showingModallyEvent]: onShowingModally,
            [NativeScriptView.shownModallyEvent]: onShownModally
        };
    }

    /* Called before render():
     * http://busypeoples.github.io/post/react-component-lifecycle/
     * Ref gets assigned only after this:
     * https://stackoverflow.com/questions/28662624/reactjs-componentdidmount-render 
     * Docs:
     * https://reactjs.org/docs/refs-and-the-dom.html#creating-refs */
    componentDidMount(){
        const node: NativeScriptView|null = this.myRef.current;
        if(node){
            attachListeners(node, this.eventsMap);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to attach event listeners.`);
        }
    }

    shouldComponentUpdate(nextProps: ViewComponentProps, nextState: {}): boolean {
        // TODO: check whether this is the ideal lifecycle function to do this in.
        if(nextProps.onLayout !== this.props.onLayout){
            const node: NativeScriptView|null = this.myRef.current;
            if(node){
                const { onLayout, onShowingModally, onShownModally } = nextProps;

                // TODO: find a more efficient way to do this (i.e. don't create a new object).
                const eventsMap = {
                    [NativeScriptView.layoutChangedEvent]: onLayout,
                    [NativeScriptView.showingModallyEvent]: onShowingModally,
                    [NativeScriptView.shownModallyEvent]: onShownModally,
                };

                updateListeners(node, this.eventsMap, eventsMap);

                this.eventsMap = eventsMap;
            } else {
                console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
            }
        }
        return true;
    }

    componentWillUnmount(){
        const node: NativeScriptView|null = this.myRef.current;
        if(node){
            detachListeners(node, this.eventsMap);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to clean up event listeners.`);
        }
    }

    render(){
        const { onLayout, onShowingModally, onShownModally, children, ...rest } = this.props;

        return React.createElement(
                'ContentView',
                {
                    ...rest,
                    ref: this.myRef
                },
                children
            );
    }
}