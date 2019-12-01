// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { FrameProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";
import { NavigatedData, Frame as NativeScriptFrame } from "@nativescript/core";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface FrameAuxProps {
    onOptionSelected?: (args: NarrowedEventData<NativeScriptFrame>) => void;
}
export type FrameOmittedPropNames = keyof FrameAuxProps | ViewOmittedPropNames;

export type FrameNavigationEventHandler = (args: NavigatedData) => void;

export type FrameComponentProps = FrameAuxProps & Partial<FrameProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useFrameEvents<
    P extends FrameComponentProps,
    E extends NativeScriptFrame = NativeScriptFrame
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "optionSelected", props.onOptionSelected);
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
export function useFrameInheritance<
    P extends FrameComponentProps,
    E extends NativeScriptFrame = NativeScriptFrame
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, FrameOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    useFrameEvents(ref, intrinsicProps);

    const {
        onOptionSelected,
        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, FrameOmittedPropNames>;
}

/**
 * A React wrapper around the NativeScript Frame component.
 * See: ui/Frame/Frame
 */
export function _Frame(props: React.PropsWithChildren<FrameComponentProps>, ref?: React.RefObject<NativeScriptFrame>)
{
    // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    ref = ref || createRef<NativeScriptFrame>();

    const { children, ...intrinsicProps } = useFrameInheritance(ref, props);

    return React.createElement(
        "frame",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const Frame = React.forwardRef<NativeScriptFrame, React.PropsWithChildren<FrameComponentProps>>(_Frame);
