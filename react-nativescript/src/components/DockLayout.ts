import * as React from "react";
import { DockLayoutProps } from "./NativeScriptComponentTypings";
import { DockLayout as NativeScriptDockLayout } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";

interface Props {
    // No mandatory props.
    /* Each constituent view passed in must bear a "dock" Prop. */
}

export type DockLayoutComponentProps = Props & Partial<DockLayoutProps>;

/**
 * A React wrapper around the NativeScript DockLayout component.
 * See: ui/layouts/dock-layout
 */
export class DockLayout extends React.Component<DockLayoutComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptDockLayout> = React.createRef<NativeScriptDockLayout>();

    render(){
        const { children, ...rest } = this.props;

        return React.createElement(
            'dockLayout',
            {
                ...rest,
                ref: this.myRef
            },
            children
        );
    }
}