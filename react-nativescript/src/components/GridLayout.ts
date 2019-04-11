import * as React from "react";
import { GridLayoutProps } from "./NativeScriptComponentTypings";
import { GridLayout as NativeScriptGridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";

interface Props {
    /* Each constituent view passed in must bear "row" and "col" Props. */
    /* rows and columns will be added in order specified. */
    rows: ItemSpec[],
    columns: ItemSpec[],
    // TODO: Should we enforce that children must only be Views?
}

export type GridLayoutComponentProps = Props & Partial<GridLayoutProps>;

/**
 * A React wrapper around the NativeScript GridLayout component.
 * See: ui/layouts/grid-layout
 */
export class GridLayout extends React.Component<GridLayoutComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptGridLayout> = React.createRef<NativeScriptGridLayout>();

    render(){
        const { children, ...rest } = this.props;

        return React.createElement(
            'gridLayout',
            {
                ...rest,
                ref: this.myRef
            },
            children
        );
    }
}