import * as console from "../shared/Logger";
import * as React from "react";
import { SliderProps, PropsWithoutForwardedRef, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { Slider as NativeScriptSlider } from "tns-core-modules/ui/slider/slider";
import { ViewComponentProps, RCTView } from "./View";
import { Observable, EventData } from "tns-core-modules/data/observable/observable";
import { updateListener } from "../client/EventHandling";

type NativeScriptUIElement = NativeScriptSlider;

interface Props {
    onValueChange?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
}

export type SliderComponentProps<
    E extends NativeScriptUIElement = NativeScriptUIElement
> = Props /* & typeof Slider.defaultProps */ & Partial<SliderProps> & ViewComponentProps<E>;

interface State {}

export class _Slider<P extends SliderComponentProps<E>, S extends State, E extends NativeScriptUIElement> extends RCTView<
    P,
    S,
    E
> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptUIElement>()
    // };

    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, "valueChange", this.props.onValueChange, nextProps.onValueChange);
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onValueChange) method("valueChange", this.props.onValueChange);
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
            "slider",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SliderComponentProps<NativeScriptUIElement>>;

export const Slider: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptUIElement>
> = React.forwardRef<NativeScriptUIElement, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptUIElement>) => {
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
);
