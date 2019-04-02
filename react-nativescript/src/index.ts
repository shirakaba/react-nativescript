import * as ReactReconciler from 'react-reconciler';
import { reactReconcilerInst, Container } from "./client/HostConfig";

// https://blog.atulr.com/react-custom-renderer-1/
export default {
    render: (
        reactElement: ReactReconciler.ReactNodeList, // <App />
        domElement: Container, // document.getElementById('root')
        callback: () => void|null|undefined = () => undefined // Called after the component is rendered or updated
    ) => {
        console.log("[render() 1a] Creating container from domElement", domElement);
        const container = reactReconcilerInst.createContainer(domElement, false, false);

        // console.log("[render() 1b] Created container", container);
        // console.log("[render() 1c] Created container", container._root);

        // update the root Container
        return reactReconcilerInst.updateContainer(
            reactElement,
            container,
            null,
            callback
        );
    }
};