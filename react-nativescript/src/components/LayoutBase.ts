import * as React from "react";
import { CustomLayoutViewProps } from "../shared/NativeScriptComponentTypings";
import { CustomLayoutView as NativeScriptCustomLayoutView } from "tns-core-modules/ui/content-view/content-view";
import { CustomLayoutView, CustomLayoutViewComponentProps } from "./CustomLayoutView";

interface Props {
}

export type CustomLayoutViewComponentProps<E extends NativeScriptCustomLayoutView = NativeScriptCustomLayoutView> = Props /* & typeof CustomLayoutView.defaultProps */ & Partial<CustomLayoutViewProps> & CustomLayoutViewComponentProps<E>;

/**
 * Base class for all views that supports children positioning.
 */
export abstract class LayoutBase<P extends CustomLayoutViewComponentProps<E>, S extends {}, E extends NativeScriptCustomLayoutView> extends CustomLayoutView<P, S, E> {
}