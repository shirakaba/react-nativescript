import * as console from "../shared/Logger";
import * as React from "react";
import { ObservableProps } from "../shared/NativeScriptComponentTypings";
import { Observable as NativeScriptObservable, EventData } from "tns-core-modules/data/observable/observable";
import { useEventListener } from "../client/EventHandling";

interface Props<E extends NativeScriptObservable = NativeScriptObservable> {
    forwardedRef?: React.RefObject<E>;

    /* From Observable. */
    onPropertyChange?: (data: EventData) => void;
}

export type ObservableComponentProps<E extends NativeScriptObservable = NativeScriptObservable> = Props<
    E
> /* & typeof RCTObservable.defaultProps */ &
    Partial<ObservableProps>;

export type ObservableComponentState = {};

export function useObservableEvents<
    P extends ObservableComponentProps<E>,
    E extends NativeScriptObservable = NativeScriptObservable
>(
    node: E,
    props: P
): void
{
    useEventListener(node, "propertyChange", props.onPropertyChange);
}

export function useObservableInheritance<
    P extends ObservableComponentProps<E>,
    E extends NativeScriptObservable = NativeScriptObservable
>(
    node: E,
    props: P
): void
{
    useObservableEvents(node, props);
}