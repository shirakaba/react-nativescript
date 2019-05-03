import * as React from "react";
import { ObservableProps } from "../shared/NativeScriptComponentTypings";
import { Observable as NativeScriptObservable, EventData } from "tns-core-modules/data/observable/observable";
import { updateListener } from "../client/EventHandling";
import { shallowEqual } from "../client/shallowEqual";
import { GestureTypes } from "tns-core-modules/ui/gestures/gestures";

interface Props<E extends NativeScriptObservable = NativeScriptObservable> {
    forwardedRef?: React.RefObject<E>,

    /* From Observable. */
    onPropertyChange?: (data: EventData) => void;
}

export type ObservableComponentProps<E extends NativeScriptObservable = NativeScriptObservable> = Props<E> /* & typeof RCTObservable.defaultProps */ & Partial<ObservableProps>;

export abstract class RCTObservable<P extends ObservableComponentProps<E>, S extends {}, E extends NativeScriptObservable> extends React.Component<P, S> {
    protected readonly myRef: React.RefObject<E> = React.createRef<E>();

    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptObservable>()
    // };

    /**
     * 
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(attach: boolean|null, nextProps?: P): void {
        const ref = this.props.forwardedRef || this.myRef;
        // console.log(`[updateListeners()] using ${ref === this.myRef ? "default ref" : "forwarded ref"}`);

        const node: E|null = ref.current;
        if(node){
            if(attach === null){
                updateListener(node, "propertyChange", this.props.onPropertyChange, nextProps.onPropertyChange);
            } else {
                const method = (attach ? node.on : node.off).bind(node);
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
        const shouldUpdate: boolean = !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
        // console.log(`[shouldComponentUpdate] shouldUpdate: ${shouldUpdate}.`);

        this.updateListeners(null, nextProps);
        
        // https://lucybain.com/blog/2018/react-js-pure-component/
        return shouldUpdate;
    }

    componentWillUnmount(){
        this.updateListeners(false);
    }

    abstract render(): React.ReactNode;
}