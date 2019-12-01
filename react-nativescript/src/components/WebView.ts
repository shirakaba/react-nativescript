// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { WebViewProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { WebView as NativeScriptWebView } from "@nativescript/core";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";
import { LoadEventData } from "@nativescript/core/ui/web-view/web-view";

interface NarrowedLoadEventData extends LoadEventData {
    object: NativeScriptWebView;
}

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface WebViewAuxProps {
    onUrlChange?: (args: NarrowedEventData<NativeScriptWebView>) => void;
    onLoadFinished?: (args: NarrowedLoadEventData) => void;
    onLoadStarted?: (args: NarrowedLoadEventData) => void;
}
export type WebViewOmittedPropNames = ViewOmittedPropNames;
export type WebViewComponentProps = WebViewAuxProps & Partial<WebViewProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useWebViewEvents<
    P extends WebViewComponentProps,
    E extends NativeScriptWebView = NativeScriptWebView
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "urlChange", props.onUrlChange);
    useEventListener(ref, "loadFinished", props.onLoadFinished);
    useEventListener(ref, "loadStarted", props.onLoadStarted);
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
export function useWebViewInheritance<
    P extends WebViewComponentProps,
    E extends NativeScriptWebView = NativeScriptWebView
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, WebViewOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    // WebView has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, WebViewOmittedPropNames>;
}

export function _WebView(props: React.PropsWithChildren<WebViewComponentProps>, ref?: React.RefObject<NativeScriptWebView>)
{
    ref = ref || createRef<NativeScriptWebView>();
    const { children, ...intrinsicProps } = useWebViewInheritance(ref, props);

    return React.createElement(
        "webView",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const WebView = React.forwardRef<NativeScriptWebView, React.PropsWithChildren<WebViewComponentProps>>(_WebView);
