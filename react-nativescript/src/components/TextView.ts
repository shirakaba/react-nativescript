// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { TextViewProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { TextView as NativeScriptTextView } from "@nativescript/core";
import { EditableTextBaseComponentProps, useEditableTextBaseInheritance, EditableTextBaseOmittedPropNames } from "./EditableTextBase";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface TextViewAuxProps {
}
export type TextViewOmittedPropNames = keyof TextViewAuxProps | EditableTextBaseOmittedPropNames;
export type TextViewComponentProps = TextViewAuxProps & Partial<TextViewProps> & EditableTextBaseComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useTextViewInheritance<
    P extends TextViewComponentProps,
    E extends NativeScriptTextView = NativeScriptTextView
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, TextViewOmittedPropNames>
{
    const intrinsicProps = useEditableTextBaseInheritance(ref, props);
    // TextView has no events to handle.

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, TextViewOmittedPropNames>;
}

export function _TextView(props: React.PropsWithChildren<TextViewComponentProps>, ref?: React.RefObject<NativeScriptTextView>)
{
    ref = ref || createRef<NativeScriptTextView>();
    const { children, text, formattedText, ...intrinsicProps } = useTextViewInheritance(ref, props);

    if (text && formattedText) {
        console.warn(`Both text and formattedText provided; shall use formattedText.`);
    }

    const textContent = {
        [formattedText ? "formattedText" : "text"]: formattedText || text,
    };

    return React.createElement(
        "textView",
        {
            ...intrinsicProps,
            ...textContent,
            ref,
        },
        children // Weird that a TextView may contain children, but what do I know.
    );
}

export const TextView = React.forwardRef<NativeScriptTextView, React.PropsWithChildren<TextViewComponentProps>>(_TextView);
