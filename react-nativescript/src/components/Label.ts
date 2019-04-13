import * as React from "react";
import { LabelProps } from "./NativeScriptComponentTypings";
import { Label as NativeScriptLabel } from "tns-core-modules/ui/label/label";
import { FormattedString } from "tns-core-modules/text/formatted-string";

// declare namespace JSX {
//     interface IntrinsicElements {
//         label: {
//             // props go here
//             textytext: string
//         }
//     }
// }

interface Props {
}

export type LabelComponentProps = Props & Partial<LabelProps>;

/**
 * A React wrapper around the NativeScript Label component.
 * See: ui/layouts/flexbox-layout
 */
export class Label extends React.Component<LabelComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptLabel> = React.createRef<NativeScriptLabel>();

    render(){
        const { children, text, formattedText, ...rest } = this.props;

        if(text && formattedText){
            console.warn(`Both text and formattedText provided; shall use formattedText.`);
        }

        const textContent = {
            [formattedText ? "formattedText" : "text"] : formattedText || text
        };

        return React.createElement(
            'label',
            {
                ...rest,
                ...textContent,
                ref: this.myRef,
            },
            children
        );
        // return (
        //     <label text="hi">children</label>
        // )
    }
}