// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { TextFieldProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { TextField as NativeScriptTextField } from "@nativescript/core";
import { EditableTextBaseComponentProps, useEditableTextBaseInheritance, EditableTextBaseOmittedPropNames } from "./EditableTextBase";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface TextFieldAuxProps {
    onReturnPress?: (args: NarrowedEventData<NativeScriptTextField>) => void;
}
export type TextFieldOmittedPropNames = keyof TextFieldAuxProps | EditableTextBaseOmittedPropNames;
export type TextFieldComponentProps = TextFieldAuxProps & Partial<TextFieldProps> & EditableTextBaseComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useTextFieldEvents<
    P extends TextFieldComponentProps,
    E extends NativeScriptTextField = NativeScriptTextField
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "returnPress", props.onReturnPress);
}

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useTextFieldInheritance<
    P extends TextFieldComponentProps,
    E extends NativeScriptTextField = NativeScriptTextField
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, TextFieldOmittedPropNames>
{
    const intrinsicProps = useEditableTextBaseInheritance(ref, props);
    useTextFieldEvents(ref, intrinsicProps);

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, TextFieldOmittedPropNames>;
}

export function _TextField(props: React.PropsWithChildren<TextFieldComponentProps>, ref?: React.RefObject<NativeScriptTextField>)
{
    ref = ref || createRef<NativeScriptTextField>();
    const { children, text, formattedText, ...intrinsicProps } = useTextFieldInheritance(ref, props);

    if (text && formattedText) {
        console.warn(`Both text and formattedText provided; shall use formattedText.`);
    }

    const textContent = {
        [formattedText ? "formattedText" : "text"]: formattedText || text,
    };

    return React.createElement(
        "textField",
        {
            ...intrinsicProps,
            ...textContent,
            ref,
        },
        children // Weird that a TextField may contain children, but what do I know.
    );
}

export const TextField = React.forwardRef<NativeScriptTextField, React.PropsWithChildren<TextFieldComponentProps>>(_TextField);
