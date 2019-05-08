import * as React from "react";
import { ContainerViewProps } from "../shared/NativeScriptComponentTypings";
import { ContainerView as NativeScriptContainerView } from "tns-core-modules/ui/content-view/content-view";
import { ViewComponentProps, RCTView } from "./View";

interface Props {
}

export type ContainerViewComponentProps<E extends NativeScriptContainerView = NativeScriptContainerView> = Props /* & typeof ContainerView.defaultProps */ & Partial<ContainerViewProps> & ViewComponentProps<E>;

/**
 * Base class for all UI components that are containers.
 */
export abstract class ContainerView<P extends ContainerViewComponentProps<E>, S extends {}, E extends NativeScriptContainerView> extends RCTView<P, S, E> {
}