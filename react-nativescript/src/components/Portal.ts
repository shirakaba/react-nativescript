import * as React from "react";
import { default as ReactNativeScript } from "../client/ReactNativeScript"
import { ContentView } from "tns-core-modules/ui/content-view/content-view";

// interface Props {

// }

// /**
//  * Under construction. Just planning to play around with it later.
//  * https://css-tricks.com/using-react-portals-to-render-children-outside-the-dom-hierarchy/
//  */
// // const portalRoot = document.getElementById("portal");
// const portalRoot = new ContentView();
// class Portal extends React.Component<Props, {}> {
//     private readonly el: ContentView = new ContentView();
//     constructor(props) {
//       super(props);
//       // 1: Create a new div that wraps the component
//     }
//     // 2: Append the element to the DOM when it mounts
//     componentDidMount = () => {
//       portalRoot.content = this.el;
//     };
//     // 3: Remove the element when it unmounts
//     componentWillUnmount = () => {
//       portalRoot.content = null;
//     };
//     render() {
//       // 4: Render the element's children in a Portal
//       const { children } = this.props;
//       return ReactNativeScript.createPortal(children, this.el);
//     }
// }