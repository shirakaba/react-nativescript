// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { EditableTextBaseProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { EditableTextBase as NativeScriptEditableTextBase } from "@nativescript/core";
import { TextBaseComponentProps, useTextBaseInheritance, TextBaseOmittedPropNames } from "./TextBase";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface EditableTextBaseAuxProps {
    onBlur?: (args: NarrowedEventData<NativeScriptEditableTextBase>) => void;
    onFocus?: (args: NarrowedEventData<NativeScriptEditableTextBase>) => void;
    onTextChange?: (args: NarrowedEventData<NativeScriptEditableTextBase>) => void;
}
export type EditableTextBaseOmittedPropNames = keyof EditableTextBaseAuxProps | TextBaseOmittedPropNames;
export type EditableTextBaseComponentProps = EditableTextBaseAuxProps & Partial<EditableTextBaseProps> & TextBaseComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useEditableTextBaseEvents<
    P extends EditableTextBaseComponentProps,
    E extends NativeScriptEditableTextBase = NativeScriptEditableTextBase
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "blur", props.onBlur);
    useEventListener(ref, "focus", props.onFocus);
    useEventListener(ref, "textChange", props.onTextChange);
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
export function useEditableTextBaseInheritance<
    P extends EditableTextBaseComponentProps,
    E extends NativeScriptEditableTextBase = NativeScriptEditableTextBase
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, EditableTextBaseOmittedPropNames>
{
    const intrinsicProps = useTextBaseInheritance(ref, props);
    useEditableTextBaseEvents(ref, intrinsicProps);

    const {
        onBlur,
        onFocus,
        onTextChange,
        ...rest
    } = intrinsicProps;

    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, EditableTextBaseOmittedPropNames>;
}
