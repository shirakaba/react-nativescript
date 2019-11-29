import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { DockLayout as NativeScriptDockLayout } from "@nativescript/core";
import { DockLayoutProps } from "../shared/NativeScriptComponentTypings";
import { LayoutBaseComponentProps, LayoutBaseOmittedPropNames, useLayoutBaseInheritance } from "./LayoutBase";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface DockLayoutAuxProps {
}
export type DockLayoutOmittedPropNames = LayoutBaseOmittedPropNames;
export type DockLayoutComponentProps = DockLayoutAuxProps & Partial<DockLayoutProps> & LayoutBaseComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useDockLayoutInheritance<
    P extends DockLayoutComponentProps,
    E extends NativeScriptDockLayout = NativeScriptDockLayout
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, DockLayoutOmittedPropNames>
{
    const intrinsicProps = useLayoutBaseInheritance(ref, props);
    // DockLayout has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, DockLayoutOmittedPropNames>;
}

export function _DockLayout(props: React.PropsWithChildren<DockLayoutComponentProps>, ref?: React.RefObject<NativeScriptDockLayout>)
{
    ref = ref || createRef<NativeScriptDockLayout>();
    const { children, ...intrinsicProps } = useDockLayoutInheritance(ref, props);

    return React.createElement(
        "dockLayout",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const DockLayout = React.forwardRef<NativeScriptDockLayout, React.PropsWithChildren<DockLayoutComponentProps>>(_DockLayout);