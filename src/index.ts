import ReactReconciler from 'react-reconciler';
import { TNSElements, elementMap, ConcreteViewConstructor } from './elementRegistry';
// TODO: Would be less coupled if we imported View and TextBase from elementRegistry.ts.
import { View } from 'tns-core-modules/ui/core/view/view';
import { ViewBase } from 'tns-core-modules/ui/core/view-base/view-base';
import { TextBase } from 'tns-core-modules/ui/text-base/text-base';
// import { Page } from 'tns-core-modules/ui/page/page';
import { Frame } from 'tns-core-modules/ui/frame/frame';

type Type = TNSElements;
type Props = Record<string, any>;
type Container = Frame; // The root node of the app.
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

const rootHostContext: HostContext = {};
const childHostContext: HostContext = {};

// https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc
const hostConfig: ReactReconciler.HostConfig<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout> = {
    getPublicInstance(instance: Instance | TextInstance): PublicInstance {
        // TODO (this was a complete guess).
        return instance;
    },
    getRootHostContext(rootContainerInstance: Container): HostContext {
        return rootHostContext;
    },
    getChildHostContext(parentHostContext: HostContext, type: Type, rootContainerInstance: Container): HostContext {
        return childHostContext;
    },
    /**
     * This function is called when we have made a in-memory render tree of all the views (Remember we are yet to attach it the the actual root dom node).
     * Here we can do any preparation that needs to be done on the rootContainer before attaching the in memory render tree.
     * For example: In the case of react-dom, it keeps track of all the currently focused elements, disabled events temporarily, etc.
     * @param rootContainerInstance - root dom node you specify while calling render. This is most commonly <div id="root"></div>
     */
    prepareForCommit(rootContainerInstance: Container): void {
        // TODO
    },
    /**
     * This function gets executed after the inmemory tree has been attached to the root dom element. Here we can do any post attach operations that needs to be done.
     *  For example: react-dom re-enabled events which were temporarily disabled in prepareForCommit and refocuses elements, etc.
     * @param rootContainerInstance - root dom node you specify while calling render. This is most commonly <div id="root"></div>
     */
    resetAfterCommit(rootContainerInstance: Container): void {
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
            // TODO: should probably notify of property change, too.
        });

        // TODO: also merge in the hostContext (whatever that is).

        return view;
    },
    appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
        parentInstance._addView(child);
    },
    /**
     * Docs from: https://blog.atulr.com/react-custom-renderer-2/
     * @param parentInstance - the DOM element after appendInitialChild()
     * @param type - the type of Fiber, e.g. "div"
     * @param props - the props to be passed to the host Element.
     * @param rootContainerInstance - root dom node you specify while calling render. This is most commonly <div id="root"></div>
     * @param hostContext - contains the context from the parent node enclosing this node. This is the return value from getChildHostContext of the parent node.
     * @returns A boolean value which decides if commitMount() for this element needs to be called.
     */
    finalizeInitialChildren(
        parentInstance: Instance,
        type: Type,
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ): boolean {
        // TODO
        return false;
    },
    /**
     * From: https://blog.atulr.com/react-custom-renderer-3/
     * @param instance - the current DOM instance of the Node.
     * @param type - the type of fiber, e.g. "div".
     * @param oldProps - props before this update.
     * @param newProps - incoming props.
     * @param rootContainerInstance - root dom node you specify while calling render. This is most commonly <div id="root"></div>
     * @param hostContext - contains the context from the parent node enclosing this node. This is the return value from getChildHostContext of the parent node.
     * @returns This function should return a payload object. Payload is a Javascript object that can contain information on what needs to be changed on this host element.
     */
    prepareUpdate(
        instance: Instance,
        type: Type,
        oldProps: Props,
        newProps: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ): null | UpdatePayload {
        // TODO
        return null;
    },
    shouldSetTextContent(type: Type, props: Props): boolean {
        return typeof props.children === 'string' || typeof props.children === 'number';
    },
    /**
     * This function is used to deprioritize rendering of some subtrees. Mostly used in cases where the subtree is hidden or offscreen.
     * @param type - the DOM type of the element, e.g. "div"
     * @param props - the props to be passed to the Element.
     */
    shouldDeprioritizeSubtree(type: Type, props: Props): boolean {
        return !!props.hidden; // Purely based on React-DOM.
    },
    createTextInstance(
        text: string,
        rootContainerInstance: Container,
        hostContext: HostContext,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): TextInstance {
        // See createInstance().

        // Is TextBase the most appropriate here? Medium tutorial uses: document.createTextNode(text);
        const textBase: TextBase = new TextBase();
        textBase.text = text;

        // TODO: maybe inherit the style information from container..?
        // TODO: also merge in the hostContext (whatever that is).

        return textBase;
    },
    scheduleDeferredCallback(
        callback: () => any,
        options?: { timeout: number },
    ): any {
        // TODO: check whether default timeout should be 0.
        if(!options) options = { timeout: 0 };

        return setTimeout(callback, options.timeout);
    },
    cancelDeferredCallback(callbackID: any): void {
        clearTimeout(callbackID);
    },
    setTimeout(handler: (...args: any[]) => void, timeout: number): TimeoutHandle | NoTimeout {
        return setTimeout(handler, timeout);
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
    /**
     * From: https://blog.atulr.com/react-custom-renderer-2/
     * This function is called for every element that has set the return value of finalizeInitialChildren() to true. This method is called after all the steps are done (ie after resetAfterCommit), meaning the entire tree has been attached to the dom.
     * This method is mainly used in react-dom for implementing autofocus. This method exists in react-dom only and not in react-native.
     * @param instance 
     * @param type 
     * @param newProps 
     * @param internalInstanceHandle 
     */
    commitMount(
        instance: Instance,
        type: Type,
        newProps: Props,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): void {
        instance.focus();
    },
    commitUpdate(
        instance: Instance,
        updatePayload: UpdatePayload,
        type: Type,
        oldProps: Props,
        newProps: Props,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): void {
        Object.keys(newProps).forEach((prop: string) => {
            const value: any = newProps[prop];
            if(prop === "children"){
                if(typeof prop === "string" || typeof prop === "number"){
                    if(instance instanceof TextBase){
                        const oldText: string = instance.text;
                        instance.text = value;
                        instance.notifyPropertyChange("text", "newText", oldText);
                    } else {
                        console.warn(`commitUpdate() called with text as a prop upon a non-TextBase View. Text-setting is only implemented for instances extending TextBase.`);
                    }
                }
            } else {
                instance.set(prop, value);
                // TODO: check whether Observable.set() is appropriate.
                // TODO: should probably notify of property change, too.
            }
        })
    },
    insertBefore(parentInstance: Instance, child: Instance | TextInstance, beforeChild: Instance | TextInstance): void {
        let beforeChildIndex: number = 0;
        parentInstance.eachChild((viewBase: ViewBase) => {
            if(viewBase === beforeChild){
                return false;
            } else {
                beforeChildIndex++;
                return true;
            }
        });
        // NOTE: Untested. Potentially has an off-by-one error.
        parentInstance._addView(child, beforeChildIndex);
    },
    /**
     * From: https://blog.atulr.com/react-custom-renderer-3/
     * This function is called whenever an element needs to insertedBefore the top most level component (Root component) itself.
     * @param container - the root container node to which a the child node needs to be inserted.
     * @param child - the dom node that needs to be inserted.
     * @param beforeChild - the child node before which the new child node needs to be inserted.
     */
    insertInContainerBefore(
        container: Container,
        child: Instance | TextInstance,
        beforeChild: Instance | TextInstance,
    ): void {
        let beforeChildIndex: number = 0;
        container.eachChild((viewBase: ViewBase) => {
            if(viewBase === beforeChild){
                return false;
            } else {
                beforeChildIndex++;
                return true;
            }
        });
        // NOTE: Untested. Potentially has an off-by-one error.
        container._addView(child, beforeChildIndex);
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
            const oldText: string = instance.text;
            instance.text = "";
            instance.notifyPropertyChange("text", "", oldText);
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