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
    const ref: React.RefObject<E> = (this.props.forwardedRef || useRef());
    const intrinsicProps = usePluginInheritance(ref.current!, props);

    return React.createElement(
        "plugin",
        {
            ...intrinsicProps,
            ref,
        },
        null
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

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param node the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
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
)
{
    const intrinsicProps = useViewInheritance(node, props);
    // Plugin has no events of its own to handle

    return intrinsicProps;
}