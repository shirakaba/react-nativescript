// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { ListPickerProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { ListPicker as NativeScriptListPicker, ItemsSource } from "@nativescript/core";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface ListPickerAuxProps {
    items: any[] | ItemsSource;
    onSelectedIndexChange?: (args: NarrowedEventData<NativeScriptListPicker>) => void;
}
export type ListPickerOmittedPropNames = keyof Pick<ListPickerAuxProps, "onSelectedIndexChange"> | ViewOmittedPropNames;
export type ListPickerComponentProps = ListPickerAuxProps & Partial<ListPickerProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useListPickerEvents<
    P extends ListPickerComponentProps,
    E extends NativeScriptListPicker = NativeScriptListPicker
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "selectedIndexChange", props.onSelectedIndexChange);
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
export function useListPickerInheritance<
    P extends ListPickerComponentProps,
    E extends NativeScriptListPicker = NativeScriptListPicker
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ListPickerOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    useListPickerEvents(ref, intrinsicProps);

    const {
        onSelectedIndexChange,
        ...rest
    } = intrinsicProps;

    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, ListPickerOmittedPropNames>;
}

export function _ListPicker(props: React.PropsWithChildren<ListPickerComponentProps>, ref?: React.RefObject<NativeScriptListPicker>)
{
    ref = ref || createRef<NativeScriptListPicker>();
    const { children, ...intrinsicProps } = useListPickerInheritance(ref, props);

    return React.createElement(
        "listPicker",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const ListPicker = React.forwardRef<NativeScriptListPicker, React.PropsWithChildren<ListPickerComponentProps>>(_ListPicker);
