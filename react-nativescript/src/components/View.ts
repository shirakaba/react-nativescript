import * as console from "../shared/Logger";
import * as React from "react";
import { ViewProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { View as NativeScriptView, ShownModallyData } from "tns-core-modules/ui/core/view/view";
import {
    GestureEventData,
    GestureTypes,
    TouchGestureEventData,
    SwipeGestureEventData,
    RotationGestureEventData,
    PinchGestureEventData,
    PanGestureEventData,
} from "tns-core-modules/ui/gestures/gestures";
import { ViewBaseComponentProps, useViewBaseInheritance, ViewBaseComponentState } from "./ViewBase";
import { useEventListener } from "../client/EventHandling";

type NativeScriptUIElement = NativeScriptView;

interface Props {
    /* From View. */
    onLoaded?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
    onUnloaded?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
    onAndroidBackPressed?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
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

export type ViewComponentProps<
    E extends NativeScriptUIElement = NativeScriptUIElement
> = Props /* & typeof RCTView.defaultProps */ & Partial<ViewProps> & ViewBaseComponentProps<E>;

export type ViewComponentState = {} & ViewBaseComponentState;

export function useViewEvents<
    P extends ViewComponentProps<E>,
    E extends NativeScriptUIElement = NativeScriptUIElement
>(
    node: E,
    props: P
): void
{
    useEventListener(node, "loaded", props.onLoaded);
    useEventListener(node, "unloaded", props.onUnloaded);
    useEventListener(node, "androidBackPressed", props.onAndroidBackPressed);
    useEventListener(node, "showingModally", props.onShowingModally);
    useEventListener(node, "shownModally", props.onShownModally);
    useEventListener(node, GestureTypes.tap, props.onTap);
    useEventListener(node, GestureTypes.doubleTap, props.onDoubleTap);
    useEventListener(node, GestureTypes.pinch, props.onPinch);
    useEventListener(node, GestureTypes.pan, props.onPan);
    useEventListener(node, GestureTypes.swipe, props.onSwipe);
    useEventListener(node, GestureTypes.rotation, props.onRotation);
    useEventListener(node, GestureTypes.longPress, props.onLongPress);
    useEventListener(node, GestureTypes.touch, props.onTouch);
}

export function useViewInheritance<
    P extends ViewComponentProps<E>,
    E extends NativeScriptUIElement = NativeScriptUIElement
>(
    node: E,
    props: P
): void
{
    useViewBaseInheritance(node, props);
    useViewEvents(node, props);
}