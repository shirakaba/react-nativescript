import * as React from "react";
import { ViewBaseProps } from "../shared/NativeScriptComponentTypings";
import { View as NativeScriptView, ShownModallyData } from "tns-core-modules/ui/core/view/view";
import { EventData } from "tns-core-modules/data/observable/observable";
import { GestureEventData, GestureTypes, TouchGestureEventData, SwipeGestureEventData, RotationGestureEventData, PinchGestureEventData, PanGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { ViewBaseComponentProps, RCTViewBase } from "./ViewBase";
import { updateListener } from "../client/EventHandling";

interface Props {
    /* From View. */
    onLoaded?: (args: EventData) => void;
    onUnloaded?: (args: EventData) => void;
    onAndroidBackPressed?: (args: EventData) => void;
    onShowingModally?: (args: ShownModallyData) => void;
    onShownModally?: (args: ShownModallyData) => void;

    /* The gesture handlers. */
    onTap?: (args: GestureEventData) => void;
    onDoubleTap?: (args: GestureEventData) => void;
    onPinch?: (args: PinchGestureEventData) => void;
    onPan?: (args: PanGestureEventData) => void;
    onSwipe?: (args: SwipeGestureEventData) => void;
    onRotation?: (args: RotationGestureEventData) => void;
    onLongPress?: (args: GestureEventData) => void;
    onTouch?: (args: TouchGestureEventData) => void;

    /* These are to be overridden in subclasses of View, so unlikely to be appropriate. */
    // onLayout?: (left: number, top: number, right: number, bottom: number) => void;
    // onMeasure?: (widthMeasureSpec: number, heightMeasureSpec: number) => void;
}

export type ViewComponentProps = Props & Partial<ViewBaseProps> & ViewBaseComponentProps;

export abstract class RCTView<P extends ViewComponentProps, S extends {}, E extends NativeScriptView> extends RCTViewBase<P, S, E> {
    /** From ui/core/view */
    private readonly _onLoaded = (args: EventData) => this.props.onLoaded && this.props.onLoaded(args);
    private readonly _onUnloaded = (args: EventData) => this.props.onUnloaded && this.props.onUnloaded(args);
    private readonly _onAndroidBackPressed = (args: EventData) => this.props.onAndroidBackPressed && this.props.onAndroidBackPressed(args);
    private readonly _onShowingModally = (args: ShownModallyData) => this.props.onShowingModally && this.props.onShowingModally(args);
    private readonly _onShownModally = (args: ShownModallyData) => this.props.onShownModally && this.props.onShownModally(args);
    
    /** From ui/gestures. */
    private readonly _onTap = (args: GestureEventData) => this.props.onTap && this.props.onTap(args);
    private readonly _onDoubleTap = (args: GestureEventData) => this.props.onDoubleTap && this.props.onDoubleTap(args);
    private readonly _onPinch = (args: PinchGestureEventData) => this.props.onPinch && this.props.onPinch(args);
    private readonly _onPan = (args: PanGestureEventData) => this.props.onPan && this.props.onPan(args);
    private readonly _onSwipe = (args: SwipeGestureEventData) => this.props.onSwipe && this.props.onSwipe(args);
    private readonly _onRotation = (args: RotationGestureEventData) => this.props.onRotation && this.props.onRotation(args);
    private readonly _onLongPress = (args: GestureEventData) => this.props.onLongPress && this.props.onLongPress(args);
    private readonly _onTouch = (args: TouchGestureEventData) => this.props.onTouch && this.props.onTouch(args);

    componentDidMount(){
        const node: E|null = this.myRef.current;
        if(node){
            node.on("loaded", this._onLoaded);
            node.on("unloaded", this._onUnloaded);
            node.on("androidBackPressed", this._onAndroidBackPressed);
            node.on("showingModally", this._onShowingModally);
            node.on("shownModally", this._onShownModally);
            node.on(GestureTypes.tap, this._onTap);
            node.on(GestureTypes.doubleTap, this._onDoubleTap);
            node.on(GestureTypes.pinch, this._onPinch);
            node.on(GestureTypes.pan, this._onPan);
            node.on(GestureTypes.swipe, this._onSwipe);
            node.on(GestureTypes.rotation, this._onRotation);
            node.on(GestureTypes.longPress, this._onLongPress);
            node.on(GestureTypes.touch, this._onTouch);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to attach event listeners.`);
        }
    }

    componentWillUnmount(){
        const node: E|null = this.myRef.current;
        if(node){
            node.off("loaded", this._onLoaded);
            node.off("unloaded", this._onUnloaded);
            node.off("androidBackPressed", this._onAndroidBackPressed);
            node.off("showingModally", this._onShowingModally);
            node.off("shownModally", this._onShownModally);
            node.off(GestureTypes.tap, this._onTap);
            node.off(GestureTypes.doubleTap, this._onDoubleTap);
            node.off(GestureTypes.pinch, this._onPinch);
            node.off(GestureTypes.pan, this._onPan);
            node.off(GestureTypes.swipe, this._onSwipe);
            node.off(GestureTypes.rotation, this._onRotation);
            node.off(GestureTypes.longPress, this._onLongPress);
            node.off(GestureTypes.touch, this._onTouch);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to clean up event listeners.`);
        }
    }

    abstract render(): React.ReactNode;
}