import * as console from "../shared/Logger";
import * as React from "react";
import { ViewBaseProps } from "../shared/NativeScriptComponentTypings";
import { ViewBase as NativeScriptViewBase } from "tns-core-modules/ui/core/view-base/view-base";
import { Dock } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { ObservableComponentProps, ObservableComponentState, useObservableInheritance } from "./Observable";

interface Props {
    /* Optional property to guide the Host Config on how best to handle this node. Will be set on instance. */
    __rns__nodeTreeRole?: string;
    dock?: Dock;

    /* Not familiar with these (from ViewBase), so shall omit. */
    // onLoaded?: () => void;
    // onUnloaded?: () => void;
}

export type ViewBaseComponentProps<
    E extends NativeScriptViewBase = NativeScriptViewBase
> = Props /* & typeof RCTViewBase.defaultProps */ & Partial<ViewBaseProps> & ObservableComponentProps<E>;

export type ViewBaseComponentState = {} & ObservableComponentState;

export function useViewBaseInheritance<
    P extends ViewBaseComponentProps<E>,
    E extends NativeScriptViewBase = NativeScriptViewBase
>(
    node: E,
    props: P
): void
{
    useObservableInheritance(node, props);
    // ViewBase has no events of its own to handle.
}