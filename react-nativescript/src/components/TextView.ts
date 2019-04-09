import * as React from "react";
import { TextViewProps } from "./NativeScriptComponentTypings";
import { TextView as NativeScriptTextView } from "tns-core-modules/ui/text-view/text-view";

interface Props {
    // No mandatory props.
}

export type TextViewComponentProps = Props & Partial<TextViewProps>;

/**
 * A React wrapper around the NativeScript TextView component.
 * See: ui/layouts/flexbox-layout
 */
export class TextView extends React.Component<TextViewComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptTextView> = React.createRef<NativeScriptTextView>();

    render(){
        const { children, text, formattedText, ...rest } = this.props;

        if(text && formattedText){
            console.warn(`Both text and formattedText provided; shall use formattedText.`);
        }

        const textContent = {
            [formattedText ? "formattedText" : "text"] : formattedText || text
        };

        return React.createElement(
            'textView',
            {
                ...rest,
                ...textContent,
                ref: this.myRef
            },
            children
        );
    }
}