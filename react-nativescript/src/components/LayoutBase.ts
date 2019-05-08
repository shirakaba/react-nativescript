import * as React from "react";
import { CustomLayoutViewProps, LayoutBaseProps } from "../shared/NativeScriptComponentTypings";
import { LayoutBase as NativeScriptLayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { RCTCustomLayoutView, CustomLayoutViewComponentProps } from "./CustomLayoutView";

interface Props {
}

export type LayoutBaseComponentProps<E extends NativeScriptLayoutBase = NativeScriptLayoutBase> = Props /* & typeof LayoutBase.defaultProps */ & Partial<LayoutBaseProps> & CustomLayoutViewComponentProps<E>;

/**
 * Base class for all views that supports children positioning.
 */
export abstract class RCTLayoutBase<P extends CustomLayoutViewComponentProps<E>, S extends {}, E extends NativeScriptLayoutBase> extends RCTCustomLayoutView<P, S, E> {
}