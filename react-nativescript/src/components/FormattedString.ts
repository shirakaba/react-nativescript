import * as console from "../shared/Logger";
import * as React from "react";
import { FormattedStringProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { FormattedString as NativeScriptFormattedString } from "tns-core-modules/text/formatted-string";
import { ViewBaseComponentProps, RCTViewBase } from "./ViewBase";

interface Props {}

export type FormattedStringComponentProps<
    E extends NativeScriptFormattedString = NativeScriptFormattedString
> = Props /* & typeof FormattedString.defaultProps */ & Partial<FormattedStringProps> & ViewBaseComponentProps<E>;

export class _FormattedString<
    P extends FormattedStringComponentProps<E>,
    S extends {},
    E extends NativeScriptFormattedString
> extends RCTViewBase<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptFormattedString>()
    // };

    render(): React.ReactNode {
        const {
            forwardedRef,

            onPropertyChange,

            children,
            ...rest
        } = this.props;

        return React.createElement(
            "formattedString",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<FormattedStringComponentProps<NativeScriptFormattedString>>;

export const FormattedString: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptFormattedString>
> = React.forwardRef<NativeScriptFormattedString, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptFormattedString>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _FormattedString,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
