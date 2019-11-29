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
import { ViewBaseComponentProps, useViewBaseInheritance, ViewBaseComponentState, ViewBaseOmittedProps } from "./ViewBase";
import { useEventListener } from "../client/EventHandling";

/**
 * Props for the wrapping component rather than the primitive element.
 */
export interface ViewAuxProps {
    /* From View. */
    onLoaded?: (args: NarrowedEventData<NativeScriptView>) => void;
    onUnloaded?: (args: NarrowedEventData<NativeScriptView>) => void;
    onAndroidBackPressed?: (args: NarrowedEventData<NativeScriptView>) => void;
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

export type ViewComponentProps = ViewAuxProps & Partial<ViewProps> & ViewBaseComponentProps;

export type ViewComponentState = {} & ViewBaseComponentState;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useViewEvents<
    P extends ViewComponentProps,
    E extends NativeScriptView = NativeScriptView
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "loaded", props.onLoaded);
    useEventListener(ref, "unloaded", props.onUnloaded);
    useEventListener(ref, "androidBackPressed", props.onAndroidBackPressed);
    useEventListener(ref, "showingModally", props.onShowingModally);
    useEventListener(ref, "shownModally", props.onShownModally);
    useEventListener(ref, GestureTypes.tap, props.onTap);
    useEventListener(ref, GestureTypes.doubleTap, props.onDoubleTap);
    useEventListener(ref, GestureTypes.pinch, props.onPinch);
    useEventListener(ref, GestureTypes.pan, props.onPan);
    useEventListener(ref, GestureTypes.swipe, props.onSwipe);
    useEventListener(ref, GestureTypes.rotation, props.onRotation);
    useEventListener(ref, GestureTypes.longPress, props.onLongPress);
    useEventListener(ref, GestureTypes.touch, props.onTouch);
}

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useViewInheritance<
    P extends ViewComponentProps,
    E extends NativeScriptView = NativeScriptView
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ViewOmittedProps>
{
    const intrinsicProps = useViewBaseInheritance(ref, props);
    useViewEvents(ref, intrinsicProps);

    const {
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

        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    return { ...rest } as Omit<P, ViewOmittedProps>;
}

export type ViewOmittedProps = keyof Pick<ViewAuxProps,
"onLoaded"|
"onUnloaded"|
"onAndroidBackPressed"|
"onShowingModally"|
"onShownModally"|

"onTap"|
"onDoubleTap"|
"onPinch"|
"onPan"|
"onSwipe"|
"onRotation"|
"onLongPress"|
"onTouch"
> | ViewBaseOmittedProps;