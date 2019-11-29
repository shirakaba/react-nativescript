// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { ContentViewProps } from "../shared/NativeScriptComponentTypings";
import { ContentView as NativeScriptContentView } from "tns-core-modules/ui/content-view/content-view";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface ContentViewAuxProps {}
export type ContentViewOmittedPropNames = ViewOmittedPropNames;
export type ContentViewComponentProps = ContentViewAuxProps & Partial<ContentViewProps> & ViewComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useContentViewInheritance<
    P extends ContentViewComponentProps,
    E extends NativeScriptContentView = NativeScriptContentView
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ContentViewOmittedPropNames>
{
    console.log(`[useContentViewInheritance] Entered.`);
    const intrinsicProps = useViewInheritance(ref, props);
    console.log(`[useContentViewInheritance] used useViewInheritance. Shall now return intrinsic props.`);
    // ContentView has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, ContentViewOmittedPropNames>;
}

export function _ContentView(props: React.PropsWithChildren<ContentViewComponentProps>, ref?: React.RefObject<NativeScriptContentView>)
{
    ref = ref || createRef<NativeScriptContentView>();
    const { children, ...intrinsicProps} = useContentViewInheritance(ref, props);

    return React.createElement(
        "contentView",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const ContentView = React.forwardRef<NativeScriptContentView, React.PropsWithChildren<ContentViewComponentProps>>(_ContentView);
