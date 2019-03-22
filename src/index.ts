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
const noTimeoutValue: NoTimeout = undefined;



// https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc
const hostConfig: ReactReconciler.HostConfig<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout> = {
    getPublicInstance(instance: Instance | TextInstance): PublicInstance {

    },
    getRootHostContext(rootContainerInstance: Container): HostContext {

    },
    getChildHostContext(parentHostContext: HostContext, type: Type, rootContainerInstance: Container): HostContext {

    },
    prepareForCommit(containerInfo: Container): void {

    },
    resetAfterCommit(containerInfo: Container): void {

    },
    createInstance(
        type: Type,
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): Instance {

    },
    appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {

    },
    finalizeInitialChildren(
        parentInstance: Instance,
        type: Type,
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ): boolean {

    },
    prepareUpdate(
        instance: Instance,
        type: Type,
        oldProps: Props,
        newProps: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ): null | UpdatePayload {

    },
    shouldSetTextContent(type: Type, props: Props): boolean {

    },
    shouldDeprioritizeSubtree(type: Type, props: Props): boolean {

    },
    createTextInstance(
        text: string,
        rootContainerInstance: Container,
        hostContext: HostContext,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): TextInstance {

    },
    scheduleDeferredCallback(
        callback: () => any,
        options?: { timeout: number },
    ): any {

    },
    cancelDeferredCallback(callbackID: any): void {

    },
    setTimeout(handler: (...args: any[]) => void, timeout: number): TimeoutHandle | NoTimeout {

    },
    clearTimeout(handle: TimeoutHandle | NoTimeout): void {

    },
    noTimeout: noTimeoutValue,
    now: Date.now,
    isPrimaryRenderer: true,
    supportsMutation: true, // TODO
    supportsPersistence: false,
    supportsHydration: false,

    /* Mutation (optional) */
    appendChild(parentInstance: Instance, child: Instance | TextInstance): void {},
    appendChildToContainer(container: Container, child: Instance | TextInstance): void {},
    commitTextUpdate(textInstance: TextInstance, oldText: string, newText: string): void {},
    commitMount(
        instance: Instance,
        type: Type,
        newProps: Props,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): void {},
    commitUpdate(
        instance: Instance,
        updatePayload: UpdatePayload,
        type: Type,
        oldProps: Props,
        newProps: Props,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): void {},
    insertBefore(parentInstance: Instance, child: Instance | TextInstance, beforeChild: Instance | TextInstance): void {},
    insertInContainerBefore(
        container: Container,
        child: Instance | TextInstance,
        beforeChild: Instance | TextInstance,
    ): void {},
    removeChild(parentInstance: Instance, child: Instance | TextInstance): void {},
    removeChildFromContainer(container: Container, child: Instance | TextInstance): void {},
    resetTextContent(instance: Instance): void {},
}
const ReactReconcilerInst = ReactReconciler<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout>(hostConfig);

export default {
    render: (
        reactElement: ReactReconciler.ReactNodeList, // <App />
        domElement: Container, // document.getElementById('root')
        callback: () => void|null|undefined = () => undefined // Called after the component is rendered or updated
    ) => {
        // console.log(arguments);
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