import * as React from "react";
import { ViewBaseProps } from "../shared/NativeScriptComponentTypings";
import { View as NativeScriptView, ShownModallyData } from "tns-core-modules/ui/core/view/view";
import { EventData } from "tns-core-modules/data/observable/observable";
import { GestureEventData, GestureTypes, TouchGestureEventData, SwipeGestureEventData, RotationGestureEventData, PinchGestureEventData, PanGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { ViewBaseComponentProps, RCTViewBase } from "./ViewBase";
import { updateListener } from "../client/EventHandling";
import { shallowEqual } from "src/client/shallowEqual";

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
    componentDidMount(){
        super.componentDidMount();

        const node: E|null = this.myRef.current;
        if(node){
            if(this.props.onLoaded) node.on("loaded", this.props.onLoaded);
            if(this.props.onUnloaded) node.on("unloaded", this.props.onUnloaded);
            if(this.props.onAndroidBackPressed) node.on("androidBackPressed", this.props.onAndroidBackPressed);
            if(this.props.onShowingModally) node.on("showingModally", this.props.onShowingModally);
            if(this.props.onShownModally) node.on("shownModally", this.props.onShownModally);
            if(this.props.onTap) node.on(GestureTypes.tap, this.props.onTap);
            if(this.props.onDoubleTap) node.on(GestureTypes.doubleTap, this.props.onDoubleTap);
            if(this.props.onPinch) node.on(GestureTypes.pinch, this.props.onPinch);
            if(this.props.onPan) node.on(GestureTypes.pan, this.props.onPan);
            if(this.props.onSwipe) node.on(GestureTypes.swipe, this.props.onSwipe);
            if(this.props.onRotation) node.on(GestureTypes.rotation, this.props.onRotation);
            if(this.props.onLongPress) node.on(GestureTypes.longPress, this.props.onLongPress);
            if(this.props.onTouch) node.on(GestureTypes.touch, this.props.onTouch);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to attach event listeners.`);
        }
    }

    shouldComponentUpdate(nextProps: P, nextState: S): boolean {
        const node: E|null = this.myRef.current;
        if(node){
            updateListener(node, "loaded", this.props.onLoaded, nextProps.onLoaded);
            updateListener(node, "unloaded", this.props.onUnloaded, nextProps.onUnloaded);
            updateListener(node, "androidBackPressed", this.props.onAndroidBackPressed, nextProps.onAndroidBackPressed);
            updateListener(node, "showingModally", this.props.onShowingModally, nextProps.onShowingModally);
            updateListener(node, "shownModally", this.props.onShownModally, nextProps.onShownModally);
            updateListener(node, GestureTypes.tap, this.props.onTap, nextProps.onTap);
            updateListener(node, GestureTypes.doubleTap, this.props.onDoubleTap, nextProps.onDoubleTap);
            updateListener(node, GestureTypes.pinch, this.props.onPinch, nextProps.onPinch);
            updateListener(node, GestureTypes.pan, this.props.onPan, nextProps.onPan);
            updateListener(node, GestureTypes.swipe, this.props.onSwipe, nextProps.onSwipe);
            updateListener(node, GestureTypes.rotation, this.props.onRotation, nextProps.onRotation);
            updateListener(node, GestureTypes.longPress, this.props.onLongPress, nextProps.onLongPress);
            updateListener(node, GestureTypes.touch, this.props.onTouch, nextProps.onTouch);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to attach event listeners.`);
        }
        
        return super.shouldComponentUpdate(nextProps, nextState);
    }

    componentWillUnmount(){
        super.componentWillUnmount();

        const node: E|null = this.myRef.current;
        if(node){
            if(this.props.onLoaded) node.off("loaded", this.props.onLoaded);
            if(this.props.onUnloaded) node.off("unloaded", this.props.onUnloaded);
            if(this.props.onAndroidBackPressed) node.off("androidBackPressed", this.props.onAndroidBackPressed);
            if(this.props.onShowingModally) node.off("showingModally", this.props.onShowingModally);
            if(this.props.onShownModally) node.off("shownModally", this.props.onShownModally);
            if(this.props.onTap) node.off(GestureTypes.tap, this.props.onTap);
            if(this.props.onDoubleTap) node.off(GestureTypes.doubleTap, this.props.onDoubleTap);
            if(this.props.onPinch) node.off(GestureTypes.pinch, this.props.onPinch);
            if(this.props.onPan) node.off(GestureTypes.pan, this.props.onPan);
            if(this.props.onSwipe) node.off(GestureTypes.swipe, this.props.onSwipe);
            if(this.props.onRotation) node.off(GestureTypes.rotation, this.props.onRotation);
            if(this.props.onLongPress) node.off(GestureTypes.longPress, this.props.onLongPress);
            if(this.props.onTouch) node.off(GestureTypes.touch, this.props.onTouch);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to clean up event listeners.`);
        }
    }

    abstract render(): React.ReactNode;
}