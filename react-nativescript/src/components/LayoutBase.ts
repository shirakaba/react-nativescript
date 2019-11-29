import * as console from "../shared/Logger";
import * as React from "react";
import { CustomLayoutViewProps, LayoutBaseProps } from "../shared/NativeScriptComponentTypings";
import { LayoutBase as NativeScriptLayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { CustomLayoutViewComponentProps, CustomLayoutViewOmittedPropNames, useCustomLayoutViewInheritance } from "./CustomLayoutView";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface LayoutBaseAuxProps {}
export type LayoutBaseOmittedPropNames = CustomLayoutViewOmittedPropNames;
export type LayoutBaseComponentProps = LayoutBaseAuxProps & Partial<LayoutBaseProps> & CustomLayoutViewComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useLayoutBaseInheritance<
    P extends CustomLayoutViewComponentProps,
    E extends NativeScriptLayoutBase = NativeScriptLayoutBase
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, CustomLayoutViewOmittedPropNames>
{
    const intrinsicProps = useCustomLayoutViewInheritance(ref, props);
    // LayoutBaseOmittedPropNames has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, LayoutBaseOmittedPropNames>;
}


