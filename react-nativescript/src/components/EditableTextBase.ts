import * as React from "react";
import {
    EditableTextBase as NativeScriptEditableTextBase,
} from "../client/ElementRegistry";
import {EditableTextBaseProps } from "../shared/NativeScriptComponentTypings";
import { RCTTextBase, TextBaseComponentProps } from "./TextBase";

interface Props {
}

export type EditableTextBaseComponentProps<E extends NativeScriptEditableTextBase = NativeScriptEditableTextBase> = Props /* & typeof EditableTextBase.defaultProps */ & Partial<EditableTextBaseProps> & TextBaseComponentProps<E>;

export abstract class RCTEditableTextBase<P extends EditableTextBaseComponentProps<E>, S extends {}, E extends NativeScriptEditableTextBase> extends RCTTextBase<P, S, E> {
}