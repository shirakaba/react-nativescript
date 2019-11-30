// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { ActionBarProps } from "../shared/NativeScriptComponentTypings";
import { ActionBar as NativeScriptActionBar } from "tns-core-modules/ui/action-bar/action-bar";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface ActionBarAuxProps {}
export type ActionBarOmittedPropNames = ViewOmittedPropNames;
export type ActionBarComponentProps = ActionBarAuxProps & Partial<ActionBarProps> & ViewComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useActionBarInheritance<
    P extends ActionBarComponentProps,
    E extends NativeScriptActionBar = NativeScriptActionBar
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ActionBarOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    // ActionBar has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, ActionBarOmittedPropNames>;
}

export function _ActionBar(props: React.PropsWithChildren<ActionBarComponentProps>, ref?: React.RefObject<NativeScriptActionBar>)
{
    ref = ref || createRef<NativeScriptActionBar>();
    const { children, ...intrinsicProps } = useActionBarInheritance(ref, props);

    return React.createElement(
        "actionBar",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const ActionBar = React.forwardRef<NativeScriptActionBar, React.PropsWithChildren<ActionBarComponentProps>>(_ActionBar);
