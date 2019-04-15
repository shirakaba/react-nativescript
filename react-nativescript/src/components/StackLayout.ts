import * as React from "react";
import { StackLayoutProps } from "../shared/NativeScriptComponentTypings";
import { StackLayout as NativeScriptStackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";

interface Props {
    /* orientation defaults to "vertical", so is not mandatory.
     * Unlike other layouts, constituent views require no properties. */
}

export type StackLayoutComponentProps = Props & Partial<StackLayoutProps>;

/**
 * A React wrapper around the NativeScript StackLayout component.
 * See: ui/layouts/grid-layout
 */
export class StackLayout extends React.Component<StackLayoutComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptStackLayout> = React.createRef<NativeScriptStackLayout>();

    render(){
        const { children, ...rest } = this.props;

        return React.createElement(
            'stackLayout',
            {
                ...rest,
                ref: this.myRef
            },
            children
        );
    }
}