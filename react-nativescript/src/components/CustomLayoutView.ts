import * as React from "react";
import { CustomLayoutViewProps } from "../shared/NativeScriptComponentTypings";
import { CustomLayoutView as NativeScriptCustomLayoutView } from "tns-core-modules/ui/content-view/content-view";
import { RCTContainerView, ContainerViewComponentProps } from "./ContainerView";

interface Props {
}

export type CustomLayoutViewComponentProps<E extends NativeScriptCustomLayoutView = NativeScriptCustomLayoutView> = Props /* & typeof CustomLayoutView.defaultProps */ & Partial<CustomLayoutViewProps> & ContainerViewComponentProps<E>;

/**
 * Base class for all UI components that implement custom layouts.
 */
export abstract class RCTCustomLayoutView<P extends CustomLayoutViewComponentProps<E>, S extends {}, E extends NativeScriptCustomLayoutView> extends RCTContainerView<P, S, E> {
}