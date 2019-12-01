import * as console from "../shared/Logger";
import * as React from "react";
import { TabViewItem as NativeScriptTabViewItem } from "@nativescript/core";
import { ViewBaseComponentProps, useViewBaseInheritance, ViewBaseComponentState, ViewBaseOmittedPropNames } from "./ViewBase";
import { createRef } from "react";

type TabViewItemProps = Pick<NativeScriptTabViewItem, "title">;

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface TabViewItemAuxProps {
}
export type TabViewItemOmittedPropNames = keyof TabViewItemAuxProps | ViewBaseOmittedPropNames;

export type TabViewItemComponentProps = TabViewItemAuxProps & Partial<TabViewItemProps> & ViewBaseComponentProps;

export type TabViewItemComponentState = {} & ViewBaseComponentState;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useTabViewItemInheritance<
    P extends TabViewItemComponentProps,
    E extends NativeScriptTabViewItem = NativeScriptTabViewItem
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, TabViewItemOmittedPropNames>
{
    const intrinsicProps = useViewBaseInheritance(ref, props);

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, TabViewItemOmittedPropNames>;
}

export function _TabViewItem(props: React.PropsWithChildren<TabViewItemComponentProps>, ref?: React.RefObject<NativeScriptTabViewItem>)
{
    ref = ref || createRef<NativeScriptTabViewItem>();
    const { children, ...intrinsicProps } = useTabViewItemInheritance(ref, props);

    return React.createElement(
        "tabViewItem",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const TabViewItem = React.forwardRef<NativeScriptTabViewItem, React.PropsWithChildren<TabViewItemComponentProps>>(_TabViewItem);
