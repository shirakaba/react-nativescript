import * as console from "../shared/Logger";
import * as React from "react";
import { ViewBaseProps } from "../shared/NativeScriptComponentTypings";
import { ViewBase as NativeScriptViewBase } from "tns-core-modules/ui/core/view-base/view-base";
import { Dock } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { ObservableComponentProps, ObservableComponentState, useObservableInheritance } from "./Observable";

/**
 * Props for the wrapping component rather than the primitive element.
 */
export interface ViewBaseAuxProps {
    /* Optional property to guide the Host Config on how best to handle this node. Will be set on instance. */
    __rns__nodeTreeRole?: string;
    dock?: Dock;

    /* Not familiar with these (from ViewBase), so shall omit. */
    // onLoaded?: () => void;
    // onUnloaded?: () => void;
}

export type ViewBaseComponentProps = ViewBaseAuxProps & Partial<ViewBaseProps> & ObservableComponentProps;

export type ViewBaseComponentState = {} & ObservableComponentState;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param node the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useViewBaseInheritance<
    P extends ViewBaseComponentProps,
    E extends NativeScriptViewBase = NativeScriptViewBase
>(
    ref: React.RefObject<E>,
    props: P
)
{
    const intrinsicProps = useObservableInheritance(ref, props);
    // ViewBase has no events of its own to handle.   
    
    // We won't omit the __rns__nodeTreeRole or dock props because they 
    return intrinsicProps;
}