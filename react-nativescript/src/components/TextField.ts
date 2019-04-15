import * as React from "react";
import { TextFieldProps } from "../shared/NativeScriptComponentTypings";
import { TextField as NativeScriptTextField } from "tns-core-modules/ui/text-field/text-field";

interface Props {
    // No mandatory props.
}

export type TextFieldComponentProps = Props & Partial<TextFieldProps>;

/**
 * A React wrapper around the NativeScript TextField component.
 * See: ui/layouts/flexbox-layout
 */
export class TextField extends React.Component<TextFieldComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptTextField> = React.createRef<NativeScriptTextField>();

    render(){
        const { children, text, formattedText, ...rest } = this.props;

        if(text && formattedText){
            console.warn(`Both text and formattedText provided; shall use formattedText.`);
        }

        const textContent = {
            [formattedText ? "formattedText" : "text"] : formattedText || text
        };

        return React.createElement(
            'textField',
            {
                ...rest,
                ...textContent,
                ref: this.myRef
            },
            children
        );
    }
}