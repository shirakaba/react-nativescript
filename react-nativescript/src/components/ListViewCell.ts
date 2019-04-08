import * as React from "react";
import { default as ReactNativeScript } from "../index";
import { ProxyViewContainer } from "tns-core-modules/ui/proxy-view-container/proxy-view-container";

interface Props {
    identifier: string,
    textReference: string,
    nativeElement: ProxyViewContainer
}

export class ListViewCell extends React.Component<Props, {}> {
    componentDidMount(){
        // console.log(`[ListViewCell ${this.props.identifier}] componentDidMount! With: ${this.props.textReference}`);
    }

    shouldComponentUpdate(nextProps: Props, nextState: {}): boolean {
        // console.log(`[ListViewCell ${this.props.identifier}] shouldComponentUpdate! With: ${nextProps.textReference}`);
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