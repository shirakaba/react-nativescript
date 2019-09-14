import * as console from "../shared/Logger";
import * as React from "react";
import { SpanProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Span as NativeScriptSpan } from "tns-core-modules/text/span";
import { ViewBaseComponentProps, RCTViewBase } from "./ViewBase";

interface Props {}

export type SpanComponentProps<
    E extends NativeScriptSpan = NativeScriptSpan
> = Props /* & typeof Span.defaultProps */ & Partial<SpanProps> & ViewBaseComponentProps<E>;

export class _Span<
    P extends SpanComponentProps<E>,
    S extends {},
    E extends NativeScriptSpan
> extends RCTViewBase<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptSpan>()
    // };

    render(): React.ReactNode {
        const {
            forwardedRef,

            onPropertyChange,

            children,
            ...rest
        } = this.props;

        return React.createElement(
            "span",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SpanComponentProps<NativeScriptSpan>>;

export const Span: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptSpan>
> = React.forwardRef<NativeScriptSpan, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptSpan>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Span,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
