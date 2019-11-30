// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { HtmlViewProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { HtmlView as NativeScriptHtmlView } from "@nativescript/core";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface HtmlViewAuxProps {
}
export type HtmlViewOmittedPropNames = ViewOmittedPropNames;
export type HtmlViewComponentProps = HtmlViewAuxProps & Partial<HtmlViewProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
// export function useHtmlViewEvents<
//     P extends HtmlViewComponentProps,
//     E extends NativeScriptHtmlView = NativeScriptHtmlView
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
export function useHtmlViewInheritance<
    P extends HtmlViewComponentProps,
    E extends NativeScriptHtmlView = NativeScriptHtmlView
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, HtmlViewOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    // HtmlView has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, HtmlViewOmittedPropNames>;
}

export function _HtmlView(props: React.PropsWithChildren<HtmlViewComponentProps>, ref?: React.RefObject<NativeScriptHtmlView>)
{
    ref = ref || createRef<NativeScriptHtmlView>();
    const { children, ...intrinsicProps } = useHtmlViewInheritance(ref, props);

    return React.createElement(
        "htmlView",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const HtmlView = React.forwardRef<NativeScriptHtmlView, React.PropsWithChildren<HtmlViewComponentProps>>(_HtmlView);
