import * as console from "../shared/Logger";
import * as React from "react";
import { ObservableProps } from "../shared/NativeScriptComponentTypings";
import { Observable as NativeScriptObservable, EventData } from "tns-core-modules/data/observable/observable";
import { useEventListener } from "../client/EventHandling";

/**
 * Props for the wrapping component rather than the primitive element.
 */
export interface ObservableAuxProps {
    /* From Observable. */
    onPropertyChange?: (data: EventData) => void;
}

export type ObservableComponentProps = ObservableAuxProps & Partial<ObservableProps>;

export type ObservableComponentState = {};

/**
 * A hook to handle adding/removing events any time a dependent event listener handler in the props changes value.
 * That is to say, on mount, update, and unmount.
 * 
 * @param node the host instance of the underlying intrinsic element for this React component.
 * @param props the props for the React component (from which this function will use any event listener handlers).
 */
export function useObservableEvents<
    P extends ObservableComponentProps,
    E extends NativeScriptObservable = NativeScriptObservable
>(
    ref: React.RefObject<E>,
    props: P
): void
{
    useEventListener(ref, "propertyChange", props.onPropertyChange);
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
export function useObservableInheritance<
    P extends ObservableComponentProps,
    E extends NativeScriptObservable = NativeScriptObservable
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ObservableOmittedProps>
{
    useObservableEvents(ref, props);
    const {
        onPropertyChange,
        ...rest
    } = props;

    // Omit all event handlers because they aren't used by the intrinsic element.
    return { ...rest } as Omit<P, ObservableOmittedProps>;
}

export type ObservableOmittedProps = keyof Pick<ObservableAuxProps, "onPropertyChange">;