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

    /**
     * 
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(attach: boolean|null, nextProps?: P): void {
        const node: E|null = this.myRef.current;
        if(node){
            if(attach === null){
                updateListener(node, "propertyChange", this.props.onPropertyChange, nextProps.onPropertyChange);
            } else {
                const method = attach ? node.on : node.off;
                if(this.props.onPropertyChange) method("propertyChange", this.props.onPropertyChange);
            }
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    componentDidMount(){
        this.updateListeners(true);
    }

    /**
     * PureComponent's shouldComponentUpdate() method is ignored and replaced with a shallowEqual()
     * comparison of props and state. We'll implement our Component's shouldComponentUpdate() to
     * match the way PureComponent is handled.
     */
    shouldComponentUpdate(nextProps: P, nextState: S): boolean {
        this.updateListeners(null, nextProps);
        
        // https://lucybain.com/blog/2018/react-js-pure-component/
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }

    componentWillUnmount(){
        this.updateListeners(false);
    }

    abstract render(): React.ReactNode;
}