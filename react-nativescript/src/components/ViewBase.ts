import * as React from "react";
import { ViewBaseProps } from "../shared/NativeScriptComponentTypings";
import { ViewBase as NativeScriptViewBase } from "tns-core-modules/ui/core/view-base/view-base";
import { Dock } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { RCTObservable, ObservableComponentProps } from "./Observable";

interface Props {
    dock?: Dock;

    /* Not familiar with these (from ViewBase), so shall omit. */
    // onLoaded?: () => void;
    // onUnloaded?: () => void;
}

export type ViewBaseComponentProps = Props & Partial<ViewBaseProps> & ObservableComponentProps;

export abstract class RCTViewBase<P extends ViewBaseComponentProps, S extends {}, E extends NativeScriptViewBase> extends RCTObservable<P, S, E> {
}