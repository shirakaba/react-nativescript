// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { SliderProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";
import { ScrollEventData, NavigatedData, Slider as NativeScriptSlider } from "@nativescript/core";
import { SelectedIndexChangedEventData } from "@nativescript/core/ui/segmented-bar/segmented-bar";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface SliderAuxProps {
    onValueChange?: (args: NarrowedEventData<NativeScriptSlider>) => void;
}
export type SliderOmittedPropNames = keyof SliderAuxProps | ViewOmittedPropNames;

export type SliderNavigationEventHandler = (args: NavigatedData) => void;

export type SliderComponentProps = SliderAuxProps & Partial<SliderProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useSliderEvents<
    P extends SliderComponentProps,
    E extends NativeScriptSlider = NativeScriptSlider
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "valueChange", props.onValueChange);
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
export function useSliderInheritance<
    P extends SliderComponentProps,
    E extends NativeScriptSlider = NativeScriptSlider
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, SliderOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    useSliderEvents(ref, intrinsicProps);

    const {
        onValueChange,
        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, SliderOmittedPropNames>;
}

/**
 * A React wrapper around the NativeScript Slider component.
 * See: ui/Slider/Slider
 */
export function _Slider(props: React.PropsWithChildren<SliderComponentProps>, ref?: React.RefObject<NativeScriptSlider>)
{
    // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    ref = ref || createRef<NativeScriptSlider>();

    const { children, ...intrinsicProps } = useSliderInheritance(ref, props);

    return React.createElement(
        "slider",
        {
            ...intrinsicProps,
            ref,
        },
        /* For now, any SliderItem children will be mapped to items by our React renderer. */
        children
    );
}

export const Slider = React.forwardRef<NativeScriptSlider, React.PropsWithChildren<SliderComponentProps>>(_Slider);
