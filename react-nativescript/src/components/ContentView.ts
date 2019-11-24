import * as console from "../shared/Logger";
import * as React from "react";
import { ContentViewProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ContentView as NativeScriptContentView } from "tns-core-modules/ui/content-view/content-view";
import { ViewComponentProps, useViewInheritance } from "./View";
import { useRef } from "react";

interface Props {}

export type ContentViewComponentProps<
    E extends NativeScriptContentView = NativeScriptContentView
> = Props /* & typeof ContentView.defaultProps */ & Partial<ContentViewProps> & ViewComponentProps<E>;

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ContentViewComponentProps<NativeScriptContentView>>;

export function _ContentView<
    P extends ContentViewComponentProps<E>,
    E extends NativeScriptContentView = NativeScriptContentView
>(props: React.PropsWithChildren<P>)
{
    const {
        forwardedRef,

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

    useContentViewInheritance(node, props);

    return React.createElement(
        "contentView",
        {
            ...rest,
            ref: forwardedRef || ref,
        },
        children
    );
}

export const ContentView: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptContentView>
> = React.forwardRef<NativeScriptContentView, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptContentView>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _ContentView,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);

export function useContentViewInheritance<
    P extends ContentViewComponentProps<E>,
    E extends NativeScriptContentView = NativeScriptContentView
>(
    node: E,
    props: P
): void
{
    useViewInheritance(node, props);
    // ContentView has no events of its own to handle
}