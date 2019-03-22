import ReactReconciler from 'react-reconciler';
import { TNSElements, elementMap, ConcreteViewConstructor } from './elementRegistry';
// TODO: Would be less coupled if we imported View and TextBase from elementRegistry.ts.
import { View } from 'tns-core-modules/ui/core/view/view';
import { TextBase } from 'tns-core-modules/ui/text-base/text-base';

type Type = TNSElements;
type Props = Record<string, any>;
type Container = View;
type Instance = View; // We may extend this to Observable in future, to allow the tree to contain non-visual components.
type TextInstance = TextBase;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = any;
type UpdatePayload = any;
type ChildSet = any;
type TimeoutHandle = number; // Actually strictly should be Node-style timeout
type NoTimeout = any;
const noTimeoutValue: NoTimeout = undefined;

// https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc
const hostConfig: ReactReconciler.HostConfig<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout> = {
    getPublicInstance(instance: Instance | TextInstance): PublicInstance {
        // TODO
    },
    getRootHostContext(rootContainerInstance: Container): HostContext {
        // TODO
    },
    getChildHostContext(parentHostContext: HostContext, type: Type, rootContainerInstance: Container): HostContext {
        // TODO
    },
    prepareForCommit(containerInfo: Container): void {
        // TODO
    },
    resetAfterCommit(containerInfo: Container): void {
        // TODO
    },
    createInstance(
        type: Type,
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): Instance {
        const viewConstructor: ConcreteViewConstructor = elementMap[type];
        if(!viewConstructor){
            throw new Error(`Unrecognised type, "${type}", not found in element registry.`);
        }

        const view: View = new viewConstructor();
        Object.keys(props).forEach((prop: string) => {
            const value: any = props[prop];
            // TODO: much more work here. Handle styles and event listeners, for example. Think this Observable method handles barely anything.
            view.set(prop, value);
        });

        return view;
    },
    appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
        parentInstance._addView(child);
    },
    finalizeInitialChildren(
        parentInstance: Instance,
        type: Type,
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ): boolean {
        // TODO
    },
    prepareUpdate(
        instance: Instance,
        type: Type,
        oldProps: Props,
        newProps: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ): null | UpdatePayload {
        // TODO
    },
    shouldSetTextContent(type: Type, props: Props): boolean {
        // TODO
    },
    shouldDeprioritizeSubtree(type: Type, props: Props): boolean {
        // TODO
    },
    createTextInstance(
        text: string,
        rootContainerInstance: Container,
        hostContext: HostContext,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): TextInstance {
        // TODO
    },
    scheduleDeferredCallback(
        callback: () => any,
        options?: { timeout: number },
    ): any {
        // TODO. Likely just setTimeout again.
    },
    cancelDeferredCallback(callbackID: any): void {
        // TODO
    },
    setTimeout(handler: (...args: any[]) => void, timeout: number): TimeoutHandle | NoTimeout {
        setTimeout(handler, timeout);
    },
    clearTimeout(handle: TimeoutHandle | NoTimeout): void {
        clearTimeout(handle);
    },
    noTimeout: noTimeoutValue,
    now: Date.now,
    isPrimaryRenderer: true,
    supportsMutation: true, // TODO
    supportsPersistence: false,
    supportsHydration: false,

    /* Mutation (optional) */
    appendChild(parentInstance: Instance, child: Instance | TextInstance): void {
        parentInstance._addView(child);
        // TODO: check whether a property/event change should be fired.
    },
    appendChildToContainer(container: Container, child: Instance | TextInstance): void {
        container._addView(child);
        // TODO: check whether a property/event change should be fired.
    },
    commitTextUpdate(textInstance: TextInstance, oldText: string, newText: string): void {
        textInstance.text = newText;
        // e.g.: https://github.com/NativeScript/NativeScript/blob/master/tns-core-modules/data/observable/observable.ts#L53
        textInstance.notifyPropertyChange("text", newText, oldText);
    },
    commitMount(
        instance: Instance,
        type: Type,
        newProps: Props,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): void {
        // TODO
    },
    commitUpdate(
        instance: Instance,
        updatePayload: UpdatePayload,
        type: Type,
        oldProps: Props,
        newProps: Props,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): void {
        // TODO
    },
    insertBefore(parentInstance: Instance, child: Instance | TextInstance, beforeChild: Instance | TextInstance): void {
        // TODO
    },
    insertInContainerBefore(
        container: Container,
        child: Instance | TextInstance,
        beforeChild: Instance | TextInstance,
    ): void {
        // TODO
    },
    removeChild(parentInstance: Instance, child: Instance | TextInstance): void {
        parentInstance._removeView(child);
        // TODO: check whether a property/event change should be fired.
    },
    removeChildFromContainer(container: Container, child: Instance | TextInstance): void {
        container._removeView(child);
        // TODO: check whether a property/event change should be fired.
    },
    resetTextContent(instance: Instance): void {
        if(instance instanceof TextBase){
            instance.text = "";
            instance.notifyPropertyChange("text", "newText");
        } else {
            console.warn(`resetTextContent() stub called on a non-TextBase View. Text-resetting is only implemented for instances extending TextBase.`);
        }
    },
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