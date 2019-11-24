import * as console from "../shared/Logger";
import * as React from "react";
import { useRef } from "react";
import { PageProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Page as NativeScriptPage, NavigatedData } from "tns-core-modules/ui/page/page";
import { _ContentView, ContentViewComponentProps, useContentViewInheritance } from "./ContentView";
import { useEventListener } from "../client/EventHandling";

interface Props {
    onNavigatingTo?: PageNavigationEventHandler;
    onNavigatedTo?: PageNavigationEventHandler;
    onNavigatingFrom?: PageNavigationEventHandler;
    onNavigatedFrom?: PageNavigationEventHandler;
}

export type PageNavigationEventHandler = (args: NavigatedData) => void;

export type PageComponentProps<
    E extends NativeScriptPage = NativeScriptPage
> = Props /* & typeof _Page.defaultProps */ & Partial<PageProps> & ContentViewComponentProps<E>;

/**
 * A React wrapper around the NativeScript Page component.
 * See: ui/page/page
 */
export function _Page<
    P extends PageComponentProps<E>,
    E extends NativeScriptPage = NativeScriptPage
>(props: React.PropsWithChildren<P>)
{
    const {
        forwardedRef,

        onNavigatedFrom,
        onNavigatedTo,
        onNavigatingFrom,
        onNavigatingTo,

        onLoaded,
        onUnloaded,
        onAndroidBackPressed,
        onShowingModally,
        onShownModally,

        onTap,
        onDoubleTap,
        onPinch,
        onPan,
        onSwipe,
        onRotation,
        onLongPress,
        onTouch,

        onPropertyChange,

        children,
        ...rest
    } = props;

    const ref: React.RefObject<E> = useRef();
    const node: E = ref.current!;

    usePageInheritance(node, props);

    return React.createElement(
        "page",
        {
            ...rest,
            ref: forwardedRef || ref,
        },
        children
    );
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<PageComponentProps<NativeScriptPage>>;

export const Page: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptPage>
> = React.forwardRef<NativeScriptPage, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptPage>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Page,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);

export function usePageEvents<
    P extends PageComponentProps<E>,
    E extends NativeScriptPage = NativeScriptPage
>(
    node: E,
    props: P
): void
{
    useEventListener(node, "navigatedFrom", props.onNavigatedFrom);
    useEventListener(node, "navigatedTo", props.onNavigatedTo);
    useEventListener(node, "navigatingFrom", props.onNavigatingFrom);
    useEventListener(node, "navigatingTo", props.onNavigatingTo);
}

export function usePageInheritance<
    P extends PageComponentProps<E>,
    E extends NativeScriptPage = NativeScriptPage
>(
    node: E,
    props: P
): void
{
    useContentViewInheritance(node, props);
    usePageEvents(node, props);
}