import * as React from "react";
import { TextBase as NativeScriptTextBase } from "../client/ElementRegistry";
import { ContentViewProps, TextBaseProps } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, RCTView } from "./View";
import { updateListener } from "../client/EventHandling";
import { EventData } from "tns-core-modules/ui/text-base/text-base";

interface Props {
    // https://docs.nativescript.org/ui/ns-ui-widgets/text-field#code-behind
    onTextChange?: (args: EventData) => void;
}

export type TextBaseComponentProps<
    E extends NativeScriptTextBase = NativeScriptTextBase
> = Props /* & typeof TextBase.defaultProps */ & Partial<TextBaseProps> & ViewComponentProps<E>;

export abstract class RCTTextBase<
    P extends TextBaseComponentProps<E>,
    S extends {},
    E extends NativeScriptTextBase
> extends RCTView<P, S, E> {
    /**
     *
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, "textChange", this.props.onTextChange, nextProps.onTextChange);
        } else {
            const method = (attach ? node.on : node.off).bind(node);
            if (this.props.onTextChange) method("textChange", this.props.onTextChange);
        }
    }
}
