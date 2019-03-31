import * as React from "react";
import { TextFieldProps } from "./NativeScriptComponentTypings";
import { View as NativeScriptView } from "tns-core-modules/ui/core/view/view";

interface Props {
    // No mandatory props.
}

export type TextFieldComponentProps = Props & Partial<TextFieldProps>;

/**
 * A React wrapper around the NativeScript TextField component.
 * See: ui/layouts/flexbox-layout
 */
export class TextField extends React.Component<TextFieldComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptView> = React.createRef<NativeScriptView>();

    render(){
        const { children, ...rest } = this.props;

        return React.createElement(
            'TextField',
            {
                ...rest,
                ref: this.myRef
            },
            children
        );
    }
}