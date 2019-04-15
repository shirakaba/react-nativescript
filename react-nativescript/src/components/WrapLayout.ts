import * as React from "react";
import { WrapLayoutProps } from "../shared/NativeScriptComponentTypings";
import { WrapLayout as NativeScriptwrapLayout } from "tns-core-modules/ui/layouts/wrap-layout/wrap-layout";

interface Props {
    /* orientation defaults to "horizontal", so is not mandatory.
     * itemWidth and itemHeight default to Number.NaN, so are also optional.
     * Unlike other layouts, constituent views require no properties. */
}

export type WrapLayoutComponentProps = Props & Partial<WrapLayoutProps>;

/**
 * A React wrapper around the NativeScript WrapLayout component.
 * See: ui/layouts/grid-layout
 */
export class WrapLayout extends React.Component<WrapLayoutComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptwrapLayout> = React.createRef<NativeScriptwrapLayout>();

    render(){
        const { children, ...rest } = this.props;

        return React.createElement(
            'wrapLayout',
            {
                ...rest,
                ref: this.myRef
            },
            children
        );
    }
}