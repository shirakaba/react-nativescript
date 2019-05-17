import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript"
import { ContentView } from "tns-core-modules/ui/page/page";

interface Props {
    identifier: string,
    nativeElement: ContentView
}

export class ListViewCell extends React.Component<Props, {}> {
    componentDidMount(){
        // console.log(`[ListViewCell ${this.props.identifier}] componentDidMount! With: ${this.props.textReference}`);
    }

    shouldComponentUpdate(nextProps: Props, nextState: {}): boolean {
        console.log(`[ListViewCell ${this.props.identifier}] shouldComponentUpdate!`);
        return true;
    }

    componentWillUnmount(){
        // console.log(`[ListViewCell ${this.props.identifier}] componentWillUnmount!`);
    }

    render(){
        return ReactNativeScript.createPortal(
            this.props.children,
            this.props.nativeElement,
            this.props.identifier
        );
    }
}