// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { DatePickerProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { DatePicker as NativeScriptDatePicker } from "@nativescript/core";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface DatePickerAuxProps {
    onDateChange?: (args: NarrowedEventData<NativeScriptDatePicker>) => void;
}
export type DatePickerOmittedPropNames = keyof DatePickerAuxProps | ViewOmittedPropNames;
export type DatePickerComponentProps = DatePickerAuxProps & Partial<DatePickerProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useDatePickerEvents<
    P extends DatePickerComponentProps,
    E extends NativeScriptDatePicker = NativeScriptDatePicker
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "onDateChange", props.onDateChange);
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
export function useDatePickerInheritance<
    P extends DatePickerComponentProps,
    E extends NativeScriptDatePicker = NativeScriptDatePicker
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, DatePickerOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    useDatePickerEvents(ref, props);

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, DatePickerOmittedPropNames>;
}

export function _DatePicker(props: React.PropsWithChildren<DatePickerComponentProps>, ref?: React.RefObject<NativeScriptDatePicker>)
{
    ref = ref || createRef<NativeScriptDatePicker>();
    const { children, ...intrinsicProps } = useDatePickerInheritance(ref, props);

    return React.createElement(
        "datePicker",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const DatePicker = React.forwardRef<NativeScriptDatePicker, React.PropsWithChildren<DatePickerComponentProps>>(_DatePicker);
