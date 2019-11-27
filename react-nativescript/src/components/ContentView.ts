// import * as console from "../shared/Logger";
import * as React from "react";
import { ContentViewProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ContentView as NativeScriptContentView } from "tns-core-modules/ui/content-view/content-view";
import { ViewComponentProps, useViewInheritance, ViewOmittedProps } from "./View";
import { useRef } from "react";

interface Props {}

export type ContentViewComponentProps<
    E extends NativeScriptContentView = NativeScriptContentView
> = Props & Partial<ContentViewProps> & ViewComponentProps<E>;

export function _ContentView<
    P extends ContentViewComponentProps<E>,
    E extends NativeScriptContentView = NativeScriptContentView
>(props: React.PropsWithChildren<P>)
{   
    const ref: React.RefObject<E> = (props.forwardedRef || useRef());
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

export const ContentView = React.forwardRef(
    (props: React.PropsWithChildren<PropsWithoutForwardedRef<ContentViewComponentProps>>, ref: React.RefObject<NativeScriptContentView>) => {
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
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useContentViewInheritance<
    P extends ContentViewComponentProps<E>,
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