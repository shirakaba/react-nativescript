import * as console from "../shared/Logger";
import * as React from "react";
import { SegmentedBarItem as NativeScriptSegmentedBarItem } from "@nativescript/core";
import { ViewBaseComponentProps, useViewBaseInheritance, ViewBaseComponentState, ViewBaseOmittedPropNames } from "./ViewBase";
import { createRef } from "react";

type SegmentedBarItemProps = Pick<NativeScriptSegmentedBarItem, "title">;

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface SegmentedBarItemAuxProps {
}
export type SegmentedBarItemOmittedPropNames = keyof SegmentedBarItemAuxProps | ViewBaseOmittedPropNames;

export type SegmentedBarItemComponentProps = SegmentedBarItemAuxProps & Partial<SegmentedBarItemProps> & ViewBaseComponentProps;

export type SegmentedBarItemComponentState = {} & ViewBaseComponentState;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useSegmentedBarItemInheritance<
    P extends SegmentedBarItemComponentProps,
    E extends NativeScriptSegmentedBarItem = NativeScriptSegmentedBarItem
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, SegmentedBarItemOmittedPropNames>
{
    const intrinsicProps = useViewBaseInheritance(ref, props);

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, SegmentedBarItemOmittedPropNames>;
}

export function _SegmentedBarItem(props: React.PropsWithChildren<SegmentedBarItemComponentProps>, ref?: React.RefObject<NativeScriptSegmentedBarItem>)
{
    ref = ref || createRef<NativeScriptSegmentedBarItem>();
    const { children, ...intrinsicProps } = useSegmentedBarItemInheritance(ref, props);

    return React.createElement(
        "segmentedBarItem",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const SegmentedBarItem = React.forwardRef<NativeScriptSegmentedBarItem, React.PropsWithChildren<SegmentedBarItemComponentProps>>(_SegmentedBarItem);
