import * as console from "../shared/Logger";
import * as React from "react";
import { PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { View as NativeScriptView } from "tns-core-modules/ui/core/view/view";
import { ViewComponentProps, useViewInheritance } from "./View";
import { useRef } from "react";

// UNDER CONSTRUCTION

export type PluginComponentProps<
    /* The props of the React component rather than the plugin (e.g. event listeners) */
    ReactComponentProps extends {},
    /* The props of the plugin (i.e. settable attributes) */
    PluginProps extends {},
    E extends NativeScriptView
> = ReactComponentProps & Partial<PluginProps> & ViewComponentProps<E>;

export function _Plugin<
    /* The props of the React component rather than the plugin (e.g. event listeners) */
    ReactComponentProps extends {},
    /* The props of the plugin (i.e. settable attributes) */
    PluginProps extends {},
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

    const ref: React.RefObject<E> = forwardedRef || useRef();
    const node: E = ref.current!;

    usePluginInheritance(node, props);

    return React.createElement(
        "plugin",
        {
            ref,
            ...rest,
        },
        children
    );
}

export const Plugin = React.forwardRef(
    <ReactComponentProps extends {}, PluginProps extends {}, E extends NativeScriptView>(props: React.PropsWithChildren<PropsWithoutForwardedRef<PluginComponentProps<ReactComponentProps, PluginProps, E>>>, ref: React.RefObject<E>) => {
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
    ReactComponentProps extends {},
    /* The props of the plugin (i.e. settable attributes) */
    PluginProps extends {},
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