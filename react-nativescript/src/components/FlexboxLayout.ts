import * as React from "react";
import { FlexboxLayoutProps } from "./NativeScriptComponentTypings";
import { View as NativeScriptView } from "tns-core-modules/ui/core/view/view";

interface Props {
    // No mandatory props.
}

export type FlexboxLayoutComponentProps = Props & Partial<FlexboxLayoutProps>;

/**
 * A React wrapper around the NativeScript FlexboxLayout component.
 * See: ui/layouts/flexbox-layout
 */
export class FlexboxLayout extends React.Component<FlexboxLayoutComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptView> = React.createRef<NativeScriptView>();

    render(){
        const { children, ...rest } = this.props;

        return React.createElement(
            'FlexboxLayout',
            {
                ...rest,
                ref: this.myRef
            },
            children
        );
    }
}