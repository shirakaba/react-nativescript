import * as React from "react";
import {
    TextBase as NativeScriptTextBase,
} from "../client/ElementRegistry";
import { ContentViewProps, TextBaseProps } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, RCTView } from "./View";
import { updateListener } from "../client/EventHandling";
import { EventData } from "tns-core-modules/ui/text-base/text-base";

interface Props {
    // https://docs.nativescript.org/ui/ns-ui-widgets/text-field#code-behind
    onTextChange?: (args: EventData) => void;
}

export type TextBaseComponentProps<E extends NativeScriptTextBase = NativeScriptTextBase> = Props /* & typeof TextBase.defaultProps */ & Partial<TextBaseProps> & ViewComponentProps<E>;

export abstract class RCTTextBase<P extends TextBaseComponentProps<E>, S extends {}, E extends NativeScriptTextBase> extends RCTView<P, S, E> {
    /**
     * 
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(attach: boolean|null, nextProps?: P): void {
        // console.log(`View's updateListeners()`);
        super.updateListeners(attach, nextProps);

        const ref = this.props.forwardedRef || this.myRef;
        // console.log(`[updateListeners()] using ${ref === this.myRef ? "default ref" : "forwarded ref"}`);

        const node: E|null = ref.current;
        if(node){
            if(attach === null){
                updateListener(node, "textChange", this.props.onTextChange, nextProps.onTextChange);
            } else {
                const method = (attach ? node.on : node.off).bind(node);
                if(this.props.onTextChange) method("textChange", this.props.onTextChange);
            }
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }
}