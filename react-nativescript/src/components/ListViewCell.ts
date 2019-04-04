import * as React from "react";
import { default as ReactNativeScript } from "../index";
import { ContentView } from "tns-core-modules/ui/page/page";

interface Props {
    nativeElement: ContentView
}

export class ListViewCell extends React.Component<Props, {}> {
    render(){
        return ReactNativeScript.createPortal(
            this.props.children,
            this.props.nativeElement
        );
    }
}