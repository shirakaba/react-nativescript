// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { TimePickerProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { TimePicker as NativeScriptTimePicker } from "@nativescript/core";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface TimePickerAuxProps {
    onTimeChange?: (args: NarrowedEventData<NativeScriptTimePicker>) => void;
}
export type TimePickerOmittedPropNames = keyof TimePickerAuxProps | ViewOmittedPropNames;
export type TimePickerComponentProps = TimePickerAuxProps & Partial<TimePickerProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useTimePickerEvents<
    P extends TimePickerComponentProps,
    E extends NativeScriptTimePicker = NativeScriptTimePicker
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "timeChange", props.onTimeChange);
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
export function useTimePickerInheritance<
    P extends TimePickerComponentProps,
    E extends NativeScriptTimePicker = NativeScriptTimePicker
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, TimePickerOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    useTimePickerEvents(ref, props);

    const {
        onTimeChange,
        ...rest
    } = intrinsicProps;

    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, TimePickerOmittedPropNames>;
}

export function _TimePicker(props: React.PropsWithChildren<TimePickerComponentProps>, ref?: React.RefObject<NativeScriptTimePicker>)
{
    ref = ref || createRef<NativeScriptTimePicker>();
    const { children, ...intrinsicProps } = useTimePickerInheritance(ref, props);

    return React.createElement(
        "timePicker",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const TimePicker = React.forwardRef<NativeScriptTimePicker, React.PropsWithChildren<TimePickerComponentProps>>(_TimePicker);
