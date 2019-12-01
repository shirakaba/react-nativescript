// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { SwitchProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";
import { ScrollEventData, NavigatedData, Switch as NativeScriptSwitch } from "@nativescript/core";
import { SelectedIndexChangedEventData } from "@nativescript/core/ui/segmented-bar/segmented-bar";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface SwitchAuxProps {
    onCheckedChange?: (args: NarrowedEventData<NativeScriptSwitch>) => void;
}
export type SwitchOmittedPropNames = keyof SwitchAuxProps | ViewOmittedPropNames;

export type SwitchNavigationEventHandler = (args: NavigatedData) => void;

export type SwitchComponentProps = SwitchAuxProps & Partial<SwitchProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useSwitchEvents<
    P extends SwitchComponentProps,
    E extends NativeScriptSwitch = NativeScriptSwitch
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "checkedChange", props.onCheckedChange);
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
export function useSwitchInheritance<
    P extends SwitchComponentProps,
    E extends NativeScriptSwitch = NativeScriptSwitch
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, SwitchOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    useSwitchEvents(ref, intrinsicProps);

    const {
        onCheckedChange,
        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, SwitchOmittedPropNames>;
}

/**
 * A React wrapper around the NativeScript Switch component.
 * See: ui/Switch/Switch
 */
export function _Switch(props: React.PropsWithChildren<SwitchComponentProps>, ref?: React.RefObject<NativeScriptSwitch>)
{
    // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    ref = ref || createRef<NativeScriptSwitch>();

    const { children, ...intrinsicProps } = useSwitchInheritance(ref, props);

    return React.createElement(
        "switch",
        {
            ...intrinsicProps,
            ref,
        },
        /* For now, any SwitchItem children will be mapped to items by our React renderer. */
        children
    );
}

export const Switch = React.forwardRef<NativeScriptSwitch, React.PropsWithChildren<SwitchComponentProps>>(_Switch);
