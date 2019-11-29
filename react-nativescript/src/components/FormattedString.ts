import * as console from "../shared/Logger";
import * as React from "react";
import { FormattedStringProps } from "../shared/NativeScriptComponentTypings";
import { FormattedString as NativeScriptFormattedString, Span } from "tns-core-modules/text/formatted-string";
import { ViewBaseComponentProps, useViewBaseInheritance, ViewBaseComponentState, ViewBaseOmittedPropNames } from "./ViewBase";
import { createRef } from "react";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface FormattedStringAuxProps {
}
export type FormattedStringOmittedPropNames = keyof FormattedStringAuxProps | ViewBaseOmittedPropNames;

export type FormattedStringComponentProps = FormattedStringAuxProps & Partial<FormattedStringProps> & ViewBaseComponentProps;

export type FormattedStringComponentState = {} & ViewBaseComponentState;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useFormattedStringInheritance<
    P extends FormattedStringComponentProps,
    E extends NativeScriptFormattedString = NativeScriptFormattedString
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, FormattedStringOmittedPropNames>
{
    const intrinsicProps = useViewBaseInheritance(ref, props);

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, FormattedStringOmittedPropNames>;
}

export function _FormattedString(props: React.PropsWithChildren<FormattedStringComponentProps>, ref?: React.RefObject<NativeScriptFormattedString>)
{
    ref = ref || createRef<NativeScriptFormattedString>();
    const { children, ...intrinsicProps } = useFormattedStringInheritance(ref, props);

    return React.createElement(
        "formattedString",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const FormattedString = React.forwardRef<NativeScriptFormattedString, React.PropsWithChildren<FormattedStringComponentProps>>(_FormattedString);
