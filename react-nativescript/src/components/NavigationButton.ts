// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { NavigationButtonProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { NavigationButton as NativeScriptNavigationButton } from "@nativescript/core";
import { ActionItemComponentProps, useActionItemInheritance, ActionItemOmittedPropNames } from "./ActionItem";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface NavigationButtonAuxProps {
}
export type NavigationButtonOmittedPropNames = ActionItemOmittedPropNames;
export type NavigationButtonComponentProps = NavigationButtonAuxProps & Partial<NavigationButtonProps> & ActionItemComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
// export function useNavigationButtonEvents<
//     P extends NavigationButtonComponentProps,
//     E extends NativeScriptNavigationButton = NativeScriptNavigationButton
// >(
//     ref: React.RefObject<E>,
//     props: P
// ): void
// {
//     useEventListener(ref, "onDateChange", props.onDateChange);
// }

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useNavigationButtonInheritance<
    P extends NavigationButtonComponentProps,
    E extends NativeScriptNavigationButton = NativeScriptNavigationButton
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, NavigationButtonOmittedPropNames>
{
    const intrinsicProps = useActionItemInheritance(ref, props);
    // actionView, /* We don't need to omit actionView because we set this at the typings level. */

    // NavigationButton has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, NavigationButtonOmittedPropNames>;
}

export function _NavigationButton(props: React.PropsWithChildren<NavigationButtonComponentProps>, ref?: React.RefObject<NativeScriptNavigationButton>)
{
    ref = ref || createRef<NativeScriptNavigationButton>();
    const { children, ...intrinsicProps } = useNavigationButtonInheritance(ref, props);

    return React.createElement(
        "navigationButton",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const NavigationButton = React.forwardRef<NativeScriptNavigationButton, React.PropsWithChildren<NavigationButtonComponentProps>>(_NavigationButton);
