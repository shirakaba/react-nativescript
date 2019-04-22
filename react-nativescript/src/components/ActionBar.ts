import * as React from "react";
import { ActionBarProps } from "../shared/NativeScriptComponentTypings";
import { ActionBar as NativeScriptActionBar } from "tns-core-modules/ui/action-bar/action-bar";
import { FormattedString } from "tns-core-modules/text/formatted-string";

interface Props {
}

export type ActionBarComponentProps = Props & Partial<ActionBarProps>;

/**
 * A React wrapper around the NativeScript ActionBar component.
 * See: ui/action-bar/action-bar
 */
export class ActionBar extends React.Component<ActionBarComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptActionBar> = React.createRef<NativeScriptActionBar>();

    render(){
        const { children, ...rest } = this.props;

        return React.createElement(
            'actionBar',
            {
                ...rest,
                ref: this.myRef,
            },
            children
        );
        // return (
        //     <ActionBar text="hi">children</ActionBar>
        // )
    }
}