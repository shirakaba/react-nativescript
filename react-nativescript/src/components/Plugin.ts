import * as console from "../shared/Logger";
import * as React from "react";
import { PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { View as NativeScriptView } from "tns-core-modules/ui/core/view/view";
import { ViewComponentProps, useViewInheritance } from "./View";
import { useRef } from "react";

// UNDER CONSTRUCTION

export type PluginComponentProps<
    /* The props of the React component rather than the plugin (e.g. event listeners) */
    ReactComponentProps,
    /* The props of the plugin (i.e. settable attributes) */
    PluginProps,
    E extends NativeScriptView
> = ReactComponentProps & Partial<PluginProps> & ViewComponentProps<E>;

type OwnPropsWithoutForwardedRef<
    ReactComponentProps,
    PluginProps,
    E extends NativeScriptView
> = PropsWithoutForwardedRef<PluginComponentProps<
    ReactComponentProps,
    PluginProps,
    E
>>;

export function _Plugin<
    /* The props of the React component rather than the plugin (e.g. event listeners) */
    ReactComponentProps,
    /* The props of the plugin (i.e. settable attributes) */
    PluginProps,
    P extends PluginComponentProps<ReactComponentProps, PluginProps, E>,
    E extends NativeScriptView
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

    usePluginInheritance(node, props);

    return React.createElement(
        "plugin",
        {
            ...rest,
            ref: forwardedRef || ref,
        },
        children
    );
}

export const Plugin = React.forwardRef(
    <ReactComponentProps, PluginProps, E extends NativeScriptView>(props: React.PropsWithChildren<OwnPropsWithoutForwardedRef<ReactComponentProps, PluginProps, E>>, ref: React.RefObject<E>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Plugin,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);

export function usePluginInheritance<
    /* The props of the React component rather than the plugin (e.g. event listeners) */
    ReactComponentProps,
    /* The props of the plugin (i.e. settable attributes) */
    PluginProps,
    P extends PluginComponentProps<ReactComponentProps, PluginProps, E>,
    E extends NativeScriptView
>(
    node: E,
    props: P
): void
{
    useViewInheritance(node, props);
    // Plugin has no events of its own to handle
}