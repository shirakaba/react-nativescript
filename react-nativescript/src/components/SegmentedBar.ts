// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { SegmentedBarProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";
import { ScrollEventData, NavigatedData, SegmentedBar as NativeScriptSegmentedBar } from "@nativescript/core";
import { SelectedIndexChangedEventData } from "@nativescript/core/ui/segmented-bar/segmented-bar";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface SegmentedBarAuxProps {
    onSelectedIndexChanged?: (args: SelectedIndexChangedEventData) => void;

}
export type SegmentedBarOmittedPropNames = "items" | keyof SegmentedBarAuxProps | ViewOmittedPropNames;

export type SegmentedBarNavigationEventHandler = (args: NavigatedData) => void;

export type SegmentedBarComponentProps = SegmentedBarAuxProps & Partial<SegmentedBarProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useSegmentedBarEvents<
    P extends SegmentedBarComponentProps,
    E extends NativeScriptSegmentedBar = NativeScriptSegmentedBar
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "selectedIndexChanged", props.onSelectedIndexChanged);

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
export function useSegmentedBarInheritance<
    P extends SegmentedBarComponentProps,
    E extends NativeScriptSegmentedBar = NativeScriptSegmentedBar
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, SegmentedBarOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    useSegmentedBarEvents(ref, intrinsicProps);

    const {
        items, // We intercept this from being passed as a prop; our Host Config will map children to items implicitly instead.
        onSelectedIndexChanged,
        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, SegmentedBarOmittedPropNames>;
}

/**
 * A React wrapper around the NativeScript SegmentedBar component.
 * See: ui/SegmentedBar/SegmentedBar
 */
export function _SegmentedBar(props: React.PropsWithChildren<SegmentedBarComponentProps>, ref?: React.RefObject<NativeScriptSegmentedBar>)
{
    // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    ref = ref || createRef<NativeScriptSegmentedBar>();

    const { children, ...intrinsicProps } = useSegmentedBarInheritance(ref, props);

    return React.createElement(
        "segmentedBar",
        {
            ...intrinsicProps,
            ref,
        },
        /* For now, any SegmentedBarItem children will be mapped to items by our React renderer. */
        children
    );
}

export const SegmentedBar = React.forwardRef<NativeScriptSegmentedBar, React.PropsWithChildren<SegmentedBarComponentProps>>(_SegmentedBar);
