import * as React from "react";
import { FlexboxLayoutProps } from "../shared/NativeScriptComponentTypings";
import { FlexboxLayout as NativeScriptFlexboxLayout } from "tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout";

interface Props {
    // No mandatory props.
}

export type FlexboxLayoutComponentProps = Props & Partial<FlexboxLayoutProps>;

/**
 * A React wrapper around the NativeScript FlexboxLayout component.
 * See: ui/layouts/flexbox-layout
 */
export class FlexboxLayout extends React.Component<FlexboxLayoutComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptFlexboxLayout> = React.createRef<NativeScriptFlexboxLayout>();

    render(){
        const { children, ...rest } = this.props;

        return React.createElement(
            'flexboxLayout',
            {
                ...rest,
                ref: this.myRef
            },
            children
        );
    }
}