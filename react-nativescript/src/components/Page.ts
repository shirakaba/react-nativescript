// import * as console from "../shared/Logger";
import * as React from "react";
import { PageProps } from "../shared/NativeScriptComponentTypings";
import { Page as NativeScriptPage, NavigatedData } from "tns-core-modules/ui/page/page";
import { _ContentView, ContentViewComponentProps, useContentViewInheritance } from "./ContentView";
import { useEventListener } from "../client/EventHandling";

/**
 * Props for the wrapping component rather than the primitive element.
 */
export interface PageAuxProps {
    onNavigatingTo?: PageNavigationEventHandler;
    onNavigatedTo?: PageNavigationEventHandler;
    onNavigatingFrom?: PageNavigationEventHandler;
    onNavigatedFrom?: PageNavigationEventHandler;
}

export type PageNavigationEventHandler = (args: NavigatedData) => void;

export type PageComponentProps = PageAuxProps & Partial<PageProps> & ContentViewComponentProps;

/**
 * A React wrapper around the NativeScript Page component.
 * See: ui/page/page
 */
export function _Page(props: React.PropsWithChildren<PageComponentProps>, ref: React.RefObject<NativeScriptPage>)
{
    // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    // const inputRef = useRef();

    console.log(`[_Page.render()] entered. ref.current:`, ref.current);
    const intrinsicProps = usePageInheritance(ref, props);
    console.log(`[_Page.render()] performed usePageInheritance; returning ReactElement now.`);

    return React.createElement(
        "page",
        {
            ...intrinsicProps,
            ref,
        },
        null
    );
}

// export const Page = React.forwardRef<React.PropsWithChildren<PropsWithoutForwardedRef<PageComponentProps>>>(_Page);
export const Page = React.forwardRef(_Page);

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function usePageEvents<
    P extends PageComponentProps,
    E extends NativeScriptPage = NativeScriptPage
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "navigatedFrom", props.onNavigatedFrom);
    useEventListener(ref, "navigatedTo", props.onNavigatedTo);
    useEventListener(ref, "navigatingFrom", props.onNavigatingFrom);
    useEventListener(ref, "navigatingTo", props.onNavigatingTo);
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
export function usePageInheritance<
    P extends PageComponentProps,
    E extends NativeScriptPage = NativeScriptPage
>(
    ref: React.RefObject<E>,
    props: P
)
{
    console.log(`[usePageInheritance] Entered.`);
    const intrinsicProps = useContentViewInheritance(ref, props);
    console.log(`[usePageInheritance] used useContentViewInheritance. Shall now enter usePageEvents.`);
    usePageEvents(ref, intrinsicProps);
    console.log(`[usePageInheritance] used usePageEvents. Shall now return intrinsic props.`);

    const {
        onNavigatedFrom,
        onNavigatedTo,
        onNavigatingFrom,
        onNavigatingTo,
        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    return { ...rest };
}