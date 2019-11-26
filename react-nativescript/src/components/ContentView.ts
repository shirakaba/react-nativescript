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
    const ref: React.RefObject<E> = (this.props.forwardedRef || useRef());
    const node: E = ref.current!;
    const { children, ...rest } = useContentViewInheritance(node, props);

    return React.createElement(
        "contentView",
        {
            ...rest,
            ref,
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

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param node the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useContentViewInheritance<
    P extends ContentViewComponentProps<E>,
    E extends NativeScriptContentView = NativeScriptContentView
>(
    node: E,
    props: P
)
{
    const intrinsicProps = useViewInheritance(node, props);
    // ContentView has no events of its own to handle

    return intrinsicProps;
}