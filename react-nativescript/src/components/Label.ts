// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { LabelProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { Label as NativeScriptLabel } from "@nativescript/core";
import { TextBaseComponentProps, useTextBaseInheritance, TextBaseOmittedPropNames } from "./TextBase";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface LabelAuxProps {
}
export type LabelOmittedPropNames = keyof LabelAuxProps | TextBaseOmittedPropNames;
export type LabelComponentProps = LabelAuxProps & Partial<LabelProps> & TextBaseComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useLabelInheritance<
    P extends LabelComponentProps,
    E extends NativeScriptLabel = NativeScriptLabel
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, LabelOmittedPropNames>
{
    const intrinsicProps = useTextBaseInheritance(ref, props);
    // No events

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, LabelOmittedPropNames>;
}

export function _Label(props: React.PropsWithChildren<LabelComponentProps>, ref?: React.RefObject<NativeScriptLabel>)
{
    ref = ref || createRef<NativeScriptLabel>();
    const { children, text, formattedText, ...intrinsicProps } = useLabelInheritance(ref, props);

    if (text && formattedText) {
        console.warn(`Both text and formattedText provided; shall use formattedText.`);
    }

    const textContent = {
        [formattedText ? "formattedText" : "text"]: formattedText || text,
    };

    return React.createElement(
        "label",
        {
            ...intrinsicProps,
            ...textContent,
            ref,
        },
        children // Weird that a Label may contain children, but what do I know.
    );
}

export const Label = React.forwardRef<NativeScriptLabel, React.PropsWithChildren<LabelComponentProps>>(_Label);
