import * as React from "react";
import { WebViewProps } from "./NativeScriptComponentTypings";
import { WebView as NativeScriptWebView } from "tns-core-modules/ui/web-view/web-view";

interface Props {
    // No mandatory props.
    /* TODO: add event listener-based props. */
}

export type WebViewComponentProps = Props & Partial<WebViewProps>;

/**
 * A React wrapper around the NativeScript WebView component.
 * See: ui/layouts/flexbox-layout
 */
export class WebView extends React.Component<WebViewComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptWebView> = React.createRef<NativeScriptWebView>();

    render(){
        const { children, ...rest } = this.props;
        if(children){
            console.warn("Ignoring 'children' prop on WebView; not permitted");
        }
        return React.createElement(
            'webView',
            {
                ...rest,
                ref: this.myRef
            },
            null
        );
    }
}