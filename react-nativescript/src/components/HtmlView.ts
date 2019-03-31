import * as React from "react";
import { HtmlViewProps } from "./NativeScriptComponentTypings";
import { HtmlView as NativeScriptHtmlView } from "tns-core-modules/ui/html-view/html-view";

interface Props {
    html: string
}

export type HtmlViewComponentProps = Props & Partial<HtmlViewProps>;

/**
 * A React wrapper around the NativeScript HtmlView component.
 * See: ui/layouts/flexbox-layout
 */
export class HtmlView extends React.Component<HtmlViewComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptHtmlView> = React.createRef<NativeScriptHtmlView>();

    render(){
        const { children, ...rest } = this.props;
        if(children){
            console.warn("Ignoring 'children' prop on HtmlView; not permitted");
        }
        return React.createElement(
            'HtmlView',
            {
                ...rest,
                ref: this.myRef
            },
            null
        );
    }
}