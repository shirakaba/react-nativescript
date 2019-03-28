import * as React from "react";
import { ViewBaseProps, TextBaseProps } from "./NativeScriptComponentTypings";
import { View as NativeScriptView, ShownModallyData } from "tns-core-modules/ui/core/view/view";
import { EventData } from "tns-core-modules/data/observable/observable";
import { isAndroid, isIOS } from "tns-core-modules/platform/platform";
import { Color } from "tns-core-modules/color/color";

/**
 * From React Native's 'ViewProps' interface.
 */
interface Props {
    onLayout?: (args: any) => void;
    onShowingModally?: (args: ShownModallyData) => void;
    onShownModally?: (args: ShownModallyData) => void;
}

type ViewProps = Props & Partial<ViewBaseProps>;

/**
 * A React wrapper around the NativeScript View component.
 * https://facebook.github.io/react-native/docs/View#color
 */
// export class View extends React.Component<Props & ViewBaseProp<NativeScriptView>, {}> {
export class View extends React.Component<ViewProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptView> = React.createRef<NativeScriptView>();

    /* Called before render():
     * http://busypeoples.github.io/post/react-component-lifecycle/
     * Ref gets assigned only after this:
     * https://stackoverflow.com/questions/28662624/reactjs-componentdidmount-render 
     * Docs:
     * https://reactjs.org/docs/refs-and-the-dom.html#creating-refs */
    componentDidMount(){
        const node: NativeScriptView|null = this.myRef.current;
        if(node){
            if(this.props.onLayout){
                node.on(NativeScriptView.layoutChangedEvent, this.props.onLayout);
            }
            if(this.props.onShowingModally){
                node.on(NativeScriptView.showingModallyEvent, this.props.onShowingModally);
            }
            if(this.props.onShownModally){
                node.on(NativeScriptView.shownModallyEvent, this.props.onShownModally);
            }
        }
        
    }

    shouldComponentUpdate(nextProps: ViewProps, nextState: {}): boolean {
        // TODO: check whether this is the ideal lifecycle function to do this in.
        if(nextProps.onLayout !== this.props.onLayout){
            const node: NativeScriptView|null = this.myRef.current;
            if(node){
                // Need to check where this lifecycle method is in relation to render().
                if(this.props.onLayout){
                    node.off(NativeScriptView.layoutChangedEvent, this.props.onLayout);
                }
                if(this.props.onShowingModally){
                    node.off(NativeScriptView.showingModallyEvent, this.props.onShowingModally);
                }
                if(this.props.onShownModally){
                    node.off(NativeScriptView.shownModallyEvent, this.props.onShownModally);
                }
                if(nextProps.onLayout){
                    node.on(NativeScriptView.layoutChangedEvent, nextProps.onLayout);
                }
                if(nextProps.onShowingModally){
                    node.on(NativeScriptView.showingModallyEvent, nextProps.onShowingModally);
                }
                if(nextProps.onShownModally){
                    node.on(NativeScriptView.shownModallyEvent, this.props.onShownModally);
                }
            } else {
                console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
            }
        }
        return true;
    }

    componentWillUnmount(){
        const node: NativeScriptView|null = this.myRef.current;
        if(node){
            if(this.props.onLayout){
                node.off(NativeScriptView.layoutChangedEvent, this.props.onLayout);
            }
            if(this.props.onShowingModally){
                node.off(NativeScriptView.showingModallyEvent, this.props.onShowingModally);
            }
            if(this.props.onShownModally){
                node.off(NativeScriptView.shownModallyEvent, this.props.onShownModally);
            }
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