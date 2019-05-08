import * as React from "react";
import {
    TextBase as NativeScriptTextBase,
} from "../client/ElementRegistry";
import { ContentViewProps, TextBaseProps } from "../shared/NativeScriptComponentTypings";
import { ContentView as NativeScriptContentView } from "tns-core-modules/ui/content-view/content-view";
import { ViewComponentProps, RCTView } from "./View";

interface Props {
}

export type TextBaseComponentProps<E extends NativeScriptTextBase = NativeScriptTextBase> = Props /* & typeof TextBase.defaultProps */ & Partial<TextBaseProps> & ViewComponentProps<E>;

export abstract class RCTTextBase<P extends TextBaseComponentProps<E>, S extends {}, E extends NativeScriptTextBase> extends RCTView<P, S, E> {
}