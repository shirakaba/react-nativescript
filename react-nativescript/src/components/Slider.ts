import * as React from "react";
import { SliderProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Slider as NativeScriptSlider } from "tns-core-modules/ui/slider/slider";
import { ViewComponentProps, RCTView } from "./View";
import { Observable, EventData } from "tns-core-modules/data/observable/observable";

interface Props {
    onValueChange?: (args: number) => void,
}

export type SliderComponentProps<E extends NativeScriptSlider = NativeScriptSlider> = Props /* & typeof Slider.defaultProps */ & Partial<SliderProps> & ViewComponentProps<E>;

interface State {
}

export class _Slider<P extends SliderComponentProps<E>, S extends State, E extends NativeScriptSlider> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptSlider>()
    // };

    onValueChange = (slargs: EventData) => {
        const sliderValue: number = (<NativeScriptSlider>slargs.object).value;

        this.props.onValueChange && this.props.onValueChange(sliderValue);
    };

    componentDidMount(){
        super.componentDidMount();

        const ref = this.props.forwardedRef || this.myRef;
        const node: E|null = ref.current;
        if(node){
            node.on("valueChange", this.onValueChange);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    componentWillUnmount(){
        super.componentWillUnmount();

        const ref = this.props.forwardedRef || this.myRef;
        const node: E|null = ref.current;
        if(node){
            node.off("valueChange", this.onValueChange);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    render(): React.ReactNode {
        const {
            forwardedRef,

            onValueChange,

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
            ...rest
        } = this.props;

        return React.createElement(
            'slider',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SliderComponentProps<NativeScriptSlider>>;

export const Slider: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptSlider>> = React.forwardRef<NativeScriptSlider, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptSlider>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Slider,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)