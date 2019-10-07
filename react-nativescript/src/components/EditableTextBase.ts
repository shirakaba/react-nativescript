import * as console from "../shared/Logger";
import * as React from "react";
import { EditableTextBase as NativeScriptEditableTextBase } from "../client/ElementRegistry";
import { EditableTextBaseProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { RCTTextBase, TextBaseComponentProps } from "./TextBase";
import { EventData } from "tns-core-modules/ui/text-base/text-base";
import { updateListener } from "../client/EventHandling";

type NativeScriptUIElement = NativeScriptEditableTextBase;

interface Props {
    onBlur?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
    onFocus?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
    onTextChange?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
}

export type EditableTextBaseComponentProps<
    E extends NativeScriptUIElement = NativeScriptUIElement
> = Props /* & typeof EditableTextBase.defaultProps */ & Partial<EditableTextBaseProps> & TextBaseComponentProps<E>;

export abstract class RCTEditableTextBase<
    P extends EditableTextBaseComponentProps<E>,
    S extends {},
    E extends NativeScriptUIElement
> extends RCTTextBase<P, S, E> {
    /**
     *
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, "blur", this.props.onBlur, nextProps.onBlur);
            updateListener(node, "focus", this.props.onFocus, nextProps.onFocus);
            updateListener(node, "textChange", this.props.onTextChange, nextProps.onTextChange);
        } else {
            const method = (attach ? node.on : node.off).bind(node);
            if (this.props.onBlur) method("blur", this.props.onBlur);
            if (this.props.onFocus) method("focus", this.props.onFocus);
            if (this.props.onTextChange) method("textChange", this.props.onTextChange);
        }
    }
}
