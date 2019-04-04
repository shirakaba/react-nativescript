import * as React from "react";
import { default as ReactNativeScript } from "../index";
import { ContentView } from "tns-core-modules/ui/page/page";

interface Props {
    nativeElement: ContentView
}

// export class ListViewCell extends React.Component<Props, {}> {
//     constructor(props) {
//         super(props);
//         this.el = document.createElement('div');
//       }
    
//       componentDidMount() {
//         // The portal element is inserted in the DOM tree after
//         // the Modal's children are mounted, meaning that children
//         // will be mounted on a detached DOM node. If a child
//         // component requires to be attached to the DOM tree
//         // immediately when mounted, for example to measure a
//         // DOM node, or uses 'autoFocus' in a descendant, add
//         // state to Modal and only render the children when Modal
//         // is inserted in the DOM tree.
//         modalRoot.appendChild(this.el);
//     }
    
//     componentWillUnmount() {
//         modalRoot.removeChild(this.el);
//     }
    

//     render(){
//         return ReactNativeScript.createPortal(
//             this.props.children,
//             this.props.nativeElement
//         );
//     }
// }