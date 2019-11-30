// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { SearchBarProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";
import { ScrollEventData, NavigatedData, SearchBar as NativeScriptSearchBar } from "@nativescript/core";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface SearchBarAuxProps {
    onTextChange?: (args: NarrowedEventData<NativeScriptSearchBar>) => void;
    onSubmit?: (args: NarrowedEventData<NativeScriptSearchBar>) => void;
    onClose?: (args: NarrowedEventData<NativeScriptSearchBar>) => void;
    /* Not represented in typings, but NativeScript Vue refers to it in its docs, so we'll provide it just in case. */
    onClear?: (args: NarrowedEventData<NativeScriptSearchBar>) => void;
}
export type SearchBarOmittedPropNames = keyof SearchBarAuxProps | ViewOmittedPropNames;

export type SearchBarNavigationEventHandler = (args: NavigatedData) => void;

export type SearchBarComponentProps = SearchBarAuxProps & Partial<SearchBarProps> & ViewComponentProps;

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useSearchBarEvents<
    P extends SearchBarComponentProps,
    E extends NativeScriptSearchBar = NativeScriptSearchBar
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "textChange", props.onTextChange);
    useEventListener(ref, "submit", props.onSubmit);
    useEventListener(ref, "close", props.onClose);
    useEventListener(ref, "clear", props.onClear);

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
export function useSearchBarInheritance<
    P extends SearchBarComponentProps,
    E extends NativeScriptSearchBar = NativeScriptSearchBar
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, SearchBarOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    useSearchBarEvents(ref, intrinsicProps);

    const {
        onTextChange,
        onSubmit,
        onClose,
        onClear,
        ...rest
    } = intrinsicProps;

    // Omit all event handlers because they aren't used by the intrinsic element.
    // We have to explicitly type this because of an issue with tsc inference... :(
    return { ...rest } as Omit<P, SearchBarOmittedPropNames>;
}

/**
 * A React wrapper around the NativeScript SearchBar component.
 * See: ui/SearchBar/SearchBar
 */
export function _SearchBar(props: React.PropsWithChildren<SearchBarComponentProps>, ref?: React.RefObject<NativeScriptSearchBar>)
{
    // https://reactjs.org/docs/hooks-reference.html#useimperativehandle
    ref = ref || createRef<NativeScriptSearchBar>();

    const { children, ...intrinsicProps } = useSearchBarInheritance(ref, props);

    return React.createElement(
        "searchBar",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const SearchBar = React.forwardRef<NativeScriptSearchBar, React.PropsWithChildren<SearchBarComponentProps>>(_SearchBar);
