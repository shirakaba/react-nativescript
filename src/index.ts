import ReactReconciler from 'react-reconciler';

type Type = any;
type Props = any;
type Container = any;
type Instance = any;
type TextInstance = any;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = any;
type UpdatePayload = any;
type ChildSet = any;
type TimeoutHandle = any;
type NoTimeout = any;

// https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc
const hostConfig: ReactReconciler.HostConfig<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout> = {
    now: Date.now,
};
const ReactReconcilerInst = ReactReconciler<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout>(hostConfig);

export default {
    render: (
        reactElement: ReactReconciler.ReactNodeList, // <App />
        domElement: Container, // document.getElementById('root')
        callback: () => void|null|undefined = () => undefined // Called after the component is rendered or updated
    ) => {
        console.log(arguments);
        // Create a root Container if it doesnt exist
        if (!domElement._rootContainer) {
        domElement._rootContainer = ReactReconcilerInst.createContainer(domElement, false, false);
        }

        // update the root Container
        return ReactReconcilerInst.updateContainer(
            reactElement,
            domElement._rootContainer,
            null,
            callback
        );
    }
};