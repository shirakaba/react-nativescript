/**
 * Code in here referenced from:
 * https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMHostConfig.js
 * https://github.com/facebook/react/blob/6a1e6b2f78da3a56aa497902951c6e9ce654eafc/packages/react-native-renderer/src/ReactNativeHostConfig.js
 * ... which both carry the following copyright:
 * 
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// import ReactReconciler = require('react-reconciler');
import * as ReactReconciler from 'react-reconciler';

import { TNSElements, elementMap, ConcreteViewConstructor } from './ElementRegistry';
// TODO: Would be less coupled if we imported View and TextBase from elementRegistry.ts.
import { View } from 'tns-core-modules/ui/core/view/view';
import { Color } from 'tns-core-modules/color/color';
import { Button } from "tns-core-modules/ui/button/button";
import { ViewBase } from 'tns-core-modules/ui/core/view-base/view-base';
import { ContentView } from "tns-core-modules/ui/content-view";
import { TextBase } from 'tns-core-modules/ui/text-base/text-base';
import { TextView } from 'tns-core-modules/ui/text-view/text-view';
import { Page } from "tns-core-modules/ui/page";
import { FlexboxLayout } from "tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout";
// import { Page } from 'tns-core-modules/ui/page/page';
import { Frame } from 'tns-core-modules/ui/frame/frame';
import { LayoutBase } from 'tns-core-modules/ui/layouts/layout-base';
import { precacheFiberNode, updateFiberProps } from './ComponentTree';
import { diffProperties, updateProperties } from './ReactNativeScriptComponent';
import { validateDOMNesting, updatedAncestorInfo } from './validateDOMNesting';
import { setValueForStyles } from '../shared/CSSPropertyOperations';
import { setValueForProperty } from './NativeScriptPropertyOperations';

export type Type = TNSElements | React.JSXElementConstructor<any>;
type Props = any;
export type Container = View; // The root node of the app. Typically Frame, but View is more flexible.
export type Instance = ViewBase; // We may extend this to Observable in future, to allow the tree to contain non-visual components. More likely ViewBase anyway?
type TextInstance = TextBase;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = HostContextDev | HostContextProd;
type UpdatePayload = any;
type ChildSet = any;
type TimeoutHandle = number; // Actually strictly should be Node-style timeout
type NoTimeout = any;
const noTimeoutValue: NoTimeout = undefined;
type HostContextProd = string;
interface HostContextDev {
    namespace: string,
    ancestorInfo: any,
    eventData: null | {
        isEventComponent?: boolean,
        isEventTarget?: boolean,
    }
};

const rootHostContext: HostContext = (global as any).__DEV__ ? 
    {
        namespace: "rootHostContextNamespaceStub",
        ancestorInfo: {},
        eventData: null,
    } : 
    "rootHostContextStub";
const childHostContext: HostContext = (global as any).__DEV__ ? 
    {
        namespace: "childHostContextNamespace",
        ancestorInfo: {},
        eventData: null,
    } : 
    "childHostContextStub";

function isASingleChildContainer(view: Instance): view is Page|ContentView {
    return view instanceof Page || view instanceof ContentView;
}

function handleChildrenProp(
    type: Type,
    props: Props,
    rootContainerInstance: Container,
    hostContext: HostContext,
    internalInstanceHandle: ReactReconciler.OpaqueHandle,
    view: View,
    value: any,
){
    if(value === null){
        // No children specified.
        return;
    }
    if(Array.isArray(value)){
        console.warn(`'children' value was array; support is experimental!`);
    }

    const valueArray: any[] = Array.isArray(value) ? value : [value];

    valueArray.forEach((value: any) => {
        if(hostConfig.shouldSetTextContent(type, props)){
            if(view instanceof TextBase){
                // WARNING: unsure that this is how you're supposed to use HostConfig.
                hostConfig.commitTextUpdate(view, "", value);
                console.log(`[createInstance() 1e] type: ${type}. after commitTextUpdate():`, view.text);
            } else {
                const tv: TextView = hostConfig.createTextInstance(value, rootContainerInstance, hostContext, internalInstanceHandle) as TextView;
    
                console.warn(`Support for setting textContent of a non-TextBase view is experimental.`);
                hostConfig.appendChild(view, tv);
            }
        } else {
            if(!value){
                console.warn(`'children' prop's value was ${value}, so skipping.`);
                return;
            }

            // console.log(`value:`, value);
            const prospectiveChild = value as React.ReactElement<any, string>;

            (()=>{
                const { children, ...rest } = prospectiveChild.props;
                console.warn(`Support for nesting children is experimental. child type: ${prospectiveChild.type}. props:`, { ...rest });
            })();
    
            if(!prospectiveChild.type){
                console.warn(`The value of 'prospectiveChild.type' was ${value}, so skipping.`);
                return;
            }
    
            const instanceFromChild: ViewBase|TextBase = hostConfig.createInstance(
                prospectiveChild.type as Type,
                prospectiveChild.props,
                rootContainerInstance,
                hostContext,
                internalInstanceHandle
            );
            hostConfig.appendChild(view, instanceFromChild);
            
            // hostConfig.appendChild(view, value);
        }
    });
}

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
    // TODO: replace parts of this with updateDOMProperties() where applicable
    createInstance(
        type: Type,
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): Instance {
        (()=>{
            const { children, ...rest } = props;
            console.log(`[createInstance() 1a] type: ${type}. props:`, { ...rest });
        })();
        // console.log(`[createInstance() 1b] type: ${type}. rootContainerInstance:`, rootContainerInstance);

        let view: View;
        const viewConstructor: ConcreteViewConstructor|null = typeof type === "string" ? elementMap[type] : null;
        if(viewConstructor){
            view = new viewConstructor();
            precacheFiberNode(internalInstanceHandle, view);
            updateFiberProps(view, props);
        } else {
            if(typeof type === "undefined"){
                throw new Error(`HostConfig received undefined type in createInstance.`);
            }
            console.log(`Type not found in element registry, so must be custom instance; recursing until we get a type in the element registry.`);
            const componentFunction: React.Component<Props, {}> = new (type as any)(props);
            const createdElement = componentFunction.render() as React.ReactElement<Props, React.JSXElementConstructor<any> | TNSElements>;

            return hostConfig.createInstance(
                createdElement.type,
                createdElement.props,
                rootContainerInstance,
                hostContext,
                internalInstanceHandle
            );
        }

        // console.log(`[createInstance() 1c] type: ${type}. constructed:`, view);
        Object.keys(props).forEach((prop: string) => {
            const value: any = props[prop];

            // TODO: much more work here. Handle styles and event listeners, for example. Think this Observable method handles barely anything.
            /*
                Note that in this situation, only <span>One</span> will be shown. Probably handled before it reaches the Host Config though:
                  <div children={[<span>Two</span>, <span>Three</span>]}>
                    <span>One</span>
                </div>
            */
            if(prop === "children"){
                return handleChildrenProp(
                    type,
                    props,
                    rootContainerInstance,
                    hostContext,
                    internalInstanceHandle,
                    view,
                    value
                );
            } else if(prop === "class"){
                // console.warn(`Note that 'class' is remapped to 'className'.`);
                view.set("className", value);
            } else if(prop === "style"){
                if(typeof value === "undefined"){
                    console.warn(`'style' prop was specified, but value was undefined.`);
                    return;
                }
                console.warn(`Support for setting styles is experimental.`);
                // console.log(`[createInstance()] type: ${type}. iterating style:`, value);
                setValueForStyles(view, value);
                // console.log(`Width now:`, view.width);
                // console.log(`Height now:`, view.height);
            } else {
                // view.set(prop, value);
                setValueForProperty(view, prop, value, false);
            }

            // TODO: should probably notify of property change, too.
        });
        // console.log(`[createInstance() 1e] type: ${type}. returning:`, view);

        // TODO: also merge in the hostContext (whatever that is).

        return view;
    },
    appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
        console.log(`[appendInitialChild()]`);
        hostConfig.appendChild(parentInstance, child);
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
        console.log(`finalizeInitialChildren() with parentInstance type: ${type}`, parentInstance);
        return false;
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

        /* Is TextView the most appropriate here?
         * Alternative is TextField. TextBase just a base class.
         * Medium tutorial uses: document.createTextNode(text); */
        const textView: TextView = new TextView();
        textView.text = text;
        precacheFiberNode(internalInstanceHandle, textView);

        // TODO: maybe inherit the style information from container..?
        // TODO: also merge in the hostContext (whatever that is).

        return textView;
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
        if(isASingleChildContainer(parentInstance)){
            console.log(`[appendChild()] (single-child container) ${parentInstance} > ${child}`);
            /* These elements were originally designed to hold one element only:
             * https://stackoverflow.com/a/55351086/5951226 */
            parentInstance.content = child as View;
        } else if(parentInstance instanceof LayoutBase){
            console.log(`[appendChild()] (instance of LayoutBase) ${parentInstance} > ${child}`);
            parentInstance.addChild(child as View);
        } else {
            console.log(`[appendChild()] (default clause) ${parentInstance} > ${child}`);
            parentInstance._addView(child);
        }
        // TODO: check whether a property/event change should be fired. 
    },
    appendChildToContainer(container: Container, child: Instance | TextInstance): void {
        // console.log(`[appendChildToContainer()] deferring to appendChild(): ${container} > ${child}`);
        hostConfig.appendChild(container, child);
        // TODO: check whether a property/event change should be fired.
    },
    commitTextUpdate(textInstance: TextInstance, oldText: string, newText: string): void {
        console.log(`[commitTextUpdate()]`, textInstance);
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
        console.log(`commitMount() with type: ${type}`, instance);
        (instance as View).focus();
    },
    /**
     * From: https://blog.atulr.com/react-custom-renderer-3/
     * Expanded on in: https://hackernoon.com/learn-you-some-custom-react-renderers-aed7164a4199
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
        console.log(`prepareUpdate() with type: ${type}`, instance);

        if (__DEV__) {
            const hostContextDev: HostContextDev = hostContext as HostContextDev;
            if (
                typeof newProps.children !== typeof oldProps.children &&
                (typeof newProps.children === 'string' ||
                    typeof newProps.children === 'number')
            ) {
                const str: string = '' + newProps.children;
                const ownAncestorInfo = updatedAncestorInfo(
                    hostContextDev.ancestorInfo,
                    type as string,
                );
                validateDOMNesting(null, str, ownAncestorInfo);
            }
        }
        return diffProperties(
            instance,
            type,
            oldProps,
            newProps,
            rootContainerInstance,
        );

        // return {}; // Simply return a non-null value to permit commitUpdate();
        // return null;
    },
    commitUpdate(
        instance: Instance,
        updatePayload: UpdatePayload,
        type: Type,
        oldProps: Props,
        newProps: Props,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): void {
        console.log(`commitUpdate() with type: ${type}`, instance);

        // Update the props handle so that we know which props are the ones with
        // with current event handlers.
        updateFiberProps(instance, newProps);

        // Apply the diff to the DOM node.
        updateProperties(instance, updatePayload, type, oldProps, newProps);

        // Object.keys(newProps).forEach((prop: string) => {
        //     const value: any = newProps[prop];
        //     if(prop === "children"){
        //         if(typeof prop === "string" || typeof prop === "number"){
        //             if(instance instanceof TextBase){
        //                 const oldText: string = instance.text;
        //                 instance.text = value;
        //                 instance.notifyPropertyChange("text", "newText", oldText);
        //             } else {
        //                 console.warn(`commitUpdate() called with text as a prop upon a non-TextBase View. Text-setting is only implemented for instances extending TextBase.`);
        //             }
        //         } else {
        //             console.warn(`commitUpdate() called with a non-textual 'children' value; ignoring.`);
        //         }
        //     } else {
        //         instance.set(prop, value);
        //         // TODO: check whether Observable.set() is appropriate.
        //         // TODO: should probably notify of property change, too.
        //     }
        // })
    },
    insertBefore(parentInstance: Instance, child: Instance | TextInstance, beforeChild: Instance | TextInstance): void {
        // TODO: Refer to {N}Vue's implementation: https://github.com/nativescript-vue/nativescript-vue/blob/master/platform/nativescript/renderer/ViewNode.js#L157
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
        // TODO: fire child._parentChanged()?
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
        if(container instanceof Page || container instanceof ContentView){
            console.warn(`[insertInContainerBefore] not supported because Page/ContentView only support a single child.`);
        } else {
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
        }
    },
    removeChild(parentInstance: Instance, child: Instance | TextInstance): void {
        parentInstance._removeView(child);
        // TODO: check whether a property/event change should be fired.
    },
    removeChildFromContainer(container: Container, child: Instance | TextInstance): void {
        if(isASingleChildContainer(container)){
            console.log(`[removeChild()] instance of single-child container: ${container} x ${child}`);
            /* These elements were originally designed to hold one element only:
             * https://stackoverflow.com/a/55351086/5951226 */
             // console.warn(`[removeChild()] TODO: Check whether "container.content = null" will indeed remove the content.`);
            container.content = null;
        } else if(container instanceof LayoutBase){
            console.log(`[removeChild()] instance of LayoutBase: ${container} x ${child}`);
            container.removeChild(child as View);
        } else {
            console.log(`[removeChild()] default clause.`);
            container._removeView(child);
        }
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

export const reactReconcilerInst = ReactReconciler<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout>(hostConfig);