import * as React from "react";
import { ObservableProps } from "../shared/NativeScriptComponentTypings";
import { Observable as NativeScriptObservable, EventData } from "tns-core-modules/data/observable/observable";
import { updateListener } from "../client/EventHandling";
import { shallowEqual } from "../client/shallowEqual";

interface Props {
    /* From Observable. */
    onPropertyChange?: (data: EventData) => void;
}

export type ObservableComponentProps = Props & Partial<ObservableProps>;

export abstract class RCTObservable<P extends ObservableComponentProps, S extends {}, E extends NativeScriptObservable> extends React.Component<P, S> {
    protected readonly myRef: React.RefObject<E> = React.createRef<E>();
    
    /** From data/observable. */
    private readonly _onPropertyChange = (data: EventData) => this.props.onPropertyChange && this.props.onPropertyChange(data);

    componentDidMount(){
        const node: E|null = this.myRef.current;
        if(node){
            node.on("propertyChange", this._onPropertyChange);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to attach event listeners.`);
        }
    }

    /**
     * PureComponent's shouldComponentUpdate() method is ignored and replaced with a shallowEqual()
     * comparison of props and state. We'll implement our Component's shouldComponentUpdate() to
     * match the way PureComponent is handled.
     */
    shouldComponentUpdate(nextProps: P, nextState: S){
        const node: E|null = this.myRef.current;
        if(node){
            updateListener(node, "propertyChange", this.props.onPropertyChange, nextProps.onPropertyChange);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to attach event listeners.`);
        }
        
        // https://lucybain.com/blog/2018/react-js-pure-component/
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }

    componentWillUnmount(){
        const node: E|null = this.myRef.current;
        if(node){
            node.off("propertyChange", this._onPropertyChange);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to clean up event listeners.`);
        }
    }

    abstract render(): React.ReactNode;
}