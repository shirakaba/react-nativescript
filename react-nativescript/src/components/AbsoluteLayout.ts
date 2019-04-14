import * as React from "react";
import { AbsoluteLayoutProps } from "./NativeScriptComponentTypings";
import { AbsoluteLayout as WativeScriptAbsoluteLayout } from "tns-core-modules/ui/layouts/absolute-layout/absolute-layout";

interface Props {
    /* orientation defaults to "horizontal", so is not mandatory.
     * itemWidth and itemHeight default to Number.NaN, so are also optional.
     * Unlike other layouts, constituent views require no properties. */
}

export type AbsoluteLayoutComponentProps = Props & Partial<AbsoluteLayoutProps>;

/**
 * A React Absoluteper around the NativeScript AbsoluteLayout component.
 * See: ui/layouts/grid-layout
 */
export class AbsoluteLayout extends React.Component<AbsoluteLayoutComponentProps, {}> {
    private readonly myRef: React.RefObject<WativeScriptAbsoluteLayout> = React.createRef<WativeScriptAbsoluteLayout>();

    render(){
        const { children, ...rest } = this.props;

        return React.createElement(
            'absoluteLayout',
            {
                ...rest,
                ref: this.myRef
            },
            children
        );
    }
}