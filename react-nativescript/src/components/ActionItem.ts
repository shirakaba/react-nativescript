import * as console from "../shared/Logger";
import * as React from "react";
import { ActionItemProps } from "../shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, useViewBaseInheritance, ViewBaseComponentState, ViewBaseOmittedPropNames } from "./ViewBase";
import { createRef } from "react";
import { GestureEventData, ActionItem as NativeScriptActionItem } from "@nativescript/core";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface ActionItemAuxProps {
    onTap?: (args: GestureEventData) => void;
}
export type ActionItemOmittedPropNames = keyof ActionItemAuxProps | ViewBaseOmittedPropNames;

export type ActionItemComponentProps = ActionItemAuxProps & Partial<ActionItemProps> & ViewBaseComponentProps;

export type ActionItemComponentState = {} & ViewBaseComponentState;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useActionItemEvents<
    P extends ActionItemComponentProps,
    E extends NativeScriptActionItem = NativeScriptActionItem
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "onTap", props.onTap);
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
export function useActionItemInheritance<
    P extends ActionItemComponentProps,
    E extends NativeScriptActionItem = NativeScriptActionItem
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ActionItemOmittedPropNames>
{
    const intrinsicProps = useViewBaseInheritance(ref, props);

    const {
        onTap,
        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, ActionItemOmittedPropNames>;
}

export function _ActionItem(props: React.PropsWithChildren<ActionItemComponentProps>, ref?: React.RefObject<NativeScriptActionItem>)
{
    ref = ref || createRef<NativeScriptActionItem>();
    const { children, ...intrinsicProps } = useActionItemInheritance(ref, props);

    return React.createElement(
        "actionItem",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const ActionItem = React.forwardRef<NativeScriptActionItem, React.PropsWithChildren<ActionItemComponentProps>>(_ActionItem);
