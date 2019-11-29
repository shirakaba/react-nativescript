// import * as console from "../shared/Logger";
import * as React from "react";
import { ContentViewProps } from "../shared/NativeScriptComponentTypings";
import { ContentView as NativeScriptContentView } from "tns-core-modules/ui/content-view/content-view";
import { ViewComponentProps, useViewInheritance, ViewOmittedProps } from "./View";

/**
 * Props for the wrapping component rather than the primitive element.
 */
export interface ContentViewAuxProps {}

export type ContentViewComponentProps = ContentViewAuxProps & Partial<ContentViewProps> & ViewComponentProps;

export function _ContentView<
    P extends ContentViewComponentProps,
    E extends NativeScriptContentView = NativeScriptContentView
>(props: React.PropsWithChildren<P>, ref: React.RefObject<E>)
{
    const intrinsicProps = useContentViewInheritance(ref, props);

    return React.createElement(
        "contentView",
        {
            ...intrinsicProps,
            ref,
        },
        null
    );
}

export const ContentView = React.forwardRef(_ContentView);

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
): Omit<P, ContentViewOmittedProps>
{
    console.log(`[useContentViewInheritance] Entered.`);
    const intrinsicProps = useViewInheritance(ref, props);
    console.log(`[useContentViewInheritance] used useViewInheritance. Shall now return intrinsic props.`);
    // ContentView has no events of its own to handle

    return intrinsicProps as Omit<P, ContentViewOmittedProps>;
}

export type ContentViewOmittedProps = ViewOmittedProps;